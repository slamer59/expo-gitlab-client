import { Ionicons } from '@expo/vector-icons';
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
}

interface Project {
    id: number;
    name: string;
    description: string | null;
    last_activity_at: string;
    star_count: number;
    forks_count: number;
}

interface SubgroupWithDetails {
    id: number;
    name: string;
    full_path: string;
    description: string | null;
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
                gitlabApi.get<SubgroupWithDetails[]>(`/groups/${subgroupId}/subgroups`, {
                    params: { per_page: 100 }
                }),
                gitlabApi.get<Project[]>(`/groups/${subgroupId}/projects`, {
                    params: { per_page: 100 }
                })
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
                    params: {
                        statistics: true,
                        with_custom_attributes: true,
                    }
                }),
                gitlabApi.get<SubgroupWithDetails[]>(`/groups/${groupId}/subgroups`, {
                    params: { per_page: 100 }
                }),
                gitlabApi.get<Project[]>(`/groups/${groupId}/projects`, {
                    params: { per_page: 10 }
                })
            ]);
            console.log("🚀 ~ fetchGroupData ~ subgroupProjectsResponse:", subgroupProjectsResponse.data.map(project => project.name))

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

    const renderGroupInfo = () => {
        if (!groupInfo) return null;

        return (
            <View style={styles.groupInfoContainer}>
                <Text style={styles.groupName}>{groupInfo.name}</Text>
                <Text style={styles.groupPath}>Path: {groupInfo.full_path}</Text>
                <Text style={styles.groupDescription}>
                    {groupInfo.description || 'No description available'}
                </Text>
                {groupInfo.statistics && (
                    <View style={styles.statistics}>
                        <Text>Subgroups: {groupInfo.statistics.subgroup_count}</Text>
                        <Text>Members: {groupInfo.statistics.member_count}</Text>
                    </View>
                )}
            </View>
        );
    };

    const renderProject = ({ item }: { item: Project }) => (
        <View style={styles.projectItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>
                {item.description || 'No description available'}
            </Text>
            <View style={styles.projectStats}>
                <Text>Stars: {item.star_count}</Text>
                <Text>Forks: {item.forks_count}</Text>
                <Text>Last activity: {new Date(item.last_activity_at).toLocaleDateString()}</Text>
            </View>
        </View>
    );

    const renderNestedSubgroup = ({ item }: { item: SubgroupWithDetails }) => (
        <View style={styles.nestedSubgroupItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPath}>{item.full_path}</Text>
            <Text style={styles.itemDescription}>
                {item.description || 'No description available'}
            </Text>
        </View>
    );

    const renderSubgroup = ({ item }: { item: SubgroupWithDetails }) => {
        if (!item) return null;

        return (
            <View style={styles.listItem}>
                <TouchableOpacity
                    style={styles.header}
                    onPress={() => toggleSubgroup(item.id)}
                >
                    <View style={styles.headerContent}>
                        <View style={styles.headerText}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPath}>{item.full_path}</Text>
                            <Text style={styles.itemDescription}>
                                {item.description || 'No description available'}
                            </Text>
                        </View>
                        <Ionicons
                            name={item.expanded ? 'chevron-up' : 'chevron-down'}
                            size={24}
                            color="#666"
                        />
                    </View>
                </TouchableOpacity>

                {item.expanded && (
                    <View style={styles.content}>
                        {item.loading ? (
                            <ActivityIndicator style={styles.nestedLoader} />
                        ) : (
                            <>
                                {item.subgroups && item.subgroups.length > 0 && (
                                    <View style={styles.nestedSection}>
                                        <Text style={styles.nestedSectionTitle}>
                                            Subgroups ({item.subgroups.length})
                                        </Text>
                                        <FlatList
                                            data={item.subgroups}
                                            renderItem={renderNestedSubgroup}
                                            keyExtractor={sg => sg.id.toString()}
                                            scrollEnabled={false}
                                        />
                                    </View>
                                )}

                                {item.projects && item.projects.length > 0 && (
                                    <View style={styles.nestedSection}>
                                        <Text style={styles.nestedSectionTitle}>
                                            Projects ({item.projects.length})
                                        </Text>
                                        <FlatList
                                            data={item.projects}
                                            renderItem={renderProject}
                                            keyExtractor={p => p.id.toString()}
                                            scrollEnabled={false}
                                        />
                                    </View>
                                )}

                                {(!item.subgroups?.length && !item.projects?.length) && (
                                    <Text style={styles.emptyText}>No subgroups or projects found</Text>
                                )}
                            </>
                        )}
                    </View>
                )}

            </View>
        );
    };

    const renderListItem = ({ item }: { item: SubgroupWithDetails | Project }) => {
        if ('full_path' in item) {
            return renderSubgroup({ item: item as SubgroupWithDetails });
        } else {
            return renderProject({ item: item as Project });
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

    if (!groupInfo) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Group not found</Text>
            </View>
        );
    }

    const combinedData = [...subgroups, ...subgroupProjects];

    return (<>
        <FlatList
            ListHeaderComponent={renderGroupInfo()}
            data={combinedData}
            renderItem={renderListItem}
            keyExtractor={item => item.id.toString()}
            style={styles.container}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No subgroups or projects found</Text>
                </View>
            }
        />
    </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nestedLoader: {
        padding: 20,
    },
    groupInfoContainer: {
        backgroundColor: '#ffffff',
        padding: 15,
        margin: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    listItem: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        overflow: 'hidden',
    },
    header: {
        padding: 15,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        flex: 1,
    },
    content: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        padding: 15,
    },
    nestedSection: {
        marginTop: 10,
    },
    nestedSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#666',
    },
    nestedSubgroupItem: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        marginVertical: 6,
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#007bff',
    },
    projectItem: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        marginVertical: 6,
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#28a745',
    },
    groupName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    groupPath: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    groupDescription: {
        fontSize: 16,
        marginBottom: 10,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemPath: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    itemDescription: {
        fontSize: 14,
    },
    statistics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    projectStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
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
        fontSize: 16,
        color: '#666',
        marginTop: 10,
    }
});

export default GroupDetails;
