import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import GitLabClient from '../../gitlab-api-wrapper';

export const useGitLab = (client: GitLabClient) => {
    const queryClient = useQueryClient();

    // User hooks
    const useUser = (userId: string): UseQueryResult<any> => useQuery({
        queryKey: ['user', userId],
        queryFn: () => client.Users.show(userId),
    });

    const useCurrentUser = (): UseQueryResult<any> => useQuery({
        queryKey: ['currentUser'],
        queryFn: () => client.Users.current(),
    });


    const useUserProjects = (userId: string): UseQueryResult<any> => useQuery({
        queryKey: ['userProjects', userId],
        queryFn: () => client.Users.projects(userId),
    });

    const useUserContributedProjects = (userId: string): UseQueryResult<any> => useQuery({
        queryKey: ['userContributedProjects', userId],
        queryFn: () => client.Users.contributed_projects(userId),
    });

    const useUserOwnedProjects = (userId: string): UseQueryResult<any> => useQuery({
        queryKey: ['userOwnedProjects', userId],
        queryFn: () => client.Users.owned_projects(userId),
    });

    const useUserStarredProjects = (userId: string): UseQueryResult<any> => useQuery({
        queryKey: ['userStarredProjects', userId],
        queryFn: () => client.Users.starred_projects(userId),
    });

    // Project hooks
    const useProject = (projectId: string): UseQueryResult<any> => useQuery({
        queryKey: ['project', projectId],
        queryFn: () => client.Projects.show(projectId),
    });

    const useProjectIssues = (projectId: string): UseQueryResult<any> => useQuery({
        queryKey: ['projectIssues', projectId],
        queryFn: () => client.Issues.all(projectId),
    });

    const useProjectMergeRequests = (projectId: string): UseQueryResult<any> => useQuery({
        queryKey: ['projectMergeRequests', projectId],
        queryFn: () => client.MergeRequests.all(projectId),
    });

    const useProjectCommits = (projectId: string): UseQueryResult<any> => useQuery({
        queryKey: ['projectCommits', projectId],
        queryFn: () => client.Commits.all(projectId),
    });

    const useProjectBranches = (projectId: string): UseQueryResult<any> => useQuery({
        queryKey: ['projectBranches', projectId],
        queryFn: () => client.Branches.all(projectId),
    });

    const useProjectUsers = (projectId: string): UseQueryResult<any> => useQuery({
        queryKey: ['projectUsers', projectId],
        queryFn: () => client.ProjectsUsers.all(projectId),
    });

    const useProjectLabels = (projectId: string): UseQueryResult<any> => useQuery({
        queryKey: ['projectLabels', projectId],
        queryFn: () => client.Labels.all(projectId),
    });

    const useProjectMilestones = (projectId: string): UseQueryResult<any> => useQuery({
        queryKey: ['projectMilestones', projectId],
        queryFn: () => client.Milestones.all(projectId),
    });

    const useProjectPipelines = (projectId: string): UseQueryResult<any> => useQuery({
        queryKey: ['projectPipelines', projectId],
        queryFn: () => client.Pipelines.all(projectId),
    });

    // Mutation hooks
    const useCreateProjectIssue = () => useMutation({
        mutationFn: (data: { projectId: string, title: string, description: string, options?: any }) =>
            client.createProjectIssue(data.projectId, data.title, data.description, data.options),
        onSuccess: () => {
            queryClient.invalidateQueries(['projectIssues']);
        },
    });

    const useUpdateProjectIssue = () => useMutation({
        mutationFn: (data: { projectId: string, issueIid: string, updateData: any }) =>
            client.updateProjectIssue(data.projectId, data.issueIid, data.updateData),
        onSuccess: () => {
            queryClient.invalidateQueries(['projectIssues']);
        },
    });

    const useDeleteProjectIssue = () => useMutation({
        mutationFn: (data: { projectId: string, issueIid: string }) =>
            client.deleteProjectIssue(data.projectId, data.issueIid),
        onSuccess: () => {
            queryClient.invalidateQueries(['projectIssues']);
        },
    });

    const useCreateMergeRequest = () => useMutation({
        mutationFn: (data: { projectId: string, sourceBranch: string, targetBranch: string, title: string, options?: any }) =>
            client.createMergeRequest(data.projectId, data.sourceBranch, data.targetBranch, data.title, data.options),
        onSuccess: () => {
            queryClient.invalidateQueries(['projectMergeRequests']);
        },
    });

    const useCreateCommit = () => useMutation({
        mutationFn: (data: { projectId: string, branch: string, commitMessage: string, actions: any[], options?: any }) =>
            client.createCommit(data.projectId, data.branch, data.commitMessage, data.actions, data.options),
        onSuccess: () => {
            queryClient.invalidateQueries(['projectCommits']);
        },
    });
    const useConvertMarkdownToHtml = () => useMutation({
        mutationFn: (markdown: string) =>
            client.Markdown.render({
                text: markdown,
                gfm: true,
            }),
    });

    return {
        useUser,
        useCurrentUser,
        useUserProjects,
        useUserContributedProjects,
        useUserOwnedProjects,
        useUserStarredProjects,
        useProject,
        useProjectIssues,
        useProjectMergeRequests,
        useProjectCommits,
        useProjectBranches,
        useProjectUsers,
        useProjectLabels,
        useProjectMilestones,
        useProjectPipelines,
        useCreateProjectIssue,
        useUpdateProjectIssue,
        useDeleteProjectIssue,
        useCreateMergeRequest,
        useCreateCommit,
        useConvertMarkdownToHtml
    };
};
