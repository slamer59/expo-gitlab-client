import { FlatFilterButton } from '@/components/FlatList/FilterSelect';
import { FlatListCards } from '@/components/FlatList/FlatListCards';
import { createScreenStore } from '@/lib/filter/state';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { CommitCard, CommitCardSkeleton } from '@/components/Commit/commit-card';

export default function CommitsList() {
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const UIFilters = [
        {
            label: 'Branch',
            placeholder: 'Select Branch',
            options: [
                { label: 'All Branches', value: '' },
                { label: 'Main', value: 'main' },
                { label: 'Develop', value: 'develop' },
                // Add more branches as needed
            ],
        },
    ];

    const { projectId } = useLocalSearchParams();

    const useScreenStore = useMemo(() => createScreenStore(client.Commits.all, projectId, UIFilters), []);
    const { items, loading, filters, error, fetchItems, setFilter } = useScreenStore();
    const pathname = "/workspace/projects/[projectId]/commits/[sha]";
    const paramsMap = {
        "projectId": "project_id", "sha": "sha"
    }

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
        <View className="flex-1 p-2 bg-background">
            <Stack.Screen
                options={{
                    headerTitle: "Commits",
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
                            onValueChange={(value: string) => setFilter(filter.label.toLowerCase(), value)}
                        />
                    ))}
                </ScrollView>

                <FlatListCards
                    items={items}
                    handleLoadMore={handleLoadMore}
                    handleRefresh={handleRefresh}
                    ItemComponent={CommitCard}
                    SkeletonComponent={CommitCardSkeleton}
                    pathname={pathname}
                    paramsMap={paramsMap}
                    isLoading={loading}
                    error={error}
                />

            </View>
        </View>
    );
}
