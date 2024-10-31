import { Octicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { AvatarWithUrl } from "../ui/avatar-with-url";
import { Skeleton } from "../ui/skeleton";

export function MemberCardSkeleton() {
    return (
        <View className="flex-col w-full p-4 my-2 space-y-2 rounded-lg bg-card">
            <View className="flex-row items-center m-2 space-x-2">
                <Skeleton className="w-10 h-10 rounded-full bg-muted" />
                <View className="ml-2">
                    <View className="flex-row items-center space-x-1">
                        <Skeleton className="w-40 h-5 bg-muted" />
                        <Skeleton className="w-4 h-4 rounded-full bg-muted" />
                    </View>
                    <Skeleton className="w-32 h-4 mt-1 bg-muted" />
                </View>
            </View>
            <View className="space-y-1">
                <Skeleton className="w-32 h-5 bg-muted" />
            </View>
        </View>
    );
}

const AccessLevel: Record<number, string> = {
    0: 'No access',
    5: 'Minimal access',
    10: 'Guest',
    20: 'Reporter',
    30: 'Developer',
    40: 'Maintainer',
    50: 'Owner'
};

interface Member {
    name: string;
    username: string;
    avatar_url: string | null;
    state: string;
    access_level: number;
}

interface MemberCardProps {
    item: Member;
}

export function MemberCard({ item }: MemberCardProps) {
    const initials = item.name.split(' ').map((n: string) => n[0]).join('');

    return (
        <View className="flex-col p-4 my-2 space-y-2 rounded-lg bg-card">
            <View className="flex-row items-center m-2 space-x-2">
                <AvatarWithUrl
                    avatarUrl={item.avatar_url}
                    alt={`${item.name}'s Avatar`}
                    fallbackText={initials}
                />
                <View className="ml-2">
                    <View className="flex-row items-center space-x-1">
                        <Text className="mr-2 text-lg font-bold text-white">{item.name}</Text>
                        <Octicons name={item.state === "active" ? "check-circle" : "circle-slash"} size={16} color={item.state === "active" ? "green" : "red"} />
                    </View>
                    <Text className="text-sm text-muted-foreground">@{item.username}</Text>
                </View>
            </View>
            <View className="space-y-1">
                <Text className="font-semibold text-white text-md">Role: {AccessLevel[item.access_level]}</Text>
            </View>
        </View>
    );
}
