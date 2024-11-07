import GitLabClient from "../gitlab/gitlab-api-wrapper";
import { notificationLevels } from "./utils";

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



type NotificationLevel = typeof notificationLevels[number];

interface NotificationItem {
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