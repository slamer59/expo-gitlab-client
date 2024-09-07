import ListWithFilters from "@/components/ListWithFilters";
import { MergeRequestCard, MergeRequestCardSkeleton } from "@/components/MergeRequest/mr-card";
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

  const UIFilters = [
    {
      label: "State",
      options: [
        {
          value: "opened",
          label: "Opened",
          filter: { state: "opened" },
        },
        { value: "all", label: "All", filter: { state: "all" } },
      ],
      placeholder: "State",
    },
    {
      label: "Milestone",
      options: [
        {
          value: "release",
          label: "Release",
          filter: { milestone: "release" },
        },
      ],
      placeholder: "Milestone",
    },
    {
      label: "Labels",
      options: [
        { value: "bug", label: "Bug", filter: { labels: "bug" } },
        {
          value: "reproduced",
          label: "Reproduced",
          filter: { labels: "reproduced" },
        },
      ],
      placeholder: "Labels",
    },
    {
      label: "Author",
      options: [
        {
          value: "author_id",
          label: "Author ID",
          filter: { author_id: 5 },
        },
        {
          value: "author_username",
          label: "Author Username",
          filter: { author_username: "gitlab-bot" },
        },
      ],
      placeholder: "Author",
    },
    {
      label: "My Reaction Emoji",
      options: [
        {
          value: "star",
          label: "Star",
          filter: { my_reaction_emoji: "star" },
        },
      ],
      placeholder: "Reaction",
    },
    {
      label: "Scope",
      options: [
        {
          value: "assigned_to_me",
          label: "Assigned to Me",
          filter: { scope: "assigned_to_me" },
        },
      ],
      placeholder: "Scope",
    },
    // {
    //   label: 'Search',
    //   options: [
    //     { value: 'title', label: 'Title', filter: { search: '', in: 'title' } },
    //     { value: 'description', label: 'Description', filter: { search: '', in: 'description' } },
    //   ],
    //   placeholder: 'Keyword',
    // },
  ];


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
