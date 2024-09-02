import { IssueCard, IssueCardSkeleton } from "@/components/ui/issue-card";
import { TopFilterList } from "@/components/ui/top-filter-list";
import { getData } from "@/lib/gitlab/client";
import { IssuesListComponent } from "@/models/issuesList";
import { PullRequestListComponent } from "@/models/pullRequests/pullRequestList";
import {
  APIEntitiesMergeRequest,
  APIEntitiesRelatedIssue,
} from "@/types/general";
import { Link, Stack } from "expo-router";
import React, { useState } from "react";
import { ScrollView } from "react-native";

export default function IssuesListScreen() {
  const [params, setParams] = useState({
    query: {},
  });
  function updateParams(filterValues: any) {
    setParams((prev) => ({
      ...prev,
      query: {
        ...params.query,
        ...filterValues,
      },
    }));
    refetch();
  }

  const filters = [
    {
      label: "Pull Requests",
      options: [
        { value: "all", label: "All ", filter: { all: 1 } },
        { value: "opened", label: "Opened", filter: { state: "opened" } },
        { value: "closed", label: "Closed", filter: { state: "closed" } },
      ],
      placeholder: "State",
    },
  ];

  const [selectedFilters, setSelectedFilters] = useState({});

  const { data: pullRequestsList, refetch } = getData<
    APIEntitiesMergeRequest[]
  >(["pullRequestsList", params.query], `/api/v4/merge_requests`, params);
  const clearFilters = () => {
    setSelectedFilters({});
  };

  return (
    <ScrollView className="flex-1 m-2">
      <Stack.Screen
        options={{
          title: "Pull requests",
        }}
      />
      <TopFilterList
        filters={filters}
        setSelectedFilters={(val) => {
          setSelectedFilters(val);

          updateParams({ state: val?.["Pull Requests"].value });
        }}
        selectedFilters={selectedFilters}
        clearFilters={clearFilters}
      />
      {pullRequestsList && (
        <PullRequestListComponent pullRequests={pullRequestsList} />
      )}
    </ScrollView>
  );
}
