import { FlatFilterButton } from '@/components/FlatList/FilterSelect';
import { FlatListCards } from '@/components/FlatList/FlatListCards';
import { IssueCard, IssueCardSkeleton } from '@/components/Issue/issue-card';
import { GlobalIssueUIFilters } from '@/constants/UIFilters';
import { createScreenStore } from '@/lib/filter/state';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { extractDefaultUIOptions } from '@/lib/utils';
import { Stack } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';



const GitLabProjectsList = () => {
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const PROJECT_ID = '59853773';

    const useScreenStore = useMemo(() => createScreenStore(client.ProjectIssues.all, PROJECT_ID), []);
    const { items, loading, filters, error, fetchItems, setFilter } = useScreenStore();
    const UIFilters = GlobalIssueUIFilters;
    const defaultUIFilterValues = extractDefaultUIOptions(UIFilters);


    const pathname = "/workspace/projects/[projectId]/issues/[issue_iid]"
    const paramsMap = {
        "projectId": "project_id", "issue_iid": "iid"
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
        <View
            className="flex-1 p-2 bg-background"
        >
            <Stack.Screen
                options={{
                    headerTitle: "Issues",
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
                    useScreenStore={useScreenStore}
                    handleLoadMore={handleLoadMore}
                    handleRefresh={handleRefresh}
                    ItemComponent={IssueCard}
                    SkeletonComponent={IssueCardSkeleton}
                    pathname={pathname}
                    paramsMap={paramsMap}
                    isLoading={loading}
                    error={error}
                />

            </View>
        </View>
    );


};

export default GitLabProjectsList;