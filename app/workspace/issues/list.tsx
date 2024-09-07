import { IssueCard, IssueCardSkeleton } from "@/components/Issue/issue-card";
import ListWithFilters from "@/components/ListWithFilters";
import { GlobalIssueUIFilters } from "@/constants/UIFilters";
import React from "react";
import { ScrollView } from "react-native";


export default function IssuesListScreen() {
  const params = {
    query: {
      // scope: "all",
      // state: "opened",
      // order_by: "created_at",
      created_by_me: false,
      // assigned_to_me: false,
      // issue_type: "issue",
    },
  };
  // const {
  //   data: issues,
  //   isLoading,
  //   isError,
  //   error,
  // } = useGetData(["issues", params?.query, params?.path], "/api/v4/issues", params);

  const UIFilters = GlobalIssueUIFilters;


  return (
    <ScrollView className="flex-1 m-2">
      <ListWithFilters
        title="Issues"
        UIFilters={UIFilters}
        ItemComponent={IssueCard}
        SkeletonComponent={IssueCardSkeleton}
        pathname="/workspace/projects/[projectId]/issues/[issue_iid]"
        endpoint="/api/v4/issues"
        cache_name="issues"
        paramsMap={{
          "projectId": "project_id", "issue_iid": "iid"
        }}
        params={params}
      />
    </ScrollView>
  );
}
