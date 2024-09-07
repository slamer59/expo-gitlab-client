import IssuesListWithFilters from "@/components/ListWithFilters";
import { useGetData } from "@/lib/gitlab/hooks";
import { APIEntitiesRelatedIssue } from "@/types/general";

import { useLocalSearchParams } from "expo-router";
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

  const {
    data: issues,
    isLoading,
    isError,
    error,
  } = useGetData<APIEntitiesRelatedIssue[]>(
    [`issues_of_project_${projectId}`, params.query],
    `/api/v4/projects/${projectId}/issues`,
    params,
  );

  return (
    <ScrollView className="flex-1 m-auto">
      <IssuesListWithFilters
        data={issues}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </ScrollView>
  );
}
