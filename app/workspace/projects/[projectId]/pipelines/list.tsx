import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { FlatFilterButton } from '@/components/FlatList/FilterSelect';
import { FlatListCards } from '@/components/FlatList/FlatListCards';
import { PipelineCard, PipelineCardSkeleton } from '@/components/Pipeline/pipeline-card';
import { GlobalPipelinesUIFilters } from '@/constants/UIFilters';
import { createScreenStore } from '@/lib/filter/state';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';


export default function ProjectPipelineList() {
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const { projectId } = useLocalSearchParams();
    const UIFilters = GlobalPipelinesUIFilters
    const useScreenStore = useMemo(() => createScreenStore(client.Pipelines.all, projectId, UIFilters), []);
    const { items, loading, filters, error, fetchItems, setFilter } = useScreenStore();

    const pathname = "/workspace/projects/[projectId]/pipelines/[iid]"
    const paramsMap = {
        "projectId": "project_id", "iid": "id"
    }

    useEffect(() => {
        // reset(); // Reset the store when the component mounts
        fetchItems(true);
    }, [filters, fetchItems]);


    const handleLoadMore = useCallback(() => {
        if (!loading) {
            fetchItems();
        }
    }, [loading, fetchItems]);

    return (
        <View
            className="flex-1 p-2 bg-background"
        >
            <Stack.Screen
                options={{
                    headerTitle: `Pipelines for Project`,
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
                    ItemComponent={PipelineCard}
                    SkeletonComponent={PipelineCardSkeleton}
                    pathname={pathname}
                    paramsMap={paramsMap}
                    isLoading={loading}
                    error={error}
                />

            </View>
        </View>
    );


};