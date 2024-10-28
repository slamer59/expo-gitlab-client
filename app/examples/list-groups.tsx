// App.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Types
interface Group {
  id: string;
  name: string;
  visibility: 'private' | 'public';
  subgroups_count: number;
  members_count: number;
  subgroups?: Group[];
  parent_id?: string | null;
  full_path?: string;
}

// Components
const Header = () => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Groups</Text>
    <View style={styles.headerButtons}>
      <TouchableOpacity style={styles.linkButton}>
        <Text style={styles.linkButtonText}>Explore groups</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>New group</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const SearchBar = ({ onSearch }: { onSearch: (text: string) => void }) => (
  <View style={styles.searchContainer}>
    <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
    <TextInput
      style={styles.searchInput}
      placeholder="Search or filter results..."
      placeholderTextColor="#6b7280"
      onChangeText={onSearch}
    />
  </View>
);

const GroupItem = ({
  group,
  level = 0,
  expanded,
  onToggle,
}: {
  group: Group;
  level?: number;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const hasSubgroups = (group.subgroups?.length || 0) > 0;
  const rotateAnim = useState(new Animated.Value(expanded ? 1 : 0))[0];

  useEffect(() => {
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
    <View>
      <TouchableOpacity
        style={[
          styles.groupItem,
          { marginLeft: level * 20 }
        ]}
        onPress={onToggle}
      >
        <View style={styles.groupLeftContent}>
          {hasSubgroups && (
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </Animated.View>
          )}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{group.name.charAt(0)}</Text>
          </View>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{group.name}</Text>
            {group.visibility === 'private' && (
              <Ionicons name="lock-closed" size={16} color="#6b7280" />
            )}
          </View>
        </View>

        <View style={styles.groupMetrics}>
          <View style={styles.metric}>
            <Ionicons name="time-outline" size={16} color="#6b7280" />
            <Text style={styles.metricText}>0</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricText}>{group.subgroups_count || 0}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricText}>{group.members_count || 0}</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {expanded && group.subgroups?.map((subgroup) => (
        <SubgroupItem
          key={subgroup.id}
          group={subgroup}
          level={level + 1}
        />
      ))}
    </View>
  );
};

const SubgroupItem = ({ group, level }: { group: Group; level: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <GroupItem
      group={group}
      level={level}
      expanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
    />
  );
};

// Main App Component
export default function App() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('https://gitlab.com/api/v4/groups?with_subgroups=true');

      const data = await response.json();
      // console.log("🚀 ~ fetchGroups ~ data:", data)
      setGroups(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading groups: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
      <SearchBar onSearch={(text) => console.log('Search:', text)} />

      {isLoading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
      ) : (
        <FlatList
          data={groups.filter(group => !group.parent_id)} // Only show top-level groups
          renderItem={({ item }) => (
            <GroupItem
              group={item}
              expanded={!!expandedGroups[item.id]}
              onToggle={() => toggleGroup(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b', // zinc-950
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  linkButton: {
    padding: 8,
  },
  linkButtonText: {
    color: '#60a5fa', // blue-400
  },
  primaryButton: {
    backgroundColor: '#3b82f6', // blue-500
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 24,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#27272a', // zinc-800
    height: 40,
    borderRadius: 6,
    paddingLeft: 40,
    paddingRight: 16,
    color: '#ffffff',
  },
  listContainer: {
    padding: 16,
  },
  groupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#27272a', // zinc-800
    borderRadius: 8,
    marginBottom: 8,
  },
  groupLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#3f3f46', // zinc-700
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  groupMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    color: '#6b7280', // gray-500
    fontSize: 14,
  },
  moreButton: {
    padding: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181b',
  },
  errorText: {
    color: '#ef4444', // red-500
    fontSize: 16,
  },
  loader: {
    flex: 1,
  },
});