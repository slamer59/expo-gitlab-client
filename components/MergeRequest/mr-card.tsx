
import React from "react";
import { Text, View } from "react-native";

import { formatDate } from "@/lib/utils";

import { Pills } from "../Pills";
import { Skeleton } from "../ui/skeleton";

import MergeStatusIcon from "./mr-status-icon";

export function MergeRequestCardSkeleton() {
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

export function MergeRequestCard({ item }) {

  return (
    <View className="flex-row p-3 mt-2 mb-2 rounded-lg bg-card">
      <View className="mr-2">
        {MergeStatusIcon(item, false)}
      </View>
      <View className="flex-1 mt-1">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-sm text-muted">{item.references.full}</Text>
          <Text className="text-sm text-muted">{formatDate(item.updated_at)}</Text>
        </View>
        <Text className="mb-2 text-lg font-bold text-white" testID={`mr-card`}>{item.title}</Text>
        <View className="flex-row items-center space-x-2">
          {item?.labels.length > 0 && (
            <View className="flex-row flex-wrap">
              {item?.labels.map((label, index) => (
                <Pills
                  label={label}
                  key={index}
                  variant="purple"
                />
              ))}
            </View>
          )}
          {/* Comments */}
          {/* <View className="flex-row items-center">
              {MergeRequestStatusIcon(item, false)}
              <Text className="ml-1 text-sm text-gray-400">2</Text>
            </View> */}
        </View>
        {/* <View className="flex-row p-3 mt-2 mb-2 rounded-lg bg-card">
          <View className="mr-2">
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
        </View> */}
      </View>
    </View>
  );
}
