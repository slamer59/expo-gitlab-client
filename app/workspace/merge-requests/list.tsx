import ListWithFilters from "@/components/ListWithFilters";
import { MergeRequestCard, MergeRequestCardSkeleton } from "@/components/MergeRequest/mr-card";
import { GlobalMergeRequestUIFilters } from "@/constants/UIFilters";
import React from "react";
import { ScrollView } from "react-native";

export default function MergeRequestsListScreen() {
  const params = {
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


  return (
    <ScrollView className="flex-1 m-2">
      <ListWithFilters
        title="Merge Requests"
        ItemComponent={MergeRequestCard}
        SkeletonComponent={MergeRequestCardSkeleton}
        endpoint="/api/v4/merge_requests"
        cache_name="merge_requests"
        pathname="/workspace/projects/[projectId]/merge-requests/[mr_iid]"
        params={params}
        paramsMap={{
          projectId: "project_id",
          mr_iid: "iid",
        }}
        UIFilters={UIFilters}
      />
    </ScrollView>
  );
}
