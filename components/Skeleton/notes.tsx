import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '~/components/ui/skeleton';

const NoteSkeleton = () => (
    <View className="flex-row items-center mb-4">
        <Skeleton className="w-4 h-4 mr-2 rounded-full bg-muted" />
        <Skeleton className="flex-1 h-4 bg-muted" />
    </View>
);

const NoteCommentSkeleton = () => (
    <View className="mb-4">
        <Skeleton className="w-full h-20 mb-2 rounded bg-muted" />
        <View className="flex-row justify-end">
            <Skeleton className="w-6 h-6 mr-2 bg-muted" />
            <Skeleton className="w-6 h-6 mr-2 bg-muted" />
            <Skeleton className="w-6 h-6 bg-muted" />
        </View>
    </View>
);

const NotesSkeleton = ({ noteCount = 5 }) => {
    return (
        <>
            <View className="p-4 mb-2">
                {Array.from({ length: noteCount }).map((_, index) => (
                    <React.Fragment key={index}>
                        {index % 2 === 0 ? <NoteSkeleton /> : <NoteCommentSkeleton />}
                    </React.Fragment>
                ))}
            </View>
        </>
    );
};

export default NotesSkeleton;
