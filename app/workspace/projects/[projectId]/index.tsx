import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";

import { CodeSection } from "@/components/Project/code-section";
import { ProjectHeader } from "@/components/Project/header";
import { WorkspaceSection } from "@/components/Project/workspaceSection";
import { ProjectHeaderSkeleton } from "@/components/Skeleton/project-header";
import SectionSkeleton from "@/components/Skeleton/section";
import { getCodeSectionItems } from "@/hooks/getCodeSectionItems";
import { getWorkspaceItems } from "@/hooks/getWorkspaceItems";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { headerRightProject } from "./headerRight";

export default function ProjectDetailsScreen() {
  const { session } = useSession();
  const [selectedBranch, setSelectedBranch] = useState("");
  const { projectId } = useLocalSearchParams();
  const router = useRouter();

  const client = new GitLabClient({
    url: session?.url,
    token: session?.token,
  });

  const api = useGitLab(client);

  const [
    { data: project, isLoading: isLoadingProject, error: errorProject },
    { data: repository, isLoading: isLoadingRepository, error: errorRepository },
    { data: mergeRequests, isLoading: isLoadingMergeRequests, error: errorMergeRequests },
    { data: branches, isLoading: isLoadingBranches, error: errorBranches },
    { data: members, isLoading: isLoadingMembers, error: errorMembers },
  ] = api.useProjectDetails(projectId);

  if (errorProject || errorRepository || errorMergeRequests || errorBranches || errorMembers) {
    return <Text>An error has occurred: {errorProject?.message || errorRepository?.message || errorMergeRequests?.message || errorBranches?.message || errorMembers?.message}</Text>;
  }

  const isLoading = isLoadingProject || isLoadingRepository || isLoadingMergeRequests || isLoadingBranches || isLoadingMembers;

  let branchesName, defaultBranchName, listItems, listItemsSecond;
  if (!isLoading) {
    branchesName = branches?.map(branch => branch.name);
    defaultBranchName = branches?.find(branch => branch.default)?.name || branches[0]?.name;
    listItems = getWorkspaceItems({ project, mergeRequests, members }, router);
    listItemsSecond = getCodeSectionItems(project, router);
  }

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen options={{
        title: "",
        headerRight: headerRightProject(project),
      }} />
      <ScrollView
        className="flex-1 p-2 bg-card"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {isLoadingProject ? <ProjectHeaderSkeleton /> : <ProjectHeader repository={project} />}
        {isLoadingRepository || isLoadingMergeRequests || isLoadingMembers ?
          <SectionSkeleton /> :
          <WorkspaceSection listItems={listItems} />
        }
        {isLoadingRepository || isLoadingBranches ?
          <SectionSkeleton /> :
          <CodeSection
            selectedBranch={selectedBranch}
            defaultBranchName={defaultBranchName}
            branchesName={branchesName}
            handleValueChange={setSelectedBranch}
            listItemsSecond={listItemsSecond}
          />
        }
      </ScrollView>
    </SafeAreaView>
  );
}
