import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';

import { updateOrCreateWebhooks } from '@/lib/gitlab/webhooks';
import { getExpoToken, notificationLevels, useNotificationStore } from '@/lib/notification/state';
import { useSession } from '@/lib/session/SessionProvider';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import 'firebase/firestore';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import ErrorAlert from '../ErrorAlert';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';


export default function NotificationDashboard() {
    const { session } = useSession();
    const client = useMemo(() => new GitLabClient({
        url: session?.url,
        token: session?.token,
    }), [session?.url, session?.token]);

    const api = useGitLab(client);

    const { data: personalProjects, isLoading: isLoadingPersonal, error: errorPersonal } = api.useProjects({ membership: true });

    const {
        projects,
        groups,
        global,
        modalVisible,
        isLoading,
        syncNotificationSettings,
        selectNotificationLevel,
        openModal,
        setModalVisible,
        // Remove syncWithFirebase from here
        fetchGitLabEmailSettings,
        fetchFirebaseNotifications,
        syncGitLabWithFirebase,
    } = useNotificationStore();


    useEffect(() => {
        if (session?.url && session?.token) {
            syncNotificationSettings(client);
        }
    }, [session?.url, session?.token]);

    // 1. Fetch projects
    const [alert, setAlert] = useState<{ isOpen: boolean; message: string }>({
        isOpen: false,
        message: '',
    });


    const prepareProjects = (projects) => {
        if (!projects) {
            console.error("Projects are undefined");
            setAlert({ message: "Error: Projects are undefined", isOpen: true });
            return null;
        }

        return projects.map(project => ({
            http_url_to_repo: project.http_url_to_repo,
            id: project.id
        }));
    };

    const updateWebhooks = async (session, projects) => {
        try {
            await updateOrCreateWebhooks(session, projects, undefined);
            console.log("Webhooks updated successfully");
        } catch (error) {
            console.error("Error updating webhooks:", error);
            setAlert({ message: `Error updating webhooks: ${error.message}`, isOpen: true });
        }
    };
    // const syncNotifications = useCallback(async () => {
    //     if (session?.url && session?.token) {
    //         await fetchData(client);
    //         console.log("Sync notification updated successfully");

    //     }
    // }, [session?.url, session?.token, fetchData]);

    // useFocusEffect(
    //     useCallback(() => {
    //         syncNotifications();
    //     }, [syncNotifications])
    // );

    useFocusEffect(
        useCallback(() => {
            const syncNotifications = async () => {
                if (session?.url && session?.token) {
                    const expoToken = await getExpoToken();
                    if (expoToken) {
                        await fetchGitLabEmailSettings(client);
                        await fetchFirebaseNotifications(expoToken);
                        await syncGitLabWithFirebase(client, expoToken);
                    }
                }
            };

            syncNotifications();
        }, [session?.url, session?.token, client])
    );

    useFocusEffect(
        React.useCallback(() => {
            const setupProjectWebhooks = async () => {
                if (isLoadingPersonal) {
                    console.log("Projects are still loading");
                    return;
                }
                const projects = prepareProjects(personalProjects);
                if (!projects) return;

                await updateWebhooks(session, projects);
            };

            setupProjectWebhooks();
        }, [session, personalProjects, isLoadingPersonal])
    );



    return (
        <>
            <ErrorAlert
                isOpen={alert.isOpen}
                onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
                message={alert.message}
            />
            <View className="p-4 m-1 rounded-lg bg-card">
                <Text className="mb-2 text-2xl font-bold text-white">Notifications</Text>
                <Text className="mb-6 text-muted">You can specify notification level per group or per project.</Text>

                <Text className="mb-6 text-muted">Configure your mobile app notification preferences here. These settings are independent from your GitLab email notifications.</Text>


                <View className="mb-6">
                    <Text className="mb-2 text-xl font-bold text-white">Global notification email</Text>
                    <TouchableOpacity className="flex-row items-center justify-between p-3 mb-2 rounded-lg bg-muted">
                        {isLoading ? (
                            <Skeleton className="w-3/4 h-4" />
                        ) : (
                            <Text className="text-white">Use primary email {global.notification_email}</Text>
                        )}
                        <Ionicons name="chevron-down" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>

                {global && global.level && (
                    <View className="mb-6">
                        <Text className="mb-2 text-xl font-bold text-white">Global notification level</Text>
                        <Text className="mb-3 text-muted">By default, all projects and groups use the global notifications setting.</Text>
                        <TouchableOpacity className="flex-row items-center justify-between p-3 mb-2 rounded-lg bg-muted" onPress={() => openModal('global', null)}>
                            <Ionicons name={global.level.icon} size={18} color="#fff" />
                            <Text className="text-white">{global.level.label}</Text>
                            <Ionicons name="chevron-down" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}
                {/* <Separator className="my-4 bg-secondary" />
                <View className="mb-6">
                    <Text className="mb-2 text-xl font-bold text-white">Groups ({groups.length})</Text>
                    <Text className="mb-3 text-muted">To specify the notification level per group you belong to, visit the project page and change the notification level there.</Text>
                    {groups.map((group, index) => (
                        <ScrollView
                            key={group.id}
                            horizontal
                            className="mb-2 ml-4 bg-transparent max-h-16"
                            contentContainerStyle={{ flexGrow: 1 }}
                        >
                            <View className="flex-row items-center justify-between w-full py-3 border-b border-muted">
                                <View className="flex-row items-center flex-1 mr-4">
                                    <Ionicons
                                        name={`notifications${group.level.value === 'disabled' ? '-off' : ''}`}
                                        size={18}
                                        color="#fff"
                                    />
                                    <Text className="ml-2 text-white" numberOfLines={1} ellipsizeMode="tail">
                                        {group.name}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    className="flex-row items-center p-2 rounded-md bg-muted"
                                    onPress={() => openModal('group', index)}
                                >
                                    <Ionicons name={group.level.icon} size={18} color="#fff" />
                                    <Text className="mx-1 text-white">{group.level.label}</Text>
                                    <Ionicons name="chevron-down" size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    ))}
                </View> */}
                <Separator className="my-4 bg-secondary" />

                <View className="mb-6">
                    <Text className="mb-2 text-xl font-bold text-white">Projects ({isLoading ? "..." : projects.length})</Text>
                    <Text className="mb-3 text-muted">To specify the notification level per project of a group you belong to, visit the project page and change the notification level there.</Text>

                    {isLoading ? (
                        // Skeleton loading
                        Array.from({ length: 3 }).map((_, index) => (
                            <View key={index} className="mb-2 ml-4 bg-transparent">
                                <View className="flex-row items-center justify-between w-full py-3 border-b border-muted">
                                    <View className="flex-row items-center flex-1 mr-4">
                                        <Skeleton className="w-5 h-5 rounded-full" />
                                        <Skeleton className="w-3/4 h-4 ml-2" />
                                    </View>
                                    <Skeleton className="w-24 h-8 rounded-md" />
                                </View>
                            </View>
                        ))
                    ) : (<>{
                        projects.map((project, index) => (
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
                        ))
                    }
                    </>
                    )}
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