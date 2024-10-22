import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from 'react';
import { View } from 'react-native';
const MemberSkeleton = () => (
    <View className="flex-row items-center mb-4">
        <Skeleton className="w-12 h-12 rounded-full bg-muted" />
        <View className="flex-1 ml-3">
            <Skeleton className="w-24 h-4 mb-2 bg-muted" />
            <Skeleton className="w-16 h-3 bg-muted" />
        </View>
    </View>
);

const getAccessLevelColor = (accessLevel: number) => {
    if (accessLevel >= 50) return 'bg-accessLevel-owner';
    if (accessLevel >= 40) return 'bg-accessLevel-maintainer';
    if (accessLevel >= 30) return 'bg-accessLevel-developer';
    if (accessLevel >= 20) return 'bg-accessLevel-reporter';
    return 'bg-accessLevel-guest';
};

const getAccessLevelText = (accessLevel: number) => {
    if (accessLevel >= 50) return 'Owner';
    if (accessLevel >= 40) return 'Maintainer';
    if (accessLevel >= 30) return 'Developer';
    if (accessLevel >= 20) return 'Reporter';
    return 'Guest';
};

export default function MemberScreen() {
    const { user_id: userId, projectId } = useLocalSearchParams();
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });
    const api = useGitLab(client);

    const { data: member, isLoading: isLoadingMember, error: errorMember } = api.useProjectMember(projectId as string, userId as string);

    if (errorMember) return <Text>Error: {errorMember.message}</Text>;
    if (!member && !isLoadingMember) return <Text>No member data found</Text>;

    const accessLevelColor = getAccessLevelColor(member?.access_level);
    const accessLevelText = getAccessLevelText(member?.access_level);

    return (
        <View className="flex-1 p-4 bg-background">
            {isLoadingMember ? <MemberSkeleton /> : (
                <>
                    <View className="flex-row items-center mb-4">
                        <Avatar alt={`${member.name}'s Avatar`}>
                            <AvatarImage source={{ uri: member.avatar_url }} />
                            <AvatarFallback>
                                <Ionicons name="person-circle-outline" size={32} color="white" />
                            </AvatarFallback>
                        </Avatar>
                        <View className="flex-1 ml-3">
                            <Text className="font-semibold">{member.name}</Text>
                            <Text className="text-sm text-white">@{member.username}</Text>
                        </View>
                    </View>

                    <Card className="border rounded-lg shadow-sm bg-card">
                        <CardHeader>
                            <CardTitle className="flex flex-col text-white">
                                Member Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <View className="flex-row items-center mb-2">
                                <View className={`w-8 h-8 rounded-full ${accessLevelColor} flex items-center justify-center mr-2`}>
                                    <Ionicons name="shield-checkmark-outline" size={20} color="white" />
                                </View>
                                <Text className="text-white">Access level: {accessLevelText} ({member.access_level})</Text>
                            </View>
                            <View className="flex-row items-center mb-2">
                                <Ionicons name="calendar-outline" size={24} color="gray" className="mr-2" />
                                <Text className="text-white">Created at: {new Date(member.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(/(\d+)(?=(st|nd|rd|th))/, '$1 the')}</Text>
                            </View>
                            <View className="flex-row items-center mb-2">
                                <Ionicons name="person-outline" size={24} color="gray" className="mr-2" />
                                <Text className="text-white">State: {member.state}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons name="link-outline" size={24} color="gray" className="mr-2" />
                                <Text className="text-white">Web URL: {member.web_url}</Text>
                            </View>
                        </CardContent>
                    </Card>
                </>
            )}
        </View>
    );
}
