import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';

import CreateMergeRequestForm from '@/components/MergeRequest/mr-create-form';
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

    const { projectId, issue_iid: issueIid, title } = useLocalSearchParams();

    const [
        { data: project, isLoading: isLoadingProject, error: errorProject },
        { data: branches, isLoading: isLoadingBranches, error: errorBranches },
    ] = api.useProjectBranchDetails(projectId);

    let branchesName: string[], defaultBranchName: any, listItemsSecond;
    if (!isLoadingBranches) {
        branchesName = branches?.map(branch => branch.name);
        defaultBranchName = branches?.find(branch => branch.default)?.name || branches[0]?.name;
    }
    const mrDescription = {
        title: title ? `Draft: Resolve "${title}"` : '',
        description: `Closes #${issueIid}`,
    }
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
            {/* <Stack.Screen
                options={{
                    title: `Edit Merge Request #${issueIid}`,
                }}
            /> */}
            <ScrollView
                className="flex-1 p-4 bg-card"
                contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
            >
                {project && project.name_with_namespace &&
                    <>
                        <Text className="mb-4 text-lg font-bold text-muted">
                            {project.name_with_namespace || ""}
                        </Text>

                    </>
                }
                {!isLoadingBranches && !isLoadingProject && <CreateMergeRequestForm
                    projectId={projectId}
                    mrDescription={mrDescription}
                    branches={{
                        targetBranchName: project?.default_branch,
                        defaultBranchName,
                        branchesName
                    }}
                // <> <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" nativeID={''}>
                //         Source Branch
                //     </Label>
                //     <Input
                //         className='mb-2'
                //         value={branchName}
                //         onChangeText={setBranchName}
                //     />
                //     <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" nativeID={''}>
                //         Target Branch
                //     </Label>
                //     <Input editable={false} className='mb-2' value={project?.default_branch} />

                //     <EditTitleDescriptionMergeRequestBlock updateMergeRequest={createMergeRequest} mr={mr} projectId={projectId} mr_iid={issueIid} />
                //     <Separator className="my-2" /> 
                //     </>
                />}
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
