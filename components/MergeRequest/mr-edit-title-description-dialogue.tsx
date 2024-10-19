
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
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import React, { useState } from 'react';
import { View } from 'react-native';
import Loading from '../Loading';
import { Textarea } from '../ui/textarea';

function EditTitleDescriptionMergeRequestDialog({ mr, updateMergeRequest, loading, error }) {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    React.useEffect(() => {
        if (mr) {
            setTitle(mr.title);
            setDescription(mr.description);
        }
    }, [mr]);

    const handleSave = async () => {
        await updateMergeRequest({
            title,
            description
        });
    };


    return <>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Text>Edit Merge Request</Text>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" >
                <DialogHeader>
                    <DialogTitle className='text-secondary'>Edit Title & Description</DialogTitle>
                    <DialogDescription>
                        Make changes to title and description mr here. Click save when you're done.
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

export default function EditMergeRequestParamDialog({ projectId, mrIid }) {

    const { session } = useSession()
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const { data: mr, loading, error } = api.useProjectMergeRequest(projectId, mrIid) ?? {};
    const { execute: updateMergeRequest, loading: updating, error: updateError } = api.useUpdateProjectMergeRequest(projectId, mrIid);

    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <>
            {loading && <Loading />}
            <EditTitleDescriptionMergeRequestDialog mr={mr} updateMergeRequest={updateMergeRequest} loading={updating} error={updateError} />
        </>
    );
};


