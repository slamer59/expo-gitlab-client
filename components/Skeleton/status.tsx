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
                    <Skeleton className="w-5 h-5 rounded-full bg-muted" />
                    <Skeleton className="w-24 h-4 ml-2 bg-muted" />
                </View>
                <Skeleton className="w-5 h-5 bg-muted" />
            </View>
        </View>
    );
};

export default StatusItemSkeleton;
