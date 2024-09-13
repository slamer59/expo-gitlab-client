
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { Ionicons } from '@expo/vector-icons';

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SectionTitle } from '../Section/param';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export enum AssigneeVariant {
    None = 'none',
    Add = 'add',
    Remove = 'remove'
}

type AssigneeProps = {
    variant: AssigneeVariant;
};

function Assignee({ assignee, children }: { assignee: any }) {

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


function EditParamIssueDialog({ title, handleSave, loading, children }) {

    return <>
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="px-2 py-1 ml-2 text-sm text-white rounded bg-card-600"
                    variant='outline'
                    size={'icon'}
                >
                    <Ionicons name="pencil" size={16} color="white" />
                    {/* <Text>EDIT</Text> */}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className='text-secondary'>Edit {title}</DialogTitle>
                    <DialogDescription>
                        Make changes to title and description issue here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Separator className='my-4 bg-primary' />
                {children}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">
                            <Text>Cancel</Text>
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="secondary" onPress={handleSave} disabled={loading}>
                            <Text>{loading ? 'Saving...' : 'Save Changes'}</Text>
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >

    </>
}

export default function EditAssigneeIssue({ projectId, issueIid }) {

    const { session } = useSession()
    const api = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const { data: issue, loading, error } = api.useProjectIssue(projectId, issueIid) ?? {};
    const { execute: updateIssue, loading: updating, error: updateError } = api.useUpdateProjectIssue(projectId, issueIid);
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
        await updateIssue({
            assignee_ids: checkedIds,
        });
    };
    useEffect(() => {
        if (issue) {
            setCheckedIds(issue.assignees.map((assignee) => `${assignee.id}`));
        }
    }, [loading, issue]);
    return (
        <>
            {/* {loading && <Loading />}; */}
            <SectionTitle title="Assignees">
                {/* <Text className='text-white'>{JSON.stringify(checkedIds)}</Text> */}
                <EditParamIssueDialog title="Assignees" handleSave={handleSave} loading={updating} error={updateError}>
                    <Text className='text-xl font-semibold text-white'>Assigned Users</Text>
                    {users && users.length > 0 ? (
                        users?.map((user: any) => <>
                            {checkedIds.includes(`${user.id}`) ?
                                <>
                                    <Assignee assignee={user} >
                                        <Button
                                            variant="icon"
                                            onPress={() => toggleSwitch(`${user.id}`)}
                                        >
                                            <Ionicons name="close-circle" size={24} color="white" />
                                        </Button>
                                    </Assignee>
                                </> : <Text className='h-14 text-muted'> No users assigned</Text>
                            }
                        </>)
                    ) : (
                        <Text className='h-24 mb-4 text-muted'>No assignees</Text>
                    )}
                    <Separator className='my-4 bg-primary' />
                    <Text className='text-xl font-semibold text-white'>Project's Users</Text>
                    {users && users.length > 0 ? (
                        users?.map((user: any) => <>
                            {!checkedIds.includes(`${user.id}`) ? <>
                                <Assignee assignee={user} >
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
                </EditParamIssueDialog >
            </SectionTitle >
            {users && users.length > 0 ? (
                users?.map((user: any) => <>
                    {checkedIds.includes(`${user.id}`) ?
                        <>
                            <Assignee assignee={user} >
                            </Assignee>
                        </> : <Text className='h-14 text-muted'> No users assigned</Text>
                    }
                </>)
            ) : (
                <Text className='h-24 mb-4 text-muted'>No assignees</Text>
            )}
            {/* {issue && issue.assignees && issue.assignees.length > 0 ? (
                issue.assignees.map((assignee: any) => <Assignee assignee={assignee} />)
            ) : (
                <Text className='mb-4 text-muted'>No assignees</Text>
            )
            } */}
        </>
    );
};

