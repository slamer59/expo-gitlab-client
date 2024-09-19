
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
import { Text } from '@/components/ui/text';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import React, { useState } from 'react';
import { View } from 'react-native';
import Loading from '../Loading';
import { Textarea } from '../ui/textarea';

function EditTitleDescriptionIssueDialog({ issue, updateIssue, loading, error }) {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    React.useEffect(() => {
        if (issue) {
            setTitle(issue.title);
            setDescription(issue.description);
        }
    }, [issue]);

    const handleSave = async () => {
        await updateIssue({
            title,
            description
        });
    };


    return <>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Text>Edit Issue</Text>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" >
                <DialogHeader>
                    <DialogTitle className='text-secondary'>Edit Title & Description</DialogTitle>
                    <DialogDescription>
                        Make changes to title and description issue here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <View className="py-4">
                    <Text className="mb-2 text-lg font-bold">Title</Text>
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
                    />

                </View>
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
        </Dialog>
    </>
}

export default function EditIssueParamDialog({ projectId, issueIid }) {

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
            {loading && <Loading />}
            <EditTitleDescriptionIssueDialog issue={issue} updateIssue={updateIssue} loading={updating} error={updateError} />
        </>
    );
};


