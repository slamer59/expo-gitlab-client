import React from 'react';
import { View } from 'react-native';

import { Skeleton } from '../ui/skeleton';

export const HeaderSkeleton = () => {
    return (
        <View className="mb-4">
            {/* Reference skeleton */}
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                    <Skeleton className="w-8 h-8 mr-2 rounded-full bg-muted" />
                    <Skeleton className="w-24 h-4 bg-muted" />
                </View>
                <Skeleton className="w-20 h-4 bg-muted" />
            </View>

            {/* Title skeleton */}
            <Skeleton className="w-full h-8 mb-2 bg-muted" />

            {/* State pill skeleton */}
            <Skeleton className="w-20 h-6 rounded-full bg-muted" />

            {/* Votes skeleton */}
            <View className="flex-row items-center mt-2">
                {/* Upvotes */}
                <View className="flex-row items-center mr-2">
                    <Skeleton className="w-5 h-5 rounded-full bg-muted" />
                    <Skeleton className="w-8 h-4 ml-1 bg-muted" />
                </View>

                {/* Downvotes */}
                <View className="flex-row items-center mr-2">
                    <Skeleton className="w-5 h-5 rounded-full bg-muted" />
                    <Skeleton className="w-8 h-4 ml-1 bg-muted" />
                </View>
            </View>
        </View>
    );
};