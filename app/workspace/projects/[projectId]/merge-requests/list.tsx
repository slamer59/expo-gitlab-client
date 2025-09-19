import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { FlatFilterButton } from '@/components/FlatList/FilterSelect';
import { FlatListCards } from '@/components/FlatList/FlatListCards';
import { MergeRequestCard, MergeRequestCardSkeleton } from '@/components/MergeRequest/mr-card';
import { GlobalMergeRequestUIFilters } from '@/constants/UIFilters';
import { createScreenStore } from '@/lib/filter/state';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';


export default function ProjectMergeRequestsList() {
  const { session } = useSession();
  const client = new GitLabClient({
    url: session?.url,
    token: session?.token,
  });

  const { projectId } = useLocalSearchParams();
  const UIFilters = GlobalMergeRequestUIFilters
  const useScreenStore = useMemo(() => createScreenStore(client.ProjectMergeRequests.all, projectId, UIFilters), []);
  const { items, loading, filters, error, fetchItems, setFilter } = useScreenStore();

  const pathname = "/workspace/projects/[projectId]/merge-requests/[mr_iid]"
  const paramsMap = {
    "projectId": "project_id", "mr_iid": "iid"
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
          headerTitle: `Merge Requests for Project`,
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
          ItemComponent={MergeRequestCard}
          SkeletonComponent={MergeRequestCardSkeleton}
          pathname={pathname}
          paramsMap={paramsMap}
          isLoading={loading}
          error={error}
        />

      </View>
    </View>
  );


};