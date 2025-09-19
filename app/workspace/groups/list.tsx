
import { Stack } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { FlatFilterButton } from '@/components/FlatList/FilterSelect';
import { FlatListCards } from '@/components/FlatList/FlatListCards';
import { GroupCard, GroupCardSkeleton } from '@/components/Group/group-card';
import { GlobalGroupUIFilters } from '@/constants/UIFilters';
import { createScreenStore } from '@/lib/filter/state';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';


export default function GroupsScreen() {
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const UIFilters = GlobalGroupUIFilters;
    const useScreenStore = useMemo(() => createScreenStore(client.Groups.all, undefined, UIFilters), []);
    const { items, loading, filters, error, fetchItems, setFilter } = useScreenStore();
    const pathname = "/workspace/groups/[groupId]"
    const paramsMap = { "groupId": "id" }

    useEffect(() => {
        fetchItems(true);
    }, [filters, fetchItems]);

    const handleLoadMore = useCallback(() => {
        if (!loading) {
            fetchItems();
        }
    }, [loading, fetchItems]);
    // const loading1 = true
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
                <ScrollView horizontal className='px-2'>
                    {UIFilters.map((filter, index) => (
                        <FlatFilterButton
                            key={index}
                            options={filter.options}
                            placeholder={filter.placeholder}
                            selectedValue={filters[filter.label]}
                            onValueChange={(option) => setFilter(filter.label, option)}
                        />
                    ))}
                </ScrollView>
                <FlatListCards
                    items={items}
                    ItemComponent={GroupCard}
                    SkeletonComponent={GroupCardSkeleton}
                    pathname={pathname}
                    paramsMap={paramsMap}
                    isLoading={loading}
                    error={error}
                    handleLoadMore={handleLoadMore}
                />
            </View>
        </View >
    );
}
