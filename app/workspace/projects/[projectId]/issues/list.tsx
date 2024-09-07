import { IssueCard, IssueCardSkeleton } from "@/components/Issue/issue-card";
import ListWithFilters from "@/components/ListWithFilters";
import { GlobalIssueUIFilters } from "@/constants/UIFilters";
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
  const UIFilters = GlobalIssueUIFilters;

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
    <ScrollView className="flex-1 m-2">
      <ListWithFilters
        title="Issues"
        UIFilters={UIFilters}
        ItemComponent={IssueCard}
        SkeletonComponent={IssueCardSkeleton}
        pathname="/workspace/projects/[projectId]/issues/[issue_iid]"
        endpoint="/api/v4/projects/{id}/issues"
        cache_name={`project_id_${projectId}`}
        paramsMap={{
          "projectId": "project_id", "issue_iid": "iid"
        }}
        params={params}
      />
    </ScrollView>
  );
}
