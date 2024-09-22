import { formatDate } from "@/lib/utils";

import React from "react";
import { Text, View } from "react-native";
import { Pills } from "../Pills";
import { Skeleton } from "../ui/skeleton";
import IssueStatusIcon from "./issue-status-icon";

export function IssueCardSkeleton() {
  return (
    <View className="flex-row items-center p-4 my-2 space-x-4 rounded-lg bg-card">
      <Skeleton className="w-12 h-12 m-2 space-x-4 rounded-full bg-muted" />
      <View className="flex-1 space-y-2">
        <Skeleton className="w-full h-4 mb-2 bg-muted" />
        <Skeleton className="w-3/4 h-4 bg-muted" />
      </View>
    </View>
  );
}

export function IssueCard({ item }) {

  return (
    <View className="flex-row p-3 mt-2 mb-2 rounded-lg bg-card">
      <View className="mr-2">
        {IssueStatusIcon(item, false)}
      </View>
      <View className="flex-1 mt-1">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-sm text-muted">{item.references.full}</Text>
          <Text className="text-sm text-muted">{formatDate(item.updated_at)}</Text>
        </View>
        <Text className="mb-2 text-lg font-bold text-white" testID={`issue-card`}>{item.title}</Text>
        <View className="flex-row items-center space-x-2">
          {item?.labels.length > 0 && (
            <View className="flex-row flex-wrap">
              {item?.labels.map((label, index) => (
                <Pills
                  key={index}
                  label={label}
                  variant="purple"
                />
              ))}
            </View>
          )}
          {/* Comments */}
          {/* <View className="flex-row items-center">
              {IssueStatusIcon(item, false)}
              <Text className="ml-1 text-sm text-gray-400">2</Text>
            </View> */}
        </View>
      </View>
    </View>
  );
}
