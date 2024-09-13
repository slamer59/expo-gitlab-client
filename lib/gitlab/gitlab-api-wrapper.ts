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

      return await response.json();
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

  Users = {
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
    return this.request('/users', 'POST', data);
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
  useProjectUsers = this.createFetchHook(this.Users.all);

  // Operation hooks
  useCreateProjectIssue = this.createOperationHook(this.createProjectIssue);
  useCreateMergeRequest = this.createOperationHook(this.createMergeRequest);
  useCreateCommit = this.createOperationHook(this.createCommit);

  // Update
  useUpdateProjectIssue = this.createOperationHook(this.updateProjectIssue);

  // Delete 
  useDeleteProjectIssue = this.createOperationHook(this.deleteProjectIssue);

}

export default GitLabClient;