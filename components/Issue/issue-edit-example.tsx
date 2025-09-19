
import React, { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';

import { Textarea } from '../ui/textarea';

const EditIssueDialog = ({ projectId, issueIid }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const { session } = useSession()
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const { data: issue, loading, error } = api.useProjectIssue(projectId, issueIid) ?? {};
    const { execute: updateIssue, loading: updating, error: updateError } = api.useUpdateProjectIssue(projectId, issueIid);

    React.useEffect(() => {
        if (issue) {
            setTitle(issue.title);
            setDescription(issue.description);
        }
    }, [issue]);

    const handleSave = async () => {
        await updateIssue({ title, description });
    };

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Text>Edit Issue</Text>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Issue</DialogTitle>
                    <DialogDescription>
                        Make changes to the issue here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <View className="py-4">
                    <Text className="mb-2 font-semibold">Title</Text>
                    <Textarea
                        value={title}
                        onChangeText={setTitle}
                        className="p-2 mb-4 border border-gray-300 rounded"
                    />
                    <Text className="mb-2 font-semibold">Description</Text>
                    <Textarea
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        className="p-2 mb-4 border border-gray-300 rounded"
                    />
                    <Text className="mb-2 font-semibold">Assignees</Text>
                    <View className="flex-row flex-wrap mb-4">
                        {issue?.assignees?.map(assignee => (
                            <View key={assignee.id} className="px-3 py-1 m-1 bg-gray-200 rounded-full">
                                <Text>{assignee.name}</Text>
                            </View>
                        ))}
                        {(!issue?.assignees || issue.assignees.length === 0) && <Text>No one assigned</Text>}
                    </View>
                </View>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">
                            <Text>Cancel</Text>
                        </Button>
                    </DialogClose>
                    <Button onPress={handleSave} disabled={updating}>
                        <Text>{updating ? 'Saving...' : 'Save Changes'}</Text>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditIssueDialog;
