import { useSession } from "@/lib/session/SessionProvider";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text } from "react-native";

import { IListItems } from "@/components/buttonList";
import Loading from "@/components/Loading";
import { CodeSection } from "@/components/Project/code-section";
import { ProjectHeader } from "@/components/Project/header";
import { WorkspaceSection } from "@/components/Project/workspaceSection";
import { getCodeSectionItems } from "@/hooks/getCodeSectionItems";
import { getWorkspaceItems } from "@/hooks/getWorkspaceItems";
import { fetchUrl } from "@/lib/utils";


// Main component
export default function ProjectDetailsScreen() {
  const { session } = useSession();
  const [selectedBranch, setSelectedBranch] = useState("");
  const { projectId } = useLocalSearchParams();
  const router = useRouter();

  const selfQuery = useQuery({
    queryKey: ["self"],
    queryFn: () =>
      fetchUrl(
        `https://gitlab.com/api/v4/projects/${projectId}`,
        session.token,
      ),
    retry: false,
    onError: (error) => {
      console.error(`Error fetching self:`, error);
    },
  });
  let urls = selfQuery.data?._links || {};
  // filter URL  in self, merge_requests, repo_branches, members
  urls = Object.fromEntries(
    Object.entries(urls).filter(([key]) =>
      ["self", "merge_requests", "repo_branches", "members"].includes(key),
    ),
  );

  const otherQueries = useQueries({
    queries: Object.entries(urls).map(([key, url]) => ({
      queryKey: [key, url],
      queryFn: () => fetchUrl(url, session.token),
      retry: false,
      enabled: !!selfQuery.data,
      onError: (error) => {
        console.error(`Error fetching ${key} from ${url}:`, error);
      },
    })),
  });

  if (selfQuery.isLoading || otherQueries.some((query) => query.isLoading)) {
    return <Loading />;
  }

  if (selfQuery.error) {
    return <Text>An error has occurred: {selfQuery.error.message}</Text>;
  }

  if (otherQueries.some((query) => query.error)) {
    return <Text>An error has occurred while fetching data.</Text>;
  }

  const urlData = otherQueries.reduce((acc, query, index) => {
    const key = Object.keys(urls)[index];
    if (query.data) {
      acc[key] = query.data;
    }
    return acc;
  }, {});

  const repository = urlData["self"];
  const mergeRequest = urlData["merge_requests"];
  const repoBranches = urlData["repo_branches"];
  const members = urlData["members"];

  const repoBranchesName = repoBranches.map((branch) => branch.name);
  const defaultBranchName =
    (repoBranches.find((branch) => branch.default) || {}).name ||
    repoBranches[0]?.name;

  const listItems: IListItems[] = getWorkspaceItems(
    { repository, mergeRequest, members },
    router,
  );

  const listItemsSecond = getCodeSectionItems(repository, router);

  const handleValueChange = (value) => {
    setSelectedBranch(value);
  };

  return (
    <ScrollView className="flex-1 p-2 bg-background">
      <Stack.Screen options={{
        title: "Project Details",
        // ...defaultOptionsHeader 
      }} />
      < ProjectHeader repository={repository} />
      <WorkspaceSection listItems={listItems} />
      <CodeSection
        selectedBranch={selectedBranch}
        defaultBranchName={defaultBranchName}
        repoBranchesName={repoBranchesName}
        handleValueChange={handleValueChange}
        listItemsSecond={listItemsSecond}
      />
    </ScrollView>
  );
}