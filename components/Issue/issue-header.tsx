import { getIssueStateColor, IssueState } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { PillProps, Pills } from '../Pills';
import { Skeleton } from '../ui/skeleton';

export const IssueHeaderSkeleton = () => {
    return (
        <View className="mb-4">
            {/* Reference skeleton */}
            <Skeleton className="w-3/4 h-4 mb-2" />

            {/* Title skeleton */}
            <Skeleton className="w-full h-8 mb-2" />

            {/* State pill skeleton */}
            <Skeleton className="w-20 h-6 rounded-full" />

            {/* Votes skeleton */}
            <View className="flex-row items-center mt-2">
                {/* Upvotes */}
                <View className="flex-row items-center mr-2">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="w-8 h-4 ml-1" />
                </View>

                {/* Downvotes */}
                <View className="flex-row items-center mr-2">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="w-8 h-4 ml-1" />
                </View>
            </View>
        </View>
    );
};

const IssueHeader = ({ issue }) => {

    return (
        <View className="mb-4">
            <Text className="mb-2 font-bold text-md text-muted" >
                {issue.references.full}
            </Text>
            <Text className="mb-2 text-4xl font-bold text-white" >
                {issue.title}
            </Text>
            <Pills
                label={issue.state}
                variant={getIssueStateColor(issue.state as IssueState) as unknown as PillProps}
            />
            <View className="flex-row items-center mt-2">
                <TouchableOpacity className="flex-row items-center mr-2">
                    <Ionicons
                        name="thumbs-up-sharp"
                        size={20}
                        color="gray"
                    />
                    <Text className="ml-1 text-gray-500">
                        {issue.upvotes}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center mr-2">
                    <Ionicons
                        name="thumbs-down-sharp"
                        size={20}
                        color="gray"
                    />
                    <Text className="ml-1 text-gray-500">
                        {issue.downvotes}
                    </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity>
                            <FontAwesome6 name="bookmark" size={20} color="gray" />
                        </TouchableOpacity> */}
            </View>

        </View>
    );
};

export default IssueHeader
