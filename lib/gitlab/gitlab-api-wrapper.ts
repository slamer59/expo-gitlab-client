// GitLabClient.js
import { useEffect, useState } from 'react';

const BASE_URL = 'https://gitlab.com/api/v4';

class GitLabClient {
  constructor(options = {}) {
    this.token = options.token;
    this.host = options.host || BASE_URL;
  }

  async request(endpoint, method = 'GET', body = null) {
    const url = `${this.host}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      //'PRIVATE-TOKEN': `${this.token}`,
      'Content-Type': 'application/json',
    };

    const options = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (response.status === 204) {
        // For 204 No Content responses, return a success object
        return { success: true, message: 'Operation completed successfully' };
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
      } else {
        // For other non-JSON responses
        return await response.text();
      }
    } catch (error) {

      console.error('API request failed:', error);
      throw error;
    }
  }

  Issues = {
    all: async (projectId, options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/projects/${projectId}/issues?${queryString}`);
    },
    create: async (projectId, data) => {
      return this.request(`/projects/${projectId}/issues`, 'POST', data);
    },
    edit: async (projectId, issueIid, data) => {
      console.log('Editing issue:', projectId, issueIid, data);
      return this.request(`/projects/${projectId}/issues/${issueIid}`, 'PUT', data);
    },
    remove: async (projectId, issueIid) => {
      return this.request(`/projects/${projectId}/issues/${issueIid}`, 'DELETE');
    },
    show: async (projectId, issueIid) => {
      return this.request(`/projects/${projectId}/issues/${issueIid}`);
    },
  };

  Projects = {
    all: async (options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/projects?${queryString}`);
    },
    show: async (projectId) => {
      return this.request(`/projects/${projectId}`);
    },
    create: async (data) => {
      return this.request('/projects', 'POST', data);
    },
    edit: async (projectId, data) => {
      return this.request(`/projects/${projectId}`, 'PUT', data);
    },
    remove: async (projectId) => {
      return this.request(`/projects/${projectId}`, 'DELETE');
    },
  };

  MergeRequests = {
    all: async (projectId, options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/projects/${projectId}/merge_requests?${queryString}`);
    },
    create: async (projectId, data) => {
      return this.request(`/projects/${projectId}/merge_requests`, 'POST', data);
    },
    edit: async (projectId, mergeRequestIid, data) => {
      return this.request(`/projects/${projectId}/merge_requests/${mergeRequestIid}`, 'PUT', data);
    },
    show: async (projectId, mergeRequestIid) => {
      return this.request(`/projects/${projectId}/merge_requests/${mergeRequestIid}`);
    },
    approve: async (projectId, mergeRequestIid) => {
      return this.request(`/projects/${projectId}/merge_requests/${mergeRequestIid}/approve`, 'POST');
    },
  };

  Commits = {
    all: async (projectId, options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/projects/${projectId}/repository/commits?${queryString}`);
    },
    show: async (projectId, sha) => {
      return this.request(`/projects/${projectId}/repository/commits/${sha}`);
    },
    create: async (projectId, data) => {
      return this.request(`/projects/${projectId}/repository/commits`, 'POST', data);
    },
  };

  Branches = {
    all: async (projectId, options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/projects/${projectId}/repository/branches?${queryString}`);
    },
    show: async (projectId, branchName) => {
      return this.request(`/projects/${projectId}/repository/branches/${encodeURIComponent(branchName)}`);
    },
    create: async (projectId, data) => {
      return this.request(`/projects/${projectId}/repository/branches`, 'POST', data);
    },
    remove: async (projectId, branchName) => {
      return this.request(`/projects/${projectId}/repository/branches/${encodeURIComponent(branchName)}`, 'DELETE');
    },
  };

  ProjectsUsers = {
    all: async (projectId, options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/projects/${projectId}/users?${queryString}`);
    },
    show: async (projectId, userId) => {
      const user = await this.request(`/projects/${projectId}/users/${userId}`);
      return user;
    },
    add: async (projectId, userId, accessLevel) => {
      const data = { user_id: userId, access_level: accessLevel };
      return this.request(`/projects/${projectId}/members`, 'POST', data);
    },
    remove: async (projectId, userId) => {
      return this.request(`/projects/${projectId}/members/${userId}`, 'DELETE');
    },
  }

  Users = {
    current: async () => {
      return this.request('/user');
    },
    all: async (options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/users?${queryString}`);
    },
    projects: async (userId, options = {}) => {
      return this.request(`/users/${userId}/projects`, 'GET', options);
    },
    contributed_projects: async (userId, options = {}) => {
      return this.request(`/users/${userId}/projects/contributed`, 'GET', options);
    },
    owned_projects: async (userId, options = {}) => {
      return this.request(`/users/${userId}/projects/owned`, 'GET', options);
    },
    starred_projects: async (userId, options = {}) => {
      return this.request(`/users/${userId}/starred_projects`, 'GET', options);
    },
    show: async (userId, options = {}) => {
      return this.request(`/users/${userId}`, 'GET', options);
    },
    create: async (data, options = {}) => {
      return this.request('/users', 'POST', data, options);
    },
    edit: async (userId, data, options = {}) => {
      return this.request(`/users/${userId}`, 'PUT', data, options);
    },
    remove: async (userId, options = {}) => {
      return this.request(`/users/${userId}`, 'DELETE', options);
    },
    status: async (userId, options = {}) => {
      return this.request(`/users/${userId}/status`, 'GET', options);
    },
    follow: async (userId, options = {}) => {
      return this.request(`/users/${userId}/follow`, 'POST', options);
    },
    unfollow: async (userId, options = {}) => {
      return this.request(`/users/${userId}/unfollow`, 'POST', options);
    },
    following: async (userId, options = {}) => {
      return this.request(`/users/${userId}/following`, 'GET', options);
    },
    followers: async (userId, options = {}) => {
      return this.request(`/users/${userId}/followers`, 'GET', options);
    },
  }

  Labels = {
    all: async (projectId, options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/projects/${projectId}/labels?${queryString}`);
    },
    create: async (projectId, data) => {
      return this.request(`/projects/${projectId}/labels`, 'POST', data);
    },
    edit: async (projectId, labelId, data) => {
      return this.request(`/projects/${projectId}/labels/${labelId}`, 'PUT', data);
    },
    remove: async (projectId, labelId) => {
      return this.request(`/projects/${projectId}/labels/${labelId}`, 'DELETE');
    },
  }

  Milestones = {
    all: async (projectId, options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/projects/${projectId}/milestones?${queryString}`);
    },
    show: async (projectId, milestoneId) => {
      return this.request(`/projects/${projectId}/milestones/${milestoneId}`);
    },
    create: async (projectId, data) => {
      return this.request(`/projects/${projectId}/milestones`, 'POST', data);
    },
    edit: async (projectId, milestoneId, data) => {
      return this.request(`/projects/${projectId}/milestones/${milestoneId}`, 'PUT', data);
    },
    remove: async (projectId, milestoneId) => {
      return this.request(`/projects/${projectId}/milestones/${milestoneId}`, 'DELETE');
    },

  }
  IssueLinks = {
    all: async (projectId, issueIid, options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/projects/${projectId}/issues/${issueIid}/links?${queryString}`);
    },
    show: async (projectId, issueIid, linkId) => {
      return this.request(`/projects/${projectId}/issues/${issueIid}/links/${linkId}`);
    },
    create: async (projectId, issueIid, data) => {
      return this.request(`/projects/${projectId}/issues/${issueIid}/links`, 'POST', data);
    },
    edit: async (projectId, issueIid, linkId, data) => {
      return this.request(`/projects/${projectId}/issues/${issueIid}/links/${linkId}`, 'PUT', data);
    },
    remove: async (projectId, issueIid, linkId) => {
      return this.request(`/projects/${projectId}/issues/${issueIid}/links/${linkId}`, 'DELETE');
    },
  }

  Pipelines = {
    all: async (projectId, options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/projects/${projectId}/pipelines?${queryString}`);
    },
    show: async (projectId, pipelineId) => {
      return this.request(`/projects/${projectId}/pipelines/${pipelineId}`);
    },
    create: async (projectId, data) => {
      return this.request(`/projects/${projectId}/pipeline`, 'POST', data);
    },
    retry: async (projectId, pipelineId) => {
      return this.request(`/projects/${projectId}/pipelines/${pipelineId}/retry`, 'POST');
    },
    cancel: async (projectId, pipelineId) => {
      return this.request(`/projects/${projectId}/pipelines/${pipelineId}/cancel`, 'POST');
    },
    remove: async (projectId, pipelineId) => {
      return this.request(`/projects/${projectId}/pipelines/${pipelineId}`, 'DELETE');
    },


  }

  // Create methods
  createProjectIssue = async (projectId, title, description, options = {}) => {
    const data = { title, description, ...options };
    return this.Issues.create(projectId, data);
  };

  createMergeRequest = async (projectId, sourceBranch, targetBranch, title, options = {}) => {
    const data = { source_branch: sourceBranch, target_branch: targetBranch, title, ...options };
    return this.MergeRequests.create(projectId, data);
  };

  createCommit = async (projectId, branch, commitMessage, actions, options = {}) => {
    const data = { branch, commit_message: commitMessage, actions, ...options };
    return this.Commits.create(projectId, data);
  };

  createUser = async (username, email, password, name, options = {}) => {
    const data = { username, email, password, name, ...options };
    return this.Users.create(data);
  }


  // Update Methods
  updateProjectIssue = async (projectId, issueIid, data, options = {}) => {
    return this.Issues.edit(projectId, issueIid, { ...data, ...options });
  };
  updateMergeRequest = async (projectId, mergeRequestIid, title, description, options = {}) => {
    const data = { title, description, ...options };
    return this.MergeRequests.edit(projectId, mergeRequestIid, data);
  };

  // Delete Methods
  deleteProjectIssue = async (projectId, issueIid) => {
    console.log('Deleting issue:', projectId, issueIid);
    return this.Issues.remove(projectId, issueIid);
  };
  deleteMergeRequest = async (projectId, mergeRequestIid) => {
    return this.MergeRequests.remove(projectId, mergeRequestIid);
  };

  // Generic operation hook creator
  createOperationHook = (operationFunc) => (...args) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = async (data: { data: any }) => {
      try {
        setLoading(true);
        const result = await operationFunc(...args, data);
        setData(result);
        setError(null);
        return result;
      } catch (err) {
        console.error("Operation failed:", err);
        setError("Operation failed");
        throw err;
      } finally {
        setLoading(false);
      }
    };

    return { execute, data, loading, error };
  };


  // Data fetching hook creator (same as before)
  createFetchHook = (apiMethod, ...defaultArgs) => {
    return (...args) => {
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            const result = await apiMethod(...(args.length ? args : defaultArgs));
            setData(result);
            setError(null);
          } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data");
          } finally {
            setLoading(false);
          }
        };

        fetchData();
      }, [JSON.stringify(args)]);

      return { data, loading, error };
    };
  };

  // Fetch hooks
  useProjectIssues = this.createFetchHook(this.Issues.all);
  useProjectIssue = this.createFetchHook(this.Issues.show);
  useProject = this.createFetchHook(this.Projects.show);
  useMergeRequests = this.createFetchHook(this.MergeRequests.all);
  useCommits = this.createFetchHook(this.Commits.all);
  useBranches = this.createFetchHook(this.Branches.all);
  useProjectUsers = this.createFetchHook(this.ProjectsUsers.all);
  useProjectLabels = this.createFetchHook(this.Labels.all);
  useProjectMilestones = this.createFetchHook(this.Milestones.all);
  useProjectPipelines = this.createFetchHook(this.Pipelines.all);
  useProjectIssueLinks = this.createFetchHook(this.IssueLinks.all);

  // Users
  getUsers = this.createFetchHook(this.Users.all);
  getCurrentUser = this.createFetchHook(this.Users.current);
  getUserProjects = this.createFetchHook(this.Users.projects);
  getUserContributedProjects = this.createFetchHook(this.Users.contributed_projects)
  getUserOwnedProjects = this.createFetchHook(this.Users.owned_projects)
  getUserStarredProjects = this.createFetchHook(this.Users.starred_projects)
  getUser = this.createFetchHook(this.Users.show)
  getUserStatus = this.createFetchHook(this.Users.status)
  getUserFollowing = this.createFetchHook(this.Users.following)
  getUserFollowers = this.createFetchHook(this.Users.followers)

  // Operation hooks
  useCreateProjectIssue = this.createOperationHook(this.createProjectIssue);
  useCreateMergeRequest = this.createOperationHook(this.createMergeRequest);
  useCreateCommit = this.createOperationHook(this.createCommit);

  // Update
  useUpdateProjectIssue = this.createOperationHook(this.updateProjectIssue);
  useUpdateMergeRequest = this.createOperationHook(this.updateMergeRequest);

  // Delete 
  useDeleteProjectIssue = this.createOperationHook(this.deleteProjectIssue);
  useDeleteMergeRequest = this.createOperationHook(this.deleteMergeRequest);

}

export default GitLabClient;