import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useGitLab } from 'lib/gitlab/future/hooks/useGitlab';
import GitLabClient from 'lib/gitlab/gitlab-api-wrapper';
import { useSession } from 'lib/session/SessionProvider';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Group {
  id: string;
  name: string;
  visibility: 'private' | 'public';
  subgroups_count: number;
  members_count: number;
  full_path: string;
}

const Header = () => (
  <View className="flex-row items-center justify-between p-4">
    <Text className="text-2xl font-semibold text-white">Groups</Text>
    <View className="flex-row gap-3">
      <TouchableOpacity className="p-2">
        <Text className="text-blue-400">Explore groups</Text>
      </TouchableOpacity>
      <TouchableOpacity className="px-4 py-2 bg-blue-500 rounded-md">
        <Text className="text-white">New group</Text>
      </TouchableOpacity>
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

const GroupItem = ({
  group,
  level = 0,
  expanded,
  onToggle,
  onPress,
}: {
  group: Group;
  level?: number;
  expanded: boolean;
  onToggle: () => void;
  onPress: () => void;
}) => {
  const rotateAnim = useState(new Animated.Value(expanded ? 1 : 0))[0];

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: expanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [expanded]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4 mb-2 rounded-lg bg-zinc-800"
      style={{ marginLeft: level * 20 }}
      onPress={onPress}
    >
      <View className="flex-row items-center gap-3">
        {group.subgroups_count > 0 && (
          <TouchableOpacity onPress={onToggle}>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </Animated.View>
          </TouchableOpacity>
        )}
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
        <TouchableOpacity className="p-1">
          <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function GroupsScreen() {
  const { session } = useSession();
  const router = useRouter();
  const client = new GitLabClient({
    token: session?.token,
    url: session?.url,
  });
  const gitlab = useGitLab(client);
  const { data: groups, isLoading } = gitlab.useGroups({});
  console.log("🚀 ~ GroupsScreen ~ groups:", groups)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleGroupPress = useCallback((group: Group) => {
    if (group.subgroups_count > 0) {
      router.push('/workspace/groups/list');
    } else {
      router.push(`/workspace/groups/${group.id}`);
    }
  }, [router]);

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  }, []);

  const filteredGroups = React.useMemo(() => {
    if (!groups) return [];
    return groups.filter(group =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.full_path.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [groups, searchQuery]);

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
          headerShown: false,
        }}
      />
      <Header />
      <SearchBar onSearch={setSearchQuery} />
      <FlatList
        className="px-4"
        data={filteredGroups}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <GroupItem
            group={item}
            expanded={!!expandedGroups[item.id]}
            onToggle={() => toggleGroup(item.id)}
            onPress={() => handleGroupPress(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}
