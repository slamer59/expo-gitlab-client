import GitLabClient from '../gitlab-api-wrapper';

export interface User {
    id: number;
    username: string;
    projectIds: number[];
}

export interface Project {
    id: number;
    name: string;
    description: string;
}

export interface Issue {
    id: number;
    iid: number;
    title: string;
    description: string;
    state: string;
}

export interface MergeRequest {
    id: number;
    iid: number;
    title: string;
    description: string;
    state: string;
}

export const useGitLabRepository = (gitlabClient: GitLabClient) => {
    return {
        getUser: async (username: string): Promise<User> => {
            const users = await gitlabClient.Users.all({ username });
            if (users.length === 0) {
                throw new Error(`User not found: ${username}`);
            }
            const user = users[0];
            const projects = await gitlabClient.Users.projects(user.id);
            return {
                id: user.id,
                username: user.username,
                projectIds: projects.map((p: any) => p.id),
            };
        },

        getProjectsByIds: async (ids: number[]): Promise<Project[]> => {
            const projects = await Promise.all(
                ids.map(id => gitlabClient.Projects.show(id))
            );
            return projects.map(project => ({
                id: project.id,
                name: project.name,
                description: project.description,
            }));
        },

        getProjectIssues: async (projectId: number): Promise<Issue[]> => {
            const issues = await gitlabClient.Issues.all(projectId);
            return issues.map(issue => ({
                id: issue.id,
                iid: issue.iid,
                title: issue.title,
                description: issue.description,
                state: issue.state,
            }));
        },

        createProjectIssue: async (projectId: number, title: string, description: string): Promise<Issue> => {
            const issue = await gitlabClient.Issues.create(projectId, { title, description });
            return {
                id: issue.id,
                iid: issue.iid,
                title: issue.title,
                description: issue.description,
                state: issue.state,
            };
        },

        getProjectMergeRequests: async (projectId: number): Promise<MergeRequest[]> => {
            const mergeRequests = await gitlabClient.MergeRequests.all(projectId);
            return mergeRequests.map(mr => ({
                id: mr.id,
                iid: mr.iid,
                title: mr.title,
                description: mr.description,
                state: mr.state,
            }));
        },

        createMergeRequest: async (projectId: number, sourceBranch: string, targetBranch: string, title: string): Promise<MergeRequest> => {
            const mr = await gitlabClient.MergeRequests.create(projectId, { source_branch: sourceBranch, target_branch: targetBranch, title });
            return {
                id: mr.id,
                iid: mr.iid,
                title: mr.title,
                description: mr.description,
                state: mr.state,
            };
        },

        getProjectBranches: async (projectId: number): Promise<string[]> => {
            const branches = await gitlabClient.Branches.all(projectId);
            return branches.map(branch => branch.name);
        },

        createProjectBranch: async (projectId: number, branch: string, ref: string): Promise<void> => {
            await gitlabClient.Branches.create(projectId, { branch, ref });
        },

        getProjectCommits: async (projectId: number): Promise<any[]> => {
            return await gitlabClient.Commits.all(projectId);
        },

        getProjectLabels: async (projectId: number): Promise<string[]> => {
            const labels = await gitlabClient.Labels.all(projectId);
            return labels.map(label => label.name);
        },

        createProjectLabel: async (projectId: number, name: string, color: string): Promise<void> => {
            await gitlabClient.Labels.create(projectId, { name, color });
        },
    };
};
