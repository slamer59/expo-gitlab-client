import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { GitLabSession, useSession } from "../session/SessionProvider";

const defaultBaseUrl = "https://gitlab.com";

export const getbaseUrl = (session: { url: string }): string => {
  const gitlabUrl = session?.url ?? defaultBaseUrl;
  return gitlabUrl;
};

export const useGetData = <T>(
  key: string[],
  endpoint: string,
  params?: Record<string, any>,
  options?: UseQueryOptions<T>,
) => {
  const { session } = useSession();

  // Replace all occurrences of {key} in the endpoint string with the corresponding value from the params object
  const url = generateUrlFromParams(session, endpoint, params);
  console.log("url", url);
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.statusText}`,
          );
        }
        return response.json();
      } catch (error) {
        console.error(`An error occurred: ${error}`);
        throw error;
      }
    },
    cacheTime: 1000 * 60, // cache data for 1 minutes
    staleTime: 1000 * 60, // consider data stale after 1 minute
    ...options,
  });
};

export const usePostData = <T>(
  key: string[],
  endpoint: string,
  body?: Record<string, any>,
  options?: UseMutationOptions<T>,
) => {
  const queryClient = useQueryClient();
  const { session } = useSession();

  const url = generateUrlFromParams(session, endpoint, {});

  return useMutation<T>(
    async () => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to post data: ${response.statusText}`,
          );
        }

        return response.json();
      } catch (error) {
        console.error(`An error occurred: ${error}`);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
      },
      ...options,
    },
  );
};

export const usePutData = <T>(
  key: string[],
  endpoint: string,
  body?: Record<string, any>,
  options?: UseMutationOptions<T>,
) => {
  const queryClient = useQueryClient();
  const { session } = useSession();

  const url = generateUrlFromParams(session, endpoint, {});

  return useMutation<T>(
    async () => {
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to put data: ${response.statusText}`,
          );
        }

        return response.json();
      } catch (error) {
        console.error(`An error occurred: ${error}`);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
      },
      ...options,
    },
  );
};

export const useDeleteData = <T>(
  key: string[],
  endpoint: string,
  params?: Record<string, any>,
  options?: UseMutationOptions<T>,
) => {
  const queryClient = useQueryClient();
  const { session } = useSession();

  const url = generateUrlFromParams(session, endpoint, params);

  return useMutation<T>(
    async () => {
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to delete data: ${response.statusText}`,
          );
        }

        return response.json();
      } catch (error) {
        console.error(`An error occurred: ${error}`);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
      },
      ...options,
    },
  );
};



function generateUrlFromParams(
  session: GitLabSession | null,
  endpoint: string,
  params: Record<string, any> | params,
) {

  let url: URL;
  try {
    url = new URL(endpoint);
    console.log("full", url)
  } catch (error) {
    if (error instanceof TypeError) {

      url = `${getbaseUrl(session?.url)}${endpoint}`;
      if (params?.path) {
        for (const key in params.path) {
          url = url.replace(`{${key}}`, params.path[key]);
        }
      }

      const query = `?${new URLSearchParams(params?.query)}` || ""

      url = `${url}${query}`
    } else {
      // If the error is not a TypeError, it means something else went wrong
      // So, we rethrow the error
      throw error;
    }
  }


  return url;
}
// API hooks


export const getSignInPassword = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['signInPassword'], '/oauth/token', params, options);
export const getAccessToken = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['accessToken'], '/oauth/token', params, options);
export const getRefreshToken = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['refreshToken'], '/oauth/token', params, options);
export const getListUsers = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listUsers'], '/api/v4/users', params, options);
export const getGetUser = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['user'], '/api/v4/user', params, options);
export const getListProjects = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listProjects'], '/api/v4/projects', params, options);
export const getGetProject = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['getProject'], '/api/v4/projects/:id', params, options);
export const getUpdateProject = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['updateProject'], '/api/v4/projects/:projectId', params, options);
export const getCreateProject = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['createProject'], '/api/v4/projects', params, options);
export const getDeleteProject = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['deleteProject'], '/api/v4/projects/:id', params, options);
export const getStarProject = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['starProject'], '/api/v4/projects/:id/star', params, options);
export const getUnstarProject = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['unstarProject'], '/api/v4/projects/:id/unstar', params, options);
export const getListProjectStarrers = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listProjectStarrers'], '/api/v4/projects/:id/starrers', params, options);
export const getListBranches = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listBranches'], '/api/v4/projects/:projectId/repository/branches', params, options);
export const getListTags = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listTags'], '/api/v4/projects/:id/repository/tags', params, options);
export const getListRepositoryTree = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listRepositoryTree'], '/api/v4/projects/:id/repository/tree', params, options);
export const getGetFile = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['getFile'], '/api/v4/projects/:projectId/repository/files/:filePath', params, options);
export const getListProjectMembers = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listProjectMembers'], '/api/v4/projects/:id/members', params, options);
export const getAddProjectMember = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['addProjectMember'], '/api/v4/projects/:id/members', params, options);
export const getRemoveProjectMember = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['removeProjectMember'], '/api/v4/projects/:projectId/members/:memberId', params, options);
export const getListGroups = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listGroups'], '/api/v4/groups', params, options);
export const getAddGroup = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['addGroup'], '/api/v4/groups', params, options);
export const getListGroupProjects = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listGroupProjects'], '/api/v4/groups/:groupId/projects', params, options);
export const getListGroupMembers = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listGroupMembers'], '/api/v4/groups/:id/members', params, options);
export const getAddGroupMember = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['addGroupMember'], '/api/v4/groups/:id/members', params, options);
export const getRemoveGroupMember = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['removeGroupMember'], '/api/v4/groups/:groupId/members/:memberId', params, options);
export const getListCommits = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listCommits'], '/api/v4/projects/:projectId/repository/commits', params, options);
export const getGetCommit = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['getCommit'], '/api/v4/projects/:projectId/repository/commits/:sha', params, options);
export const getGetDiff = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['getDiff'], '/api/v4/projects/:projectId/repository/commits/:sha/diff', params, options);
export const getListIssues = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listIssues'], '/api/v4/issues', params, options);
export const getListProjectIssues = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listProjectIssues'], '/api/v4/projects/:projectId/issues', params, options);
export const getGetProjectIssue = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['getProjectIssue'], '/api/v4/projects/:projectId/issues/:iid', params, options);
export const getUpdateProjectIssue = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['updateProjectIssue'], '/api/v4/projects/:projectId/issues/:issueIid', params, options);
export const getAddProjectIssue = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['addProjectIssue'], '/api/v4/projects/:projectId/issues', params, options);
export const getDeleteProjectIssue = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['deleteProjectIssue'], '/api/v4/projects/:projectId/issues/:issueId', params, options);
export const getListMergeRequests = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listMergeRequests'], '/api/v4/merge_requests', params, options);
export const getListProjectMergeRequests = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listProjectMergeRequests'], '/api/v4/projects/:projectId/merge_requests', params, options);
export const getListIssueRelatedMergeRequests = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listIssueRelatedMergeRequests'], '/api/v4/projects/:projectId/issues/:issueIid/related_merge_requests', params, options);
export const getGetMergeRequest = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['getMergeRequest'], '/api/v4/projects/:projectId/merge_requests/:mrIid', params, options);
export const getCreateMergeRequest = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['createMergeRequest'], '/api/v4/projects/:projectId/merge_requests', params, options);
export const getUpdateMergeRequest = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['updateMergeRequest'], '/api/v4/projects/:projectId/merge_requests/:mrIid', params, options);
export const getDeleteMergeRequest = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['deleteMergeRequest'], '/api/v4/projects/:projectId/merge_requests/:id', params, options);
export const getListProjectLabels = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listProjectLabels'], '/api/v4/projects/:projectId/labels', params, options);
export const getListGroupLabels = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listGroupLabels'], '/api/v4/projects/:projectId/labels', params, options);
export const getCreateProjectLabel = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['createProjectLabel'], '/api/v4/projects/:projectId/labels', params, options);
export const getCreateGroupLabel = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['createGroupLabel'], '/api/v4/groups/:groupId/labels', params, options);
export const getUpdateProjectLabel = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['updateProjectLabel'], '/api/v4/projects/:projectId/labels/:labelId', params, options);
export const getDeleteProjectLabel = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['deleteProjectLabel'], '/api/v4/projects/:projectId/labels/:labelId', params, options);
export const getListSnippets = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listSnippets'], '/api/v4/snippets', params, options);
export const getListProjectSnippets = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listProjectSnippets'], '/api/v4/projects/:projectId/snippets', params, options);
export const getGetProjectSnippet = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['getProjectSnippet'], '/api/v4/projects/:projectId/snippets/:snippetId', params, options);
export const getGetProjectSnippetContent = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['getProjectSnippetContent'], '/api/v4/projects/:projectId/snippets/:snippetId/raw', params, options);
export const getAddProjectSnippet = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['addProjectSnippet'], '/api/v4/projects/:projectId/snippets', params, options);
export const getUpdateProjectSnippet = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['updateProjectSnippet'], '/api/v4/projects/:projectId/snippets/:snippetId', params, options);
export const getDeleteProjectSnippet = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['deleteProjectSnippet'], '/api/v4/projects/:projectId/snippets/:snippetId', params, options);
export const getListProjectMilestones = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listProjectMilestones'], '/api/v4/projects/:projectId/milestones', params, options);
export const getGetProjectMilestone = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['getProjectMilestone'], '/api/v4/projects/:projectId/milestones/:milestoneId', params, options);
export const getUpdateProjectMilestone = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['updateProjectMilestone'], '/api/v4/projects/:projectId/milestones/:milestoneId', params, options);
export const getAddProjectMilestone = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['addProjectMilestone'], '/api/v4/projects/:projectId/milestones', params, options);
export const getDeleteProjectMilestone = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['deleteProjectMilestone'], '/api/v4/projects/:projectId/milestones/:milestoneId', params, options);
export const getGetMilestoneIssues = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['getMilestoneIssues'], '/api/v4/projects/:projectId/milestones/:milestoneId/issues', params, options);
export const getGetMilestoneMR = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['getMilestoneMR'], '/api/v4/projects/:projectId/milestones/:milestoneId/merge_requests', params, options);
export const getListProjectIssueNotes = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listProjectIssueNotes'], '/api/v4/projects/:projectId/issues/:issueIid/notes', params, options);
export const getAddProjectIssueNote = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['addProjectIssueNote'], '/api/v4/projects/:projectId/issues/:issueIid/notes', params, options);
export const getUpdateProjectIssueNote = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['updateProjectIssueNote'], '/api/v4/projects/:projectId/issues/:issueIid/notes/:noteId', params, options);
export const getDeleteProjectIssueNote = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['deleteProjectIssueNote'], '/api/v4/projects/:projectId/issues/:issueIid/notes/:noteId', params, options);
export const getListGroupMilestones = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listGroupMilestones'], '/api/v4/groups/:groupId/milestones', params, options);
export const getListEvents = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listEvents'], '/api/v4/events', params, options);
export const getListProjectEvents = (params?: Record<string, any>, options?: UseQueryOptions) => useGetData(['listProjectEvents'], '/api/v4/projects/:projectId/events', params, options);

