import { IssueCard, IssueCardSkeleton } from "@/components/Issue/issue-card";
import ListWithFilters from "@/components/ListWithFilters";
import { GlobalMergeRequestUIFilters } from "@/constants/UIFilters";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";

import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

export default function ProjectMergeRequestsList() {
  const { session } = useSession();
  const client = new GitLabClient({
    url: session?.url,
    token: session?.token,
  });

  const api = useGitLab(client);
  const { projectId } = useLocalSearchParams();
  const defaultParamsProjectPR = {
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
  };
  const UIFilters = GlobalMergeRequestUIFilters
  const pathname = "/workspace/projects/[projectId]/merge-requests/[mr_iid]"
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
        projectId={projectId}
        queryFn={api.useProjectMergeRequests}
        ItemComponent={IssueCard}
        SkeletonComponent={IssueCardSkeleton}
        pathname={pathname}


        paramsMap={paramsMap}
        defaultParams={defaultParamsProjectPR}
      />
    </ScrollView>
  );
}
