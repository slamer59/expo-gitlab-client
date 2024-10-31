import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

const GITLAB_API_URL = 'https://gitlab.com/api/v4';
const GITLAB_ACCESS_TOKEN = 'REDACTED';

const GitLabProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async (refresh = false) => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await axios.get(`${GITLAB_API_URL}/projects`, {
                headers: {
                    'Authorization': `Bearer ${GITLAB_ACCESS_TOKEN}`,
                },
                params: {
                    page: refresh ? 1 : page,
                    per_page: 20,
                    search: filter,
                },
            });

            if (refresh) {
                setProjects(response.data);
                setPage(2);
            } else {
                setProjects([...projects, ...response.data]);
                setPage(page + 1);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.projectItem}>
            <Text style={styles.projectName}>{item.name}</Text>
            <Text style={styles.projectDescription}>{item.description}</Text>
        </View>
    );

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        );
    };

    const handleLoadMore = () => {
        if (!loading) {
            fetchProjects();
        }
    };

    const handleRefresh = () => {
        setPage(1);
        fetchProjects(true);
    };

    const handleFilterChange = (text) => {
        setFilter(text);
        setPage(1);
        fetchProjects(true);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.filterInput}
                placeholder="Filter projects..."
                value={filter}
                onChangeText={handleFilterChange}
            />
            <FlatList
                data={projects}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
                refreshing={loading && page === 1}
                onRefresh={handleRefresh}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    filterInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    projectItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    projectName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    projectDescription: {
        fontSize: 14,
        color: '#666',
    },
    loadingFooter: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

export default GitLabProjectsList;
