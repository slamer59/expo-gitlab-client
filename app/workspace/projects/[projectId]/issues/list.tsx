import { getData } from "@/lib/gitlab/hooks";
import { getToken } from "@/lib/utils";
import { IssuesListComponent } from "@/models/issuesList";
import { APIEntitiesRelatedIssue } from "@/types/general";

import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

export default function IssuesList() {
  const { projectId } = useLocalSearchParams();
  const toekn = getToken();
  console.log(projectId);
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

  const { data: issues } = getData<APIEntitiesRelatedIssue[]>(
    ["issues_of_project", params.query],
    "/api/v4/projects/{id}/issues",
    params
  );
  console.log(issues, 9999999);
  return (
    <ScrollView className="flex-1 m-2">
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
      {issues && <IssuesListComponent issues={issues} />}
    </ScrollView>
  );
}
