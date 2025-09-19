import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';

import EditAssigneeMergeRequest from '@/components/MergeRequest/mr-edit-assignee';
import EditLabelMergeRequest from '@/components/MergeRequest/mr-edit-label';
import EditMilestoneMergeRequest from '@/components/MergeRequest/mr-edit-miletone';
import EditReviewerMergeRequest from '@/components/MergeRequest/mr-edit-reviewer';
import EditTargetBranchMergeRequest from '@/components/MergeRequest/mr-edit-target-branch';
import { EditTitleDescriptionMergeRequestBlock } from '@/components/MergeRequest/mr-edit-title-description-block';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';

export default function MergeRequestEditComponent() {
    const { session } = useSession()
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);
    const { projectId, mr_iid: mrIid } = useLocalSearchParams();

    const { data: mr, loading, error } = api.useProjectMergeRequest(projectId, mrIid) ?? {};
    // const updateMergeRequest = api.useUpdateProjectMergeRequest();

    const updateMergeRequest = useCallback(async (updatedData) => {
        try {
            await client.updateMergeRequest(projectId, mrIid, updatedData);
        } catch (error) {
            console.error('Error updating mr:', error);
            // Handle error (e.g., show an error message to the user)
        }
    }, [api, projectId, mrIid]);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <>
            <Stack.Screen
                options={{
                    title: `Edit Merge Request #${mrIid}`,
                }}
            />
            <ScrollView
                className="flex-1 p-4 bg-card"
                contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
            >
                <EditTitleDescriptionMergeRequestBlock updateMergeRequest={updateMergeRequest} mr={mr} projectId={projectId} mr_iid={mrIid} />
                <Separator className="my-2" />
                <EditTargetBranchMergeRequest projectId={projectId} mrIid={mrIid} />
                <Separator className="my-2" />
                <EditAssigneeMergeRequest projectId={projectId} mrIid={mrIid} />
                <Separator className="my-2" />
                <EditReviewerMergeRequest projectId={projectId} mrIid={mrIid} />
                <Separator className="my-2" />
                <EditLabelMergeRequest projectId={projectId} mrIid={mrIid} />
                <Separator className="my-2" />
                <EditMilestoneMergeRequest projectId={projectId} mrIid={mrIid} />
            </ScrollView>
        </>
    );
};
