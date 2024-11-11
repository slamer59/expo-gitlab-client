import GitLabClient from "../gitlab/gitlab-api-wrapper";
import { notificationLevels } from "./utils";

// Defining the data types
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

export type NotificationLevel = typeof notificationLevels[number];

interface NotificationItem {
    id: number;
    name: string;
    level: NotificationLevel;
}

// Defining the NotificationStore interface
export interface NotificationStore {
    // State properties
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
    consentToRGPDGiven: boolean;
    session: any;

    // State setters
    setGroups: (groups: NotificationItem[]) => void;
    setProjects: (projects: NotificationItem[]) => void;
    setGlobal: (global: { level: NotificationLevel; notification_email: string }) => void;
    setModalVisible: (visible: boolean) => void;
    setSelectedItemType: (type: string) => void;
    setSelectedItemIndex: (index: number) => void;
    setIsInitialized: (initialized: boolean) => void;
    setExpoPushToken: () => void;
    setPermissionStatus: (status: string | null) => void;
    setGdprConsent: (consent: boolean) => void;

    // Webhook and Firebase actions
    manageGdprConsent: (session: any) => Promise<void>;
    manageWebhooks: (session: any, client: GitLabClient) => Promise<void>;
    addWebhookToGitLab: (session: any) => Promise<void>;
    removeWebhookFromGitLab: (session: any) => Promise<void>;
    requestPermissions: () => Promise<void>;
    manageConsentFirebase: () => Promise<void>;
    setPersonalProjects: (projects: GitLabProject[] | undefined) => void;
    syncNotificationSettings: (client: GitLabClient) => Promise<void>;
    fetchFirebaseData: (expoToken: string) => Promise<FirebaseDocument | null>;
    selectNotificationLevel: (level: NotificationLevel) => Promise<void>;
    openModal: (type: string, index: number) => void;
    fetchGitLabEmailSettings: (client: GitLabClient) => Promise<void>;
    fetchFirebaseNotifications: (expoToken: string) => Promise<void>;
    syncGitLabWithFirebase: (client: GitLabClient, expoToken: string) => Promise<void>;

}

// This way, the NotificationStore interface is more organized and easier to read.