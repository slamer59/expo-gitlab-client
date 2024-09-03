import { useStorageState } from "@/lib/session/useStorageState";
import * as SecureStore from 'expo-secure-store';
import { createContext, type PropsWithChildren, useContext, useEffect } from 'react';

interface GitLabSession {
    url: string;
    token: string;
}

interface AuthContextType {
    signIn: (url: string, token: string) => Promise<void>;
    signOut: () => Promise<void>;
    session: GitLabSession | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    signIn: async () => { },
    signOut: async () => { },
    session: null,
    isLoading: true,
});

export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value;
}

async function validateGitLabCredentials(url: string, token: string): Promise<boolean> {
    try {
        const response = await fetch(`${url}/api/v4/user`, {
            headers: { 'PRIVATE-TOKEN': token }
        });
        return response.ok;
    } catch (error) {
        console.error('Error validating credentials:', error);
        return false;
    }
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState<GitLabSession | null>('session');

    useEffect(() => {
        // Check for existing credentials on mount
        checkExistingCredentials();
    }, []);

    async function checkExistingCredentials() {
        const url = await SecureStore.getItemAsync('gitlabUrl');
        const token = await SecureStore.getItemAsync('gitlabToken');
        if (url && token) {
            const isValid = await validateGitLabCredentials(url, token);
            if (isValid) {
                setSession(JSON.stringify({ url, token }));
            } else {
                // Clear invalid credentials
                await SecureStore.deleteItemAsync('gitlabUrl');
                await SecureStore.deleteItemAsync('gitlabToken');
                setSession(null);
            }
        } else {
            setSession(null);
        }
    }

    const signIn = async (url: string, token: string) => {
        const isValid = await validateGitLabCredentials(url, token);
        if (isValid) {
            await SecureStore.setItemAsync('gitlabUrl', url);
            await SecureStore.setItemAsync('gitlabToken', token);
            setSession(JSON.stringify({ url, token }));
        } else {
            throw new Error('Invalid credentials');
        }
    };

    const signOut = async () => {
        await SecureStore.deleteItemAsync('gitlabUrl');
        await SecureStore.deleteItemAsync('gitlabToken');
        setSession(null);
    };

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                session: session ? JSON.parse(session) : null,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}