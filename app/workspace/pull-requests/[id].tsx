import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getData } from "@/lib/gitlab/client";
import { APIEntitiesCommit, APIEntitiesMergeRequest } from "@/types/general";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function PullRequestScreen() {
  const { id: PullRequestId, projectId } = useLocalSearchParams();
  console.log(projectId, PullRequestId);
  const url = "/api/v4/projects/{projectId}/merge_requests/{id}";
  const urlCommits = "/api/v4/projects/{projectId}/merge_requests/{id}/commits";
  const params = {
    path: {
      projectId,
      id: PullRequestId,
    },
    query: {},
  };
  const {
    data: pullRequest,
    isLoading,
    isError,
  } = getData<APIEntitiesMergeRequest>(
    ["pullRequest", params.query],
    url,
    params
  );
  const { data: pullRequestCommits } = getData<APIEntitiesCommit[]>(
    ["pullRequestCommits", params.query],
    urlCommits,
    params
  );

  return (
    <ScrollView className="flex-1 m-4 ">
      <Stack.Screen
        options={{
          title: "Pull Request",
        }}
      />
      <View className="h-full flex flex-col gap-4">
        <View className=" bg-gray-200  px-2 py-4 flex flex-col gap-4">
          <Text className="text-lg font-[600]">
            {pullRequest?.references?.full}
          </Text>
          <Text className="text-xl font-[600]">{pullRequest?.title}</Text>

          <View className="flex flex-row items-center gap-2">
            <Avatar alt={pullRequest?.author?.username}>
              <AvatarImage source={{ uri: pullRequest?.author?.avatar_url }} />
              <AvatarFallback>
                <Text>{pullRequest?.author?.username}[0]</Text>
              </AvatarFallback>
            </Avatar>
            <View>
              <Text>{pullRequest?.author?.username}</Text>
            </View>
          </View>
          <View>
            <Text>{pullRequest?.description || "No description provided"}</Text>
          </View>
        </View>
        <SignedView title="Changes">
          <View className=" bg-gray-200  p-2 flex flex-col ">
            <View className="flex flex-row justify-between items-center border-b-[1px] border-gray-400">
              <View className="flex flex-row gap-4 items-center py-2">
                <Ionicons size={20} name="document" />
                <Text>File changed</Text>
              </View>
              <Text>{pullRequest?.changes_count}</Text>
            </View>
            <View className="flex flex-row justify-between items-center">
              <View className="flex flex-row gap-4 items-center py-2">
                <Ionicons size={20} name="git-commit" />
                <Text>Commits</Text>
              </View>
              <Text>{pullRequestCommits?.length}</Text>
            </View>
          </View>
        </SignedView>
        <SignedView title="Merge commits">
          <View className="flex flex-col gap-5 mt-4">
            {pullRequestCommits?.map((item) => (
              <View className="flex flex-row items-center gap-4">
                <Ionicons size={20} name="git-commit" />
                <Text className="flex-1" numberOfLines={1}>
                  {item.title}
                </Text>
              </View>
            ))}
          </View>
        </SignedView>
      </View>
    </ScrollView>
  );
}

export function SignedView({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <View className="flex flex-col gap-2">
      <Text className="text-lg font-[600]">{title}</Text>
      {children}
    </View>
  );
}
