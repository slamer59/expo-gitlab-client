
import { EditProjectDescription } from '@/components/Project/project-edit-description';
import { Text } from '@/components/ui/text';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';

export default function ProjectEditDescriptionComponent() {
    const { session } = useSession()

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);
    const { projectId } = useLocalSearchParams();

    const { data: project, loading, error } = api.useProject(projectId) ?? {};

    const updateProjectDescription = useCallback(async (updatedDescription) => {
        try {
            await api.updateProject(projectId, { description: updatedDescription });
            router.back(); // Navigate back to the previous screen after updating the description
        } catch (error) {
            console.error('Error updating project description:', error);
            // Handle error (e.g., show an error message to the user)
        }
    }, [api, projectId]);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <>
            <Stack.Screen
                options={{
                    title: "",
                }}
            />
            <ScrollView className="flex-1 p-4 bg-card">
                <EditProjectDescription updateProject={updateProjectDescription} project={project} />
            </ScrollView>
        </>
    );
};
