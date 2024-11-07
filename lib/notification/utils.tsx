import { doc, setDoc } from "firebase/firestore";
import GitLabClient from "../gitlab/gitlab-api-wrapper";

export const RGPD_ACCEPTED_KEY = '@notification_rgpd_accepted';
export const EXPO_TOKEN_KEY = 'expoPushToken';

export interface GitLabProject {
    id: number;
    path_with_namespace: string;
}

export interface GitLabGroup {
    id: number;
    full_name: string;
}

export interface GitLabNotificationSettings {
    level: string;
    notification_email?: string;
}

export interface FirebaseNotification {
    id: number;
    name: string;
    notification_level: string;
    custom_events: any[];
}

export interface FirebaseDocument {
    changedDate: string;
    global_notification: {
        notification_level: string;
        custom_events: any[];
    };
    notifications: FirebaseNotification[];
}

export async function getAllProjects(client: GitLabClient, page = 1, allProjects: GitLabProject[] = []): Promise<GitLabProject[]> {
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
}

export const notificationLevels = [
    { value: 'global', label: 'Global', description: 'Use your global notification setting', icon: 'globe' },
    { value: 'participating', label: 'Participate', description: 'You will only receive notifications for issues you have participated in', icon: 'chatbubbles' },
    { value: 'disabled', label: 'Disabled', description: 'You will not receive any notifications', icon: 'notifications-off' },
] as const;

type NotificationLevel = typeof notificationLevels[number];

export interface NotificationItem {
    id: number;
    name: string;
    level: NotificationLevel;
}

export interface NotificationStore {
    groups: NotificationItem[];
    projects: NotificationItem[];
    global: {
        level: NotificationLevel;
        notification_email: string;
    };
    modalVisible: boolean;
    selectedItemType: string;
    selectedItemIndex: number;
    isLoading: boolean;
    isInitialized: boolean;
    expoPushToken: string | null;
    permissionStatus: string | null;
    notificationPreferences: any;
    consentToRGPDGiven: boolean;
    setGroups: (groups: NotificationItem[]) => void;
    setProjects: (projects: NotificationItem[]) => void;
    setGlobal: (global: { level: NotificationLevel; notification_email: string }) => void;
    setModalVisible: (visible: boolean) => void;
    setSelectedItemType: (type: string) => void;
    setSelectedItemIndex: (index: number) => void;
    setIsLoading: (loading: boolean) => void;
    setIsInitialized: (initialized: boolean) => void;
    setExpoPushToken: (token: string | null) => void;
    setPermissionStatus: (status: string | null) => void;
    setNotificationPreferences: (prefs: any) => void;
    fetchFirebaseData: (expoToken: string) => Promise<FirebaseDocument | null>;
    syncNotificationSettings: (client: GitLabClient) => Promise<void>;
    selectNotificationLevel: (level: NotificationLevel) => Promise<void>;
    openModal: (type: string, index: number) => void;
    fetchGitLabEmailSettings: (client: GitLabClient) => Promise<void>;
    fetchFirebaseNotifications: (expoToken: string) => Promise<void>;
    syncGitLabWithFirebase: (client: GitLabClient, expoToken: string) => Promise<void>;
    initializeNotifications: () => Promise<void>;
    checkNotificationRegistration: () => Promise<string | null>;
    registerForPushNotifications: () => Promise<string | null>;
    setRGPDConsent: (accepted: boolean) => Promise<void>;
}

export async function updateNotificationLevel(
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
        });
        console.log("Update mobile notification successfully");
    } catch (error) {
        console.error("Error mobile notification: ", error);
    }
}
