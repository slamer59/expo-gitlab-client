import { EditTitleDescriptionMergeRequestBlock } from '@/components/MergeRequest/mr-edit-title-description-block';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';

export default function MergeRequestEditComponent() {
    const { session } = useSession()
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const { projectId, issue_iid: issueIid, title } = useLocalSearchParams();
    const { data: project, isLoading, isError } = api.useProject(projectId);
    const router = useRouter();
    const [branchName, setBranchName] = useState(() => title ? transformToBranchName(title) : '');

    const mr = {
        title: title ? `Draft: Resolve "${title}"` : '',
        description: `Closes #${issueIid}`,
    }

    const createMergeRequest = useCallback(async (createdData) => {
        const { title, description } = createdData;
        try {
            // First, create the branch
            const response = await client.Branches.create(projectId, {
                branch: branchName, ref: project?.default_branch,
            });

            // Then, create the merge request
            const mr = await client.ProjectMergeRequests.create(projectId, {
                source_branch: branchName,
                target_branch: project?.default_branch,
                title,
                description,
                // Add any other options if needed
            });

            // Navigate to the new merge request
            router.push(`/workspace/projects/${projectId}/merge-requests/${mr.iid}`);
        } catch (error) {
            console.error('Error creating branch or merge request:', error);
        }
    }, [projectId, issueIid, branchName]);

    function transformToBranchName(title: string): string {
        if (!title) return '';
        return `${issueIid}-${title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .slice(0, 50)}`; // Limit length to 50 characters
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: `Edit MergeRequest #${issueIid}`,
                }}
            />
            <ScrollView
                className="flex-1 p-4 bg-card"
                contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
            >
                {!isLoading &&
                    <>
                        <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" nativeID={''}>
                            Source Branch
                        </Label>
                        <Input
                            className='mb-2'
                            value={branchName}
                            onChangeText={setBranchName}
                        />
                        <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" nativeID={''}>
                            Target Branch
                        </Label>
                        <Input editable={false} className='mb-2' value={project?.default_branch} />

                        <EditTitleDescriptionMergeRequestBlock updateMergeRequest={createMergeRequest} mr={mr} projectId={projectId} mr_iid={issueIid} />
                        <Separator className="my-2" />
                    </>
                }
                {/* {!isLoading && <CreateMergeRequestForm
                    projectId={projectId}
                /> */}
                {/* <EditTargetBranchMergeRequest
                    projectId={projectId}
                    issueIid={issueIid}
                    target_branch={target_branch}
                /> */}
                {/* <Separator className="my-2" />
                <EditAssigneeMergeRequest projectId={projectId} issueIid={issueIid} />
                <Separator className="my-2" />
                <EditReviewerMergeRequest projectId={projectId} issueIid={issueIid} />
                <Separator className="my-2" />
                <EditLabelMergeRequest projectId={projectId} issueIid={issueIid} />
                <Separator className="my-2" />
                <EditMilestoneMergeRequest projectId={projectId} issueIid={issueIid} /> */}
            </ScrollView>
        </>
    );
};
