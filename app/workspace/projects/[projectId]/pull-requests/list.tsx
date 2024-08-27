import { getData } from "@/lib/gitlab/client";
import { getToken } from "@/lib/utils";
import { IssuesListComponent } from "@/models/issuesList";
import { PullRequestListComponent } from "@/models/pullRequests/pullRequestList";
import {
  APIEntitiesMergeRequest,
  APIEntitiesRelatedIssue,
} from "@/types/general";

import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

export default function IssuesList() {
  const { projectId } = useLocalSearchParams();

  const params = {
    path: {
      id: projectId,
    },
    query: {},
  };

  const { data: prList } = getData<APIEntitiesMergeRequest[]>(
    ["pr_of_project", params.query],
    "/api/v4/projects/{id}/merge_requests",
    params
  );

  return (
    <ScrollView className="flex-1 m-2 ">
      <Stack.Screen
        options={{
          title: "Pull Requests",
        }}
       
      />
      {/* <TopFilterList
        filters={filters}
        setSelectedFilters={setSelectedFilters}
        selectedFilters={selectedFilters}
        clearFilters={clearFilters}
      /> */}
      {prList && <PullRequestListComponent pullRequests={prList} />}
    </ScrollView>
  );
}
