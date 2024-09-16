
import ListWithFilters from "@/components/ListWithFilters";
import { MergeRequestCard, MergeRequestCardSkeleton } from "@/components/MergeRequest/mr-card";
import { GlobalMergeRequestUIFilters } from "@/constants/UIFilters";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

export default function MergeRequestsListScreen() {
  const defaultParamsMergeRequests = {
    query: {
      // created_by_me: true,
      state: "all",
      // milestone: "release",
      // labels: "bug",
      // author_id: 5,
      // my_reaction_emoji: "star",
      // scope: "assigned_to_me",
      // search: 'foo',
      // in: 'title',
    },
  };

  const UIFilters = GlobalMergeRequestUIFilters
  const endpoint = "/api/v4/merge_requests"
  const query_cache_name = "merge_requests"
  const pathname = "/workspace/projects/[projectId]/merge-requests/[mr_iid]"

  const paramsMap = {
    projectId: "project_id",
    mr_iid: "iid",
  }

  return (
    <ScrollView className="flex-1 p-2 bg-background">
      <Stack.Screen
        options={{
          title: "Merge Requests",
          // ...defaultOptionsHeader
        }}
      />
      <ListWithFilters
        ItemComponent={MergeRequestCard}
        SkeletonComponent={MergeRequestCardSkeleton}
        endpoint={endpoint}
        query_cache_name={query_cache_name}
        pathname={pathname}
        defaultParams={defaultParamsMergeRequests}
        paramsMap={paramsMap}
        UIFilters={UIFilters}
      />
    </ScrollView>
  );
}
