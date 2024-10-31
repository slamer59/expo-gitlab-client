import { useQuery } from '@tanstack/react-query';
import { FlatFilterButton } from 'components/FlatList/FilterSelect';
import { FlatListCards } from 'components/FlatList/FlatListCards';
import { ProjectCard, ProjectCardSkeleton } from 'components/Project/project-card';
import { Text } from 'components/ui/text';
import { GlobalUserStarredProjectsUIFilters } from 'constants/UIFilters';
import { Stack } from 'expo-router';
import { createScreenStore } from 'lib/filter/state';
import GitLabClient from 'lib/gitlab/gitlab-api-wrapper';
import { useSession } from 'lib/session/SessionProvider';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

export default function StarredListScreen() {
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const { data: currentUser, isLoading: isLoadingUser, error: errorUser } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => client.Users.current(),
    });

    const UIFilters = GlobalUserStarredProjectsUIFilters;

    // Move useMemo before any conditional returns
    const useScreenStore = useMemo(() =>
        createScreenStore(
            client.Users.starred_projects,
            currentUser?.id,
            UIFilters
        ),
        [currentUser?.id, UIFilters]
    );

    const { items, loading, filters, error, fetchItems, setFilter } = useScreenStore();

    const pathname = "/workspace/projects/[projectId]";

    const paramsMap = {
        projectId: "id",
    };

    useEffect(() => {
        if (currentUser?.id) {
            fetchItems(true);
        }
    }, [filters, fetchItems, currentUser?.id]);

    const handleLoadMore = useCallback(() => {
        if (!loading) {
            fetchItems();
        }
    }, [loading, fetchItems]);

    if (isLoadingUser) {
        return (
            <View className="items-center justify-center flex-1">
                <Text className="text-foreground" variant="body">Loading user...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-2 bg-background">
            <Stack.Screen
                options={{
                    headerTitle: "⭐ Starred Projects",
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
                            onValueChange={(option) => setFilter(filter.label.toLowerCase(), option.value)}
                        />
                    ))}
                </ScrollView>
                <FlatListCards
                    items={items}
                    handleLoadMore={handleLoadMore}
                    ItemComponent={ProjectCard}
                    SkeletonComponent={ProjectCardSkeleton}
                    pathname={pathname}
                    paramsMap={paramsMap}
                    isLoading={loading}
                    error={error}
                />
            </View>
        </View>
    );
};
