import { useMutation, useQueries, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import GitLabClient from '../../gitlab-api-wrapper';

const createQueryHook = (queryKey: string[], queryFn: () => Promise<any>) => (): UseQueryResult<any> =>
    useQuery({ queryKey, queryFn });

const createMutationHook = (mutationFn: (...args: any[]) => Promise<any>, invalidateQueries: string[]) => () =>
    useMutation({
        mutationFn,
        onSuccess: () => {
            const queryClient = useQueryClient();
            invalidateQueries.forEach(query => queryClient.invalidateQueries([query]));
        },
    });

export const useGitLab = (client: GitLabClient) => {
    const queryHooks = {
        useUser: (userId: string) => createQueryHook(['user', userId], () => client.Users.show(userId))(),
        useCurrentUser: createQueryHook(['currentUser'], () => client.Users.current()),
        useUserProjects: (userId: string) => createQueryHook(['userProjects', userId], () => client.Users.projects(userId))(),
        useUserContributedProjects: (userId: string) => createQueryHook(['userContributedProjects', userId], () => client.Users.contributed_projects(userId))(),
        useUserOwnedProjects: (userId: string) => createQueryHook(['userOwnedProjects', userId], () => client.Users.owned_projects(userId))(),
        useUserStarredProjects: (userId: string) => createQueryHook(['userStarredProjects', userId], () => client.Users.starred_projects(userId))(),
        useProject: (projectId: string) => createQueryHook(['project', projectId], () => client.Projects.show(projectId))(),
        useProjects: (params: any) => createQueryHook(['project', params], () => client.Projects.all(params))(),
        useProjectIssues: (projectId: string) => createQueryHook(['projectIssues', projectId], () => client.Issues.all(projectId))(),
        useProjectIssue: (projectId: string, issueId: string) => createQueryHook(['projectIssue', projectId, issueId], () => client.Issues.show(projectId, issueId))(),
        useProjectMergeRequests: (projectId: string) => createQueryHook(['projectMergeRequests', projectId], () => client.MergeRequests.all(projectId))(),
        useProjectCommits: (projectId: string) => createQueryHook(['projectCommits', projectId], () => client.Commits.all(projectId))(),
        useProjectBranches: (projectId: string) => createQueryHook(['projectBranches', projectId], () => client.Branches.all(projectId))(),
        useProjectUsers: (projectId: string) => createQueryHook(['projectUsers', projectId], () => client.ProjectsUsers.all(projectId))(),
        useProjectLabels: (projectId: string) => createQueryHook(['projectLabels', projectId], () => client.Labels.all(projectId))(),
        useProjectMilestones: (projectId: string) => createQueryHook(['projectMilestones', projectId], () => client.Milestones.all(projectId))(),
        useProjectPipelines: (projectId: string) => createQueryHook(['projectPipelines', projectId], () => client.Pipelines.all(projectId))(),
        useProjectMergeRequest: (projectId: string, mergeRequestIid: string) => createQueryHook(['projectMergeRequest', projectId, mergeRequestIid], () => client.MergeRequests.show(projectId, mergeRequestIid))(),
    };

    const mutationHooks = {
        // Project Issue
        useCreateProjectIssue: createMutationHook(
            (data: { projectId: string; title: string; description: string; options?: any }) =>
                client.createProjectIssue(data.projectId, data.title, data.description, data.options),
            ['projectIssues']
        ),
        useUpdateProjectIssue: createMutationHook(
            (data: { projectId: string; issueIid: string; updateData: any }) =>
                client.updateProjectIssue(data.projectId, data.issueIid, data.updateData),
            ['projectIssues']
        ),
        useDeleteProjectIssue: createMutationHook(
            (data: { projectId: string; issueIid: string }) =>
                client.deleteProjectIssue(data.projectId, data.issueIid),
            ['projectIssues']
        ),
        // Project Merge Request
        useCreateMergeRequest: createMutationHook(
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



        useConvertMarkdownToHtml: createMutationHook(
            (markdown: string) => client.Markdown.render({ text: markdown, gfm: true }),
            []
        ),
    };
    const useProjectDetails = (projectId: string) => {
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
                    queryFn: () => client.MergeRequests.all(projectId),
                },
                {
                    queryKey: ['projectBranches', projectId],
                    queryFn: () => client.Branches.all(projectId),
                },
                {
                    queryKey: ['projectMembers', projectId],
                    queryFn: () => client.ProjectMembers.all(projectId),
                },
            ],
        });
    };

    return { ...queryHooks, ...mutationHooks, useProjectDetails };
};
