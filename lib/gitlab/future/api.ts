import { useSession } from '@/lib/session/SessionProvider';
import axios, { AxiosInstance } from 'axios';


export const useGitLabApi = (): AxiosInstance => {
    const session = useSession();

    return axios.create({
        baseURL: session.baseURL,
        headers: {
            'Authorization': `Bearer ${session.accessToken}`,
        },
    });
};