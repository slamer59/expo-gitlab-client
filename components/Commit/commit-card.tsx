import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { Text, View } from 'react-native';

import { formatDate } from "@/lib/utils";

import { Skeleton } from '../ui/skeleton';


export const CommitCardSkeleton = () => {
    return (
        <View className="flex-row items-center p-4 my-2 space-x-4 rounded-lg bg-card">
            <Skeleton className="w-12 h-12 m-2 space-x-4 rounded-full bg-muted" />
            <View className="flex-1 space-y-2">
                <Skeleton className="w-full h-4 mb-2 bg-muted" />
                <Skeleton className="w-3/4 h-4 bg-muted" />
            </View>
        </View>
    );
};

export const CommitCard = ({ item }: { item: any }) => {
    return (
        <View className="flex-row p-3 mt-2 mb-2 rounded-lg bg-card">
            <View className="mr-2">
                <Ionicons name="person-circle-outline" size={32} color="white" />
            </View>
            <View className="flex-1 mt-1">
                <Text className="mb-2 text-lg font-bold text-white" numberOfLines={2} testID={`commit-card`}>{item.title}</Text>

                <Text className=" text-foreground">{item.short_id}</Text>
                <Text className="text-xs text-muted">{item.author_name} </Text>
            </View>
            <Text className="text-sm text-muted">{formatDate(item.created_at)}</Text>
        </View >
    );
};