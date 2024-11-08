import { create } from 'zustand';

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
    setGdprConsent: (accepted: boolean) => void;

    // Webhook and Firebase actions
    manageWebhookAndFirebase: (consent: boolean) => Promise<void>;
    addWebhookToGitLab: (session: any, groups: any[]) => Promise<void>;
    removeWebhookFromGitLab: (session: any) => Promise<void>;
    addDataToFirebase: (session: any) => Promise<void>;
    removeDataFromFirebase: () => Promise<void>;
}

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

    // State setters
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

    // GDPR Consent and Firebase Sync
    setGdprConsent: (accepted) => set({ consentToRGPDGiven: accepted }),

    // Webhook and Firebase actions
    manageWebhookAndFirebase: async (consent) => {
        const { session, groups } = get();
        if (consent) {
            try {
                console.log('Adding webhook to GitLab and syncing Firebase data...');
                await Promise.all([
                    get().addWebhookToGitLab(session, groups),
                    get().addDataToFirebase(session),
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
    addWebhookToGitLab: async (session, groups) => {
        console.log('Adding webhook to GitLab for session:', session, 'and groups:', groups);
        // Implement GitLab webhook addition logic here
    },

    removeWebhookFromGitLab: async (session) => {
        console.log('Removing webhook from GitLab for session:', session);
        // Implement GitLab webhook removal logic here
    },

    addDataToFirebase: async (session) => {
        console.log('Adding data to Firebase for session:', session);
        // Implement Firebase data addition logic here
    },

    removeDataFromFirebase: async () => {
        console.log('Removing data from Firebase');
        // Implement Firebase data removal logic here
    },
}));
