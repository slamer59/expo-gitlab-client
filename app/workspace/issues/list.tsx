import IssuesListWithFilters from "@/components/IssuesListWithFilters";
import { useGetData } from "@/lib/gitlab/hooks";
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
  const {
    data: issues,
    isLoading,
    isError,
    error,
  } = useGetData(["issues", params?.query, params?.path], "/api/v4/issues", params);
  return (
    <ScrollView className="flex-1 m-2">
      <IssuesListWithFilters
        data={issues}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </ScrollView>
  );
}
