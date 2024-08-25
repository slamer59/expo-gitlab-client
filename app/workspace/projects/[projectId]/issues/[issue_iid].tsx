import { Text } from "@/components/ui/text";
import { getData } from "@/lib/gitlab/client";
import { formatDate } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, View } from "react-native";
enum IssueScreenPopupActions {
  edit,
  reopen,
  close,
  delete,
  share,
  openWeb,
}

interface Issue {
  id: number;
  title: string;
  state: "opened" | "closed" | "merged" | "locked";
  author: any;
  createdAt: string;
  updatedAt: string;
  description?: string;
  labels: string[];
  updated_at: string;
  created_at: string;
  milestone: any;
}

export default function ProjectIssueScreen() {
  const { projectId, issue_iid } = useLocalSearchParams();
  console.log(projectId, issue_iid);
  const handlePopupSelected = (value: IssueScreenPopupActions) => {
    // Handle popup menu item selection
  };
  const params = {
    path: {
      id: projectId,
      issue_iid: issue_iid,
    },
  };
  const { data: issue } = getData<Issue>(
    ["project_issue", params.path],
    `/api/v4/projects/{id}/issues/{issue_iid}`,
    params
  );
  console.log(issue);
  return (
    <ScrollView className="flex-1 bg-white">
      {issue && (
        <>
          <StatusBar style="auto" />
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-300">
            <Text className="text-lg font-bold">{issue.title}</Text>
          </View>
          <View className="p-4">
            <View className="flex-row">
              {issue.state === "opened" ? (
                <Ionicons name="checkmark-circle" size={24} color="green" />
              ) : issue?.state === "closed" ? (
                <Ionicons name="close-circle" size={24} color="red" />
              ) : issue?.state === "locked" ? (
                <Ionicons name="lock-closed" size={24} color="orange" />
              ) : issue?.state === "merged" ? (
                <Ionicons name="git-branch" size={24} color="purple" />
              ) : (
                <Ionicons name="help-circle" size={24} color="blue" />
              )}
              <Text className="text-sm text-gray-600">
                {issue.author.name} opened this issue{" "}
                {formatDate(issue.created_at)}, updated{" "}
                {formatDate(issue.updated_at)}
              </Text>
            </View>
            <Text className="text-base">{issue.description}</Text>
            <Text className="p-4 mb-4 text-base bg-gray-100 border border-gray-300 rounded">
              {issue.milestone.description}
            </Text>
          </View>

          <View className="flex-1 p-4 text-gray-300 ">
            <View className="p-4 mb-4 space-y-4 bg-gray-100 border border-gray-300 rounded">
              <View>
                <Text className="text-lg font-semibold">Assignees</Text>
                <View>
                  {issue?.assignees.length > 0 ? (
                    issue?.assignees.map((assignee) => (
                      <View
                        key={assignee.id}
                        className="flex-row items-center space-x-2"
                      >
                        <Image
                          source={{ uri: assignee.avatar_url }}
                          className="w-8 h-8 rounded-full"
                        />
                        <Text className="text-base">{assignee.name}</Text>
                      </View>
                    ))
                  ) : (
                    <Text>No one assigned</Text>
                  )}
                </View>
              </View>
              <View>
                <Text className="text-lg font-semibold">Labels</Text>
                <View className="flex-row space-x-2">
                  {issue.labels.map((label) => (
                    <Text
                      key={label}
                      className="px-2 py-1 mb-2 mr-2 text-sm font-bold text-gray-700 bg-gray-200 rounded-md"
                    >
                      {label}
                    </Text>
                  ))}
                </View>
              </View>
              {/* <View>
                                <Text className="text-lg font-semibold">Projects</Text>
                                <Text>None yet</Text>
                            </View>
                            <View>
                                <Text className="text-lg font-semibold">Milestone</Text>
                                <Text>No milestone</Text>
                            </View>
                            <View>
                                <Text className="text-lg font-semibold">Development</Text>
                                <Text>No branches or pull requests</Text>
                            </View>
                            <View>
                                <Text className="text-lg font-semibold">Notifications</Text>
                                <View className="flex-row items-center space-x-2">
                                    <TouchableOpacity className="flex-row items-center px-4 py-2 space-x-2 text-gray-300 bg-gray-500 rounded">
                                        <FontAwesome name="bell" size={16} color="white" />
                                        <Text>Subscribe</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text className="mt-2 text-sm">You're not receiving notifications from this thread.</Text>
                            </View> */}

              {/* <View>
                                <Text className="text-lg font-semibold">2 participants</Text>
                                <View className="flex-row space-x-2">
                                    <Image source={{ uri: 'https://placehold.co/32x32' }} alt="Participant 1" className="rounded-full" />
                                    <Image source={{ uri: 'https://placehold.co/32x32' }} alt="Participant 2" className="rounded-full" />
                                </View>
                            </View> */}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}
