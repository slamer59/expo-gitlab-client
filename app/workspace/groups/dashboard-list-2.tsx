import { Ionicons, Octicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import GitLabClient from 'lib/gitlab/gitlab-api-wrapper';
import { useSession } from 'lib/session/SessionProvider';
import { ChevronRight, LucideComponent } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

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

export default function GroupsScreen() {
    const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { session } = useSession();

    const client = new GitLabClient({
        token: session?.token,
        host: session?.url
    });

    // Fetch all groups and subgroups
    const { data: groups, isLoading } = useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
            // First fetch top-level groups
            const topLevelGroups = await client.Groups.all({
                top_level_only: true,
                per_page: 100
            });

            // For each top-level group, fetch its subgroups
            const groupsWithSubgroups = await Promise.all(
                topLevelGroups.map(async (group) => {
                    const subgroups = await client.Groups.subgroups(group.id);
                    return {
                        ...group,
                        subgroups
                    };
                })
            );

            return groupsWithSubgroups;
        }
    });

    const toggleGroup = (groupId: number) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };


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
                                </TouchableOpacity>
                            </>
                        )
                            :
                            <View className='mr-10' />
                        }

                        {/* Group avatar */}
                        <View className="items-center justify-center w-8 h-8 mr-3 bg-gray-700 rounded-lg">
                            <Text className="text-lg text-white">
                                {group.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>

                        <View className="flex-1">
                            <Text className="mr-2 text-lg text-white">{group.name}</Text>
                        </View>

                        <View className="flex-row items-center gap-4">
                            <View className="flex-row items-center">
                                <LucideComponent size={16} color="grey" />
                                <Text className="ml-1 text-gray-400">{group.subgroups?.length || 0}</Text>
                            </View>

                            {group.visibility === 'private' && (
                                <Octicons className="ml-2" name="lock" size={16} color="grey" />

                            )}
                            <TouchableOpacity>
                                <Ionicons
                                    name="ellipsis-vertical"
                                    size={16}
                                    color="grey"
                                    className="m-2 ml-2 mr-2 opacity-100"
                                    testID="options"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Render subgroups if expanded */}
                {isExpanded && group.subgroups?.map(subgroup => (
                    <GroupItem
                        key={subgroup.id}
                        group={subgroup}
                        level={level + 1}
                    />
                ))}
            </>
        );
    };

    const filteredGroups = groups?.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderGroups = () => {
        if (isLoading) {
            return (
                <View className="p-4">
                    <Text className="text-white">Loading groups...</Text>
                </View>
            );
        }

        if (!filteredGroups?.length) {
            return (
                <View className="p-4">
                    <Text className="text-white">No groups found</Text>
                </View>
            );
        }

        return filteredGroups.map(group => (
            <GroupItem key={group.id} group={group} />
        ));
    };

    return (
        <View
            className="flex-1 p-2 bg-background"
        >
            <Stack.Screen
                options={{
                    headerTitle: "Groups",
                }}
            />
            <View className="*:mb-2 flex-col justify-between">
                {/* <ScrollView horizontal className='px-2'>
                    {UIFilters.map((filter, index) => (
                        <FlatFilterButton
                            key={index}
                            options={filter.options}
                            placeholder={filter.placeholder}
                            selectedValue={filters[filter.label]}
                            onValueChange={(option) => setFilter(filter.label.toLowerCase(), option.value)}
                        />
                    ))}
                </ScrollView> */}
                <FlatList
                    data={[]} // We're using custom render for nested structure
                    renderItem={null}
                    ListFooterComponent={renderGroups}
                    stickyHeaderIndices={[0]}
                />
            </View>
        </View>
    )
}
