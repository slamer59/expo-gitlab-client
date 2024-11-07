import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { getApps, initializeApp } from 'firebase/app';
import 'firebase/firestore';
import { deleteDoc, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { firebaseConfig } from 'lib/firebase/helpers';
import GitLabClient from 'lib/gitlab/gitlab-api-wrapper';
import { create } from 'zustand';
import { FirebaseDocument, GitLabGroup, GitLabNotificationSettings, GitLabProject, NotificationStore } from './interfaces';
import { getAllProjects, getExpoToken, notificationLevels, RGPD_ACCEPTED_KEY, updateNotificationLevel } from './utils';

// Initialize Firebase
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const db = getFirestore(app);


export const useNotificationStore = create<NotificationStore>((set, get) => ({
    groups: [],
    projects: [],
    global: { level: notificationLevels[0], notification_email: '' },
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

    setGroups: (groups) => set({ groups }),
    setProjects: (projects) => set({ projects }),
    setGlobal: (global) => set({ global }),
    setModalVisible: (visible) => set({ modalVisible: visible }),
    setSelectedItemType: (type) => set({ selectedItemType: type }),
    setSelectedItemIndex: (index) => set({ selectedItemIndex: index }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setIsInitialized: (initialized) => set({ isInitialized: initialized }),
    setExpoPushToken: (token) => set({ expoPushToken: token }),
    setPermissionStatus: (status) => set({ permissionStatus: status }),
    setNotificationPreferences: (prefs) => set({ notificationPreferences: prefs }),

    setRGPDConsent: async (accepted: boolean) => {
        try {

            if (accepted) {
                // 1. Store RGPD consent
                await AsyncStorage.setItem(RGPD_ACCEPTED_KEY, 'true');

                // 2. Request local notification permissions
                if (Device.isDevice) {
                    const { status } = await Notifications.requestPermissionsAsync();
                    if (status !== 'granted') {
                        throw new Error('Notification permission not granted');
                    }
                }

                // 3. Get Expo token and register in Firebase
                const token = (await Notifications.getExpoPushTokenAsync()).data;
                // await AsyncStorage.setItem(EXPO_TOKEN_KEY, token);

                // Register in Firebase
                await setDoc(doc(db, "userNotifications", token), {
                    changedDate: new Date().toISOString(),
                    consentDate: new Date().toISOString()
                }, { merge: true });

                set({
                    expoPushToken: token,
                    consentToRGPDGiven: true
                });

            } else {
                // Handle consent removal
                const token = (await Notifications.getExpoPushTokenAsync()).data;

                if (token) {
                    // 1. Remove from Firebase
                    await deleteDoc(doc(db, "userNotifications", token));
                    console.log("Removed from Firebase");
                }

                // 3. Clear local storage
                await AsyncStorage.removeItem(RGPD_ACCEPTED_KEY);
                // await AsyncStorage.removeItem(EXPO_TOKEN_KEY);

                set({
                    expoPushToken: null,
                    consentToRGPDGiven: false,
                    permissionStatus: null
                });
            }
        } catch (error) {
            console.error('Error handling RGPD consent:', error);
            if (error.response?.status === 401) {
                router.push('/login');
            }
            throw error;
        }
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
        try {
            const { isInitialized } = get();
            const expoToken = await getExpoToken();

            if (!expoToken) {
                throw new Error('Failed to retrieve Expo token');
            }

            const fetchNotificationSettings = async (type: string, id: number | null): Promise<GitLabNotificationSettings> => {
                try {
                    let response: GitLabNotificationSettings;
                    if (type === 'global') {
                        response = await client.GlobalNotification.all();
                    } else if (type === 'group') {
                        response = await client.GroupNotifications.all(id!);
                    } else if (type === 'project') {
                        response = await client.ProjectNotifications.all(id!);
                    } else {
                        response = { level: 'global' };
                    }
                    return response;
                } catch (error) {
                    console.error(`Error fetching ${type} notification settings:`, error);
                    return { level: 'global' };
                }
            };

            if (!isInitialized) {
                const groups = await client.Groups.all() as GitLabGroup[];
                const groupsWithSettings = await Promise.all(groups.map(async (group: GitLabGroup) => {
                    const settings = await fetchNotificationSettings('group', group.id);
                    return {
                        id: group.id,
                        name: group.full_name,
                        level: notificationLevels.find(level => level.value === settings.level) || notificationLevels[0]
                    };
                }));

                const projects = await getAllProjects(client);
                const projectsWithSettings = await Promise.all(projects.map(async (project: GitLabProject) => {
                    const settings = await fetchNotificationSettings('project', project.id);
                    return {
                        id: project.id,
                        name: project.path_with_namespace,
                        level: notificationLevels.find(level => level.value === settings.level) || notificationLevels[0]
                    };
                }));

                const globalSettings = await fetchNotificationSettings('global', null);
                const global = {
                    level: notificationLevels.find(level => level.value === globalSettings.level) || notificationLevels[0],
                    notification_email: globalSettings.notification_email || ''
                };

                const firebaseData = await get().fetchFirebaseData(expoToken);

                if (!firebaseData || !firebaseData.notifications) {
                    // If no Firebase data exists or no notifications array, create initial data
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

                set({ isInitialized: true });
            } else {
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

    registerForPushNotifications: async () => {
        if (!Device.isDevice) {
            alert('Must use physical device for Push Notifications');
            return null;
        }

        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            set({ permissionStatus: finalStatus });

            if (finalStatus !== 'granted') {
                return null;
            }

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            set({ expoPushToken: token });

            // Save token locally
            await AsyncStorage.setItem('expoPushToken', token);

            // Save to Firestore
            const docRef = doc(db, "userNotifications", token);
            const docSnap = await getDoc(docRef);
            // if (!docSnap.exists()) {
            await setDoc(docRef, {
                changedDate: new Date().toISOString(),
                global_notification: {
                    notification_level: 'global',
                    custom_events: []
                },
                notifications: []
            }, { merge: true });
            // }

            // Navigate to GitlabNotificationSettings after successful registration
            // router.push('/options/profile');

            return token;
        } catch (error) {
            console.error('Error registering for push notifications:', error);
            return null;
        }
    },

    checkNotificationRegistration: async () => {
        try {
            const storedToken = await AsyncStorage.getItem('expoPushToken');

            if (!storedToken) {
                return await get().registerForPushNotifications();
            }

            const docRef = doc(db, "userNotifications", storedToken);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return await get().registerForPushNotifications();
            }

            set({ expoPushToken: storedToken });
            return storedToken;
        } catch (error) {
            console.error('Error checking notification registration:', error);
            return null;
        }
    },

    initializeNotifications: async () => {
        try {
            // Check if the user has accepted RGPD
            const hasAcceptedRGPD = await AsyncStorage.getItem(RGPD_ACCEPTED_KEY);
            if (hasAcceptedRGPD !== 'true') {
                // Prompt the user to accept RGPD
                // For example, you could navigate to a screen that explains RGPD and asks the user to accept
                router.push('/workspace/privacy-policy');
                return;
            }

            // Load saved preferences
            const storedPrefs = await AsyncStorage.getItem('notificationPreferences');
            if (storedPrefs) {
                set({ notificationPreferences: JSON.parse(storedPrefs) });
            }

            // Check and register for notifications if needed
            const token = await get().checkNotificationRegistration();
            if (!token) {
                throw new Error('Failed to initialize notifications');
            }

            // Set up periodic token check
            setInterval(async () => {
                await get().checkNotificationRegistration();
            }, 24 * 60 * 60 * 1000); // Daily check
        } catch (error) {
            console.error('Error initializing notifications:', error);
        }
    },
}));
