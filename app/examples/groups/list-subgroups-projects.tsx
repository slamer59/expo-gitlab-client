import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

const gitlabApi = axios.create({
    baseURL: 'https://gitlab.com/api/v4',
    headers: {
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_GITLAB_TOKEN}`
    }
});

const GroupDetails = () => {
    const [groupInfo, setGroupInfo] = useState(null);
    const [subgroups, setSubgroups] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const GROUP_ID = 'jokosun';

    const fetchGroupData = async () => {
        try {
            setLoading(true);
            // Fetch group details
            const groupResponse = await gitlabApi.get(`/groups/${GROUP_ID}`, {
                params: {
                    statistics: true,
                    with_custom_attributes: true,
                }
            });
            setGroupInfo(groupResponse.data);

            // Fetch subgroups
            const subgroupsResponse = await gitlabApi.get(`/groups/${GROUP_ID}/subgroups`, {
                params: {
                    per_page: 100
                }
            });
            setSubgroups(subgroupsResponse.data);

            // Fetch projects
            const projectsResponse = await gitlabApi.get(`/groups/${GROUP_ID}/projects`, {
                params: {
                    per_page: 100,
                    include_subgroups: true
                }
            });
            setProjects(projectsResponse.data);

        } catch (err) {
            setError(err.message);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupData();
    }, []);

    const renderGroupInfo = () => (
        <View style={styles.groupInfoContainer}>
            <Text style={styles.groupName}>{groupInfo.name}</Text>
            <Text style={styles.groupPath}>Path: {groupInfo.full_path}</Text>
            <Text style={styles.groupDescription}>
                {groupInfo.description || 'No description available'}
            </Text>
            {groupInfo.statistics && (
                <View style={styles.statistics}>
                    <Text>Projects: {groupInfo.statistics.project_count}</Text>
                    <Text>Subgroups: {groupInfo.statistics.subgroup_count}</Text>
                    <Text>Members: {groupInfo.statistics.member_count}</Text>
                </View>
            )}
        </View>
    );

    const renderSubgroup = ({ item }) => (
        <View style={styles.listItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPath}>{item.full_path}</Text>
        </View>
    );

    const renderProject = ({ item }) => (
        <View style={styles.listItem}>
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

    return (
        <FlatList
            ListHeaderComponent={
                <>
                    {renderGroupInfo()}

                    {subgroups.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Subgroups ({subgroups.length})</Text>
                            <FlatList
                                data={subgroups}
                                renderItem={renderSubgroup}
                                keyExtractor={item => item.id.toString()}
                                scrollEnabled={false}
                            />
                        </View>
                    )}

                    {projects.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Projects ({projects.length})</Text>
                        </View>
                    )}
                </>
            }
            data={projects}
            renderItem={renderProject}
            keyExtractor={item => item.id.toString()}
            style={styles.container}
        />
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
    sectionContainer: {
        marginHorizontal: 16,
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    listItem: {
        backgroundColor: '#ffffff',
        padding: 15,
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
    },
    itemDescription: {
        fontSize: 14,
        marginVertical: 5,
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
        marginTop: 10,
        paddingTop: 10,
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
});

export default GroupDetails;