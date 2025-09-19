// app/[groupId]/groups.tsx
import { Octicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ChevronDown, GitBranch, MoreVertical, Users } from 'lucide-react-native';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface GitLabGroup {
    id: number;
    name: string;
    path: string;
    visibility: string;
    avatar_url: string | null;
    star_count: number;
    forks_count: number;
    members_count: number;
}

const gitlabApi = axios.create({
    baseURL: 'https://gitlab.com/api/v4',
    headers: {
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_GITLAB_TOKEN}`
    }
});

export default function GroupsScreen() {
    const { groupId } = useLocalSearchParams();

    const { data: groups, isLoading } = useQuery({
        queryKey: ['groups', groupId],
        queryFn: async () => {
            const endpoint = groupId ? `/groups/${groupId}/subgroups` : '/groups';
            const response = await gitlabApi.get<GitLabGroup[]>(endpoint);
            return response.data;
        }
    });
    const renderHeader = () => (
        <View className="p-4 border-b border-gray-700">
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-2xl font-semibold text-white">Groups</Text>
                <View className="flex-row gap-4">
                    <TouchableOpacity className="px-3 py-1">
                        <Text className="text-blue-400">Explore groups</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-3 py-1 bg-blue-500 rounded">
                        <Text className="text-white">New group</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-row gap-2">
                <View className="flex-1">
                    <View className="flex-row items-center px-3 py-2 bg-gray-800 rounded">
                        <TextInput
                            placeholder="Search or filter results..."
                            placeholderTextColor="#9CA3AF"
                            className="flex-1 text-white"
                        />
                    </View>
                </View>
                <TouchableOpacity className="flex-row items-center px-3 py-2 bg-gray-800 rounded">
                    <Text className="mr-2 text-white">Created date</Text>
                    <ChevronDown size={16} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderGroup = ({ item }: { item: GitLabGroup }) => (
        <TouchableOpacity
            onPress={() => router.push(`/${item.id}/groups`)}
            className="p-4 border-b border-gray-700"
        >
            <View className="flex-row items-center">
                <View className="items-center justify-center w-8 h-8 mr-3 bg-gray-700 rounded-lg">
                    <Text className="text-lg text-white">
                        {item.name.charAt(0).toUpperCase()}
                    </Text>
                </View>

                <View className="flex-1">
                    <View className="flex-row items-center">
                        <Text className="mr-2 text-lg text-white">{item.name}</Text>
                        {item.visibility === 'private' && (
                            <Octicons name="lock" size={16} color="#9CA3AF" />
                        )}
                    </View>
                </View>

                <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center">
                        <Octicons name="star" size={16} color="#9CA3AF" />
                        <Text className="ml-1 text-gray-400">{item.star_count}</Text>
                    </View>

                    <View className="flex-row items-center">
                        <GitBranch size={16} color="#9CA3AF" />
                        <Text className="ml-1 text-gray-400">{item.forks_count}</Text>
                    </View>

                    <View className="flex-row items-center">
                        <Users size={16} color="#9CA3AF" />
                        <Text className="ml-1 text-gray-400">{item.members_count}</Text>
                    </View>

                    <TouchableOpacity>
                        <MoreVertical size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-900">
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />

            <FlatList
                data={groups}
                renderItem={renderGroup}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={renderHeader}
                stickyHeaderIndices={[0]}
            />
        </View>
    );
}