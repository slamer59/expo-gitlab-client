import { useQueries, useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";

import { getCodeSectionItems } from "@/hooks/getCodeSectionItems";
import { getWorkspaceItems } from "@/hooks/getWorkspaceItems";
import { useSession } from "@/lib/session/SessionProvider";
import { fetchUrl } from "@/lib/utils";

import Loading from "@/components/Loading";
import { CodeSection } from "@/components/Project/code-section";
import { ProjectHeader } from "@/components/Project/header";
import { WorkspaceSection } from "@/components/Project/workspaceSection";
import { ProjectHeaderSkeleton } from "@/components/Skeleton/project-header";
import SectionSkeleton from "@/components/Skeleton/section";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { headerRightProject } from "./headerRight";

const RELEVANT_URLS = ["self", "merge_requests", "repo_branches", "members"];

export default function ProjectDetailsScreen() {
  const { session } = useSession();
  const [selectedBranch, setSelectedBranch] = useState("");
  const { projectId } = useLocalSearchParams();
  const router = useRouter();

  const client = new GitLabClient({
    url: session?.url,
    token: session?.token,
  });

  const { data: selfData, isLoading: isSelfLoading, error: selfError } = useQuery({
    queryKey: ["self"],
    queryFn: () => fetchUrl(`https://gitlab.com/api/v4/projects/${projectId}`, session.token),
    retry: false,
  });

  const urls = selfData?._links ?
    Object.fromEntries(Object.entries(selfData._links).filter(([key]) => RELEVANT_URLS.includes(key))) :
    {};

  const otherQueries = useQueries({
    queries: Object.entries(urls).map(([key, url]) => ({
      queryKey: [key, url],
      queryFn: () => fetchUrl(url, session.token),
      retry: false,
      enabled: !!selfData,
    })),
  });
  const isLoading = otherQueries.some((query) => query.isLoading);
  const isError = otherQueries.find((query) => query.error);

  if (isSelfLoading || isLoading) return <Loading />;
  if (selfError || isError) return <Text>An error has occurred: {selfError?.message || isError?.message}</Text>;

  const urlData = otherQueries.reduce((acc, query, index) => {
    const key = Object.keys(urls)[index];
    if (query.data) acc[key] = query.data;
    return acc;
  }, {});

  const { self: repository, merge_requests: mergeRequest, repo_branches: repoBranches, members } = urlData;

  const repoBranchesName = repoBranches?.map(branch => branch.name);
  const defaultBranchName = repoBranches?.find(branch => branch.default)?.name || repoBranches[0]?.name;

  const listItems = getWorkspaceItems({ repository, mergeRequest, members }, router);
  const listItemsSecond = getCodeSectionItems(repository, router);

  if (isError || selfError) {
    return <Error error={error} />
  }
  const isLoadingTest = true
  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen options={{
        title: "",
        headerRight: headerRightProject(
          selfData
        ),
      }} />
      <ScrollView
        className="flex-1 p-2 bg-card"
        contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom

      >
        <>
          {isSelfLoading ? <ProjectHeaderSkeleton /> :
            <ProjectHeader repository={repository} />
          }
          {isLoading ? <SectionSkeleton /> :
            <WorkspaceSection listItems={listItems} />
          }
          {isLoading ? <SectionSkeleton /> : <CodeSection
            selectedBranch={selectedBranch}
            defaultBranchName={defaultBranchName}
            repoBranchesName={repoBranchesName}
            handleValueChange={setSelectedBranch}
            listItemsSecond={listItemsSecond}
          />}
        </>
      </ScrollView>
    </SafeAreaView >
  );
}
