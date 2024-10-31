import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GroupStatistics {
    subgroup_count: number;
    member_count: number;
}

interface GroupInfo {
    id: number;
    name: string;
    full_path: string;
    description: string | null;
    statistics: GroupStatistics;
    visibility: string;
}

interface Project {
    id: number;
    name: string;
    description: string | null;
    last_activity_at: string;
    visibility: string;
    namespace: {
        kind: string;
    };
}

interface SubgroupWithDetails {
    id: number;
    name: string;
    full_path: string;
    description: string | null;
    visibility: string;
    subgroups?: SubgroupWithDetails[];
    projects?: Project[];
    loading?: boolean;
    expanded?: boolean;
    detailsFetched?: boolean;
}

const gitlabApi = axios.create({
    baseURL: 'https://gitlab.com/api/v4',
    headers: {
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_GITLAB_TOKEN}`
    }
});

const GroupDetails = () => {
    const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
    const [subgroups, setSubgroups] = useState<SubgroupWithDetails[]>([]);
    const [subgroupProjects, setSubgroupProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const groupId = 'jokosun';

    const fetchSubgroupDetails = async (subgroupId: number) => {
        try {
            const [subgroupsResponse, projectsResponse] = await Promise.all([
                gitlabApi.get<SubgroupWithDetails[]>(`/groups/${subgroupId}/subgroups`),
                gitlabApi.get<Project[]>(`/groups/${subgroupId}/projects`)
            ]);

            setSubgroups(currentSubgroups =>
                currentSubgroups.map(sg =>
                    sg.id === subgroupId ? {
                        ...sg,
                        subgroups: subgroupsResponse.data.map(subgroup => ({
                            ...subgroup,
                            expanded: false,
                            detailsFetched: false
                        })),
                        projects: projectsResponse.data,
                        loading: false,
                        detailsFetched: true
                    } : sg
                )
            );
        } catch (err) {
            console.error(`Error fetching details for subgroup ${subgroupId}:`, err);
            setSubgroups(currentSubgroups =>
                currentSubgroups.map(sg =>
                    sg.id === subgroupId ? {
                        ...sg,
                        subgroups: [],
                        projects: [],
                        loading: false,
                        detailsFetched: true
                    } : sg
                )
            );
        }
    };

    const toggleSubgroup = async (subgroupId: number) => {
        setSubgroups(currentSubgroups =>
            currentSubgroups.map(sg =>
                sg.id === subgroupId ? {
                    ...sg,
                    expanded: !sg.expanded,
                    loading: !sg.detailsFetched
                } : sg
            )
        );

        const subgroup = subgroups.find(sg => sg.id === subgroupId);
        if (subgroup && !subgroup.detailsFetched) {
            await fetchSubgroupDetails(subgroupId);
        }
    };

    const fetchGroupData = async () => {
        try {
            setLoading(true);
            const [groupResponse, subgroupsResponse, subgroupProjectsResponse] = await Promise.all([
                gitlabApi.get<GroupInfo>(`/groups/${groupId}`, {
                    params: { statistics: true, with_custom_attributes: true }
                }),
                gitlabApi.get<SubgroupWithDetails[]>(`/groups/${groupId}/subgroups`),
                gitlabApi.get<Project[]>(`/groups/${groupId}/projects`)
            ]);

            setGroupInfo(groupResponse.data);
            setSubgroups(subgroupsResponse.data.map(sg => ({
                ...sg,
                expanded: false,
                detailsFetched: false
            })));
            setSubgroupProjects(subgroupProjectsResponse.data);
        } catch (err) {
            const error = err as AxiosError;
            setError(error.message);
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupData();
    }, []);

    const renderProject = ({ item }: { item: Project }) => (
        <View style={[styles.listItem, styles.nestedItem]}>
            <View style={styles.itemContent}>
                <View style={styles.leftContent}>
                    <MaterialCommunityIcons
                        name="source-repository"
                        size={20}
                        color="#666"
                        style={styles.icon}
                    />
                    <Text style={styles.itemName} numberOfLines={1}>
                        {item.name}
                    </Text>
                </View>
                <View style={styles.rightContent}>
                    {item.visibility === 'private' && (
                        <MaterialCommunityIcons
                            name="lock"
                            size={16}
                            color="#666"
                            style={styles.lockIcon}
                        />
                    )}
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Owner</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderSubgroup = ({ item }: { item: SubgroupWithDetails }) => {
        if (!item) return null;

        return (
            <View>
                <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => toggleSubgroup(item.id)}
                >
                    <View style={styles.itemContent}>
                        <View style={styles.leftContent}>
                            <MaterialCommunityIcons
                                name="folder"
                                size={20}
                                color="#666"
                                style={styles.icon}
                            />
                            <Text style={styles.itemName} numberOfLines={1}>
                                {item.name}
                            </Text>
                        </View>
                        <View style={styles.rightContent}>
                            {item.visibility === 'private' && (
                                <MaterialCommunityIcons
                                    name="lock"
                                    size={16}
                                    color="#666"
                                    style={styles.lockIcon}
                                />
                            )}
                            <Ionicons
                                name={item.expanded ? 'chevron-down' : 'chevron-forward'}
                                size={20}
                                color="#666"
                            />
                        </View>
                    </View>
                </TouchableOpacity>

                {item.expanded && (
                    <View style={styles.nestedContent}>
                        {item.loading ? (
                            <ActivityIndicator style={styles.nestedLoader} />
                        ) : (
                            <>
                                {item.subgroups?.map(subgroup => (
                                    <View key={subgroup.id} style={styles.nestedItem}>
                                        <TouchableOpacity
                                            style={styles.itemContent}
                                            onPress={() => toggleSubgroup(subgroup.id)}
                                        >
                                            <View style={styles.leftContent}>
                                                <MaterialCommunityIcons
                                                    name="folder"
                                                    size={20}
                                                    color="#666"
                                                    style={styles.icon}
                                                />
                                                <Text style={styles.itemName} numberOfLines={1}>
                                                    {subgroup.name}
                                                </Text>
                                            </View>
                                            <View style={styles.rightContent}>
                                                {subgroup.visibility === 'private' && (
                                                    <MaterialCommunityIcons
                                                        name="lock"
                                                        size={16}
                                                        color="#666"
                                                        style={styles.lockIcon}
                                                    />
                                                )}
                                                <Ionicons
                                                    name={'chevron-forward'}
                                                    size={20}
                                                    color="#666"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                {item.projects?.map(project => (
                                    <View key={project.id}>
                                        {renderProject({ item: project })}
                                    </View>
                                ))}
                            </>
                        )}
                    </View>
                )}
            </View>
        );
    };

    const renderListItem = ({ item }: { item: SubgroupWithDetails | Project }) => {
        if ('namespace' in item) {
            return renderProject({ item });
        } else {
            return renderSubgroup({ item: item as SubgroupWithDetails });
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" style={styles.loader} />;
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    const combinedData = [...subgroups, ...subgroupProjects];

    return (
        <FlatList
            data={combinedData}
            renderItem={renderListItem}
            keyExtractor={item => item.id.toString()}
            style={styles.container}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No items found</Text>
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nestedLoader: {
        padding: 12,
    },
    listItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
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
    icon: {
        marginRight: 12,
    },
    lockIcon: {
        marginRight: 8,
    },
    itemName: {
        fontSize: 14,
        flex: 1,
    },
    badge: {
        backgroundColor: '#eee',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginRight: 8,
    },
    badgeText: {
        fontSize: 12,
        color: '#666',
    },
    nestedContent: {
        backgroundColor: '#f8f9fa',
    },
    nestedItem: {
        borderLeftWidth: 2,
        borderLeftColor: '#eee',
        marginLeft: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    emptyContainer: {
        padding: 16,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
    }
});

export default GroupDetails;
