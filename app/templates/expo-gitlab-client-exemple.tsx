import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import React, { useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';


const GitLabIssuesList = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const projectId = 59795263
    const { session } = useSession()
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const { data: issues = [], loading = false, error = null } = api.useProjectIssues(projectId) ?? {};

    const { execute: createIssue, data: newIssue, loading: creating, error: createError } = api.useCreateProjectIssue(projectId, title, description);

    const handleCreateIssue = async () => {
        if (title && description) {
            try {
                await createIssue();
                console.log('New issue created:', newIssue);
                console.log("creating", creating);
                // setTitle('');
                // setDescription('');
            } catch (error) {
                console.error('Error creating issue:', error);
                // Handle the error appropriately, e.g., show an error message to the user
            } finally {
                // This block will run regardless of success or failure
                console.log('Create issue attempt completed');
            }
        }
    };


    if (loading) return <Text>Loading issues...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <View>
            <Text>Project Issues</Text>
            <TextInput
                placeholder="Issue Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                placeholder="Issue Description"
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <Button
                title={creating ? "Creating..." : "Create Issue"}
                onPress={handleCreateIssue}
                disabled={creating || !title || !description}
            />
            {createError && <Text>Error creating issue: {createError}</Text>}
            {newIssue && <Text>New issue created: {newIssue.title}</Text>}
            <FlatList
                data={issues}
                renderItem={({ item }) => <Text>{item.title}</Text>}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

export default GitLabIssuesList;