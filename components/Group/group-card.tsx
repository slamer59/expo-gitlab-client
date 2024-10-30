import { formatDate } from "@/lib/utils";
import { Octicons } from '@expo/vector-icons';
import { ChevronRight, LucideComponent } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { Pills } from "../Pills";
import { Skeleton } from '../ui/skeleton';

export interface GitLabGroup {
    id: number;
    name: string;
    path: string;
    visibility: string;
    avatar_url: string | null;
    star_count: number;
    forks_count: number;
    members_count: number;
    subgroups?: GitLabGroup[];
    parent_id: number | null;
    created_at?: string;
}

// interface GroupCardProps {
//     item: GitLabGroup;
// }

export function GroupCardSkeleton() {
    return (
        <View className="flex-row items-center p-4 my-2 space-x-4 rounded-lg bg-card">
            <Skeleton className="w-12 h-12 m-2 space-x-4 rounded-full bg-muted" />
            <View className="flex-1 space-y-2">
                <Skeleton className="w-full h-4 mb-2 bg-muted" />
                <Skeleton className="w-3/4 h-4 bg-muted" />
            </View>
        </View>
    );
}

export function GroupCard({ item }) {
    const hasSubgroups = item.subgroups && item.subgroups.length > 0;

    return (<>
        <View className="flex-row p-3 mt-2 mb-2 rounded-lg bg-card">
            <View className="mr-2">
                {hasSubgroups && <ChevronRight size={16} color="#9CA3AF" />}
            </View>
            <View className="flex-1 mt-1">
                <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-sm text-muted">{item.full_path}</Text>
                    <Text className="text-sm text-muted">{formatDate(item.created_at)}</Text>
                </View>
                <View className="flex-row items-center justify-between mb-1">

                    <Text className="mb-2 text-lg font-bold text-white" testID={`group-card`}>{item.name}</Text>
                    <View className="flex-row items-center">
                        <LucideComponent size={16} color="grey" />
                        <Text className="ml-1 mr-2 text-sm text-gray-400">{item.subgroups?.length || 0}</Text>
                        {item.visibility === 'private' && (
                            <Octicons name="lock" size={16} color="grey" />
                        )}
                    </View>

                </View>
                <View className="flex-row items-center space-x-2">
                    <Pills
                        label={item.visibility}
                        variant="purple"
                    />
                </View>
            </View>
        </View>
    </>
    );
}
