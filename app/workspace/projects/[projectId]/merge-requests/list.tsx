import { IssueCard, IssueCardSkeleton } from "@/components/Issue/issue-card";
import ListWithFilters from "@/components/ListWithFilters";
import { GlobalMergeRequestUIFilters } from "@/constants/UIFilters";

import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

export default function ProjectMergeRequestsList() {
  const { projectId } = useLocalSearchParams();
  const defaultParamsProjectPR = {
    // https://docs.gitlab.com/ee/api/merge_requests.html
    path: {
      id: projectId,
    },
    query: {
      // id: 123, // integer or string
      // approved_by_ids: [1, 2, 3], // integer array
      // assignee_id: 456, // integer
      // author_username: 'username', // string
      // created_after: '2022-01-01T00:00:00Z', // datetime
      // labels: 'bug,feature', // string
      // milestone: 'v1.0', // string
      // order_by: 'created_at', // string
      // page: 1, // integer
      // per_page: 20, // integer
      // scope: 'all', // string
      // search: 'search term', // string
      // sort: 'desc', // string
      // state: 'opened', // string
      // view: 'simple', // string
      // wip: 'no', // string
      // with_labels_details: true, // boolean
      // with_merge_status_recheck: false // boolean
    }
  };
  const UIFilters = GlobalMergeRequestUIFilters
  const query_cache_name = `project_id_merge_requests_${projectId}`
  const pathname = "/workspace/projects/[projectId]/merge-requests"
  const endpoint = "/api/v4/projects/{id}/merge_requests"
  const paramsMap = {
    "projectId": "project_id", "mr_iid": "iid"
  }

  return (
    <ScrollView
      className="flex-1 p-2 bg-background"
      contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
    >
      <Stack.Screen
        options={{
          headerTitle: `Merge Requests for Project`,
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
        defaultParams={defaultParamsProjectPR}
      />
    </ScrollView>
  );
}
