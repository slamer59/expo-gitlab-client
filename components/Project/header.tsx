import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export const ProjectHeader = ({ repository }) => (
    <View className="p-2 m-4">
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
                    <Ionicons name="folder-outline" size={28} color="gray" />
                </AvatarFallback>
            </Avatar>
            <Text className="ml-2 text-lg font-bold text-light dark:text-slate-500">
                {repository?.owner?.name ||
                    repository?.namespace?.name ||
                    "Default name"}
            </Text>
        </View>
        <Text className="text-2xl font-bold">
            {repository.name}
        </Text>
        <Text className="text-base ">{repository.description}</Text>
        <View className="flex-row items-center">
            <Ionicons name="lock-closed-outline" size={16} color="black" />
            <Text className="ml-4 text-lg font-bold text-light dark:text-black">
                {repository.visibility || "Default vis"}
            </Text>
        </View>
        <Link
            className="flex w-full overflow-hidden"
            asChild
            href={repository.web_url}
        >
            <TouchableOpacity className="flex-row items-center mr-4">
                <Ionicons name="link" size={16} color="black" />
                <Text
                    numberOfLines={1}
                    className="ml-4 text-lg font-bold break-normal text-ellipsis text-light dark:text-black"
                >
                    {repository.web_url}
                </Text>
            </TouchableOpacity>
        </Link>
        <View className="flex-row">
            <View className="flex-row items-center mr-4 text-lg font-bold text-light dark:text-black">
                <Ionicons name="star" size={16} color="gold" />
                <Text className="ml-1 font-bold">
                    {repository.star_count || 0}
                </Text>
                <Text> stars</Text>
            </View>
            <View className="flex-row items-center mr-4 text-lg font-bold text-light dark:text-black">
                <Ionicons name="git-network" size={16} color="red" />
                <Text className="ml-1 font-bold">{repository.forks_count}</Text>
                <Text> forks</Text>
            </View>
        </View>
        <Text>{repository.language}</Text>
    </View>
);