import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../ui/skeleton';

export const CommentSkeleton = () => {
    return (
        <View className="p-4 mt-4 mb-4 rounded-lg bg-card-600">
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                    <Skeleton className="w-8 h-8 mr-2 rounded-full bg-muted" />
                    <Skeleton className="w-24 h-4 bg-muted" />
                </View>
                <Skeleton className="w-20 h-4 bg-muted" />
            </View>

            {/* Title skeleton */}
            <Skeleton className="w-3/4 h-5 mb-2 bg-muted" />

            {/* Description/body skeleton */}
            <View className="mb-4">
                <Skeleton className="w-full h-4 mb-2 bg-muted" />
                <Skeleton className="w-full h-4 mb-2 bg-muted" />
                <Skeleton className="w-3/4 h-4 mb-2 bg-muted" />
                <Skeleton className="w-1/2 h-4 bg-muted" />
            </View>

            {/* Action buttons skeleton */}
            <View className="flex-row justify-end">
                <Skeleton className="w-6 h-6 mr-4 bg-muted" />
                <Skeleton className="w-6 h-6 mr-4 bg-muted" />
                <Skeleton className="w-6 h-6 bg-muted" />
            </View>
        </View>
    );
};
