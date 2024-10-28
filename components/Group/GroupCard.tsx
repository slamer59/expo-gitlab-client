import { Octicons } from '@expo/vector-icons';
import { formatDate } from 'lib/utils';
import { ChevronRight, GitFork, GitPullRequest, Globe, Lock, Star } from 'lucide-react-native';
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { GroupItem } from "../../app/workspace/groups/list1";
import { Pills } from "../Pills";
import { Skeleton } from "../ui/skeleton";

interface GroupCardProps {
    item: GroupItem;
    onPress?: (item: GroupItem) => void;
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

export function GroupCard({ item, onPress }: GroupCardProps) {
    const handlePress = () => {
        if (onPress) {
            onPress(item);
        }
    };

    if (!item) {
        return null;
    }

    return (
        <Pressable onPress={handlePress}>
            <View className="flex-row items-center p-4 my-1 rounded-lg bg-card">
                <View className="mr-3">
                    {item.avatar_url ? (
                        <Image
                            source={{ uri: item.avatar_url }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                    ) : (
                        <View className="items-center justify-center w-10 h-10 rounded-full bg-muted">
                            <Octicons name="repo" size={24} color="white" />
                        </View>
                    )}
                </View>
                <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-base font-semibold text-foreground">{item.name}</Text>
                        <Text className="text-xs text-muted-foreground">{formatDate(item.last_activity_at)}</Text>
                    </View>
                    <Text className="mb-2 text-sm text-muted-foreground">{item.path_with_namespace}</Text>
                    <View className="flex-row flex-wrap gap-2">
                        <Pills
                            label={item.visibility}
                            variant={item.visibility === 'private' ? "destructive" : item.visibility === 'internal' ? "warning" : "success"}
                            icon={item.visibility === 'private' ? <Lock size={14} /> : <Globe size={14} />}
                        />
                        <Pills
                            label={`${item.star_count} stars`}
                            variant="default"
                            icon={<Star size={14} />}
                        />
                        <Pills
                            label={`${item.forks_count} forks`}
                            variant="secondary"
                            icon={<GitFork size={14} />}
                        />
                        {item.merge_requests_enabled && (
                            <Pills
                                label="MR enabled"
                                variant="success"
                                icon={<GitPullRequest size={14} />}
                            />
                        )}
                    </View>
                    {item.description && (
                        <Text className="mt-2 text-sm text-muted-foreground" numberOfLines={2}>
                            {item.description}
                        </Text>
                    )}
                </View>
                {item.subgroups_count && item.subgroups_count > 0 && (
                    <View className="ml-2">
                        <ChevronRight size={20} className="text-muted-foreground" />
                    </View>
                )}
            </View>
        </Pressable>
    );
}
