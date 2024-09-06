import { formatDate } from "@/lib/utils";

import React from "react";
import { Text, View } from "react-native";
import IssueStatusIcon from "./issue-status-icon";
import { Skeleton } from "./skeleton";

export function IssueCardSkeleton() {
  return (
    <View className="flex-row items-center p-4 space-x-4">
      <Skeleton className="w-12 h-12 m-2 space-x-4 rounded-full" />
      <View className="flex-1 space-y-2">
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-3/4 h-4" />
      </View>
    </View>
  );
}

export function IssueCard({ item }) {
  // console.log(issue);
  return (
    <View className="flex-row items-start m-4">
      <View className="flex-row items-center m-2">
        {IssueStatusIcon(item, false)}
      </View>
      <View className="space-y-1 flex-2">
        <Text className="text-light dark:text-dark">
          {item.references.full}
        </Text>
        <Text className="text-lg font-bold">{item.title}</Text>
        {item?.labels.length > 0 && (
          <View className="flex-row flex-wrap">
            {item?.labels.map((label) => (
              <Text
                key={label}
                className="mr-2 text-sm font-bold text-gray-700 bg-gray-200 rounded-md"
              >
                {label}
              </Text>
            ))}
          </View>
        )}
      </View>
      <View className="items-end flex-1">
        <Text className="text-xs text-light dark:text-dark">
          {formatDate(item.updated_at)}
        </Text>
      </View>
    </View>
  );
}
