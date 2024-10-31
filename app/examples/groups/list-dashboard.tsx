import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

const gitlabApi = axios.create({
    baseURL: 'https://gitlab.com/api/v4',
    headers: {
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_GITLAB_TOKEN}`
    }
});

// Relevant GitLab API endpoints for groups:
// GET /groups - List groups
// GET /groups/:id - Get single group
// GET /groups/:id/subgroups - List a group's subgroups
// GET /groups/:id/projects - List a group's projects

const GroupsList = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGroups = async () => {
        try {
            // You can add parameters like:
            // ?min_access_level=10
            // ?owned=true
            // ?statistics=true
            // ?search=searchterm
            // ?sort=desc
            // ?order_by=name
            const response = await gitlabApi.get('/groups', {
                params: {
                    // Include group statistics
                    statistics: true,
                    // Include custom attributes
                    with_custom_attributes: true,
                    // Number of items per page
                    per_page: 20,
                    // Include descendant groups
                    include_descendant_groups: true
                }
            });
            setGroups(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const renderGroup = ({ item }) => (
        <View style={styles.groupItem}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupPath}>Path: {item.full_path}</Text>
            <Text style={styles.groupDescription}>
                {item.description || 'No description available'}
            </Text>
            {item.statistics && (
                <View style={styles.statistics}>
                    <Text>Projects: {item.statistics.project_count}</Text>
                    <Text>Subgroups: {item.statistics.subgroup_count}</Text>
                </View>
            )}
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

    return (
        <FlatList
            data={groups}
            renderItem={renderGroup}
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
    groupItem: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
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
    groupName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    groupPath: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    groupDescription: {
        fontSize: 14,
        marginBottom: 10,
    },
    statistics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
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

export default GroupsList;