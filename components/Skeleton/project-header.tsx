import { Separator } from "@rn-primitives/select";
import React from "react";
import { View } from "react-native";

import { Skeleton } from "../ui/skeleton";


export const ProjectHeaderSkeleton = () => (
    <View className="p-4 m-2 rounded-lg bg-card">
        <View className="flex-row items-center">
            <Skeleton className="w-10 h-10 rounded-full bg-muted" />
            <Skeleton className="w-24 h-4 ml-2 bg-muted" />
        </View>
        <Skeleton className="w-3/4 h-6 mt-2 bg-muted" />

        <Skeleton className="w-full h-4 mt-2 bg-muted" />

        <Separator className="my-4 bg-card " />

        <View className="flex-row items-center p-1">
            <Skeleton className="w-4 h-4 rounded-full bg-muted" />
            <Skeleton className="w-20 h-4 ml-2 bg-muted" />
        </View>

        <View className="flex-row items-center p-1 mt-2">
            <Skeleton className="w-4 h-4 rounded-full bg-muted" />
            <Skeleton className="w-3/4 h-4 ml-3 bg-muted" />
        </View>

        <View className="flex-row p-1 mt-2">
            <View className="flex-row items-center mr-4">
                <Skeleton className="w-4 h-4 rounded-full bg-muted" />
                <Skeleton className="w-8 h-4 ml-3 bg-muted" />
            </View>
            <View className="flex-row items-center mr-4">
                <Skeleton className="w-4 h-4 rounded-full bg-muted" />
                <Skeleton className="w-8 h-4 ml-1 bg-muted" />
            </View>
        </View>

        <Skeleton className="w-16 h-4 mt-2 bg-muted" />
    </View>
);