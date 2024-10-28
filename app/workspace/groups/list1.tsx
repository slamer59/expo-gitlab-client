import { FlatFilterButton } from 'components/FlatList/FilterSelect';
import { FlatListCards } from 'components/FlatList/FlatListCards';
import { GroupCard, GroupCardSkeleton } from 'components/Group/GroupCard';
import { GlobalGroupUIFilters } from 'constants/UIFilters';
import { Stack, useRouter } from 'expo-router';
import { createScreenStore } from 'lib/filter/state';
import GitLabClient from 'lib/gitlab/gitlab-api-wrapper';
import { useSession } from 'lib/session/SessionProvider';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

export interface GroupItem {
    id: number;
    name: string;
    path_with_namespace: string;
    description?: string;
    visibility: string;
    parent_id?: number;
    avatar_url?: string;
    star_count: number;
    forks_count: number;
    open_issues_count: number;
    merge_requests_enabled: boolean;
    last_activity_at: string;
    subgroups_count?: number;
}

export interface ProcessedGroupItem extends GroupItem {
    level: number;
}

export default function GroupsScreen() {
    const { session } = useSession();
    const router = useRouter();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const UIFilters = GlobalGroupUIFilters;

    const fetchGroups = useCallback(async (params: Record<string, any>) => {
        try {
            const groups = await client.Groups.all({
                ...params,
                with_custom_attributes: true,
                include_custom_attributes: true,
                with_statistics: true,
                statistics: true
            });

            // Fetch subgroups count for each group
            const groupsWithSubgroupsCount = await Promise.all(
                groups.map(async (group: GroupItem) => {
                    const subgroups = await client.Groups.subgroups(group.id);
                    return {
                        ...group,
                        subgroups_count: subgroups.length
                    };
                })
            );

            return groupsWithSubgroupsCount;
        } catch (error) {
            console.error('Error fetching groups:', error);
            return [];
        }
    }, [client]);

    const useScreenStore = useMemo(() => createScreenStore(
        fetchGroups,
        undefined,
        UIFilters
    ), [fetchGroups]);

    const { items, loading, filters, fetchItems, setFilter } = useScreenStore();

    const processedItems = useMemo(() => {
        if (!items) return [];

        const itemMap = new Map<number, ProcessedGroupItem>();
        items.forEach((item: GroupItem) => {
            itemMap.set(item.id, { ...item, level: 0 });
        });
        return Array.from(itemMap.values());
    }, [items]);

    const handleGroupPress = useCallback((group: ProcessedGroupItem) => {
        if (group.subgroups_count && group.subgroups_count > 0) {
            router.push('/workspace/groups/list');
        } else {
            router.push(`/workspace/groups/${group.id}`);
        }
    }, [router]);

    useEffect(() => {
        fetchItems(true);
    }, [filters, fetchItems]);

    const handleLoadMore = useCallback(() => {
        if (!loading) {
            fetchItems();
        }
    }, [loading, fetchItems]);

    const handleRefresh = useCallback(() => {
        fetchItems(true);
    }, [fetchItems]);

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen
                options={{
                    headerTitle: "Groups",
                }}
            />
            <View className="flex-1">
                <ScrollView horizontal className='px-2 mb-2'>
                    {UIFilters.map((filter, index) => (
                        <FlatFilterButton
                            key={index}
                            options={filter.options}
                            placeholder={filter.placeholder}
                            selectedValue={filters[filter.label.toLowerCase()]}
                            onValueChange={(value: string) => setFilter(filter.label.toLowerCase(), value)}
                        />
                    ))}
                </ScrollView>
                <FlatListCards
                    items={processedItems}
                    handleLoadMore={handleLoadMore}
                    ItemComponent={GroupCard}
                    SkeletonComponent={GroupCardSkeleton}
                    onItemPress={handleGroupPress}
                    useScreenStore={useScreenStore}
                    handleRefresh={handleRefresh}
                    isLoading={loading}
                />
            </View>
        </View>
    );
}
