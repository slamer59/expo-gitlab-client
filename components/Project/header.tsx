import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "../ui/separator";

export function ProjectHeader({ repository }) {
    return <>
        <View className="m-4">
            <View className="flex-row items-center">
                <Avatar alt={`${repository?.owner?.name}'s Avatar`}>
                    <AvatarImage
                        source={{
                            uri:
                                repository?.owner?.avatar_url ||
                                repository?.namespace?.avatar_url ||
                                "https://example.com/default-avatar.jpg",
                        }}
                    />
                    <AvatarFallback>
                        <Ionicons name="folder-outline" size={28} color="white" />
                    </AvatarFallback>
                </Avatar>
                <Text className="ml-2 font-bold text-md text-muted">
                    {repository?.owner?.name ||
                        repository?.namespace?.name ||
                        "Default name"}
                </Text>
            </View>
            <Text className="p-1 text-2xl font-bold text-white">
                {repository.name}
            </Text>
            {repository.description &&
                <Text className="pl-1 text-muted">{repository.description}</Text>
            }
            <Separator className="my-4 bg-card-600" />
            <View className="flex-row items-center p-1">
                <Ionicons name="lock-closed-outline" size={18} color="white" />
                <Text className="ml-2 font-bold text-md text-muted">
                    {(repository.visibility || "Default visibility").charAt(0).toUpperCase() + (repository.visibility || "Default visibility").slice(1)}
                </Text>
            </View>
            <Link
                className="flex w-full p-1 overflow-hidden"
                asChild
                href={repository?.web_url || "https://example.com/default-url"}
            >
                <TouchableOpacity className="flex-row items-center mr-4">
                    <Ionicons name="link" size={16} color="white" />
                    <Text
                        numberOfLines={1}
                        className="ml-3 font-bold text-white break-normal text-md text-ellipsis"
                    >
                        {repository.path_with_namespace}
                    </Text>
                </TouchableOpacity>
            </Link>
            <View className="flex-row p-1">
                <View className="flex-row items-center mr-4 text-lg font-bold text-white">
                    <Ionicons name="star" size={16} color="gold" />
                    <Text className="ml-3 font-bold text-white">
                        {repository.star_count || 0}
                    </Text>
                    <Text className="text-white"> stars</Text>
                </View>
                <View className="flex-row items-center mr-4 text-lg font-bold text-white">
                    <Ionicons name="git-network" size={16} color="red" />
                    <Text className="ml-1 font-bold text-white">{repository.forks_count}</Text>
                    <Text className="text-white"> forks</Text>
                </View>
            </View>
            {repository.language &&
                <Text>{repository.language}</Text>
            }

        </View>
    </>
}