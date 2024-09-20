import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProjectHeaderSkeleton = () => (
    <View className="p-4 m-2 rounded-lg bg-card">
        <View className="flex-row items-center">
            <View className="w-10 h-10 bg-gray-300 rounded-full" />
            <View className="w-1/3 h-5 ml-2 bg-gray-300 rounded" />
        </View>
        <View className="w-2/3 h-8 mt-2 bg-gray-300 rounded" />
        <View className="w-full h-4 mt-2 bg-gray-300 rounded" />
        <View className="flex-row items-center mt-2">
            <View className="w-4 h-4 bg-gray-300 rounded-full" />
            <View className="w-1/4 h-4 ml-2 bg-gray-300 rounded" />
        </View>
        <View className="w-full h-6 mt-2 bg-gray-300 rounded" />
        <View className="flex-row mt-2">
            <View className="w-1/4 h-4 mr-4 bg-gray-300 rounded" />
            <View className="w-1/4 h-4 bg-gray-300 rounded" />
        </View>
        <View className="w-1/3 h-4 mt-2 bg-gray-300 rounded" />
    </View>
);
export function ProjectHeader({ repository, isLoading }) {
    if (isLoading) {
        return <ProjectHeaderSkeleton />;
    }

    return <View className="m-4">
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
        <Text className="p-2 text-2xl font-bold text-white">
            {repository.name}
        </Text>

        <View className="flex-row items-center">
            <Ionicons name="lock-closed-outline" size={18} color="white" />
            <Text className="ml-2 text-lg font-bold text-muted">
                {(repository.visibility || "Default visibility").charAt(0).toUpperCase() + (repository.visibility || "Default visibility").slice(1)}
            </Text>
        </View>
        <Link
            className="flex w-full overflow-hidden"
            asChild
            href={repository.web_url}
        >
            <TouchableOpacity className="flex-row items-center mr-4">
                <Ionicons name="link" size={16} color="white" />
                <Text
                    numberOfLines={1}
                    className="ml-3 text-lg font-bold text-white break-normal text-ellipsis"
                >
                    {repository.web_url}
                </Text>
            </TouchableOpacity>
        </Link>
        <View className="flex-row">
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
        <Text>{repository.language}</Text>
        <Text className="text-white">{repository.description}</Text>
    </View>
}