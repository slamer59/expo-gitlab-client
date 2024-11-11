import * as Clipboard from 'expo-clipboard';
import * as Notifications from 'expo-notifications';
import { router } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { MutableRefObject, SetStateAction } from "react";
import GitLabClient from "../gitlab/gitlab-api-wrapper";
import { FirebaseNotification, GitLabProject } from "./interfaces";

export const RGPD_ACCEPTED_KEY = '@notification_rgpd_accepted';
export const EXPO_TOKEN_KEY = 'expoPushToken';

// Re-export getExpoToken for use in other files
export const getExpoToken = async (): Promise<string | null> => {
    try {
        if (__DEV__) {
            // Return a fake token in debug mode
            return 'ExponentPushToken[fake_expo_push_token]';
        } else {
            // Return the real token in production mode
            return (await Notifications.getExpoPushTokenAsync()).data;
        }
    } catch (error) {
        console.error('Error getting Expo token:', error);
        return null;
    }
};


export async function getAllProjects(client: GitLabClient, page = 1, allProjects: GitLabProject[] = []): Promise<GitLabProject[]> {
    try {
        const perPage = 100; // Maximum allowed by GitLab API
        const projects = await client.Projects.all({ membership: true, owned: true, per_page: perPage, page: page });

        allProjects = allProjects.concat(projects);

        if (projects.length === perPage) {
            // There might be more pages
            return getAllProjects(client, page + 1, allProjects);
        } else {
            // No more pages
            return allProjects;
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        if (error.response?.status === 401) {
            router.push('/login');
        }
        return [];
    }
}

export const notificationLevels = [
    { value: 'global', label: 'Global', description: 'Use your global notification setting', icon: 'globe' },
    { value: 'participating', label: 'Participate', description: 'You will only receive notifications for issues you have participated in', icon: 'chatbubbles' },
    { value: 'disabled', label: 'Disabled', description: 'You will not receive any notifications', icon: 'notifications-off' },
] as const;



export async function updateNotificationLevel(
    db: any,
    expoToken: string,
    globalNotification: { notification_level: string; custom_events: any[] },
    notifications: FirebaseNotification[]
): Promise<void> {
    try {
        const currentDate = new Date().toISOString();
        await setDoc(doc(db, "userNotifications", expoToken), {
            changedDate: currentDate,
            global_notification: globalNotification,
            notifications
        }, { merge: true });
        console.log("Update mobile notification successfully");
    } catch (error) {
        console.error("Error mobile notification: ", error);
    }
}


export const tapForExpoToken = async (
    tapCount: number,
    setTapCount: (value: SetStateAction<number>) => void,
    lastTapTimeRef: MutableRefObject<number>
) => {
    const now = new Date().getTime();
    const DOUBLE_PRESS_DELAY = 300;

    if (now - lastTapTimeRef.current < DOUBLE_PRESS_DELAY) {
        setTapCount(prev => prev + 1);
        if (tapCount === 4) {
            try {
                const token = getExpoToken();
                await Clipboard.setStringAsync(token);
                // alert('Expo token copied to clipboard');
                return `Expo token copied to clipboard : \n ${token}`
            } catch (error) {
                console.error('Failed to copy Expo token:', error);
            }
            setTapCount(0);
        }
    } else {
        setTapCount(1);
    }
    lastTapTimeRef.current = now;
};
