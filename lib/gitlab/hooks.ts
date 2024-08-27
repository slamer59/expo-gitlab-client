import { useMutation, useQuery } from "@tanstack/react-query";

import type { paths } from "@/lib/gitlab/api";

import { getToken } from "@/lib/utils";
import createClient from "openapi-fetch";

const baseUrl = "https://gitlab.com";

const client = createClient<paths>({ baseUrl: baseUrl });

export const getData = <T>(
  keys: readonly unknown[],
  endpoint: string,
  params?: Record<string, any>
) => {
  console.log("getData", endpoint, params);
  return useQuery({
    queryKey: keys,
    queryFn: () => fetchData<T>(endpoint, "GET", params),
  });
};

export const postData = <T>(endpoint: string, body?: Record<string, any>) => {
  return useMutation({
    mutationFn: () => fetchData<T>(endpoint, "POST", undefined, body),
  });
};

export const putData = <T>(endpoint: string, body?: Record<string, any>) => {
  return useMutation({
    mutationFn: () => fetchData<T>(endpoint, "PUT", undefined, body),
  });
};

export const deleteData = <T>(
  endpoint: string,
  params?: Record<string, any>
) => {
  return useMutation({
    mutationFn: () => fetchData<T>(endpoint, "DELETE", params),
  });
};

export async function fetchData<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  params?: Record<string, any>,
  body?: Record<string, any>
): Promise<T> {
  try {
    console.log("fetchData", endpoint, method, params, body);
    let response;
    const headers = {
      accept: "application/json",
      "private-token": await getToken(), // process.env.EXPO_PUBLIC_GITLAB_TOKEN
    };

    switch (method) {
      case "GET":
        console.log("GET", endpoint, params, headers);
        response = await client.GET(endpoint, { params, headers });
        break;
      case "POST":
        response = await client.POST(endpoint, { params, headers, body });
        break;
      case "PUT":
        response = await client.PUT(endpoint, { params, headers, body });
        break;
      case "DELETE":
        response = await client.DELETE(endpoint, { params, headers });
        break;
    }

    // Check if response.data is defined
    if (!response.data) {
      throw new Error("Response data is undefined");

    }

    return response.data as T;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to be handled by react-query
  }
}

// '/api/v4/users'
// '/api/v4/user'
// '/api/v4/projects'
// '/api/v4/projects/$id'
// '/api/v4/projects/$projectId'
// '/api/v4/projects'
// '/api/v4/projects/$id'
// '/api/v4/projects/$id/star'
// '/api/v4/projects/$id/unstar'
// '/api/v4/projects/$id/starrers'
// '/api/v4/projects/$projectId/repository/branches'
// '/api/v4/projects/$id/repository/tags'
// '/api/v4/projects/$id/repository/tree'
// '/api/v4/projects/$projectId/repository/files/$encoded'
// '/api/v4/projects/$id/members'
// '/api/v4/projects/$id/members'
// '/api/v4/projects/$projectId/members/$memberId'
// '/api/v4/groups'
// '/api/v4/groups'
// '/api/v4/groups/$groupId/projects'
// '/api/v4/groups/$id/members'
// '/api/v4/groups/$id/members'
// '/api/v4/groups/$groupId/members/$memberId'
// '/api/v4/projects/$projectId/repository/commits'
// '/api/v4/projects/$projectId/repository/commits/$sha'
// '/api/v4/projects/$projectId/repository/commits/$sha/diff'
// '/api/v4/issues'
// '/api/v4/projects/$projectId/issues'
// '/api/v4/projects/$projectId/issues/$iid'
// '/api/v4/projects/$projectId/issues/$issueIid'
// '/api/v4/projects/$projectId/issues'
// '/api/v4/projects/$projectId/issues/$issueId'
// '/api/v4/merge_requests'
// '/api/v4/projects/$projectId/merge_requests'
// '/api/v4/projects/$projectId/issues/$issueIid/related_merge_requests'
// '/api/v4/projects/$projectId/merge_requests/$mrIid'
// '/api/v4/projects/$projectId/merge_requests'
// '/api/v4/projects/$projectId/merge_requests/$mrIid'
// '/api/v4/projects/$projectId/merge_requests/$id'
// '/api/v4/projects/$projectId/labels'
// '/api/v4/projects/$projectId/labels'
// '/api/v4/projects/$projectId/labels'
// '/api/v4/groups/$groupId/labels'
// '/api/v4/projects/$projectId/labels/$labelId'
// '/api/v4/projects/$projectId/labels/$labelId'
// '/api/v4/snippets'
// '/api/v4/projects/$projectId/snippets'
// '/api/v4/projects/$projectId/snippets/$snippetId'
// '/api/v4/projects/$projectId/snippets/$snippetId/raw'
// '/api/v4/projects/$projectId/snippets'
// '/api/v4/projects/$projectId/snippets/$snippetId'
// '/api/v4/projects/$projectId/snippets/$snippetId'
// '/api/v4/projects/$projectId/milestones'
// '/api/v4/projects/$projectId/milestones/$milestoneId'
// '/api/v4/projects/$projectId/milestones/$milestoneId'
// '/api/v4/projects/$projectId/milestones'
// '/api/v4/projects/$projectId/milestones/$milestoneId'
// '/api/v4/projects/$projectId/milestones/$milestoneId/issues'
// '/api/v4/projects/$projectId/milestones/$milestoneId/merge_requests'
// '/api/v4/projects/$projectId/issues/$issueIid/notes'
// '/api/v4/projects/$projectId/issues/$issueIid/notes'
// '/api/v4/projects/$projectId/issues/$issueIid/notes/$noteId'
// '/api/v4/projects/$projectId/issues/$issueIid/notes/$noteId'
// '/api/v4/groups/$groupId/milestones'
// '/api/v4/events'
// '/api/v4/projects/$projectId/events'
