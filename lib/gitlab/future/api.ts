import axios, { AxiosInstance } from 'axios';

import { useSession } from '@/lib/session/SessionProvider';


export const useGitLabApi = (): AxiosInstance => {
    const session = useSession();

    return axios.create({
        baseURL: session.baseURL,
        headers: {
            'Authorization': `Bearer ${session.accessToken}`,
        },
    });
};