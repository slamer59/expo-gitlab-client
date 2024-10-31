import * as SecureStore from 'expo-secure-store';

export const getAvatarUrl = async (avatarPath: string | null | undefined): Promise<string> => {
    if (!avatarPath) {
        return '';
    }

    // If the avatar URL is already absolute, return it as is
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath;
    }

    // Get the GitLab base URL from secure storage
    const baseUrl = await SecureStore.getItemAsync('gitlabUrl');

    // Remove leading slash if present in both baseUrl and avatarPath
    const cleanBaseUrl = baseUrl?.replace(/\/$/, '') || '';
    const cleanAvatarPath = avatarPath.replace(/^\//, '');

    return `${cleanBaseUrl}/${cleanAvatarPath}`;
};
