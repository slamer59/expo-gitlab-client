
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { Ionicons } from '@expo/vector-icons';

import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SectionTitle } from '../Section/param';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { EditParamMergeRequestDialog } from './mr-edit-param';

function Assignee({ assignee, children }: { assignee: any, children: React.ReactNode }) {

    return <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
            <Avatar alt={`${assignee.name}'s Avatar`} className="mr-2">
                <AvatarImage source={{ uri: assignee.avatar_url }} />
                <AvatarFallback>
                    <Text>{assignee.name.slice(0, 2).toUpperCase()}</Text>
                </AvatarFallback>
            </Avatar>
            <Text className="text-white" key={assignee.id}>
                {assignee.name || assignee.username}
            </Text>

        </View>
        {children}
    </View>;
}

export default function EditAssigneeMergeRequest({ projectId, mrIid }) {

    const { session } = useSession()
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const { data: mr, loading, error } = api.useProjectMergeRequest(projectId, mrIid) ?? {};
    const { execute: updateMergeRequest, loading: updating, error: updateError } = api.useUpdateProjectMergeRequest(projectId, mrIid);
    const { data: users, loading: usersLoading, error: usersError } = api.useProjectUsers(projectId);

    if (error || usersError || updateError) return <Text>Error: {error?.message || usersError?.message || updateError?.message}</Text>;

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
            assignee_ids: checkedIds,
        });
    };
    useEffect(() => {
        if (mr) {
            setCheckedIds(mr.assignees.map((assignee) => `${assignee.id}`));
        }
    }, [loading, mr]);
    return (
        <>
            {/* {loading && <Loading />}; */}
            <SectionTitle title="Assignees">
                {/* <Text className='text-white'>{JSON.stringify(checkedIds)}</Text> */}
                <EditParamMergeRequestDialog title="Assignees" handleSave={handleSave} loading={updating} error={updateError}>
                    <Text className='text-xl font-semibold text-white'>Assigned Users</Text>
                    {checkedIds && checkedIds.length > 0 ? (
                        <>
                            {users?.map((user: any) => (
                                checkedIds.includes(`${user.id}`) && (
                                    <Assignee key={user.id} assignee={user}>
                                        <Button
                                            variant="icon"
                                            onPress={() => toggleSwitch(`${user.id}`)}
                                        >
                                            <Ionicons name="close-circle" size={24} color="white" />
                                        </Button>
                                    </Assignee>
                                )
                            ))}
                            {/* {!users.some((id) => checkedIds?.some(user => `${user.id}` === id)) && (
                                <Text className='h-14 text-muted'>No assignees selected</Text>
                            )} */}
                        </>
                    ) : (
                        <Text className='h-10 mb-4 text-muted'>No assignees</Text>
                    )}

                    <Separator className='my-4 bg-primary' />
                    <Text className='text-xl font-semibold text-white'>Project's Users</Text>
                    {users && users.length > 0 ? (
                        users?.map((user: any) => <>
                            {!checkedIds.includes(`${user.id}`) ? <>

                                <Assignee key={user.id} assignee={user}>
                                    <Button
                                        variant="icon"
                                        onPress={() => toggleSwitch(`${user.id}`)}
                                    >
                                        <Ionicons name="add-circle" size={24} color="white" />
                                    </Button>
                                </Assignee>

                            </> : <Text className='h-14 text-muted'> No more users in project</Text>}

                        </>)
                    ) : (
                        <Text className='mb-4 text-muted'>No assignees</Text>
                    )}
                </EditParamMergeRequestDialog >
            </SectionTitle >

            {checkedIds && checkedIds.length > 0 ? (
                users?.map((user: any) => <>
                    {checkedIds.includes(`${user.id}`) && <Assignee assignee={user} />}
                </>)
            ) : (
                <Text className='h-12 mb-4 text-muted'>No assignees</Text>
            )}
            {/* {mr && mr.assignees && mr.assignees.length > 0 ? (
                mr.assignees.map((assignee: any) => <Assignee assignee={assignee} />)
            ) : (
                <Text className='mb-4 text-muted'>No assignees</Text>
            )
            } */}
        </>
    );
};
