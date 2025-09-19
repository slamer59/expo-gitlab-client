import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";

import { SectionTitle } from "../Section/param";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { EditParamMergeRequestDialog } from "./mr-edit-param";

function Reviewer({
	reviewer,
	children,
}: { reviewer: any; children: React.ReactNode }) {
	return (
		<View className="flex-row items-center justify-between mb-2">
			<View className="flex-row items-center">
				<Avatar alt={`${reviewer.name}'s Avatar`} className="mr-2">
					<AvatarImage source={{ uri: reviewer.avatar_url }} />
					<AvatarFallback>
						<Text>{reviewer.name.slice(0, 2).toUpperCase()}</Text>
					</AvatarFallback>
				</Avatar>
				<Text className="text-white" key={reviewer.id}>
					{reviewer.name || reviewer.username}
				</Text>
			</View>
			{children}
		</View>
	);
}

export default function EditReviewerMergeRequest({ projectId, mrIid }) {
	const { session } = useSession();
	const client = new GitLabClient({
		url: session?.url,
		token: session?.token,
	});

	const api = useGitLab(client);

	const {
		data: mr,
		loading,
		error,
	} = api.useProjectMergeRequest(projectId, mrIid) ?? {};
	const {
		execute: updateMergeRequest,
		loading: updating,
		error: updateError,
	} = api.useUpdateProjectMergeRequest(projectId, mrIid);
	const { data: users, error: usersError } = api.useProjectUsers(projectId);

	const [checkedIds, setCheckedIds] = React.useState([]);

	const toggleSwitch = (id) => {
		setCheckedIds((prev) => {
			if (prev.includes(id)) {
				return prev.filter((checkedId) => checkedId !== id);
			} else {
				return [...prev, id];
			}
		});
	};

	const handleSave = async () => {
		await updateMergeRequest({
			reviewer_ids: checkedIds,
		});
	};

	useEffect(() => {
		if (mr) {
			setCheckedIds(mr.reviewers.map((reviewer) => `${reviewer.id}`));
		}
	}, [loading, mr]);

	if (error || usersError || updateError)
		return (
			<Text>
				Error: {error?.message || usersError?.message || updateError?.message}
			</Text>
		);
	return (
		<>
			{/* {loading && <Loading />}; */}
			<SectionTitle title="Reviewers">
				{/* <Text className='text-white'>{JSON.stringify(checkedIds)}</Text> */}
				<EditParamMergeRequestDialog
					title="Reviewers"
					handleSave={handleSave}
					loading={updating}
					error={updateError}
				>
					<Text className="text-xl font-semibold text-white">
						Assigned Users
					</Text>
					{checkedIds && checkedIds.length > 0 ? (
						<>
							{users?.map((user: any) => (
								<React.Fragment key={user.id}>
									{checkedIds.includes(`${user.id}`) && (
										<Reviewer reviewer={user}>
											<Button
												variant="icon"
												onPress={() => toggleSwitch(`${user.id}`)}
											>
												<Ionicons name="close-circle" size={24} color="white" />
											</Button>
										</Reviewer>
									)}
								</React.Fragment>
							))}
							{/* {!users.some((id) => checkedIds?.some(user => `${user.id}` === id)) && (
                                <Text className='h-14 text-muted'>No reviewers selected</Text>
                            )} */}
						</>
					) : (
						<Text className="h-10 mb-4 text-muted">No reviewers</Text>
					)}

					<Separator className="my-4 bg-primary" />
					<Text className="text-xl font-semibold text-white">
						Project's Users
					</Text>
					{users && users.length > 0 ? (
						users?.map((user: any) => (
							<React.Fragment key={user.id}>
								{!checkedIds.includes(`${user.id}`) ? (
									<Reviewer reviewer={user}>
										<Button
											variant="icon"
											onPress={() => toggleSwitch(`${user.id}`)}
										>
											<Ionicons name="add-circle" size={24} color="white" />
										</Button>
									</Reviewer>
								) : (
									<Text className="h-14 text-muted">
										{" "}
										No more users in project
									</Text>
								)}
							</React.Fragment>
						))
					) : (
						<Text className="mb-4 text-muted">No reviewers</Text>
					)}
				</EditParamMergeRequestDialog>
			</SectionTitle>

			{checkedIds && checkedIds.length > 0 ? (
				users?.map((user: any) => (
					<React.Fragment key={user.id}>
						{checkedIds.includes(`${user.id}`) && <Reviewer reviewer={user} />}
					</React.Fragment>
				))
			) : (
				<Text className="h-12 mb-4 text-muted">No reviewers</Text>
			)}
			{/* {mr && mr.reviewers && mr.reviewers.length > 0 ? (
                mr.reviewers.map((reviewer: any) => <Reviewer reviewer={reviewer} />)
            ) : (
                <Text className='mb-4 text-muted'>No reviewers</Text>
            )
            } */}
		</>
	);
}
