
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
import GitLabClient from '@/lib/custom-gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { SectionTitle } from '../Section/param';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


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
                {/* <Text className="mb-2 text-lg font-bold">Title</Text>
                    <Textarea
                        value={title}
                        onChangeText={setTitle}
                        className="p-2 mb-4 border border-gray-300 rounded"
                    />
                    <Text className="mb-2 text-lg font-bold">Description</Text>
                    <Textarea
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        className="p-2 mb-4 border border-gray-300 rounded"
                    /> */}


                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">
                            <Text>Cancel</Text>
                        </Button>
                    </DialogClose>
                    <Button variant="secondary" onPress={handleSave} disabled={loading}>
                        <Text>{loading ? 'Saving...' : 'Save Changes'}</Text>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >

    </>
}



export default function EditParamIssue({ projectId, issueIid }) {

    const handleSave = async () => {
        await updateIssue({
            assignee_ids: issue.map((assignee) => assignee.id),
        });
    };

    const { session } = useSession()
    const api = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const { data: issue, loading, error } = api.useProjectIssue(projectId, issueIid) ?? {};
    const { execute: updateIssue, loading: updating, error: updateError } = api.useUpdateProjectIssue(projectId, issueIid);


    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <>
            {/* {loading && <Loading />}; */}
            <SectionTitle title="Assignees">
                <EditParamIssueDialog title="Assignees" handleSave={handleSave} loading={updating} error={updateError}>
                    {issue && issue.assignees && issue.assignees.length > 0 ? (
                        issue.assignees.map((assignee: any) => Assignee(assignee))
                    ) : (
                        <Text className='mb-4 text-muted'>No assignees</Text>
                    )}
                </EditParamIssueDialog>
            </SectionTitle >
            {issue && issue.assignees && issue.assignees.length > 0 ? (
                issue.assignees.map((assignee: any) => Assignee(assignee))
            ) : (
                <Text className='mb-4 text-muted'>No assignees</Text>
            )}
        </>
    );
};

export enum AssigneeVariant {
    None = 'none',
    Add = 'add',
    Remove = 'remove'
}

type AssigneeProps = {
    variant: AssigneeVariant;
};
function Assignee(assignee: any, variant: AssigneeProps = AssigneeVariant.None) {
    return <View className="flex-row items-center justify-between">
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
        {variant === AssigneeVariant.Remove && (
            <Button
                variant="icon"
                onPress={() => console.log("remove assignee")}
            >
                <Ionicons name="close-circle" size={24} color="white" />
            </Button>
        )}
        {variant === AssigneeVariant.Add && (
            <Button
                variant="icon"
                onPress={() => console.log("add assignee")}
            >
                <Ionicons name="add-circle" size={24} color="white" />
            </Button>
        )}
    </View>;
}

