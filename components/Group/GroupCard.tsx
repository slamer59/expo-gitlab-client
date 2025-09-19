import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "date-fns";
import { ChevronRight, GitFork, Globe, Lock, Star } from "lucide-react-native";
import React from "react";
import { Image, Pressable, TouchableOpacity, View } from "react-native";

import { Pills } from "../Pills";
import { Text } from "../Themed";

import { Group } from "@/lib/gitlab/types";

interface GroupCardProps {
    group: Group;
    onPress?: () => void;
}

export default function GroupCard({ group, onPress }: GroupCardProps) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View className="flex-row items-center p-4 mb-2 rounded-lg bg-card">
                <View className="mr-3">
                    {group.avatar_url ? (
                        <Image
                            source={{ uri: group.avatar_url }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                    ) : (
                        <View className="items-center justify-center w-10 h-10 rounded-full bg-muted">
                            <Ionicons
                                name={group.has_subgroups ? "folder" : "document-text"}
                                size={24}
                                color="white"
                            />
                        </View>
                    )}
                </View>
                <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-base font-semibold text-foreground">{group.name}</Text>
                        <Text className="text-xs text-muted-foreground">{formatDate(group.last_activity_at)}</Text>
                    </View>
                    {group.description && (
                        <Text className="mb-2 text-sm text-muted-foreground" numberOfLines={2}>
                            {group.description}
                        </Text>
                    )}
                    <View className="flex-row flex-wrap gap-2">
                        <Pills
                            label={group.visibility_level}
                            variant={group.visibility_level === 'private' ? "destructive" : group.visibility_level === 'internal' ? "warning" : "success"}
                            icon={group.visibility_level === 'private' ? <Lock size={14} /> : <Globe size={14} />}
                        />
                        <Pills
                            label={`${group.projects_count} projects`}
                            variant="default"
                            icon={<Star size={14} />}
                        />
                        {group.has_subgroups && (
                            <Pills
                                label="Has subgroups"
                                variant="secondary"
                                icon={<GitFork size={14} />}
                            />
                        )}
                    </View>
                </View>
                <Pressable onPress={onPress}>
                    <ChevronRight size={24} color="#666" />
                </Pressable>
            </View>
        </TouchableOpacity>
    );
}
