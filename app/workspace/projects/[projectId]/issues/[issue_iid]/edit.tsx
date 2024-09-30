import EditAssigneeIssue from '@/components/Issue/issue-edit-assignee';
import EditLabelIssue from '@/components/Issue/issue-edit-label';
import EditMilestoneIssue from '@/components/Issue/issue-edit-miletone';
import { EditTitleDescriptionIssueBlock } from '@/components/Issue/issue-edit-title-description-block';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';

export default function IssueEditComponent() {
    const { session } = useSession()

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);
    const { projectId, issue_iid: issueIid } = useLocalSearchParams();

    const { data: issue, isLoading: isLoadingIssue, error: errorIssue } = api.useProjectIssue(projectId, issueIid) ?? {};

    const updateIssue = useCallback(async (updatedData) => {
        try {
            await client.updateProjectIssue(projectId, issueIid, updatedData);
        } catch (error) {
            console.error('Error updating issue:', error);
            // Handle error (e.g., show an error message to the user)
        }
    }, [api, projectId, issueIid]);

    if (isLoadingIssue) return <Text>Loading...</Text>;
    if (errorIssue) return <Text>Error: {errorIssue?.message}</Text>;
    return (
        <ScrollView
            className="flex-1 p-4 bg-card"
            contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
        >
            <Stack.Screen
                options={{
                    title: `Edit Issue #${issueIid}`,
                }}
            />

            <EditTitleDescriptionIssueBlock updateIssue={updateIssue} issue={issue} />
            <Separator className="my-4" />
            <EditAssigneeIssue projectId={projectId} issueIid={issueIid} />
            <Separator className="my-4" />
            <EditLabelIssue projectId={projectId} issueIid={issueIid} />
            <Separator className="my-4" />
            <EditMilestoneIssue projectId={projectId} issueIid={issueIid} />
        </ScrollView>
    );
};
