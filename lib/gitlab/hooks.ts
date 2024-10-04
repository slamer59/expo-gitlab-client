import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useMemo } from "react";
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

  const url = useMemo(() => generateUrlFromParams(session, endpoint, params), [session, endpoint, params]);

  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      if (!session?.token) {
        throw new Error("No authentication token available");
      }

      try {
        const response = await fetch(url, {
          headers: {
            "PRIVATE-TOKEN": session.token,
            "Accept": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to fetch data: ${response.status} ${response.statusText}`);
          console.error(`Response body:`, errorText);
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return response.json();
      } catch (error) {
        console.error(`An error occurred:`, error);
        throw error;
      }
    },
    cacheTime: 1000 * 60, // cache data for 1 minute
    staleTime: 1000 * 60, // consider data stale after 1 minute
    enabled: !!session?.token, // Only run the query if we have a token
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
  } catch (error) {
    if (error instanceof TypeError) {

      url = `${getbaseUrl(session?.url)}${endpoint}`;
      if (params?.path) {
        for (const key in params.path) {
          const encodedValue = encodeURIComponent(params.path[key]);
          url = url.replace(`{${key}}`, encodedValue);
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
