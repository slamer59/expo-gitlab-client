import { useNotificationStore } from '@/lib/notification/state';
import { Ionicons, Octicons } from '@expo/vector-icons';
import 'firebase/firestore';
import { notificationLevels } from 'lib/notification/utils';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

const NotificationDashboard = () => {
    const {
        projects,
        global,
        modalVisible,
        isLoading,
        selectNotificationLevel,
        openModal,
        setModalVisible,
    } = useNotificationStore();

    // Use useCallback to prevent re-creating functions on every render
    const handleSelectNotificationLevel = useCallback((level) => {
        selectNotificationLevel(level);
    }, [selectNotificationLevel]);

    const handleOpenModal = useCallback((type, index) => {
        openModal(type, index);
    }, [openModal]);

    const handleCloseModal = useCallback(() => {
        setModalVisible(false);
    }, [setModalVisible]);

    // Use useMemo to prevent recalculating values on every render
    const globalNotificationLevel = useMemo(() => {
        return global?.level;
    }, [global]);

    const globalNotificationEmail = useMemo(() => {
        return global?.notification_email;
    }, [global]);

    const projectList = useMemo(() => {
        return projects || [];
    }, [projects]);

    useEffect(() => {
        // Any side effects can be handled here
        console.log("🚀 ~ NotificationDashboard ~ projects:", projects)

    }, []);

    return (
        <>
            <View className="p-4 m-1 rounded-lg bg-card">
                <View className='flex flex-row items-center mb-5'>
                    <Octicons name="bell" size={30} color="white" className='mr-2' />
                    <Text className='text-2xl font-bold text-white'>Notifications</Text>
                </View>
                <Text className="mb-6 text-muted">You can specify notification level per group or per project.</Text>

                <Text className="mb-6 text-muted">Configure your mobile app notification preferences here. These settings are independent from your GitLab email notifications.</Text>

                <View className="mb-6">
                    <Text className="mb-2 text-xl font-bold text-white">Global notification email</Text>
                    <TouchableOpacity className="flex-row items-center justify-between p-3 mb-2 rounded-lg bg-muted">
                        {isLoading ? (
                            <Skeleton className="w-3/4 h-4" />
                        ) : (
                            <Text className="text-white">Use primary email {globalNotificationEmail}</Text>
                        )}
                        <Ionicons name="chevron-down" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>

                {globalNotificationLevel && (
                    <View className="mb-6">
                        <Text className="mb-2 text-xl font-bold text-white">Global notification level</Text>
                        <Text className="mb-3 text-muted">By default, all projects and groups use the global notifications setting.</Text>
                        <TouchableOpacity
                            className="flex-row items-center justify-between p-3 mb-2 rounded-lg bg-muted"
                            onPress={() => handleOpenModal('global', -1)}
                        >
                            <Ionicons name={globalNotificationLevel.icon} size={18} color="#fff" />
                            <Text className="text-white">{globalNotificationLevel.label}</Text>
                            <Ionicons name="chevron-down" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}

                <Separator className="my-4 bg-secondary" />

                <View className="mb-6">
                    <Text className="mb-2 text-xl font-bold text-white">Projects ({isLoading ? "..." : projectList.length})</Text>
                    <Text className="mb-3 text-muted">To specify the notification level per project of a group you belong to, visit the project page and change the notification level there.</Text>

                    {isLoading ? (
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
                    ) : (
                        projectList.length > 0 ? projectList.map((project, index) => (
                            <ScrollView
                                key={project.id}
                                horizontal
                                className="mb-2 ml-4 bg-transparent max-h-16"
                                contentContainerStyle={{ flexGrow: 1 }}
                            >
                                <View className="flex-row items-center justify-between w-full py-3 border-b border-muted">
                                    <View className="flex-row items-center flex-1 mr-4">
                                        <Ionicons
                                            name={`notifications${project.level?.value === 'disabled' ? '-off' : ''}`}
                                            size={18}
                                            color="#fff"
                                        />
                                        <Text className="ml-2 text-white" numberOfLines={1} ellipsizeMode="tail">
                                            {project.name}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        className="flex-row items-center p-2 rounded-md bg-muted"
                                        onPress={() => handleOpenModal('project', index)}
                                    >
                                        <Ionicons name={project.level?.icon} size={18} color="#fff" />
                                        <Text className="mx-1 text-white">{project.level.label}</Text>
                                        <Ionicons name="chevron-down" size={18} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        )) : (
                            <Text className="text-muted">No projects found</Text>
                        )
                    )}
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View className="justify-end flex-1 bg-black bg-opacity-50">
                        <View className="p-5 bg-card rounded-t-2xl">
                            <Text className="mb-4 text-4xl font-bold text-white">Select Notification Level</Text>
                            {notificationLevels.map((level, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="py-3 border-b border-muted"
                                    onPress={() => handleSelectNotificationLevel(level)}
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
};

export default NotificationDashboard;