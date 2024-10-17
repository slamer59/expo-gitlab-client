// GitLabClient.js
import { useEffect, useState } from 'react';

const BASE_URL = 'https://gitlab.com/api/v4';

class GitLabClient {
  constructor(options = {}) {
    this.token = options.token;
    this.host = options.host || BASE_URL;
  }

  async request(endpoint, method = 'GET', body = null, file = null) {
    const url = `${this.host}${endpoint}`;

    const headers = {
      'Authorization': `Bearer ${this.token}`,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (file) {
      // Handle file upload
      const formData = new FormData();
      formData.append('file', file);

      if (body) {
        // If there's additional data, append it to formData
        Object.keys(body).forEach(key => {
          formData.append(key, body[key]);
        });
      }
      options.body = formData;
      // Don't set Content-Type header, let the browser set it with the boundary
      delete headers['Content-Type'];
    } else if (body && (method === 'POST' || method === 'PUT')) {
      // Handle JSON body
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      // console.log("🚀 ~ GitLabClient ~ request ~ url, options:", url, options)
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
      console.error(`API request ${url} failed on:`, error);
      throw error;
    }
  }

  Issues = {
    all: async (params) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/issues?${queryString}`, 'GET', params);
    }
  }
  ProjectIssues = {
    all: async (projectId, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
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
    notes: async (projectId, issueIid) => {
      return this.request(`/projects/${projectId}/issues/${issueIid}/notes`);
    },
    addNote: async (projectId, issueIid, data) => {
      return this.request(`/projects/${projectId}/issues/${issueIid}/notes`, 'POST', data);
    },
    editNote: async (projectId, issueIid, noteId, data) => {
      return this.request(`/projects/${projectId}/issues/${issueIid}/notes/${noteId}`, 'PUT', data);
    },
    removeNote: async (projectId, issueIid, noteId) => {
      return this.request(`/projects/${projectId}/issues/${issueIid}/notes/${noteId}`, 'DELETE');
    },
    related_merge_requests: async (projectId, issueIid) => {
      return this.request(`/projects/${projectId}/issues/${issueIid}/related_merge_requests`);
    },
    links: async (projectId, issueIid) => {
      return this.request(`/projects/${projectId}/issues/${issueIid}/links`);
    },

  };
  Groups = {
    all: async (options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/groups?${queryString}`);
    },
  }
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
    fork: async (projectId, data) => {
      return this.request(`/projects/${projectId}/fork`, 'POST', data);
    },
    archive: async (projectId) => {
      return this.request(`/projects/${projectId}/archive`, 'POST');
    },
    unarchive: async (projectId) => {
      return this.request(`/projects/${projectId}/unarchive`, 'POST');
    },
    upload: async (projectId, file, data) => {
      return this.request(`/projects/${projectId}/uploads`, 'POST', data, file);
    },
    search: async (query) => {
      return this.request(`/projects/search/${query}`);
    },
  };

  Discussions = {
    show: async (projectId, issueIid, discussionId) => {
      return this.request(`/projects/${projectId}/issues/${issueIid}/discussions/1`);
    },
    create: async (projectId, issueIid, description) => {
      return this.request(`/projects/${projectId}/issues/${issueIid}/discussions?body=${description}`, 'POST');
    },
    add: async (projectId, issueIid, discussionId, query) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/projects/${projectId}/issues/${issueIid}/discussions/${discussionId}?${queryString}`, 'POST');
    },
  }

  MergeRequests = {
    all: async (params) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/merge_requests?${queryString}`, 'GET', params);
    }
  }

  ProjectMergeRequests = {
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
    remove: async (projectId, mergeRequestIid) => {
      return this.request(`/projects/${projectId}/merge_requests/${mergeRequestIid}`, 'DELETE');
    },
    comments: async (projectId, mergeRequestIid) => {
      return this.request(`/projects/${projectId}/merge_requests/${mergeRequestIid}/notes`);
    },
    commits: async (projectId, mergeRequestIid) => {
      return this.request(`/projects/${projectId}/merge_requests/${mergeRequestIid}/commits`);
    },
    changes: async (projectId, mergeRequestIid) => {
      return this.request(`/projects/${projectId}/merge_requests/${mergeRequestIid}/changes`);
    },
    notes: async (projectId, mergeRequestIid) => {
      return this.request(`/projects/${projectId}/merge_requests/${mergeRequestIid}/notes`);
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
    edit: async (projectId, branchName, data) => {
      return this.request(`/projects/${projectId}/repository/branches/${encodeURIComponent(branchName)}`, 'PUT', data);
    },
    create: async (projectId, options) => {
      return this.request(`/projects/${projectId}/repository/branches`, 'POST', options);
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
  //   const response = await axios.get(`${API_BASE_URL}/${type}s/${id}/notification_settings`, {
  //     headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
  // });
  Notifications = {
    all: async (projectId, options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/projects/${projectId}/notification_settings?${queryString}`);
    },
    show: async (projectId, userId) => {
      return this.request(`/projects/${projectId}/notification_settings/${userId}`);
    },
    update: async (projectId, userId, data) => {
      return this.request(`/projects/${projectId}/notification_settings/${userId}`, 'PUT', data);
    },
  }
  GlobalNotification = {
    all: async (options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/notification_settings?${queryString}`);
    },
    update: async (data) => {
      return this.request(`/notification_settings`, 'PUT', data);
    },
  }
  GroupNotifications = {
    all: async (groupId, options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/groups/${groupId}/notification_settings?${queryString}`);
    },
    update: async (groupId, data) => {
      return this.request(`/groups/${groupId}/notification_settings`, 'PUT', data);
    },
  }
  ProjectNotifications = {
    all: async (projectId, options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/projects/${projectId}/notification_settings?${queryString}`);
    },
    update: async (projectId, data) => {
      return this.request(`/projects/${projectId}/notification_settings`, 'PUT', data);
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
      return this.request(`/users/${userId}/contributed_projects`, 'GET', options);
    },
    groups: async (userId, options = {}) => {
      return this.request(`/users/${userId}/groups`, 'GET', options);
    },
    starred_projects: async (userId, options = {}) => {
      console.log("🚀 ~ GitLabClient ~ starred_projects: ~ userId:", userId)
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
    jobs: async (projectId, pipelineId) => {
      return this.request(`/projects/${projectId}/pipelines/${pipelineId}/jobs`);
    },
  }
  ProjectMembers = {
    all: async (projectId, options = {}) => {
      const queryString = new URLSearchParams(options).toString();
      return this.request(`/projects/${projectId}/members?${queryString}`);
    },
    show: async (projectId, userId) => {
      return this.request(`/projects/${projectId}/members/${userId}`);
    },
    add: async (projectId, userId, accessLevel, options = {}) => {
      const data = {
        user_id: userId,
        access_level: accessLevel,
        ...options,
      };
      return this.request(`/projects/${projectId}/members`, 'POST', data);
    },
    edit: async (projectId, userId, accessLevel, options = {}) => {
      const data = {
        access_level: accessLevel,
        ...options,
      };
      return this.request(`/projects/${projectId}/members/${userId}`, 'PUT', data);
    },
    remove: async (projectId, userId) => {
      return this.request(`/projects/${projectId}/members/${userId}`, 'DELETE');
    },
  }
  RepositoryFile = {
    // GET /projects/:id/repository/files/:file_path
    show: async (projectId, filePath, options = {}) => {
      return this.request(`/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`, 'GET', options);
    },
    // HEAD /projects/:id/repository/files/:file_path
    exists: async (projectId, filePath, options = {}) => {
      return this.request(`/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`, 'HEAD', options);
    },
    // GET /projects/:id/repository/files/:file_path/blame
    blame: async (projectId, filePath, options = {}) => {
      return this.request(`/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}/blame`, 'GET', options);
    },
    // GET /projects/:id/repository/files/:file_path/raw
    raw: async (projectId, filePath, options = {}) => {
      return this.request(`/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}/raw`, 'GET', options);
    },
    // POST /projects/:id/repository/files/:file_path
    create: async (projectId, filePath, data) => {
      return this.request(`/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`, 'POST', data);
    },
    // PUT /projects/:id/repository/files/:file_path
    update: async (projectId, filePath, data) => {
      return this.request(`/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`, 'PUT', data);
    },
    // DELETE /projects/:id/repository/files/:file_path
    remove: async (projectId, filePath) => {
      return this.request(`/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`, 'DELETE');
    },
  }

  Markdown = {
    render: async (body) => {
      const response = await this.request('/markdown', 'POST', body);
      return response.html;
    },
  }
  // Create methods
  createProjectIssue = async (projectId, title, description, options = {}) => {
    const data = { title, description, ...options };
    return this.ProjectIssues.create(projectId, data);
  };
  updateProjectBranches = async (projectId, branch, data) => {
    return this.Branches.edit(projectId, branch, data);
  };
  updateMergeRequest = async (projectId, mergeRequestIid, data) => {
    return this.ProjectMergeRequests.edit(projectId, mergeRequestIid, data);
  };
  updateUser = async (userId, data) => {
    return this.request(`/users/${userId}`, 'PUT', data);
  };
  updateRepositoryFile = async (projectId, filePath, data) => {
    return this.RepositoryFile.update(projectId, filePath, data);
  };
  updateProjectMember = async (projectId, userId, accessLevel, options = {}) => {
    return this.Members.update(projectId, userId, accessLevel, options);
  };


  // Delete Methods
  deleteProjectIssue = async (projectId, issueIid) => {
    return this.ProjectIssues.remove(projectId, issueIid);
  };
  deleteProjectMergeRequest = async (projectId, mergeRequestIid) => {
    return this.ProjectMergeRequests.remove(projectId, mergeRequestIid);
  };
  deleteMergeRequest = async (projectId, mergeRequestIid) => {
    return this.ProjectMergeRequests.remove(projectId, mergeRequestIid);
  };
  deleteProject = async (projectId) => {
    return this.request(`/projects/${projectId}`, 'DELETE');
  };
  deleteUser = async (userId) => {
    return this.request(`/users/${userId}`, 'DELETE');
  };
  deletePipeline = async (projectId, pipelineId) => {
    return this.request(`/projects/${projectId}/pipelines/${pipelineId}`, 'DELETE');
  };
  deleteProjectMember = async (projectId, userId) => {
    return this.Members.remove(projectId, userId);
  };
  deleteRepositoryFile = async (projectId, filePath) => {
    return this.RepositoryFile.remove(projectId, filePath);
  };

  cancelPipeline = async (projectId, pipelineId) => {
    return this.request(`/projects/${projectId}/pipelines/${pipelineId}/cancel`, 'POST');
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

  // // Fetch hooks
  // useProjectIssues = this.createFetchHook(this.ProjectIssues.all);
  // useProjectIssue = this.createFetchHook(this.ProjectIssues.show);
  // useProject = this.createFetchHook(this.Projects.show);
  // useMergeRequests = this.createFetchHook(this.ProjectMergeRequests.all);
  // useCommits = this.createFetchHook(this.Commits.all);
  // useBranches = this.createFetchHook(this.Branches.all);
  // useProjectUsers = this.createFetchHook(this.ProjectsUsers.all);
  // useProjectLabels = this.createFetchHook(this.Labels.all);
  // useProjectMilestones = this.createFetchHook(this.Milestones.all);
  // useProjectPipelines = this.createFetchHook(this.Pipelines.all);
  // useProjectIssueLinks = this.createFetchHook(this.IssueLinks.all);
  // useProjectMergeRequest = this.createFetchHook(this.ProjectMergeRequests.show);
  // useProjectBranches = this.createFetchHook(this.Branches.all);

  // // Users
  // getUsers = this.createFetchHook(this.Users.all);
  // getCurrentUser = this.createFetchHook(this.Users.current);
  // getUserProjects = this.createFetchHook(this.Users.projects);
  // getUserContributedProjects = this.createFetchHook(this.Users.contributed_projects)
  // getUserOwnedProjects = this.createFetchHook(this.Users.owned_projects)
  // getUserStarredProjects = this.createFetchHook(this.Users.starred_projects)
  // getUser = this.createFetchHook(this.Users.show)
  // getUserStatus = this.createFetchHook(this.Users.status)
  // getUserFollowing = this.createFetchHook(this.Users.following)
  // getUserFollowers = this.createFetchHook(this.Users.followers)
  // getRepositoryFile = this.createFetchHook(this.RepositoryFile.show)
  // getRepositoryFileRaw = this.createFetchHook(this.RepositoryFile.raw)


  // // Operation hooks
  // useCreateProjectIssue = this.createOperationHook(this.createProjectIssue);
  // useCreateMergeRequest = this.createOperationHook(this.createMergeRequest);
  // useCreateCommit = this.createOperationHook(this.createCommit);

  // // Update
  // useUpdateProjectIssue = this.createOperationHook(this.updateProjectIssue);
  // useUpdateProjectMergeRequest = this.createOperationHook(this.updateProjectMergeRequest);
  // useUpdateProjectBranches = this.createOperationHook(this.updateProjectBranches);
  // // Delete 
  // useDeleteProjectIssue = this.createOperationHook(this.deleteProjectIssue);
  // useDeleteMergeRequest = this.createOperationHook(this.deleteProjectMergeRequest);

}

export default GitLabClient;