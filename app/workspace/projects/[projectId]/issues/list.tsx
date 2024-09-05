import { useGetData } from "@/lib/gitlab/hooks";
import { IssuesListComponent } from "@/models/issuesList";
import { APIEntitiesRelatedIssue } from "@/types/general";

import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

export default function IssuesList() {
  const { projectId } = useLocalSearchParams();
  const params = {
    path: {
      id: projectId,
    },
    query: {
      // scope: "all",
      // state: "opened",
      // order_by: "created_at",
      // created_by_me: true,
      // assigned_to_me: false,
      // issue_type: "issue",
    },
  };

  const { data: issues } = useGetData<APIEntitiesRelatedIssue[]>(
    ["issues_of_project", params.query],
    "/api/v4/projects/{id}/issues",
    params
  );

  // const { data: labelColors } = useGetData<any>(
  //   ["label_colors_of_project", params.query],
  //   "/api/v4/projects/{id}/labels",
  //   params
  // );
  return (
    <ScrollView className="flex-1 m-auto">
      <Stack.Screen
        options={{
          title: "Issues",
        }}
      />
      {/* <TopFilterList
        filters={filters}
        setSelectedFilters={setSelectedFilters}
        selectedFilters={selectedFilters}
        clearFilters={clearFilters}
      /> */}
      {issues && <IssuesListComponent
        issues={issues}
      // labelColors={labelColors}
      />}
    </ScrollView>
  );
}
