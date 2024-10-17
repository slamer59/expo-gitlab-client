import { useMutation, useQueries, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import GitLabClient from '../../gitlab-api-wrapper';

const createQueryHook = (queryKey: string[], queryFn: () => Promise<any>) => (): UseQueryResult<any> =>
    useQuery({ queryKey, queryFn });

const createMutationHook = (
    mutationFn: (...args: any[]) => Promise<any>,
    invalidateQueries: string[],
    onSuccessCallback?: (data: any, variables: any, context: unknown) => void
) => () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: (data, variables, context) => {
            invalidateQueries.forEach(query => queryClient.invalidateQueries([query]));
            if (onSuccessCallback) {
                onSuccessCallback(data, variables, context);
            }
        },
    });
};

export const useGitLab = (client: GitLabClient) => {
    const queryHooks = {
        useUser: (userId: string) => createQueryHook(['user', userId], () => client.Users.show(userId))(),
        useCurrentUser: createQueryHook(['currentUser'], () => client.Users.current()),
        useUserProjects: (userId: string) => createQueryHook(['userProjects', userId], () => client.Users.projects(userId))(),
        useUserContributedProjects: (userId: string) => createQueryHook(['userContributedProjects', userId], () => client.Users.contributed_projects(userId))(),
        useUserGroupsProjects: (userId: string) => createQueryHook(['userGroupsProjects', userId], () => client.Users.groups(userId))(),
        useUserStarredProjects: (userId: string) => createQueryHook(['userStarredProjects', userId], () => client.Users.starred_projects(userId))(),
        useProject: (projectId: string) => createQueryHook(['project', projectId], () => client.Projects.show(projectId))(),
        useProjects: (params: any) => createQueryHook(['project', params], () => client.Projects.all(params))(),
        useProjectIssues: (projectId: string, params: any) => createQueryHook(['projectIssues', projectId], () => client.ProjectIssues.all(projectId, params))(),
        useProjectIssue: (projectId: string, issueId: string) => createQueryHook(['projectIssue', projectId, issueId], () => client.ProjectIssues.show(projectId, issueId))(),
        useProjectMergeRequests: (projectId: string) => createQueryHook(['projectMergeRequests', projectId], () => client.ProjectMergeRequests.all(projectId))(),
        useProjectCommits: (projectId: string) => createQueryHook(['projectCommits', projectId], () => client.Commits.all(projectId))(),
        useProjectBranches: (projectId: string) => createQueryHook(['projectBranches', projectId], () => client.Branches.all(projectId))(),
        useProjectUsers: (projectId: string) => createQueryHook(['projectUsers', projectId], () => client.ProjectsUsers.all(projectId))(),
        useProjectLabels: (projectId: string) => createQueryHook(['projectLabels', projectId], () => client.Labels.all(projectId))(),
        useProjectMilestones: (projectId: string) => createQueryHook(['projectMilestones', projectId], () => client.Milestones.all(projectId))(),
        useProjectPipelines: (projectId: string) => createQueryHook(['projectPipelines', projectId], () => client.Pipelines.all(projectId))(),
        useProjectMergeRequest: (projectId: string, mergeRequestIid: string) => createQueryHook(['projectMergeRequest', projectId, mergeRequestIid], () => client.ProjectMergeRequests.show(projectId, mergeRequestIid))(),
        useIssues: (params: any) => createQueryHook(['issues', params], () => client.Issues.all(params))(),
        useIssueDiscussion: (projectId: string, issueId: string, discussionId: string) => createQueryHook(['issueDiscussion', projectId, issueId, discussionId], () => client.Discussions.show(projectId, issueId, discussionId))(),
        useMergeRequests: (params: any) => createQueryHook(['mergeRequests', params], () => client.MergeRequests.all(params))(),
        useConvertMarkdownToHtml: (markdown: string) => createQueryHook(['convertMarkdownToHtml', markdown], () => client.Markdown.render({ text: markdown, gfm: true }))(),
    };

    const mutationHooks = {
        // Project
        useCreateProject: createMutationHook(
            (data: { name: string; options?: any }) => client.Projects.create(data.name, data.options),
            ['projects'],
        ),
        useUpdateProject: createMutationHook(
            (data: { projectId: string; updateData: any }) =>
                client.Projects.edit(data.projectId, data.updateData),
            ['project', 'projectUsers'],
        ),
        useArchiveProject: createMutationHook(
            (projectId: string) => client.Projects.archive(projectId),
            ['projects'],
        ),
        useUnarchiveProject: createMutationHook(
            (projectId: string) => client.Projects.unarchive(projectId),
            ['projects'],
        ),
        useDeleteProject: createMutationHook(
            (projectId: string) => client.Projects.remove(projectId),
            ['projects'],
        ),
        useProjectFork: createMutationHook(
            (data: { projectId: string; options?: any }) => client.Projects.fork(data.projectId, data.options),
            ['projects'],
        ),
        useProjectUpload: createMutationHook(
            (data: { projectId: string; file: File; options?: any }) =>
                client.Projects.upload(data.projectId, data.file, data.options),
            ['projects'],
        ),
        useProjectSearch: createMutationHook(
            (data: { projectId: string; search: string; options?: any }) =>
                client.Projects.search(data.projectId, data.search, data.options),
            ['projects'],
        ),
        // Project Issue
        useCreateProjectIssue: createMutationHook(
            (data: { projectId: string; title: string; description: string; options?: any }) => {
                return client.createProjectIssue(data.projectId, data.title, data.description, data.options)
            },
            ['projectIssues']
        ),
        useUpdateProjectIssue: createMutationHook(
            (data: { projectId: string, issueIid: string, updateData: any }) => {
                return client.updateProjectIssue(data.projectId, data.issueIid, data.updateData)
            },
            ['projectIssues']
        ),
        useDeleteProjectIssue: createMutationHook(
            (data: { projectId: string; issueIid: string }) =>
                client.deleteProjectIssue(data.projectId, data.issueIid),
            ['projectIssues']
        ),
        // Project Merge Request
        useCreateProjectMergeRequest: createMutationHook(
            (data: { projectId: string; sourceBranch: string; targetBranch: string; title: string; options?: any }) =>
                client.createMergeRequest(data.projectId, data.sourceBranch, data.targetBranch, data.title, data.options),
            ['projectMergeRequests']
        ),
        useUpdateProjectMergeRequest: createMutationHook(
            (data: { projectId: string; mergeRequestIid: string; updateData: any }) =>
                client.updateProjectMergeRequest(data.projectId, data.mergeRequestIid, data.updateData),
            ['projectMergeRequests']
        ),
        useDeleteProjectMergeRequest: createMutationHook(
            (data: { projectId: string; mergeRequestIid: string }) =>
                client.deleteProjectMergeRequest(data.projectId, data.mergeRequestIid),
            ['projectMergeRequests']
        ),
        // Project Commit
        useCreateCommit: createMutationHook(
            (data: { projectId: string; branch: string; commitMessage: string; actions: any[]; options?: any }) =>
                client.createCommit(data.projectId, data.branch, data.commitMessage, data.actions, data.options),
            ['projectCommits']
        ),
        useUpdateMergeRequest: createMutationHook(
            (data: { projectId: string; mergeRequestIid: string; updateData: any }) =>
                client.updateMergeRequest(data.projectId, data.mergeRequestIid, data.updateData),
            ['projectMergeRequests']
        ),
        useDeleteMergeRequest: createMutationHook(
            (data: { projectId: string; mergeRequestIid: string }) =>
                client.deleteMergeRequest(data.projectId, data.mergeRequestIid),
            ['projectMergeRequests']
        ),
        useDeletePipeline: createMutationHook(
            (data: { projectId: string; pipelineId: string }) =>
                client.deletePipeline(data.projectId, data.pipelineId),
            ['projectPipelines']
        ),
        useCancelPipeline: createMutationHook(
            (data: { projectId: string; pipelineId: string }) =>
                client.cancelPipeline(data.projectId, data.pipelineId),
            ['projectPipelines']
        ),
        // Retry
        useRetryPipeline: createMutationHook(
            (data: { projectId: string; pipelineId: string }) =>
                client.Pipelines.retry(data.projectId, data.pipelineId),
            ['projectPipelines']
        ),
        useRetryJob: createMutationHook(
            (data: { projectId: string; jobId: string }) =>
                client.Jobs.retry(data.projectId, data.jobId),
            ['projectJobs']
        ),
        useCreateIssueDiscussion: createMutationHook(
            (data: { projectId: string, issueId: string, body: any }) =>
                client.Discussions.create(data.projectId, data.issueId, data.body),
            ['projectIssuesDiscussions']
        ),
        useCreateProjectBranch: createMutationHook(
            (data: { projectId: string, branchName: string, ref: string }) =>
                client.Branches.create(data.projectId, data.branchName, data.ref),
            ['projectBranches']
        ),
        useDeleteProjectBranch: createMutationHook(
            (data: { projectId: string, branchName: string }) =>
                client.Branches.remove(data.projectId, data.branchName),
            ['projectBranches']
        )

    };

    const detailsHooks = {
        // Project
        useProjectDetails: (projectId: string) => {
            return useQueries({
                queries: [
                    {
                        queryKey: ['project', projectId],
                        queryFn: () => client.Projects.show(projectId),
                    },
                    {
                        queryKey: ['projectUsers', projectId],
                        queryFn: () => client.ProjectsUsers.all(projectId),
                    },
                    {
                        queryKey: ['projectMergeRequests', projectId],
                        queryFn: () => client.ProjectMergeRequests.all(projectId),
                    },
                    {
                        queryKey: ['projectBranches', projectId],
                        queryFn: () => client.Branches.all(projectId),
                    },
                    {
                        queryKey: ['projectMembers', projectId],
                        queryFn: () => client.ProjectMembers.all(projectId),
                    },
                    {
                        queryKey: ['projectPipelines', projectId],
                        queryFn: () => client.Pipelines.all(projectId),
                    },
                    {
                        queryKey: ['projectMilleStones', projectId],
                        queryFn: () => client.Milestones.all(projectId),
                    },
                    {
                        queryKey: ['projectLabels', projectId],
                        queryFn: () => client.Labels.all(projectId),
                    }
                ],
            },
            );
        },
        useProjectIssueCreate: (projectId: string) => {
            return useQueries({
                queries: [
                    {
                        queryKey: ['project', projectId],
                        queryFn: () => client.Projects.show(projectId),
                    },
                    {
                        queryKey: ['projectMembers', projectId],
                        queryFn: () => client.ProjectMembers.all(projectId),
                    },
                    {
                        queryKey: ['projectMileStones', projectId],
                        queryFn: () => client.Milestones.all(projectId),
                    },
                    {
                        queryKey: ['projectLabels', projectId],
                        queryFn: () => client.Labels.all(projectId),
                    }
                ],
            },
            );
        },

        // Project Issue
        useProjectIssueDetails: (projectId: string, issueIid: string) => {
            return useQueries({
                queries: [
                    {
                        queryKey: ['projectIssue', projectId, issueIid],
                        queryFn: () => client.ProjectIssues.show(projectId, issueIid),
                    },
                    {
                        queryKey: ['projectIssueNotes', projectId, issueIid],
                        queryFn: () => client.ProjectIssues.notes(projectId, issueIid),
                    },
                    {
                        queryKey: ['projectIssueRelatedMergeRequest', projectId, issueIid],
                        queryFn: () => client.ProjectIssues.related_merge_requests(projectId, issueIid),
                    },
                    {
                        queryKey: ['projectIssueLinks', projectId, issueIid],
                        queryFn: () => client.ProjectIssues.links(projectId, issueIid),
                    }
                ],
            })
        },
        // Merge Request
        useMergeRequestDetails: (projectId: string, mergeRequestIid: string) => {
            return useQueries({
                queries: [
                    {
                        queryKey: ['projectMergeRequest', projectId, mergeRequestIid],
                        queryFn: () => client.ProjectMergeRequests.show(projectId, mergeRequestIid),
                    },
                    // {
                    //     queryKey: ['projectMergeRequestComments', projectId, mergeRequestIid],
                    //     queryFn: () => client.ProjectMergeRequests.comments(projectId, mergeRequestIid),
                    // },
                    {
                        queryKey: ['projectMergeRequestCommits', projectId, mergeRequestIid],
                        queryFn: () => client.ProjectMergeRequests.commits(projectId, mergeRequestIid),
                    },
                    {
                        queryKey: ['projectMergeRequestNotes', projectId, mergeRequestIid],
                        queryFn: () => client.ProjectMergeRequests.notes(projectId, mergeRequestIid),
                    },
                    {
                        queryKey: ['projectMergeRequestChanges', projectId, mergeRequestIid],
                        queryFn: () => client.ProjectMergeRequests.changes(projectId, mergeRequestIid),
                    },
                ],
            });
        },
        // Profile
        useProfileDetails() {
            const { data: currentUser, isLoading: isLoadingUser, error: errorUser } = useQuery({
                queryKey: ['currentUser'],
                queryFn: () => client.Users.current(),
            });
            const queries = useQueries({
                queries: [
                    {
                        queryKey: ['personalProjects', currentUser?.username],
                        queryFn: () => client.Users.projects(currentUser.username, {
                            membership: true,
                            sort: "desc",
                        }),
                        enabled: !!currentUser,
                    },
                    {
                        queryKey: ['contributedProjects'],
                        queryFn: () => client.Users.contributed_projects(currentUser.id, {
                            membership: true,
                            order_by: "last_activity_at",
                            sort: "desc",
                        }),
                    },
                    {
                        queryKey: ['starredProjects', currentUser?.username],
                        queryFn: () => client.Users.starred_projects(currentUser?.id),
                        enabled: !!currentUser?.username,
                    },
                ],
            });
            return [
                { data: currentUser, isLoading: isLoadingUser, error: errorUser },
                ...queries.map(({ data, isLoading, error }) => ({ data, isLoading, error })),
            ];
        },
        // Pipeline
        usePipelineDetails: (projectId: string, pipelineId: string) => {
            const pipelineQuery = useQuery({
                queryKey: ['projectPipeline', projectId, pipelineId],
                queryFn: () => client.Pipelines.show(projectId, pipelineId),
            });

            const commitQuery = useQuery({
                queryKey: ['projectPipelineCommit', projectId, pipelineQuery.data?.sha],
                queryFn: () => client.Commits.show(projectId, pipelineQuery.data?.sha),
                enabled: !!pipelineQuery.data?.sha,
            });

            const jobsQuery = useQuery({
                queryKey: ['projectPipelineJobs', projectId, pipelineId],
                queryFn: () => client.Pipelines.jobs(projectId, pipelineId),
            });

            return [
                { data: pipelineQuery.data, isLoading: pipelineQuery.isLoading, error: pipelineQuery.error },
                { data: commitQuery.data, isLoading: commitQuery.isLoading, error: commitQuery.error },
                { data: jobsQuery.data, isLoading: jobsQuery.isLoading, error: jobsQuery.error },
            ];
        },

    };


    return { ...queryHooks, ...mutationHooks, ...detailsHooks };
};
