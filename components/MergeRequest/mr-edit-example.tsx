
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
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Textarea } from '../ui/textarea';

const EditMergeRequestDialog = ({ projectId, mrIid }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const { session } = useSession()
    const api = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const { data: mr, loading, error } = api.useProjectMergeRequest(projectId, mrIid) ?? {};
    const { execute: updateMergeRequest, loading: updating, error: updateError } = api.useUpdateProjectMergeRequest(projectId, mrIid);

    React.useEffect(() => {
        if (mr) {
            setTitle(mr.title);
            setDescription(mr.description);
        }
    }, [mr]);

    const handleSave = async () => {
        await updateMergeRequest({ title, description });
    };

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Text>Edit MergeRequest</Text>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit MergeRequest</DialogTitle>
                    <DialogDescription>
                        Make changes to the mr here. Click save when you're done.
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
                        {mr?.assignees?.map(assignee => (
                            <View key={assignee.id} className="px-3 py-1 m-1 bg-gray-200 rounded-full">
                                <Text>{assignee.name}</Text>
                            </View>
                        ))}
                        {(!mr?.assignees || mr.assignees.length === 0) && <Text>No one assigned</Text>}
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

export default EditMergeRequestDialog;
