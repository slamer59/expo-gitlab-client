import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';

import { EditProjectDescription } from '@/components/Project/project-edit-description';
import { Text } from '@/components/ui/text';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';

export default function ProjectEditDescriptionComponent() {
    const { session } = useSession()
    const router = useRouter();

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);
    const { projectId } = useLocalSearchParams();

    const { data: project, isLoading: isLoadingProject, isError: isErrorProject, error: errorProject } = api.useProject(projectId) ?? {};
    const { mutate: updateProject, isLoading: isLoadingUpdateProject, isError: isErrorUpdateProject, error: errorUpdate } = api.useUpdateProject();

    const handleUpdateProject = useCallback(async (updatedDescription: string) => {
        try {
            await updateProject({
                projectId: projectId as string,
                updateData: { description: updatedDescription }
            })
            router.back(); // Navigate back to the previous screen after updating the description
        } catch (error) {
            console.error('Error updating project description:', error);
            // Handle error (e.g., show an error message to the user)
        }
    }, [projectId, updateProject, router]);

    if (isLoadingProject || isLoadingUpdateProject) return <Text>Loading...</Text>;
    if (isErrorProject || isErrorUpdateProject) return <Text>Error: {errorProject?.message || errorUpdate?.message}</Text>;

    return (
        <>
            <Stack.Screen
                options={{
                    title: "",
                }}
            />
            <ScrollView className="flex-1 p-4 bg-card">
                <EditProjectDescription updateProject={handleUpdateProject} project={project} />
            </ScrollView>
        </>
    );
};
