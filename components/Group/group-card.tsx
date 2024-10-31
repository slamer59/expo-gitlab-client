import { formatDate } from "@/lib/utils";
import { Ionicons, Octicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { LucideComponent } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Separator } from "../ui/separator";
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

export function GroupCard({ item, children }: { item: GitLabGroup, children?: React.ReactNode }) {

    return (<>
        <View className="flex-row p-3 mt-2 mb-2 rounded-lg bg-card">
            <View className="flex-1 mt-1">
                <View className="flex-row items-start justify-between">
                    {item.expanded !== undefined && (
                        <>
                            <View className="mt-1">
                                <Ionicons
                                    className="mr-2"
                                    name={item.expanded ? 'chevron-up' : 'chevron-down'}
                                    size={24}
                                    color="#666"
                                />
                            </View>
                            <Separator orientation='vertical' className="mr-2 bg-muted" />
                        </>
                    )}
                    <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                            <View className="flex-row items-center">
                                <Text className="mr-2 text-sm text-muted">{item.full_path}</Text>
                                {item.visibility === 'private' && (
                                    <Octicons
                                        className="ml-2 mr-2"
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
                        {/* <View className="flex-row items-center space-x-2">
                            <Pills
                                label={item.visibility}
                                variant="purple"
                            />
                        </View> */}
                        {children}
                    </View>

                </View>
            </View>
        </View>
    </>
    );
}

export const GroupWithSubgroupsVariant = ({ item, children }: { group: GitLabGroup, children?: React.ReactNode }) => {

    return (
        <>
            <GroupCard item={item} >
                {children}
            </GroupCard>

        </>
    );
};
export const GroupWithSubgroups = ({ group, expandedGroups, toggleGroup, level = 0 }: { group: GitLabGroup, expandedGroups?: any[], toggleGroup?: (groupId: number) => void, level?: number }) => {
    const hasSubgroups = group.subgroups && group.subgroups.length > 0;
    const isExpanded = expandedGroups?.includes(group.id);
    const router = useRouter()

    const handleGroupPress = () => {
        router.push(`/workspace/groups/${group.id}`);
    };

    return (
        <>
            <View className={`${hasSubgroups && "mt-2 mb-2"}`}>
                <View className="p-2 rounded-lg bg-card">
                    <View className="flex-1 mt-1">
                        <View className="flex-row items-start justify-between">
                            {hasSubgroups ? (
                                <>
                                    <TouchableOpacity
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            toggleGroup(group.id);
                                        }}
                                        className="flex-row items-center justify-center mr-2"
                                    >
                                        {/* <ChevronRight
                                            size={16}
                                            color="grey"
                                            style={{
                                                transform: [{ rotate: isExpanded ? '90deg' : '0deg' }]
                                            }}
                                        /> */}

                                        <View className="mt-1">
                                            <Ionicons
                                                className="mr-2"
                                                name={group.expanded ? 'chevron-up' : 'chevron-down'}
                                                size={24}
                                                color="#666"
                                            />
                                        </View>

                                    </TouchableOpacity>
                                    <Separator orientation='vertical' className="mr-2 bg-muted" />

                                </>
                            ) :
                                <View className="w-12 h-8" />
                            }

                            <View className="flex-1">
                                <TouchableOpacity
                                    onPress={handleGroupPress}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center">
                                            <Text className="mr-2 text-sm text-muted">{group.full_path}</Text>
                                            {group.visibility === 'private' && (
                                                <Octicons
                                                    className="mr-2"
                                                    name="lock"
                                                    size={16}
                                                    color="grey"
                                                />
                                            )}
                                            <LucideComponent size={16} color="grey" />
                                            <Text className="ml-1 mr-2 text-sm text-gray-400">{group.subgroups?.length || 0}</Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <Text className="text-sm text-muted">{formatDate(group.created_at)}</Text>
                                            <TouchableOpacity
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    // Handle ellipsis press
                                                }}
                                            >
                                                <Ionicons
                                                    name="ellipsis-vertical"
                                                    size={16}
                                                    color="grey"
                                                    className="m-2 ml-2 mr-2 opacity-100"
                                                    testID="options"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Text className="mb-1 text-lg font-bold text-white" testID={`group-card`}>{group.name}</Text>
                                </TouchableOpacity>
                                {/* Render subgroups if expanded */}
                                {isExpanded && group.subgroups?.map(subgroup => (
                                    <View className="pl-2 mb-2 border-t border-gray-700">
                                        <GroupWithSubgroups
                                            key={subgroup.id}
                                            group={subgroup}
                                            expandedGroups={expandedGroups}
                                            toggleGroup={toggleGroup}
                                            level={level + 1}
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
};


