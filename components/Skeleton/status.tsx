import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '~/components/ui/skeleton';

interface StatusItemSkeletonProps {
    expandable?: boolean;
}

const StatusItemSkeleton: React.FC<StatusItemSkeletonProps> = () => {
    return (
        <View className="mb-2">
            <View className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center">
                    <Skeleton className="w-5 h-5 rounded-full" /> {/* Icon skeleton */}
                    <Skeleton className="w-24 h-4 ml-2" /> {/* Text skeleton */}
                </View>
                <Skeleton className="w-5 h-5" /> {/* Chevron skeleton */}
            </View>
        </View>
    );
};

export default StatusItemSkeleton;
