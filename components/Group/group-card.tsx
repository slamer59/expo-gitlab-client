import { formatDate } from "@/lib/utils";
import { Ionicons, Octicons } from '@expo/vector-icons';
import { ChevronRight, LucideComponent } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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

    return (<>
        <View className="flex-row p-3 mt-2 mb-2 rounded-lg bg-card">

            <View className="flex-1 mt-1">
                <View className="flex-row items-center justify-between mb-1">
                    <View className="flex-row items-center">
                        <Text className="mr-2 text-sm text-muted">{item.full_path}</Text>
                        {item.visibility === 'private' && (
                            <Octicons
                                className="mr-2"
                                name="lock"
                                size={16}
                                color="grey"
                            />
                        )}
                        <LucideComponent size={16} color="grey" />
                        <Text className="ml-1 mr-2 text-sm text-gray-400">{item.subgroups?.length || 0}</Text>

                    </View>
                    <Text className="text-sm text-muted">{formatDate(item.created_at)}</Text>
                </View>
                <View className="flex-row items-center justify-between mb-1">

                    <Text className="mb-2 text-lg font-bold text-white" testID={`group-card`}>{item.name}</Text>
                    <View className="flex-row items-center">

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

export const GroupWithSubgroups = ({ group, expandedGroups, toggleGroup, level = 0 }: { group: GitLabGroup, expandedGroups?: any[], toggleGroup?: (groupId: number) => void, level?: number }) => {
    const hasSubgroups = group.subgroups && group.subgroups.length > 0;
    const isExpanded = expandedGroups?.includes(group.id);

    return (
        <>
            <TouchableOpacity
                className="p-4 border-b border-gray-700"
                onPress={() => hasSubgroups && toggleGroup(group.id)}
            >
                <View className="flex-row items-center">
                    {/* Indentation based on level */}
                    {level > 0 && (
                        <View style={{ width: level * 24 }} />
                    )}

                    {/* Expand/Collapse arrow */}
                    {hasSubgroups ? (
                        <>
                            <TouchableOpacity
                                onPress={() => toggleGroup(group.id)}
                                className="flex-row items-center mr-2 jusitfy-center"
                            >
                                <ChevronRight
                                    size={16}
                                    color="#9CA3AF"
                                    style={{
                                        transform: [{ rotate: isExpanded ? '90deg' : '0deg' }]
                                    }}
                                />
                                {/* <Octicons name="people" size={16} color="#9CA3AF" className='ml-2 mr-2' /> */}
                            </TouchableOpacity>
                        </>
                    )
                        :
                        <View className='mr-10' />
                    }

                    {/* Group avatar */}
                    <View className="items-center justify-center w-8 h-8 mr-3 bg-gray-700 rounded-lg">
                        <Text className="text-lg text-white">
                            {group.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>

                    <View className="flex-1">
                        <Text className="mr-2 text-lg text-white">{group.name}</Text>

                    </View>

                    <View className="flex-row items-center gap-4">
                        {/* <View className="flex-row items-center">
                            <Octicons name="star" size={16} color="grey" />
                            <Text className="ml-1 text-gray-400">{group.star_count}</Text>
                        </View> */}

                        {/* <View className="flex-row items-center">
                            <Octicons name="project" size={16} color="grey" />
                            <Text className="ml-1 text-gray-400">{group.subgroups?.length || 0}</Text>
                        </View> */}

                        <View className="flex-row items-center">
                            <LucideComponent size={16} color="grey" />
                            <Text className="ml-1 text-gray-400">{group.subgroups?.length || 0}</Text>
                        </View>


                        {group.visibility === 'private' && (
                            <Octicons name="lock" size={16} color="grey" />
                        )}
                        <TouchableOpacity>
                            <Ionicons
                                name="ellipsis-vertical"
                                size={16}
                                color="grey"
                                // className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`}
                                className={`m-2 ml-2 mr-2 opacity-100'`}
                                testID="options"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Render subgroups if expanded */}
            {isExpanded && group.subgroups?.map(subgroup => (
                <GroupWithSubgroups
                    key={subgroup.id}
                    group={subgroup}
                    level={level + 1}
                />
            ))}
        </>
    );
};