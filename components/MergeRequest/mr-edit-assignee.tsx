import { Ionicons } from '@expo/vector-icons';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import { Text } from 'components/ui/text';
import { useGitLab } from 'lib/gitlab/future/hooks/useGitlab';
import GitLabClient from 'lib/gitlab/gitlab-api-wrapper';
import { useSession } from 'lib/session/SessionProvider';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SectionTitle } from '../Section/param';
import { AvatarWithUrl } from '../ui/avatar-with-url';
import { EditParamMergeRequestDialog } from './mr-edit-param';

interface GitLabUser {
    id: number;
    name: string;
    username: string;
    avatar_url: string | null;
}

interface MergeRequest {
    assignees: GitLabUser[];
}

interface GitLabApiResponse<T> {
    data?: T;
    isLoading: boolean;
    error: Error | null;
}

interface AssigneeProps {
    assignee: GitLabUser;
    children?: React.ReactNode;
}

function Assignee({ assignee, children }: AssigneeProps) {
    return (
        <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
                <AvatarWithUrl
                    avatarUrl={assignee.avatar_url}
                    alt={`${assignee.name}'s Avatar`}
                    fallbackText={assignee.name.slice(0, 2).toUpperCase()}
                    className="mr-2"
                />
                <Text className="text-white" key={assignee.id}>
                    {assignee.name || assignee.username}
                </Text>
            </View>
            {children}
        </View>
    );
}

interface EditAssigneeMergeRequestProps {
    projectId: string;
    mrIid: string;
}

export default function EditAssigneeMergeRequest({ projectId, mrIid }: EditAssigneeMergeRequestProps) {
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const { data: mr, isLoading: mrLoading, error: mrError } = api.useProjectMergeRequest(projectId, mrIid) as GitLabApiResponse<MergeRequest>;
    const { mutateAsync: updateMergeRequest, isLoading: updating, error: updateError } = api.useUpdateProjectMergeRequest(projectId, mrIid);
    const { data: users, isLoading: usersLoading, error: usersError } = api.useProjectUsers(projectId) as GitLabApiResponse<GitLabUser[]>;

    if (mrError || usersError || updateError) {
        return <Text>Error: {mrError?.message || usersError?.message || updateError?.message}</Text>;
    }

    const [checkedIds, setCheckedIds] = React.useState<string[]>([]);

    const toggleSwitch = (id: string) => {
        setCheckedIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((checkedId) => checkedId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSave = async () => {
        if (updateMergeRequest) {
            await updateMergeRequest({
                assignee_ids: checkedIds,
            });
        }
    };

    useEffect(() => {
        if (mr?.assignees) {
            setCheckedIds(mr.assignees.map((assignee) => `${assignee.id}`));
        }
    }, [mr]);

    return (
        <>
            <SectionTitle title="Assignees">
                <EditParamMergeRequestDialog
                    title="Assignees"
                    handleSave={handleSave}
                    loading={updating}
                >
                    <Text className='text-xl font-semibold text-white'>Assigned Users</Text>
                    {checkedIds && checkedIds.length > 0 ? (
                        <>
                            {users?.map((user: GitLabUser) => (
                                checkedIds.includes(`${user.id}`) && (
                                    <Assignee key={user.id} assignee={user}>
                                        <Button
                                            variant="ghost"
                                            onPress={() => toggleSwitch(`${user.id}`)}
                                        >
                                            <Ionicons name="close-circle" size={24} color="white" />
                                        </Button>
                                    </Assignee>
                                )
                            ))}
                        </>
                    ) : (
                        <Text className='h-10 mb-4 text-muted'>No assignees</Text>
                    )}

                    <Separator className='my-4 bg-primary' />
                    <Text className='text-xl font-semibold text-white'>Project's Users</Text>
                    {users && users.length > 0 ? (
                        users.map((user: GitLabUser) => (
                            !checkedIds.includes(`${user.id}`) && (
                                <Assignee key={user.id} assignee={user}>
                                    <Button
                                        variant="ghost"
                                        onPress={() => toggleSwitch(`${user.id}`)}
                                    >
                                        <Ionicons name="add-circle" size={24} color="white" />
                                    </Button>
                                </Assignee>
                            )
                        ))
                    ) : (
                        <Text className='mb-4 text-muted'>No assignees</Text>
                    )}
                </EditParamMergeRequestDialog>
            </SectionTitle>

            {checkedIds && checkedIds.length > 0 ? (
                users?.map((user: GitLabUser) => (
                    checkedIds.includes(`${user.id}`) && <Assignee key={user.id} assignee={user} />
                ))
            ) : (
                <Text className='h-12 mb-4 text-muted'>No assignees</Text>
            )}
        </>
    );
}
