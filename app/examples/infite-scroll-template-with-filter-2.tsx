import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GITLAB_API_URL = 'https://gitlab.com/api/v4';
const GITLAB_ACCESS_TOKEN = 'GITLAB_PAT_REMOVED';

const GitLabProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all');
    const [hasMore, setHasMore] = useState(true);  // New state to track if there are more items

    useEffect(() => {
        fetchProjects(true);
    }, [filter]);

    const projectId = '59853773'; // 59795263 59853773 278964

    // const { data, error, isLoading, isError, refetch } = api.useProjectIssues(projectId, {
    //     page,
    //     per_page: 20,
    //     state: filter !== 'all' ? filter : "all"
    // });
    const fetchProjects = async (refresh = false) => {
        if (loading || (!refresh && !hasMore)) return;

        setLoading(true);
        try {
            const response = await axios.get(`${GITLAB_API_URL}/projects/${projectId}/issues`, {
                headers: {
                    'Authorization': `Bearer ${GITLAB_ACCESS_TOKEN}`,
                },
                params: {
                    page: refresh ? 1 : page,
                    per_page: 20,
                    state: filter === 'all' ? undefined : filter,
                },
            });

            const newProjects = response.data;

            if (refresh) {
                setProjects(newProjects);
                setPage(2);
            } else {
                setProjects([...projects, ...newProjects]);
                setPage(page + 1);
            }

            // Check if there are more items
            setHasMore(newProjects.length === 20);

        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => {
        console.log("🚀 ~ GitLabProjectsList ~ item:", item?.web_url)
        return <View style={styles.projectItem}>
            <Text style={styles.projectName}>{item.web_url}</Text>
            <Text style={styles.projectState}>State: {item.state}</Text>
        </View>

    }

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

    const FilterButton = ({ title, value }) => (
        <TouchableOpacity
            style={[styles.filterButton, filter === value && styles.activeFilterButton]}
            onPress={() => setFilter(value)}
        >
            <Text style={[styles.filterButtonText, filter === value && styles.activeFilterButtonText]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <FilterButton title="All" value="all" />
                <FilterButton title="Open" value="opened" />
                <FilterButton title="Closed" value="closed" />
            </View>
            <FlatList
                data={projects}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
                refreshing={loading && page === 1}
                onRefresh={handleRefresh}
                ListEmptyComponent={<Text>No issues found</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    activeFilterButton: {
        backgroundColor: '#007AFF',
    },
    filterButtonText: {
        fontSize: 14,
        color: '#333',
    },
    activeFilterButtonText: {
        color: '#fff',
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
    projectState: {
        fontSize: 12,
        color: '#007AFF',
        marginTop: 5,
    },
    loadingFooter: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

export default GitLabProjectsList;