import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '~/components/ui/skeleton';

const ButtonListSkeleton = ({ itemCount = 3 }) => {
    return (
        <View>
            {Array.from({ length: itemCount }).map((_, index) => (
                <View key={index} className="flex-row items-center mt-2">
                    <Skeleton className="w-10 h-10 mr-2 rounded-lg bg-muted" />
                    <Skeleton className="flex-1 h-5 mr-2 bg-muted" />
                    <Skeleton className="w-5 h-5 rounded-full bg-muted" />
                </View>
            ))}
        </View>
    );
};

const WorkspaceButtonListSkeleton = () => {
    return (
        <View className="p-4 mt-4 mb-4 rounded-lg bg-card-600">
            <Skeleton className="w-24 h-6 mb-4 bg-muted" />
            <ButtonListSkeleton itemCount={3} />
        </View>
    );
};

export default WorkspaceButtonListSkeleton;
