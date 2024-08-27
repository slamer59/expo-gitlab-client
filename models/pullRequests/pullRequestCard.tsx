import { formatDate } from "@/lib/utils";
import { APIEntitiesMergeRequest } from "@/types/general";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export function PullRequestCard({
  pullRequestItem,
}: {
  pullRequestItem: APIEntitiesMergeRequest;
}) {
  const isMerged = pullRequestItem.detailed_merge_status;
  const checkColor = (merge_status: string = "draft_status") => {
    switch (merge_status) {
      case "draft_status":
        return "#ababab";
      case "not_open":
        return "#000000";
      case "conflict":
        return "#FF0000";
      case "checking":
        return "#eeff00";
      case "mergeable":
        return "#00FF00";
      default:
        return "#ababab";
    }
  };
  console.log(pullRequestItem.detailed_merge_status);
  return (
    <View className="flex flex-row items-center gap-2 px-2">
      <Ionicons
        color={checkColor(pullRequestItem.detailed_merge_status)}
        size={40}
        name="git-pull-request-outline"
      ></Ionicons>
      <View className="flex-row items-start flex-1 p-4 space-x-4 cursor-pointer justify-between   flex ">
        <View className="space-y-1  ">
          <Text className="text-lg font-bold">
            {pullRequestItem.references.full}
          </Text>
          <Text className="text-light dark:text-dark">
            {pullRequestItem.title_html}
          </Text>
          {/* {[1,2]?.labels.length > 0 && (
          <View className="flex-row flex-wrap mb-4">
            {issue?.labels.map((label) => (
              <Text
                key={label}
                className="px-2 py-1 mb-2 mr-2 text-sm font-bold text-gray-700 bg-gray-200 rounded-md"
              >
                {label}
              </Text>
            ))}
          </View>
        )} */}
        </View>
        <View className="items-end">
          <Text className="text-xs text-light dark:text-dark">
            {formatDate(pullRequestItem.updated_at || "")}
          </Text>
        </View>
      </View>
    </View>
  );
}
