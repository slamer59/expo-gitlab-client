import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';

const notificationLevels = [
    { value: 'global', label: 'Global', description: 'Use your global notification setting', icon: 'globe' },
    { value: 'watch', label: 'Watch', description: 'You will receive notifications for any activity', icon: 'eye' },
    { value: 'participating', label: 'Participate', description: 'You will only receive notifications for issues you have participated in', icon: 'chatbubbles' },
    { value: 'mention', label: 'On mention', description: 'You will receive notifications only for @mentions', icon: 'at' },
    { value: 'disabled', label: 'Disabled', description: 'You will not receive any notifications', icon: 'notifications-off' },
    // { value: 'custom', label: 'Custom', description: 'You will receive notifications based on your custom settings', icon: 'settings' },
];

export default function NotificationDashboard() {
    const [groups, setGroups] = useState([]);
    const [projects, setProjects] = useState([]);
    const [globalNotificationLevel, setGlobalNotificationLevel] = useState(notificationLevels[0]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItemType, setSelectedItemType] = useState('');
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(true);
    const [isChecked, setIsChecked] = useState(false);


    // Get all info from axios 

    const API_BASE_URL = 'https://gitlab.com/api/v4';
    const ACCESS_TOKEN = 'GITLAB_PAT_REMOVED';


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const fetchNotificationSettings = async (type, id) => {
                    console.log("🚀 ~ fetchNotificationSettings ~ id:", id)
                    try {
                        const response = await axios.get(`${API_BASE_URL}/${type}s/${id}/notification_settings`, {
                            headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
                        });
                        console.log("🚀 ~ fetchNotificationSettings ~ response:", response.data.level)

                        return notificationLevels.find(level => level.value === response.data.level) || notificationLevels[0];
                    } catch (error) {
                        console.error(`Error fetching ${type} notification settings:`, error);
                        return notificationLevels[0];
                    }
                };

                // Fetch groups
                const groupsResponse = await axios.get(`${API_BASE_URL}/groups`, {
                    headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
                });
                const groupsWithSettings = await Promise.all(groupsResponse.data.map(async group => ({
                    id: group.id,
                    name: group.name,
                    level: await fetchNotificationSettings('group', group.id)
                })));
                console.log("🚀 ~ groupsWithSettings ~ groupsWithSettings:", groupsWithSettings)
                setGroups(groupsWithSettings);

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
                setProjects(projectsWithSettings);

                // Fetch global notification settings
                const globalSettingsResponse = await axios.get(`${API_BASE_URL}/notification_settings`, {
                    headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
                });
                setGlobalNotificationLevel(notificationLevels.find(level => level.value === globalSettingsResponse.data.level) || notificationLevels[0]);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const openModal = (type, index = -1) => {
        setSelectedItemType(type);
        setSelectedItemIndex(index);
        setModalVisible(true);
    };

    const selectNotificationLevel = (level) => {
        if (selectedItemType === 'global') {
            setGlobalNotificationLevel(level);
        } else if (selectedItemType === 'group') {
            setGroups(groups.map((group, index) =>
                index === selectedItemIndex ? { ...group, level } : group
            ));
        } else if (selectedItemType === 'project') {
            setProjects(projects.map((project, index) =>
                index === selectedItemIndex ? { ...project, level } : project
            ));
        }
        setModalVisible(false);
    };
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
                        <Text className="text-white">Use primary email (thomas.pedot@gmail.com)</Text>
                        <Ionicons name="chevron-down" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View className="mb-6">
                    <Text className="mb-2 text-xl font-bold text-white">Global notification level</Text>
                    <Text className="mb-3 text-muted">By default, all projects and groups use the global notifications setting.</Text>
                    <TouchableOpacity className="flex-row items-center justify-between p-3 mb-2 rounded-lg bg-muted" onPress={() => openModal('global')}>
                        <Ionicons name={globalNotificationLevel.icon} size={18} color="#fff" />
                        <Text className="text-white">{globalNotificationLevel.label}</Text>
                        <Ionicons name="chevron-down" size={18} color="#fff" />
                    </TouchableOpacity>
                    <View className='flex-row items-center'>
                        <Checkbox
                            className="flex-row items-center"
                            checked={isChecked}
                            onCheckedChange={setIsChecked}
                        />
                        <Text className="ml-2 text-white">Owned activity ?</Text>
                    </View>
                </View>
                <Separator className="my-4 bg-secondary" />
                <View className="mb-6">
                    <Text className="mb-2 text-xl font-bold text-white">Groups ({groups.length})</Text>
                    {groups.map((group, index) => (
                        <ScrollView
                            horizontal
                            className="mb-2 ml-4 bg-transparent max-h-16"
                            contentContainerStyle={{ flexGrow: 1 }}
                        >
                            <View key={index} className="flex-row items-center justify-between w-full py-3 border-b border-muted">
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
                </View>
                <Separator className="my-4 bg-secondary" />
                <View className="mb-6">
                    <Text className="mb-2 text-xl font-bold text-white">Projects ({projects.length})</Text>
                    <Text className="mb-3 text-muted">To specify the notification level per project of a group you belong to, visit the project page and change the notification level there.</Text>
                    {projects.map((project, index) => (
                        <ScrollView
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
