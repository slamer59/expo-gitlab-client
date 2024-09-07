import { IssueCard, IssueCardSkeleton } from "@/components/Issue/issue-card";
import ListWithFilters from "@/components/ListWithFilters";
import { GlobalMergeRequestUIFilters } from "@/constants/UIFilters";

import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

export default function MergeRequestsList() {
  const { projectId } = useLocalSearchParams();
  const params = {
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


  return (
    <ScrollView className="flex-1 m-2">
      <ListWithFilters
        title="Merge Requests"
        UIFilters={UIFilters}
        ItemComponent={IssueCard}
        SkeletonComponent={IssueCardSkeleton}
        pathname="/workspace/projects/[projectId]/merge-requests"
        endpoint="/api/v4/projects/{id}/merge_requests"
        cache_name={`project_id_merge_requests_${projectId}`}
        paramsMap={{
          "projectId": "project_id", "mr_iid": "iid"
        }}
        params={params}
      />
    </ScrollView>
  );
}
