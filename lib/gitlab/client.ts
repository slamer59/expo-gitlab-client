import { useMutation, useQuery } from '@tanstack/react-query';

import type { paths } from "@/lib/gitlab/api";

import { getToken } from '@/lib/utils';
import createClient from "openapi-fetch";

const baseUrl = 'https://gitlab.com';

const client = createClient<paths>({ baseUrl: baseUrl });

export const getData = <T>(
    keys: readonly unknown[],
    endpoint: string,
    params?: Record<string, any>
) => {
    return useQuery({
        queryKey: keys,
        queryFn: () => fetchData<T>(endpoint, 'GET', params),
    });
};

export const postData = <T>(
    endpoint: string,
    body?: Record<string, any>
) => {
    return useMutation({
        mutationFn: () => fetchData<T>(endpoint, 'POST', undefined, body),
    });
};

export const putData = <T>(
    endpoint: string,
    body?: Record<string, any>
) => {
    return useMutation({
        mutationFn: () => fetchData<T>(endpoint, 'PUT', undefined, body),
    });
};

export const deleteData = <T>(
    endpoint: string,
    params?: Record<string, any>
) => {
    return useMutation({
        mutationFn: () => fetchData<T>(endpoint, 'DELETE', params),
    });
};

export async function fetchData<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    params?: Record<string, any>,
    body?: Record<string, any>
): Promise<T | undefined> {
    try {
        let response;

        const headers = {
            accept: 'application/json',
            'private-token': await getToken() // process.env.EXPO_PUBLIC_GITLAB_TOKEN
        }
        switch (method) {
            case 'GET':
                response = await client.GET(endpoint, { params, headers });
                break;
            case 'POST':
                response = await client.POST(endpoint, { params, headers, body });
                break;
            case 'PUT':
                response = await client.PUT(endpoint, { params, headers, body });
                break;
            case 'DELETE':
                response = await client.DELETE(endpoint, { params, headers });
                break;
        }
        return response.data as T;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}