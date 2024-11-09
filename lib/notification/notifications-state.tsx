import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { getApps, initializeApp } from 'firebase/app';
import 'firebase/firestore';
import { deleteDoc, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { firebaseConfig } from 'lib/firebase/helpers';
import GitLabClient from 'lib/gitlab/gitlab-api-wrapper';
import { create } from 'zustand';
import { FirebaseDocument, GitLabNotificationSettings, GitLabProject } from './interfaces';
import { getAllProjects, getExpoToken, notificationLevels, updateNotificationLevel } from './utils';


import 'firebase/firestore';

import { removeWebhooks, updateOrCreateWebhooks } from '../gitlab/webhooks';

// Initialize Firebase
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const db = getFirestore(app);



interface NotificationState {
    groups: any[];
    projects: any[];
    global: { level: string; notification_email: string };
    modalVisible: boolean;
    selectedItemType: string;
    selectedItemIndex: number;
    isLoading: boolean;
    isInitialized: boolean;
    expoPushToken: string | null;
    permissionStatus: any;
    notificationPreferences: any;
    consentToRGPDGiven: boolean;
    session: any;

    // State setters
    setGroups: (groups: any[]) => void;
    setProjects: (projects: any[]) => void;
    setGlobal: (global: { level: string; notification_email: string }) => void;
    setModalVisible: (visible: boolean) => void;
    setSelectedItemType: (type: string) => void;
    setSelectedItemIndex: (index: number) => void;
    setIsLoading: (loading: boolean) => void;
    setIsInitialized: (initialized: boolean) => void;
    setExpoPushToken: (token: string | null) => void;
    setPermissionStatus: (status: any) => void;
    setNotificationPreferences: (prefs: any) => void;

    // Webhook and Firebase actions
    manageWebhooks: (session: any, client: GitLabClient, projects: any[]) => Promise<void>;
    addWebhookToGitLab: (session: any, projects: any[]) => Promise<void>;
    removeWebhookFromGitLab: (session: any) => Promise<void>;
    addDataToFirebase: (session: any) => Promise<void>;
    removeDataFromFirebase: () => Promise<void>;
}
const prepareProjects = (projects: GitLabProject[] | undefined): { id: number; name: string }[] => {
    if (!projects || !Array.isArray(projects)) {
        console.error("Projects are undefined or not an array");
        return [];
    }

    return projects
        .filter(project => project.id && typeof project.id === 'number') // Only include projects with valid IDs
        .map(project => ({
            id: project.id,
            name: project.path_with_namespace || String(project.id) // Fallback to ID if name not available
        }));
};

const fetchNotificationSettings = async (client: GitLabClient, type: string, id: number | null, name: string): Promise<any> => {
    try {
        let settings: GitLabNotificationSettings;
        if (type === 'global') {
            settings = await client.GlobalNotification.all();
        } else if (type === 'group') {
            settings = await client.GroupNotifications.all(id!);
        } else if (type === 'project') {
            settings = await client.ProjectNotifications.all(id!);
        } else {
            settings = { level: 'global' };
        }
        return {
            id,
            name,
            level: notificationLevels.find(level => level.value === settings.level) || notificationLevels[0],
            notification_email: settings.notification_email || ''
        };
    } catch (error) {
        console.error(`Error fetching ${type} notification settings:`, error);
        return {
            id,
            name,
            level: notificationLevels[0],
            notification_email: ''
        };
    }
};
export const useNotificationStore = create<NotificationState>((set, get) => ({
    groups: [],
    projects: [],
    global: { level: 'default', notification_email: '' },
    modalVisible: false,
    selectedItemType: '',
    selectedItemIndex: -1,
    isLoading: true,
    isInitialized: false,
    expoPushToken: null,
    permissionStatus: null,
    notificationPreferences: null,
    consentToRGPDGiven: false,
    session: null,
    client: null,

    // State setters
    setGroups: (groups) => set({ groups }),
    setProjects: (projects) => set({ projects }),
    setGlobal: (global) => set({ global }),
    setModalVisible: (visible) => set({ modalVisible: visible }),
    setSelectedItemType: (type) => set({ selectedItemType: type }),
    setSelectedItemIndex: (index) => set({ selectedItemIndex: index }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setIsInitialized: (initialized) => set({ isInitialized: initialized }),
    setPermissionStatus: (status) => set({ permissionStatus: status }),
    setNotificationPreferences: (prefs) => set({ notificationPreferences: prefs }),
    setPersonalProjects: (projects) => set({ projects: prepareProjects(projects) }),
    setSessionClient: (session, client) => set({ session: session, client: client }),
    // GDPR Consent and Firebase Sync
    setGdprConsent: (accepted) => set({ consentToRGPDGiven: accepted }),
    requestPermissions: async () => {
        if (Device.isDevice) {
            const { status } = await Notifications.requestPermissionsAsync();
            set({ permissionStatus: status });
        } else {
            alert('Must use physical device for Push Notifications');
        }
    },
    manageConsentFirebase: async () => {
        const { expoPushToken: token, consentToRGPDGiven } = get();

        if (consentToRGPDGiven) {
            await setDoc(doc(db, 'userNotifications', token), {
                changedDate: new Date().toISOString(),
                consentDate: new Date().toISOString(),
            }, { merge: true });
        } else {
            await deleteDoc(doc(db, 'userNotifications', token));
            console.log('Removed from Firebase');
        }
    },
    setExpoPushToken: async () => {
        try {
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            set({ expoPushToken: token });

        } catch (error) {
            console.error('Error getting Expo push token:', error);
            // Handle error, e.g., show an alert to the user
            throw error;
        }
    },
    manageGdprConsent: async (accepted) => {
        set({ consentToRGPDGiven: accepted });

        try {
            await get().requestPermissions();
            await get().setExpoPushToken();
            await get().manageConsentFirebase();
        } catch (error) {
            console.error('Error syncing Firebase:', error);
        }
    },
    // Webhook and Firebase actions
    manageWebhooks: async (session, client, projects) => {
        const { consentToRGPDGiven: consent } = get();

        if (consent) {
            get().setPersonalProjects(projects);
            try {
                console.log('Adding webhook to GitLab and syncing Firebase data...');

                await Promise.all([
                    get().addWebhookToGitLab(session),
                    get().syncNotificationSettings(client),
                ]);
                console.log('Webhook added and Firebase data synced');
            } catch (error) {
                console.error('Error adding webhook and syncing Firebase:', error);
            }
        } else {
            try {
                console.log('Removing webhook from GitLab and Firebase data...');
                await Promise.all([
                    get().removeWebhookFromGitLab(session),
                    get().removeDataFromFirebase(),
                ]);
                console.log('Webhook removed and Firebase data removed');
            } catch (error) {
                console.error('Error removing webhook and Firebase data:', error);
            }
        }
    },

    // Helper functions for Webhooks and Firebase
    addWebhookToGitLab: async (session) => {
        const { projects, expoPushToken: token } = get();
        // console.log('Adding webhook to GitLab for session:', session, 'and groups:', groups);

        if (!session?.url || !session?.token) {
            console.error("Invalid session data");
            return;
        }

        try {
            await updateOrCreateWebhooks(
                { url: session.url, token: session.token },
                projects,
                undefined
            );
            console.log("Webhooks updated successfully");
        } catch (error) {
            console.error("Error updating webhooks:", error);
        }


    },
    removeWebhookFromGitLab: async (session) => {
        console.log('Removing webhook from GitLab for session');
        const { projects } = get();
        if (session?.url && session?.token) {
            try {
                await removeWebhooks(session, projects);
                console.log('Webhooks removed successfully');
            } catch (error) {
                console.error('Error removing webhooks:', error);
            }
        }
    },

    addDataToFirebase: async (session) => {
        console.log('Adding data to Firebase for session:', session);
        // Implement Firebase data addition logic here
    },

    removeDataFromFirebase: async () => {
        console.log('Removing data from Firebase');
        set({ isInitialized: false });
        // Implement Firebase data removal logic here
    },

    fetchFirebaseData: async (expoToken: string) => {
        try {
            const docRef = doc(db, "userNotifications", expoToken);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data() as FirebaseDocument;
            }
            return null;
        } catch (error) {
            console.error("Error fetching Firebase data:", error);
            return null;
        }
    },

    syncNotificationSettings: async (client: GitLabClient) => {
        set({ isLoading: true });
        console.log('Syncing notification settings...');
        try {
            const { isInitialized } = get();
            console.log("🚀 ~ syncNotificationSettings: ~ isInitialized:", isInitialized)
            const expoToken = await getExpoToken();

            if (!expoToken) {
                throw new Error('Failed to retrieve Expo token');
            }

            if (!isInitialized) {
                console.log('Fetching Firebase data...');
                const groups = await client.Groups.all();
                const projects = await getAllProjects(client);

                const [groupsWithSettings, projectsWithSettings, globalSettings] = await Promise.all([
                    Promise.all(groups.map(group => fetchNotificationSettings(client, 'group', group.id, group.full_name))),
                    Promise.all(projects.map(project => fetchNotificationSettings(client, 'project', project.id, project.path_with_namespace))),
                    fetchNotificationSettings(client, 'global', null, 'Global')
                ]);

                const global = {
                    level: notificationLevels.find(level => level.value === globalSettings.level) || notificationLevels[0],
                    notification_email: globalSettings.notification_email || ''
                };

                const firebaseData = await get().fetchFirebaseData(expoToken);
                console.log("🚀 ~ syncNotificationSettings: ~ projectsWithSettings:", projectsWithSettings)
                console.log("🚀 ~ syncNotificationSettings: ~ !firebaseData || !firebaseData.notifications:", !firebaseData || !firebaseData.notifications)

                if (!firebaseData || !firebaseData.notifications) {
                    // If no Firebase data exists or no notifications array, create initial data
                    console.log('Creating initial Firebase data');
                    await updateNotificationLevel(db, expoToken, {
                        notification_level: global.level.value,
                        custom_events: []
                    }, projectsWithSettings.map(project => ({
                        id: project.id,
                        name: project.name,
                        notification_level: project.level.value,
                        custom_events: []
                    })));

                    set({ groups: groupsWithSettings, projects: projectsWithSettings, global });
                } else {
                    // Use existing Firebase data
                    console.log('Using existing Firebase data');
                    set({
                        projects: firebaseData.notifications.map(n => ({
                            id: n.id,
                            name: n.name,
                            level: notificationLevels.find(l => l.value === n.notification_level) || notificationLevels[0]
                        })),
                        global: {
                            level: notificationLevels.find(l => l.value === firebaseData.global_notification.notification_level) || notificationLevels[0],
                            notification_email: global.notification_email
                        },
                        groups: groupsWithSettings
                    });
                }
                const { projects: p } = get();
                console.log("🚀 ~ syncNotificationSettings: ~ p:", p)
                // set({ isInitialized: true });
            } else {
                console.log('Fetching Firebase data for syncin...');
                const firebaseData = await get().fetchFirebaseData(expoToken);
                if (firebaseData && firebaseData.notifications) {
                    set({
                        projects: firebaseData.notifications.map(n => ({
                            id: n.id,
                            name: n.name,
                            level: notificationLevels.find(l => l.value === n.notification_level) || notificationLevels[0]
                        })),
                        global: {
                            level: notificationLevels.find(l => l.value === firebaseData.global_notification.notification_level) || notificationLevels[0],
                            notification_email: get().global.notification_email
                        }
                    });
                }
            }
            console.log('Notification settings synced successfully');
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    selectNotificationLevel: async (level) => {
        const { selectedItemType, selectedItemIndex, projects, global } = get();
        let updatedProjects = [...projects];
        let updatedGlobal = { ...global };

        if (selectedItemType === 'global') {
            updatedGlobal.level = level;
        } else if (selectedItemType === 'project') {
            updatedProjects = projects.map((project, index) =>
                index === selectedItemIndex ? { ...project, level } : project
            );
        }

        set({ projects: updatedProjects, global: updatedGlobal, modalVisible: false });

        try {
            const expoToken = await getExpoToken();
            if (!expoToken) {
                throw new Error('Failed to retrieve Expo token');
            }

            const globalNotification = {
                notification_level: updatedGlobal.level.value,
                custom_events: []
            };

            const updatedNotifications = updatedProjects.map((project) => ({
                id: project.id,
                name: project.name,
                notification_level: project.level.value,
                custom_events: []
            }));

            await updateNotificationLevel(db, expoToken, globalNotification, updatedNotifications);
        } catch (error) {
            console.error("Error updating notification level:", error);
        }
    },

    openModal: (type, index = -1) => {
        set({
            selectedItemType: type,
            selectedItemIndex: index,
            modalVisible: true
        });
    },

    fetchGitLabEmailSettings: async (client: GitLabClient) => {
        try {
            const response = await client.GlobalNotification.all() as GitLabNotificationSettings;
            set({
                global: {
                    level: notificationLevels.find(level => level.value === response.level) || notificationLevels[0],
                    notification_email: response.notification_email || ''
                }
            });
        } catch (error) {
            console.error("Error fetching GitLab email settings:", error);
        }
    },

    fetchFirebaseNotifications: async (expoToken: string) => {
        try {
            const firebaseData = await get().fetchFirebaseData(expoToken);
            if (firebaseData && firebaseData.notifications) {
                set({
                    projects: firebaseData.notifications.map(n => ({
                        id: n.id,
                        name: n.name,
                        level: notificationLevels.find(l => l.value === n.notification_level) || notificationLevels[0]
                    })),
                    global: {
                        level: notificationLevels.find(l => l.value === firebaseData.global_notification.notification_level) || notificationLevels[0],
                        notification_email: get().global.notification_email
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching Firebase notifications:", error);
        }
    },

    syncGitLabWithFirebase: async (client: GitLabClient, expoToken: string) => {
        try {
            const projects = await getAllProjects(client);
            const firebaseData = await get().fetchFirebaseData(expoToken);
            const firebaseProjects = firebaseData?.notifications || [];

            const firebaseProjectMap = new Map(firebaseProjects.map(p => [p.id, p]));

            const updatedNotifications = projects.map(project => {
                const firebaseProject = firebaseProjectMap.get(project.id);
                return {
                    id: project.id,
                    name: project.path_with_namespace,
                    notification_level: firebaseProject?.notification_level || get().global.level.value,
                    custom_events: firebaseProject?.custom_events || []
                };
            });

            await updateNotificationLevel(db, expoToken, {
                notification_level: get().global.level.value,
                custom_events: []
            }, updatedNotifications);

            set({
                projects: updatedNotifications.map(n => ({
                    id: n.id,
                    name: n.name,
                    level: notificationLevels.find(l => l.value === n.notification_level) || notificationLevels[0]
                }))
            });

        } catch (error) {
            console.error("Error syncing GitLab with Firebase:", error);
        }
    },

}));