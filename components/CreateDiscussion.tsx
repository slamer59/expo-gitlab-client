import { Label } from '@rn-primitives/select';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Keyboard, ScrollView, View } from 'react-native';

import EnhancedMarkdownEditor from '@/components/markdown-editor';
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';

export default function CreateDiscussion({ issue }) {

    const { project_id: projectId, iid: issueIid } = issue;
    const router = useRouter();
    const { session } = useSession()

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const [formData, setFormData] = useState({
        description: '',
    });

    // const { execute: createDiscussion, loading: isLoading, error: errorDiscussion } = api.useCreateIssueDiscussion(projectId, issueIid);
    const [isLoading, setIsLoading] = useState(false);
    const handleCancel = useCallback(() => {
        setFormData({
            description: '',
        });
    }, [issue]);

    const handleSave = useCallback(async () => {
        setIsLoading(true);
        console.log("Save button clicked");
        Keyboard.dismiss();

        const updatedData = {
            description: formData.description,
        };
        try {
            await client.Discussions.create(projectId, issueIid, updatedData.description);
            // router.back();
        } catch (error) {
            console.error("Error updating issue:", error);
        } finally {
            setIsLoading(false);
        }
    }, [formData.description]);

    return (
        <ScrollView
            className="flex-1 bg-card"
            contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
        >
            {/* <Stack.Screen
                options={{
                    title: `Discussion`,
                }}
            /> */}

            {/* <IssueComment issue={issue} projectId={projectId} /> */}


            <View className="mb-2">
                <Label nativeID='discussion-on-note' className="mb-2 text-xl font-semibold text-white">Discussion</Label>
                <EnhancedMarkdownEditor
                    projectId={projectId}
                    markdown={formData.description}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                />
            </View>
            <View className="flex flex-row justify-start mt-4 mb-2 space-x-2">
                <Button
                    variant="destructive"
                    onPress={handleSave}
                    className='m-2'
                // disabled={isLoading}
                >
                    <Text>{isLoading ? "⏳  Loading   " : "Save changes"}</Text>
                </Button>
                <Button
                    variant="outline"
                    onPress={handleCancel}
                    className='m-2'
                    disabled={isLoading}
                >
                    <Text>Cancel</Text>
                </Button>
            </View>
        </ScrollView>
    );
};
