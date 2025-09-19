import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';

import CreateIssueForm from '@/components/Issue/issue-create-form';
import { Text } from '@/components/ui/text';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';

export default function CreateIssue() {
    const { projectId } = useLocalSearchParams();
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);


    const [
        { data: project, isLoading: isLoadingProject, error: errorProject },
        // { data: members, isLoading: isLoadingMembers, error: errorMembers },
        // { data: milestones, loading: milestonesLoading, error: milestonesError },
        // { data: labels, loading: labelsLoading, error: labelsError }
    ] = api.useProjectIssueCreate(projectId);
    // console.log("🚀 ~ CreateIssue ~ project:", project)
    // console.log("🚀 ~ CreateIssue ~ members:", members)
    // console.log("🚀 ~ CreateIssue ~ milestones:", milestones)
    // console.log("🚀 ~ CreateIssue ~ labels:", labels)
    return (
        <ScrollView
            className="flex-1 p-4 bg-card"
            contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
        >
            {project && project.name_with_namespace &&
                <Text className="mb-4 text-lg font-bold text-muted">
                    {project.name_with_namespace || ""}
                </Text>
            }
            {!isLoadingProject && <CreateIssueForm
                projectId={projectId}
            // members={members}
            // milestones={milestones}
            // labels={labels}
            />}

        </ScrollView >
    );
}
