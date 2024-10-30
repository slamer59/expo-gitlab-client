import { GroupWithSubgroups } from '@/components/Group/group-card';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';

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

    const toggleGroup = (groupId: number) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };



    const filteredGroups = groups?.filter(group =>
        group.name.toLowerCase()
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
            <GroupWithSubgroups key={group.id} group={group} expandedGroups={expandedGroups} toggleGroup={toggleGroup} />
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
                            onValueChange={(option) => setFilter(filter.label, option)}
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
    );
}
