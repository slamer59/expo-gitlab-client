import { formatDate } from "@/lib/utils";

import React from "react";
import { Text, View } from "react-native";
import { Pills } from "../Pills";
import { Skeleton } from "../ui/skeleton";
import PipelineStatusIcon from "./pipeline-status-icon";

export function PipelineCardSkeleton() {
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

export function PipelineCard({ item }) {
    console.log("PipelineCard item:", item);
    return (
        <View className="flex-row p-3 mt-2 mb-2 rounded-lg bg-card">
            <View className="mr-2">
                {PipelineStatusIcon(item, false)}
            </View>
            <View className="flex-1 mt-1">
                <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-sm text-muted">{item.ref}</Text>
                    <Text className="text-sm text-muted">{formatDate(item.updated_at)}</Text>
                </View>
                <Text className="mb-2 text-lg font-bold text-white" testID={`pipeline-card`}>{`Pipeline #${item.iid}`}</Text>
                <View className="flex-row items-center space-x-2">
                    <Pills
                        label={item.status}
                        variant={item.status === 'success' ? 'green' : 'purple'}
                    />
                    <Text className="text-sm text-muted">{`SHA: ${item.sha.substring(0, 8)}`}</Text>
                </View>
            </View>

        </View>
    );
}
