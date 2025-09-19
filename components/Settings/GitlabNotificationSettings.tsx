import "firebase/firestore";

import { Ionicons, Octicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo } from "react";
import {
	Modal,
	ScrollView,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";

import { Switch } from "@/components/ui/switch";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useNotificationStore } from "@/lib/notification/state";
import { useSession } from "@/lib/session/SessionProvider";
import { notificationLevels } from "lib/notification/utils";

import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

const NotificationDashboard = () => {
	const { session } = useSession();
	const {
		projects,
		global,
		modalVisible,
		isLoading,
		selectNotificationLevel,
		openModal,
		setModalVisible,
		syncNotificationSettings,
	} = useNotificationStore();

	// Create GitLab client with useMemo to prevent recreation on every render
	const client = useMemo(
		() =>
			new GitLabClient({
				url: session?.url,
				token: session?.token,
			}),
		[session?.url, session?.token],
	);

	// Use useCallback to prevent re-creating functions on every render
	const handleSelectNotificationLevel = useCallback(
		(level: any) => {
			selectNotificationLevel(level);
		},
		[selectNotificationLevel],
	);

	const handleOpenModal = useCallback(
		(type: string, index: number) => {
			openModal(type, index);
		},
		[openModal],
	);

	const handleCloseModal = useCallback(() => {
		setModalVisible(false);
	}, [setModalVisible]);

	// Use useMemo to prevent recalculating values on every render
	const globalNotificationLevel = useMemo(() => {
		return global?.level;
	}, [global]);

	const globalNotificationEmail = useMemo(() => {
		return global?.notification_email;
	}, [global]);

	const projectList = useMemo(() => {
		return projects || [];
	}, [projects]);

	useEffect(() => {
		// Load notification settings and projects when component mounts
		if (session && session.token) {
			console.log("🔄 Calling syncNotificationSettings with client:", !!client);
			syncNotificationSettings(client);
		} else {
			console.log("❌ Cannot sync notifications - missing session or token:", {
				hasSession: !!session,
				hasToken: !!session?.token,
			});
		}
	}, [session, client, syncNotificationSettings]);

	return (
		<>
			<View className="p-4 m-1 rounded-lg bg-card">
				<View className="flex flex-row items-center mb-5">
					<Octicons name="bell" size={30} color="white" className="mr-2" />
					<Text className="text-2xl font-bold text-white">Notifications</Text>
				</View>
				<Text className="mb-6 text-muted">
					You can specify notification level per group or per project.
				</Text>

				<Text className="mb-6 text-muted">
					Configure your mobile app notification preferences here. These
					settings are independent from your GitLab email notifications.
				</Text>

				<View className="mb-6">
					<Text className="mb-2 text-xl font-bold text-white">
						Global notification email
					</Text>
					<TouchableOpacity className="flex-row items-center justify-between p-3 mb-2 rounded-lg bg-muted">
						{isLoading ? (
							<Skeleton className="w-3/4 h-4" />
						) : (
							<Text className="text-white">
								Use primary email {globalNotificationEmail}
							</Text>
						)}
						<Ionicons name="chevron-down" size={18} color="#fff" />
					</TouchableOpacity>
				</View>

				{globalNotificationLevel && (
					<View className="mb-6">
						<Text className="mb-2 text-xl font-bold text-white">
							Global notification level
						</Text>
						<Text className="mb-3 text-muted">
							By default, all projects and groups use the global notifications
							setting.
						</Text>
						<TouchableOpacity
							className="flex-row items-center justify-between p-3 mb-2 rounded-lg bg-muted"
							onPress={() => handleOpenModal("global", -1)}
						>
							<Ionicons
								name={globalNotificationLevel.icon}
								size={18}
								color="#fff"
							/>
							<Text className="text-white">
								{globalNotificationLevel.label}
							</Text>
							<Ionicons name="chevron-down" size={18} color="#fff" />
						</TouchableOpacity>
					</View>
				)}

				<Separator className="my-4 bg-secondary" />

				<View className="mb-6">
					<Text className="mb-2 text-xl font-bold text-white">
						Projects ({isLoading ? "..." : projectList.length})
					</Text>
					<Text className="mb-3 text-muted">
						To specify the notification level per project of a group you belong
						to, visit the project page and change the notification level there.
					</Text>

					{isLoading ? (
						Array.from({ length: 3 }).map((_, index) => (
							<View key={index} className="mb-2 ml-4 bg-transparent">
								<View className="flex-row items-center justify-between w-full py-3 border-b border-muted">
									<View className="flex-row items-center flex-1 mr-4">
										<Skeleton className="w-5 h-5 rounded-full" />
										<Skeleton className="w-3/4 h-4 ml-2" />
									</View>
									<Skeleton className="w-24 h-8 rounded-md" />
								</View>
							</View>
						))
					) : projectList.length > 0 ? (
						projectList.map((project, index) => (
							<ScrollView
								key={project.id}
								horizontal
								className="mb-2 ml-4 bg-transparent max-h-16"
								contentContainerStyle={{ flexGrow: 1 }}
							>
								<View className="flex-row items-center justify-between w-full py-3 border-b border-muted">
									<View className="flex-row items-center flex-1 mr-4">
										<Ionicons
											name={`notifications${project.level?.value === "disabled" ? "-off" : ""}`}
											size={18}
											color="#fff"
										/>
										<Text
											className="ml-2 text-white"
											numberOfLines={1}
											ellipsizeMode="tail"
										>
											{project.name}
										</Text>
									</View>
									<TouchableOpacity
										className="flex-row items-center p-2 rounded-md bg-muted"
										onPress={() => handleOpenModal("project", index)}
									>
										<Ionicons
											name={project.level?.icon}
											size={18}
											color="#fff"
										/>
										<Text className="mx-1 text-white">
											{project.level.label}
										</Text>
										<Ionicons name="chevron-down" size={18} color="#fff" />
									</TouchableOpacity>
								</View>
							</ScrollView>
						))
					) : (
						<Text className="text-muted">No projects found</Text>
					)}
				</View>
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={handleCloseModal}
			>
				<TouchableWithoutFeedback onPress={handleCloseModal}>
					<View className="justify-end flex-1 bg-black bg-opacity-50">
						<View className="p-5 bg-card rounded-t-2xl">
							<Text className="mb-4 text-4xl font-bold text-white">
								Select Notification Level
							</Text>
							{notificationLevels.map((level, index) => (
								<TouchableOpacity
									key={index}
									className="py-3 border-b border-muted"
									onPress={() => handleSelectNotificationLevel(level)}
								>
									<Text className="mb-1 text-xl font-bold text-white">
										{level.label}
									</Text>
									<Text className="text-muted">{level.description}</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
		</>
	);
};

// GitLabNotificationSettings component for notification mode toggles
export const GitLabNotificationSettings = () => {
	const [notificationModes, setNotificationModes] = React.useState({
		all: false,
		issues: false,
		mergeRequests: false,
		pipelineFailures: false,
		approvals: false,
	});

	// Update "all" mode when individual modes change
	React.useEffect(() => {
		const { all, ...otherModes } = notificationModes;
		const allIndividualModesEnabled = Object.values(otherModes).every(Boolean);

		if (allIndividualModesEnabled !== all) {
			setNotificationModes((prev) => ({
				...prev,
				all: allIndividualModesEnabled,
			}));
		}
	}, [notificationModes]);

	const handleModeToggle = useCallback((mode: string, checked: boolean) => {
		if (mode === "all") {
			// When "all" is toggled, set all modes to the same value
			setNotificationModes({
				all: checked,
				issues: checked,
				mergeRequests: checked,
				pipelineFailures: checked,
				approvals: checked,
			});
		} else {
			// When individual mode is toggled, update that mode
			setNotificationModes((prev) => ({
				...prev,
				[mode]: checked,
			}));
		}
	}, []);

	return (
		<View className="p-4 m-1 rounded-lg bg-card">
			<Text className="mb-4 text-2xl font-bold text-white">
				Notification Settings
			</Text>

			<View className="space-y-4">
				<View className="flex-row items-center justify-between py-2">
					<Text className="text-white">All notifications</Text>
					<Switch
						testID="all-mode"
						checked={notificationModes.all}
						onCheckedChange={(checked) => handleModeToggle("all", checked)}
					/>
				</View>

				<View className="flex-row items-center justify-between py-2">
					<Text className="text-white">Issues</Text>
					<Switch
						testID="issues-mode"
						checked={notificationModes.issues}
						onCheckedChange={(checked) => handleModeToggle("issues", checked)}
					/>
				</View>

				<View className="flex-row items-center justify-between py-2">
					<Text className="text-white">Merge Requests</Text>
					<Switch
						testID="mergeRequests-mode"
						checked={notificationModes.mergeRequests}
						onCheckedChange={(checked) =>
							handleModeToggle("mergeRequests", checked)
						}
					/>
				</View>

				<View className="flex-row items-center justify-between py-2">
					<Text className="text-white">Pipeline Failures</Text>
					<Switch
						testID="pipelineFailures-mode"
						checked={notificationModes.pipelineFailures}
						onCheckedChange={(checked) =>
							handleModeToggle("pipelineFailures", checked)
						}
					/>
				</View>

				<View className="flex-row items-center justify-between py-2">
					<Text className="text-white">Approvals</Text>
					<Switch
						testID="approvals-mode"
						checked={notificationModes.approvals}
						onCheckedChange={(checked) =>
							handleModeToggle("approvals", checked)
						}
					/>
				</View>
			</View>
		</View>
	);
};

export default NotificationDashboard;
