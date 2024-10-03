import { IssueCard, IssueCardSkeleton } from "@/components/Issue/issue-card";
import ListWithFilters from "@/components/ListWithFilters";
import { GlobalIssueUIFilters } from "@/constants/UIFilters";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { extractDefaultFilters, extractDefaultUIOptions } from "@/lib/utils";

import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

export default function ProjectIssuesList() {
  const { session } = useSession();
  const client = new GitLabClient({
    url: session?.url,
    token: session?.token,
  });

  const api = useGitLab(client);
  const { projectId } = useLocalSearchParams();

  const UIFilters = GlobalIssueUIFilters;
  const defaultParams = extractDefaultFilters(UIFilters);
  const defaultUIFilterValues = extractDefaultUIOptions(UIFilters);
  const pathname = "/workspace/projects/[projectId]/issues/[issue_iid]"
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
        }}
      />
      <ListWithFilters
        UIFilters={UIFilters}
        itemId={projectId}
        queryFn={api.useProjectIssues}
        ItemComponent={IssueCard}
        SkeletonComponent={IssueCardSkeleton}
        pathname={pathname}
        paramsMap={paramsMap}
        defaultParams={defaultParams}
        defaultUIFilterValues={defaultUIFilterValues}
      />
    </ScrollView>
  );
}
