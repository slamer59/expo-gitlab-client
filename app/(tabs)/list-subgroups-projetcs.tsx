// types.ts
type Visibility = 'private' | 'public';
type ItemType = 'group' | 'project';

interface BaseItem {
    id: string;
    name: string;
    visibility: Visibility;
    updatedAt: string;
    stars: number;
    membershipType?: 'direct' | 'inherited';
}

interface Project extends BaseItem {
    type: 'project';
    avatar?: string;
    description?: string;
    isOwner?: boolean;
}

interface SubGroup extends BaseItem {
    type: 'group';
    stats: {
        members: number;
        subItems: number;
        activity: number;
    };
}

type GroupItem = Project | SubGroup;

interface ApiProject {
    id: number;
    name: string;
    visibility: string;
    last_activity_at: string;
    star_count: number;
    avatar_url?: string;
    description?: string;
}

interface ApiSubGroup {
    id: number;
    name: string;
    visibility: string;
    last_activity_at: string;
    star_count: number;
    statistics?: {
        member_count: number;
        project_count: number;
        commit_count: number;
    };
}

interface GroupResponse {
    id: string;
    name: string;
    visibility: string;
    last_activity_at: string;
    star_count: number;
    projects: ApiProject[];
    subgroups: ApiSubGroup[];
}

const gitlabApi = axios.create({
    baseURL: 'https://gitlab.com/api/v4',
    headers: {
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_GITLAB_TOKEN}`
    }
});

interface Member {
    id: number;
    access_level: number;
    source_type: string;
}

const fetchGroupDetails = async (groupId: string) => {
    try {
        const { directMemberIds, inheritedMemberIds } = await fetchMemberships(groupId);
        const { data } = await gitlabApi.get<GroupResponse>(`/groups/${groupId}`, {
            params: {
                include_subgroups: true,
                include_projects: true,
                with_statistics: true
            }
        });

        // Transform and combine the data
        const items: GroupItem[] = data.subgroups.map(group => ({
            id: group.id.toString(),
            name: group.name,
            type: 'group' as const,
            visibility: group.visibility as Visibility,
            updatedAt: group.last_activity_at,
            stars: group.star_count,
            stats: {
                members: group.statistics?.member_count || 0,
                subItems: group.statistics?.project_count || 0,
                activity: group.statistics?.commit_count || 0
            },
            membershipType: directMemberIds.has(group.id) ? 'direct' : 'inherited'
        }));

        return { items };
    } catch (error) {
        console.error('Error fetching group details:', error);
        throw error;
    }
};

const fetchGroupProjects = async (groupId: string) => {
    try {
        const { data } = await gitlabApi.get<GroupResponse>(`/groups/${groupId}`, {
            params: {
                include_projects: true
            }
        });

        return data.projects.map(project => ({
            id: project.id.toString(),
            name: project.name,
            type: 'project' as const,
            visibility: project.visibility as Visibility,
            updatedAt: project.last_activity_at,
            stars: project.star_count,
            avatar: project.avatar_url,
            description: project.description
        }));
    } catch (error) {
        console.error('Error fetching group projects:', error);
        throw error;
    }
};

const fetchMemberships = async (groupId: string) => {
    const [directMembers, inheritedMembers] = await Promise.all([
        gitlabApi.get<Member[]>(`/groups/${groupId}/members`),
        gitlabApi.get<Member[]>(`/groups/${groupId}/members/all`)
    ]);

    const directMemberIds = new Set(directMembers.data.map(m => m.id));
    const inheritedMemberIds = new Set(inheritedMembers.data.map(m => m.id));

    return {
        directMemberIds,
        inheritedMemberIds
    };
};

import { Octicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronRight, Clock, Lock, LucideGroup, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const GroupItem = ({ item }: { item: GroupItem }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { data: projects, isLoading: isLoadingProjects } = useQuery({
        queryKey: ['projects', item.id],
        queryFn: () => fetchGroupProjects(item.id),
        enabled: isExpanded && item.type === 'group',
    });

    const timeAgo = (date: string) => {
        const now = new Date();
        const updated = new Date(date);
        const diffMonths = (now.getFullYear() - updated.getFullYear()) * 12 +
            (now.getMonth() - updated.getMonth());

        if (diffMonths < 1) return 'this month';
        if (diffMonths === 1) return '1 month ago';
        if (diffMonths < 12) return `${diffMonths} months ago`;
        const years = Math.floor(diffMonths / 12);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    };

    const renderProjects = () => {
        if (!isExpanded || item.type !== 'group') return null;
        if (isLoadingProjects) {
            return (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading projects...</Text>
                </View>
            );
        }
        return projects?.map(project => (
            <View key={project.id} style={styles.projectContainer}>
                <View style={styles.leftContent}>
                    <View style={styles.projectIndent} />
                    <Octicons name="project" size={24} color="white" style={styles.projectIcon} />
                    <View style={styles.nameContainer}>
                        <Text style={styles.itemName}>{project.name}</Text>
                        {project.visibility === 'private' && <Lock size={16} style={styles.lockIcon} />}
                    </View>
                </View>
                <View style={styles.rightContent}>
                    <View style={styles.statsContainer}>
                        <Star size={16} />
                        <Text style={styles.statText}>{project.stars}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                        <Clock size={16} />
                        <Text style={styles.timeText}>{timeAgo(project.updatedAt)}</Text>
                    </View>
                </View>
            </View>
        ));
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => item.type === 'group' && setIsExpanded(!isExpanded)}
            >
                <View style={styles.leftContent}>
                    {item.type === 'group' && (
                        <ChevronRight
                            size={16}
                            style={[styles.chevron, isExpanded && styles.chevronExpanded]}
                        />
                    )}
                    {item.type === 'project' ?
                        <Octicons name="project" size={24} color="white" />
                        : <LucideGroup size={24} color="white" />
                    }
                    <View style={styles.nameContainer}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        {item.visibility === 'private' && <Lock size={16} style={styles.lockIcon} />}
                    </View>
                </View>

                <View style={styles.rightContent}>
                    <View style={styles.statsContainer}>
                        <Star size={16} />
                        <Text style={styles.statText}>{item.stars}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                        <Clock size={16} />
                        <Text style={styles.timeText}>{timeAgo(item.updatedAt)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            {renderProjects()}
        </View>
    );
};

const GroupDetailView = ({ groupId }: { groupId: string }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['group', groupId],
        queryFn: () => fetchGroupDetails(groupId),
        staleTime: 5 * 60 * 1000,
    });

    const [selectedTab, setSelectedTab] = useState<'all' | 'direct' | 'inherited'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.loadingText}>Loading group details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Error loading group details</Text>
            </View>
        );
    }

    const filteredItems = data?.items.filter(item => {
        const matchesSearch = searchQuery.length < 3 ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase());

        switch (selectedTab) {
            case 'direct':
                return matchesSearch && item.membershipType === 'direct';
            case 'inherited':
                return matchesSearch && item.membershipType === 'inherited';
            default:
                return matchesSearch;
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
                    onPress={() => setSelectedTab('all')}
                >
                    <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
                        All
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'direct' && styles.activeTab]}
                    onPress={() => setSelectedTab('direct')}
                >
                    <Text style={[styles.tabText, selectedTab === 'direct' && styles.activeTabText]}>
                        Direct
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'inherited' && styles.activeTab]}
                    onPress={() => setSelectedTab('inherited')}
                >
                    <Text style={[styles.tabText, selectedTab === 'inherited' && styles.activeTabText]}>
                        Inherited
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Clock size={16} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search (3 character minimum)"
                    placeholderTextColor="#6B7280"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView>
                {filteredItems?.map((item) => (
                    <GroupItem key={item.id} item={item} />
                ))}
            </ScrollView>
        </View>
    );
};

export default function GroupScreen() {
    return (
        <GroupDetailView groupId="jokosun" />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1F2937',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
    },
    tab: {
        padding: 16,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#60A5FA',
    },
    tabText: {
        color: '#9CA3AF',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#374151',
        margin: 16,
        borderRadius: 4,
    },
    searchIcon: {
        color: '#6B7280',
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 14,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    projectContainer: {
        flexDirection: 'row',
        padding: 16,
        paddingLeft: 32,
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2D3748',
    },
    projectIndent: {
        width: 24,
    },
    projectIcon: {
        marginRight: 12,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    itemName: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    lockIcon: {
        marginLeft: 8,
        color: '#9CA3AF',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    statText: {
        color: '#9CA3AF',
        marginLeft: 4,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        color: '#9CA3AF',
        marginLeft: 4,
    },
    chevron: {
        color: '#9CA3AF',
        marginRight: 8,
    },
    chevronExpanded: {
        transform: [{ rotate: '90deg' }],
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#EF4444',
    },
    loadingText: {
        color: '#9CA3AF',
    },
    loadingContainer: {
        padding: 16,
        paddingLeft: 72,
        backgroundColor: '#2D3748',
    },
});
