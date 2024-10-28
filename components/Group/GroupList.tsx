import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGitLab } from '../../lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '../../lib/gitlab/gitlab-api-wrapper';
import { useSession } from '../../lib/session/SessionProvider';
import { GroupCard, GroupCardSkeleton } from './GroupCard';

interface Group {
    id: number;
    name: string;
    full_path: string;
    description: string;
    visibility: string;
    created_at: string;
    last_activity_at: string;
    members_count?: number;
}

export const GroupList = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
    const { session } = useSession();

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    // Fetch top-level groups
    const { data: groups, isLoading, error, refetch } = api.useGroups({
        top_level_only: true,
        with_custom_attributes: true,
        include_custom_attributes: true,
        with_statistics: true
    });

    // Fetch subgroups for expanded groups
    const subgroupQueries = expandedGroups.map(groupId => ({
        ...api.useSubgroups(groupId.toString()),
        groupId
    }));

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const toggleGroupExpansion = (groupId: number) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                {[1, 2, 3].map((_, index) => (
                    <GroupCardSkeleton key={index} />
                ))}
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error loading groups</Text>
            </View>
        );
    }

    const renderGroup = (group: Group, level: number = 0) => {
        const isExpanded = expandedGroups.includes(group.id);
        const subgroupQuery = subgroupQueries.find(q => q.groupId === group.id);
        const hasSubgroups = subgroupQuery?.data?.length > 0;

        return (
            <View key={group.id}>
                <GroupCard
                    group={group}
                    level={level}
                    isExpanded={isExpanded}
                    onToggleExpand={() => toggleGroupExpansion(group.id)}
                    hasSubgroups={hasSubgroups}
                />

                {isExpanded && subgroupQuery?.data && (
                    <View>
                        {subgroupQuery.data.map((subgroup: Group) =>
                            renderGroup(subgroup, level + 1)
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            {groups?.map((group: Group) => renderGroup(group))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});
