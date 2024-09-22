import EditAssigneeIssue from '@/components/Issue/issue-edit-asignee';
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

export default function IssueEditComponent() {
    const { session } = useSession()
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);
    const { projectId, issue_iid: issueIid } = useLocalSearchParams();

    const { data: issue, loading, error } = api.useProjectIssue(projectId, issueIid) ?? {};

    const updateIssue = useCallback(async (updatedData) => {
        try {
            await api.updateProjectIssue(projectId, issueIid, updatedData);
        } catch (error) {
            console.error('Error updating issue:', error);
            // Handle error (e.g., show an error message to the user)
        }
    }, [api, projectId, issueIid]);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <>
            <Stack.Screen
                options={{
                    title: `Edit Issue #${issueIid}`,
                }}
            />
            <C
                className="flex-1 p-4 bg-card"
                contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
            >
                <EditTitleDescriptionIssueBlock updateIssue={updateIssue} issue={issue} projectId={projectId} issue_iid={issueIid} />
                <Separator className="my-4" />
                <EditAssigneeIssue projectId={projectId} issueIid={issueIid} />
                <Separator className="my-4" />
                <EditLabelIssue projectId={projectId} issueIid={issueIid} />
                <Separator className="my-4" />
                <EditMilestoneIssue projectId={projectId} issueIid={issueIid} />
            </C>
        </>
    );
};
