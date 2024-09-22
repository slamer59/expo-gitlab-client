import { IssueCard, IssueCardSkeleton } from "@/components/Issue/issue-card";
import ListWithFilters from "@/components/ListWithFilters";
import { GlobalIssueUIFilters } from "@/constants/UIFilters";

import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

export default function ProjectIssuesList() {
  const { projectId } = useLocalSearchParams();
  const defaultParamsProjectIssues = {
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
  const pathname = "/workspace/projects/[projectId]/issues/[issue_iid]"
  const endpoint = "/api/v4/projects/{id}/issues"
  const query_cache_name = `project_id_${projectId}`
  const paramsMap = {
    "projectId": "project_id", "issue_iid": "iid"
  }


  return (
    <ScrollView
      className="flex-1 p-2 bg-background"
      contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
    >
      <Stack.Screen
        options={{
          headerTitle: "Issues for Project",
          // ...defaultOptionsHeader
          // headerRight: () => (
          //   <Link href={`/workspace/projects/${projectId}/issues/new`}>
          //     <Button size="sm" variant="primary">
          //       New Issue
          //     </Button>
          //   </Link>
          // ),
        }}
      />
      <ListWithFilters
        UIFilters={UIFilters}
        ItemComponent={IssueCard}
        SkeletonComponent={IssueCardSkeleton}
        pathname={pathname}
        endpoint={endpoint}
        query_cache_name={query_cache_name}
        paramsMap={paramsMap}
        defaultParams={defaultParamsProjectIssues}
      />
    </ScrollView>
  );
}
