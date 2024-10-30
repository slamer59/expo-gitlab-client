// app/groups.tsx
import { Octicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Stack } from 'expo-router';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface GitLabGroup {
    id: number;
    name: string;
    path: string;
    visibility: string;
    avatar_url: string | null;
    star_count: number;
    forks_count: number;
    members_count: number;
    subgroups?: GitLabGroup[];
    parent_id: number | null;
}

const gitlabApi = axios.create({
    baseURL: 'https://gitlab.com/api/v4',
    headers: {
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_GITLAB_TOKEN}`
    }
});

export default function GroupsScreen() {
    const [expandedGroups, setExpandedGroups] = useState<number[]>([]);

    // Fetch all groups and subgroups
    const { data: groups, isLoading } = useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
            // First fetch top-level groups
            const response = await gitlabApi.get<GitLabGroup[]>('/groups', {
                params: {
                    top_level_only: true,
                    per_page: 100
                }
            });

            // For each top-level group, fetch its subgroups
            const groupsWithSubgroups = await Promise.all(
                response.data.map(async (group) => {
                    const subgroupsResponse = await gitlabApi.get<GitLabGroup[]>(
                        `/groups/${group.id}/subgroups`
                    );
                    return {
                        ...group,
                        subgroups: subgroupsResponse.data
                    };
                })
            );

            return groupsWithSubgroups;
        }
    });
    console.log("🚀 ~ GroupsScreen ~ groups:", groups)

    const toggleGroup = (groupId: number) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const renderHeader = () => (
        <View className="p-4 border-b border-gray-700">
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-2xl font-semibold text-white">Groups</Text>
                <View className="flex-row gap-4">
                    <TouchableOpacity className="px-3 py-1">
                        <Text className="text-blue-400">Explore groups</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-3 py-1 bg-blue-500 rounded">
                        <Text className="text-white">New group</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-row gap-2">
                <View className="flex-1">
                    <View className="flex-row items-center px-3 py-2 bg-gray-800 rounded">
                        <TextInput
                            placeholder="Search or filter results..."
                            placeholderTextColor="#9CA3AF"
                            className="flex-1 text-white"
                        />
                    </View>
                </View>
                <TouchableOpacity className="flex-row items-center px-3 py-2 bg-gray-800 rounded">
                    <Text className="mr-2 text-white">Created date</Text>
                    <ChevronDown size={16} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const GroupItem = ({ group, level = 0 }: { group: GitLabGroup, level?: number }) => {
        const hasSubgroups = group.subgroups && group.subgroups.length > 0;
        const isExpanded = expandedGroups.includes(group.id);

        return (
            <>
                <TouchableOpacity
                    className="p-4 border-b border-gray-700"
                    onPress={() => hasSubgroups && toggleGroup(group.id)}
                >
                    <View className="flex-row items-center">
                        {/* Indentation based on level */}
                        {level > 0 && (
                            <View style={{ width: level * 24 }} />
                        )}

                        {/* Expand/Collapse arrow */}
                        {hasSubgroups ? (
                            <>
                                <TouchableOpacity
                                    onPress={() => toggleGroup(group.id)}
                                    className="flex-row items-center mr-2 jusitfy-center"
                                >
                                    <ChevronRight
                                        size={16}
                                        color="#9CA3AF"
                                        style={{
                                            transform: [{ rotate: isExpanded ? '90deg' : '0deg' }]
                                        }}
                                    />
                                    <Octicons name="people" size={16} color="#9CA3AF" className='ml-2 mr-2' />
                                </TouchableOpacity>
                            </>
                        )
                            :
                            <View className='mr-10' />
                        }

                        {/* Group avatar */}
                        <View className="items-center justify-center w-8 h-8 mr-3 bg-gray-700 rounded-lg">
                            <Text className="text-lg text-white">
                                {/* <Avatar alt={`${group.name}'s Avatar`}>
                                    <AvatarImage source={{ uri: group.avatar_url }} />
                                    <AvatarFallback>
                                        <Ionicons name="person-circle-outline" size={32} color="white" />
                                    </AvatarFallback>
                                </Avatar> */}

                                <Text className="text-lg text-white">
                                    {group.name.charAt(0).toUpperCase()}
                                </Text>
                            </Text>
                        </View>

                        <View className="flex-1">
                            <View className="flex-row items-center">
                                <Text className="mr-2 text-lg text-white">{group.name}</Text>
                                {group.visibility === 'private' && (
                                    <Octicons name="lock" size={16} color="#9CA3AF" />
                                )}
                            </View>
                        </View>

                        <View className="flex-row items-center gap-4">
                            <View className="flex-row items-center">
                                <Octicons name="star" size={16} color="#9CA3AF" />
                                <Text className="ml-1 text-gray-400">{group.star_count}</Text>
                            </View>

                            <View className="flex-row items-center">
                                <Octicons name="repo-forked" size={16} color="#9CA3AF" />
                                <Text className="ml-1 text-gray-400">{group.forks_count}</Text>
                            </View>

                            <View className="flex-row items-center">
                                <Octicons name="people" size={16} color="#9CA3AF" />
                                <Text className="ml-1 text-gray-400">{group.subgroups?.length || 0}</Text>
                            </View>

                            <TouchableOpacity>
                                <Octicons name="three-bars" size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity >

                {/* Render subgroups if expanded */}
                {
                    isExpanded && group.subgroups?.map(subgroup => (
                        <GroupItem
                            key={subgroup.id}
                            group={subgroup}
                            level={level + 1}
                        />
                    ))
                }
            </>
        );
    };

    const renderGroups = () => {
        if (!groups) return null;

        return groups.map(group => (
            <GroupItem key={group.id} group={group} />
        ));
    };

    return (
        <View className="flex-1 p-4 bg-background">
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />

            <FlatList
                data={[]} // We're using custom render for nested structure
                renderItem={null}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderGroups}
                stickyHeaderIndices={[0]}
            />
        </View>
    );
}