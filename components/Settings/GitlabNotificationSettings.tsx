import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Separator } from '../ui/separator';

const notificationLevels = [
    { value: 'global', label: 'Global', description: 'Use your global notification setting', icon: 'globe' },
    { value: 'watch', label: 'Watch', description: 'You will receive notifications for any activity', icon: 'eye' },
    { value: 'participate', label: 'Participate', description: 'You will only receive notifications for issues you have participated in', icon: 'chatbubbles' },
    { value: 'mention', label: 'On mention', description: 'You will receive notifications only for @mentions', icon: 'at' },
    { value: 'disabled', label: 'Disabled', description: 'You will not receive any notifications', icon: 'notifications-off' },
    { value: 'custom', label: 'Custom', description: 'You will receive notifications based on your custom settings', icon: 'settings' },
];

export default function NotificationDashboard() {
    const [groups, setGroups] = useState([
        { name: 'ecommerce', level: notificationLevels[0] },
        { name: 'expo-app', level: notificationLevels[0] },
        { name: 'infrastructure', level: notificationLevels[0] },
        { name: 'Jokosun', level: notificationLevels[0] },
        { name: 'outils', level: notificationLevels[0] },
        { name: 'Plateforme investisseurs', level: notificationLevels[0] },
        { name: 'playground', level: notificationLevels[0] },
    ]);

    const [projects, setProjects] = useState([
        { name: 'Thomas PEDOT / fake', level: notificationLevels[1] },
        { name: 'Thomas PEDOT / fake-gitlab', level: notificationLevels[1] },
        { name: 'Jokosun / vitrine', level: notificationLevels[3] },
        { name: 'Jokosun / jokosun e-commerce', level: notificationLevels[3] },
        { name: 'Jokosun / component-library', level: notificationLevels[0] },
        { name: 'Jokosun / jokosun-wordpress', level: notificationLevels[0] },
        { name: 'Thomas PEDOT / expo-gitlab-client', level: notificationLevels[0] },
        { name: 'Thomas PEDOT / gemseo', level: notificationLevels[0] },
        { name: 'Thomas PEDOT / obsidian-template', level: notificationLevels[0] },
        { name: 'Thomas PEDOT / Obsidian Vault', level: notificationLevels[0] },
    ]);

    const [globalNotificationLevel, setGlobalNotificationLevel] = useState(notificationLevels[0]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItemType, setSelectedItemType] = useState('');
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

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
                </View>
                <Separator className="my-4 bg-secondary" />
                <View className="mb-6">
                    <Text className="mb-2 text-xl font-bold text-white">Groups ({groups.length})</Text>
                    {groups.map((group, index) => (
                        <View key={index} className="flex-row items-center justify-between py-3 border-b border-muted">
                            <View className="flex-row items-center">
                                <Ionicons
                                    name={`notifications${group.level.value === 'disabled' ? '-off' : ''}`}
                                    size={18}
                                    color="#fff"
                                />
                                <Text className="ml-2 text-white">{group.name}</Text>
                            </View>
                            <TouchableOpacity className="flex-row items-center p-2 rounded-md bg-muted" onPress={() => openModal('group', index)}>
                                <Ionicons name={group.level.icon} size={18} color="#fff" />
                                <Text className="mx-1 text-white">{group.level.label}</Text>
                                <Ionicons name="chevron-down" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                <Separator className="my-4 bg-secondary" />
                <View className="mb-6">
                    <Text className="mb-2 text-xl font-bold text-white">Projects ({projects.length})</Text>
                    <Text className="mb-3 text-muted">To specify the notification level per project of a group you belong to, visit the project page and change the notification level there.</Text>
                    {projects.map((project, index) => (
                        <View key={index} className="flex-row items-center justify-between py-3 border-b border-muted">
                            <View className="flex-row items-center">
                                <Ionicons
                                    name={`notifications${project.level.value === 'disabled' ? '-off' : ''}`}
                                    size={18}
                                    color="#fff"
                                />
                                <Text className="ml-2 text-white">{project.name}</Text>
                            </View>
                            <TouchableOpacity className="flex-row items-center p-2 rounded-md bg-muted" onPress={() => openModal('project', index)}>
                                <Ionicons name={project.level.icon} size={18} color="#fff" />
                                <Text className="mx-1 text-white">{project.level.label}</Text>
                                <Ionicons name="chevron-down" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="justify-end flex-1 bg-black bg-opacity-50">
                    <View className="p-5 bg-card rounded-t-2xl">
                        <Text className="mb-4 text-2xl font-bold text-white">Select Notification Level</Text>
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
                        <TouchableOpacity className="p-3 mt-4 rounded-lg bg-popover" onPress={() => setModalVisible(false)}>
                            <Text className="text-xl font-bold text-white">Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}
