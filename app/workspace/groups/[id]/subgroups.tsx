import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useGitLab } from 'lib/gitlab/future/hooks/useGitlab';
import GitLabClient from 'lib/gitlab/gitlab-api-wrapper';
import { useSession } from 'lib/session/SessionProvider';

interface Group {
    id: string;
    name: string;
    visibility: 'private' | 'public';
    subgroups_count: number;
    members_count: number;
    full_path: string;
}

const Header = ({ groupName }: { groupName?: string }) => (
    <View className="flex-row items-center justify-between p-4">
        <View>
            <Text className="text-2xl font-semibold text-white">Subgroups</Text>
            {groupName && (
                <Text className="text-zinc-400">{groupName}</Text>
            )}
        </View>
    </View>
);

const SearchBar = ({ onSearch }: { onSearch: (text: string) => void }) => (
    <View className="flex-row items-center px-4 mb-4">
        <View className="flex-row items-center flex-1 px-4 py-2 rounded-md bg-zinc-800">
            <Ionicons name="search" size={20} color="#6b7280" className="mr-2" />
            <TextInput
                className="flex-1 ml-2 text-white"
                placeholder="Search or filter results..."
                placeholderTextColor="#6b7280"
                onChangeText={onSearch}
            />
        </View>
    </View>
);

const GroupItem = ({ group, onPress }: { group: Group; onPress: () => void }) => (
    <TouchableOpacity
        className="flex-row items-center justify-between p-4 mb-2 rounded-lg bg-zinc-800"
        onPress={onPress}
    >
        <View className="flex-row items-center gap-3">
            <View className="items-center justify-center w-10 h-10 rounded-lg bg-zinc-700">
                <Text className="text-lg font-medium text-white">{group.name.charAt(0)}</Text>
            </View>
            <View>
                <Text className="text-base font-medium text-white">{group.name}</Text>
                <Text className="text-sm text-zinc-400">{group.full_path}</Text>
            </View>
        </View>

        <View className="flex-row items-center gap-4">
            {group.visibility === 'private' && (
                <Ionicons name="lock-closed" size={16} color="#6b7280" />
            )}
            <View className="flex-row items-center gap-1">
                <Text className="text-zinc-400">{group.subgroups_count}</Text>
                <Text className="text-zinc-400">subgroups</Text>
            </View>
            <View className="flex-row items-center gap-1">
                <Text className="text-zinc-400">{group.members_count}</Text>
                <Text className="text-zinc-400">members</Text>
            </View>
            {group.subgroups_count > 0 && (
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            )}
        </View>
    </TouchableOpacity>
);

export default function SubgroupsScreen() {
    const { session } = useSession();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const client = new GitLabClient({
        token: session?.token,
        url: session?.url,
    });
    const gitlab = useGitLab(client);
    const { data: group } = gitlab.useGroup({ id: id as string });
    const { data: subgroups, isLoading } = gitlab.useSubgroups({ id: id as string });
    const [searchQuery, setSearchQuery] = useState('');

    const handleGroupPress = useCallback((group: Group) => {
        // Navigate to nested subgroups or group details
        if (group.subgroups_count > 0) {
            router.push(`/workspace/groups/${group.id}/subgroups`);
        } else {
            router.push(`/workspace/groups/${group.id}`);
        }
    }, [router]);

    const filteredGroups = React.useMemo(() => {
        if (!subgroups) return [];
        return subgroups.filter(group =>
            group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.full_path.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [subgroups, searchQuery]);

    if (isLoading) {
        return (
            <SafeAreaView className="items-center justify-center flex-1 bg-zinc-950">
                <ActivityIndicator size="large" color="#3b82f6" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-zinc-950">
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerStyle: {
                        backgroundColor: '#09090b',
                    },
                    headerTintColor: '#fff',
                }}
            />
            <Header groupName={group?.name} />
            <SearchBar onSearch={setSearchQuery} />
            <FlatList
                className="px-4"
                data={filteredGroups}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <GroupItem
                        group={item}
                        onPress={() => handleGroupPress(item)}
                    />
                )}
            />
        </SafeAreaView>
    );
}
