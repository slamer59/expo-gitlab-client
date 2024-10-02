import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";

import { HeaderAction, HeaderOption, HeaderRight } from "@/components/HeaderRight";
import { CodeSection } from "@/components/Project/code-section";
import { ProjectHeader } from "@/components/Project/header";
import { WorkspaceSection } from "@/components/Project/workspaceSection";
import { ProjectHeaderSkeleton } from "@/components/Skeleton/project-header";
import SectionSkeleton from "@/components/Skeleton/section";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getCodeSectionItems } from "@/hooks/getCodeSectionItems";
import { getWorkspaceItems } from "@/hooks/getWorkspaceItems";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { shareView } from "@/lib/utils";

export default function ProjectDetailsScreen() {
  const { session } = useSession();
  const { projectId } = useLocalSearchParams();
  const router = useRouter();

  const client = new GitLabClient({
    url: session?.url,
    token: session?.token,
  });

  const api = useGitLab(client);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);


  const [
    { data: project, isLoading: isLoadingProject, error: errorProject },
    { data: repository, isLoading: isLoadingRepository, error: errorRepository },
    { data: mergeRequests, isLoading: isLoadingMergeRequests, error: errorMergeRequests },
    { data: branches, isLoading: isLoadingBranches, error: errorBranches },
    { data: members, isLoading: isLoadingMembers, error: errorMembers },
    { data: pipelines, isLoading: isLoadingPipelines, error: errorPipelines },
  ] = api.useProjectDetails(projectId);

  if (errorProject || errorRepository || errorMergeRequests || errorBranches || errorMembers) {
    return <Text>An error has occurred: {errorProject?.message || errorRepository?.message || errorMergeRequests?.message || errorBranches?.message || errorMembers?.message}</Text>;
  }

  const isLoading = isLoadingProject || isLoadingRepository || isLoadingMergeRequests || isLoadingBranches || isLoadingMembers || isLoadingPipelines

  let branchesName, defaultBranchName, listItems, listItemsSecond;
  if (!isLoading) {
    branchesName = branches?.map(branch => branch.name);
    defaultBranchName = branches?.find(branch => branch.default)?.name || branches[0]?.name;
    listItems = getWorkspaceItems({ project, mergeRequests, members, pipelines }, router);
    listItemsSecond = getCodeSectionItems(project, router);
  }


  // Action Options
  const archiveProjectMutation = api.useArchiveProject();
  const unArchiveProjectMutation = api.useUnarchiveProject();

  const archiveProject = async () => {
    archiveProjectMutation.mutateAsync(projectId, {
      onError: (error, variables, context) => {
        if (error.toString().includes('403')) {
          setAlertVisible(true);
        }
      },
    });
  };
  const unarchiveProject = async () => unArchiveProjectMutation.mutateAsync(projectId);

  const headerActions: HeaderAction[] = [
    {
      icon: "share-social-outline",
      onPress: () => shareView(project.web_url),
      testID: "share-button"
    },
    {
      icon: "add",
      onPress: () => router.push(`/workspace/projects/${project.id}/issues/create`),
      testID: "create-issue-button"
    }
  ];

  const headerOptions: HeaderOption[] = [
    {
      icon: "pencil",
      label: "Edit Project",
      onPress: () => router.push(`/workspace/projects/${project.id}/edit`),
      testID: "project-edit-option"
    },
    {
      icon: "git-pull-request-outline",
      color: "#3e64ed",
      label: "Create Merge Request",
      onPress: () => router.push(`/workspace/projects/${project.id}/merge-requests/create`),
      testID: "create-mr-option"
    },
    {
      icon: project?.archived ? "archive-outline" : "archive",
      color: project?.archived ? "#3e64ed" : "#ffa500",
      label: project?.archived ? "Unarchive Project" : "Archive Project",
      onPress: () => project?.archived ? unarchiveProject() : archiveProject(),
      testID: "toggle-archive-option"
    },
    {
      icon: "trash-outline",
      color: "#ff0000",
      label: "Delete Project",
      onPress: () => console.log("pressed"),//deleteProject(),
      testID: "delete-project-option"
    }
  ];


  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen options={{
        title: "",
        headerRight: () => (
          <HeaderRight
            actions={headerActions}
            options={headerOptions}
            dropdownLabel="Project Options"
          />)
      }} />
      <ScrollView
        className="flex-1 p-2 bg-card"
        contentContainerStyle={{ paddingBottom: 100 }}
      >

        <AlertDialog open={alertVisible} >
          <AlertDialogContent >
            <AlertDialogHeader>
              <AlertDialogTitle>Permission Denied</AlertDialogTitle>
              <AlertDialogDescription>
                You do not have permission to archive this project.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter >
              <AlertDialogCancel onPress={() => setAlertVisible(false)}>
                <Text className="text-primary bg-card-500">Close</Text>
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
    </SafeAreaView >
  );
}

