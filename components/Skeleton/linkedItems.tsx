import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '~/components/ui/skeleton';

export const LinkedItemSkeleton = () => {
    return (
        <View className='p-4 mb-4 border border-dashed rounded-2xl border-primary bg-card-600'>
            <View className='flex-row items-center justify-between mb-4'>
                <Skeleton className='w-1/3 h-6 bg-muted' />
                <Skeleton className='w-10 h-6 rounded bg-muted' />
            </View>

            {/* Issue items skeletons */}
            {[1, 2, 3].map((_, index) => (
                <View key={index} className='flex-row items-center mt-2'>
                    <View className='flex-row items-center flex-1 mr-2'>
                        <Skeleton className='w-5 h-5 mr-2 rounded-full bg-muted' />
                        <Skeleton className='flex-1 h-5 bg-muted' />
                    </View>
                    <Skeleton className='w-16 h-4 bg-muted' />
                </View>
            ))}
        </View>
    );
};


