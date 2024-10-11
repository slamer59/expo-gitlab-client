import { firebaseConfig } from '@/lib/firebase/helpers';
import { getExpoToken } from '@/lib/gitlab/helpers';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { getApps, initializeApp } from 'firebase/app';
import 'firebase/firestore';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { create } from 'zustand';
import { Separator } from '../ui/separator';

// Initialize Firebase
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const db = getFirestore(app);

const API_BASE_URL = 'https://gitlab.com/api/v4';
const ACCESS_TOKEN = 'GITLAB_PAT_REMOVED';

const notificationLevels = [
    { value: 'global', label: 'Global', description: 'Use your global notification setting', icon: 'globe' },
    { value: 'participating', label: 'Participate', description: 'You will only receive notifications for issues you have participated in', icon: 'chatbubbles' },
    { value: 'disabled', label: 'Disabled', description: 'You will not receive any notifications', icon: 'notifications-off' },
];

interface NotificationItem {
    id: number;
    name: string;
    level: typeof notificationLevels[0];
}

interface NotificationStore {
    groups: NotificationItem[];
    projects: NotificationItem[];
    global: {
        level: typeof notificationLevels[0];
        notification_email: string;
    };
    modalVisible: boolean;
    selectedItemType: string;
    selectedItemIndex: number;
    isLoading: boolean;
    setGroups: (groups: NotificationItem[]) => void;
    setProjects: (projects: NotificationItem[]) => void;
    setGlobal: (global: { level: typeof notificationLevels[0]; notification_email: string }) => void;
    setModalVisible: (visible: boolean) => void;
    setSelectedItemType: (type: string) => void;
    setSelectedItemIndex: (index: number) => void;
    setIsLoading: (loading: boolean) => void;
    fetchData: () => Promise<void>;
    selectNotificationLevel: (level: typeof notificationLevels[0]) => Promise<void>;
    openModal: (type: string, index: number) => void;
}

const useNotificationStore = create<NotificationStore>((set, get) => ({
    groups: [],
    projects: [],
    global: { level: notificationLevels[0], notification_email: '' },
    modalVisible: false,
    selectedItemType: '',
    selectedItemIndex: -1,
    isLoading: true,
    setGroups: (groups) => set({ groups }),
    setProjects: (projects) => set({ projects }),
    setGlobal: (global) => set({ global }),
    setModalVisible: (visible) => set({ modalVisible: visible }),
    setSelectedItemType: (type) => set({ selectedItemType: type }),
    setSelectedItemIndex: (index) => set({ selectedItemIndex: index }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    fetchData: async () => {
        set({ isLoading: true });
        try {
            const fetchNotificationSettings = async (type, id) => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/${type}s/${id}/notification_settings`, {
                        headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
                    });
                    return notificationLevels.find(level => level.value === response.data.level) || notificationLevels[0];
                } catch (error) {
                    console.error(`Error fetching ${type} notification settings:`, error);
                    return notificationLevels[0];
                }
            };

            // Fetch projects
            const projectsResponse = await axios.get(`${API_BASE_URL}/projects`, {
                params: { membership: true, owned: true },
                headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
            });
            const projectsWithSettings = await Promise.all(projectsResponse.data.map(async project => ({
                id: project.id,
                name: project.path_with_namespace,
                level: await fetchNotificationSettings('project', project.id)
            })));
            set({ projects: projectsWithSettings });

            // Fetch global notification settings
            const globalSettingsResponse = await axios.get(`${API_BASE_URL}/notification_settings`, {
                headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
            });
            const globalSettings = {
                level: notificationLevels.find(level => level.value === globalSettingsResponse.data.level) || notificationLevels[0],
                notification_email: globalSettingsResponse.data.notification_email
            };
            set({ global: globalSettings });

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

            await updateNotificationLevel(expoToken, globalNotification, updatedNotifications);
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
}));

async function updateNotificationLevel(expoToken: string, globalNotification: any, notifications: any[]) {
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

export default function NotificationDashboard() {
    const {
        projects,
        global,
        modalVisible,
        isLoading,
        fetchData,
        selectNotificationLevel,
        openModal,
        setModalVisible
    } = useNotificationStore();

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <View className="items-center justify-center flex-1">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="mt-2 text-white">Loading...</Text>
            </View>
        );
    }

    return (
        <>
            <View className="p-4 m-1 rounded-lg bg-card">
                <Text className="mb-2 text-2xl font-bold text-white">Notifications</Text>
                <Text className="mb-6 text-muted">You can specify notification level per group or per project.</Text>

                <View className="mb-6">
                    <Text className="mb-2 text-xl font-bold text-white">Global notification email</Text>
                    <TouchableOpacity className="flex-row items-center justify-between p-3 mb-2 rounded-lg bg-muted">
                        <Text className="text-white">Use primary email {global.notification_email}</Text>
                        <Ionicons name="chevron-down" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>

                {global && global.level && (
                    <View className="mb-6">
                        <Text className="mb-2 text-xl font-bold text-white">Global notification level</Text>
                        <Text className="mb-3 text-muted">By default, all projects and groups use the global notifications setting.</Text>
                        <TouchableOpacity className="flex-row items-center justify-between p-3 mb-2 rounded-lg bg-muted" onPress={() => openModal('global')}>
                            <Ionicons name={global.level.icon} size={18} color="#fff" />
                            <Text className="text-white">{global.level.label}</Text>
                            <Ionicons name="chevron-down" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}

                <Separator className="my-4 bg-secondary" />
                <View className="mb-6">
                    <Text className="mb-2 text-xl font-bold text-white">Projects ({projects.length})</Text>
                    <Text className="mb-3 text-muted">To specify the notification level per project of a group you belong to, visit the project page and change the notification level there.</Text>
                    {projects.map((project, index) => (
                        <ScrollView
                            key={project.id}
                            horizontal
                            className="mb-2 ml-4 bg-transparent max-h-16"
                            contentContainerStyle={{ flexGrow: 1 }}
                        >
                            <View className="flex-row items-center justify-between w-full py-3 border-b border-muted">
                                <View className="flex-row items-center flex-1 mr-4">
                                    <Ionicons
                                        name={`notifications${project.level.value === 'disabled' ? '-off' : ''}`}
                                        size={18}
                                        color="#fff"
                                    />
                                    <Text className="ml-2 text-white" numberOfLines={1} ellipsizeMode="tail">
                                        {project.name}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    className="flex-row items-center p-2 rounded-md bg-muted"
                                    onPress={() => openModal('project', index)}
                                >
                                    <Ionicons name={project.level.icon} size={18} color="#fff" />
                                    <Text className="mx-1 text-white">{project.level.label}</Text>
                                    <Ionicons name="chevron-down" size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    ))}
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View className="justify-end flex-1 bg-black bg-opacity-50">
                        <View className="p-5 bg-card rounded-t-2xl">
                            <Text className="mb-4 text-4xl font-bold text-white">Select Notification Level</Text>
                            {notificationLevels.map((level, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="py-3 border-b border-muted"
                                    onPress={() => selectNotificationLevel(level)}
                                >
                                    <Text className="mb-1 text-xl font-bold text-white">{level.label}</Text>
                                    <Text className="text-muted">{level.description}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
}