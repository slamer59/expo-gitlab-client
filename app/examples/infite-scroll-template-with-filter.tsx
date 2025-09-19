import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { IssueCard } from '@/components/Issue/issue-card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';

const IssuesList = () => {
    const router = useRouter();
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });
    const api = useGitLab(client);

    const [issues, setIssues] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [filter, setFilter] = useState('all');

    const projectId = '59795263'; // 59795263 59853773 278964

    const { data, error, isLoading, isError, refetch } = api.useProjectIssues(projectId, {
        page,
        per_page: 20,
        state: filter !== 'all' ? filter : "all"
    });

    useEffect(() => {
        if (data) {
            if (data.length > 0) {
                setIssues(prevIssues => page === 1 ? data : [...prevIssues, ...data]);
                setHasMore(true);
            } else {
                setHasMore(false);
            }
            setIsLoadingMore(false);
        }
    }, [data, page]);

    useEffect(() => {
        setPage(1);
        setIssues([]);
        refetch();
    }, [filter]);

    const handleLoadMore = () => {
        if (!isLoading && !isLoadingMore && hasMore) {
            setIsLoadingMore(true);
            setPage(prevPage => prevPage + 1);
        }
    };

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="large" />
            </View>
        );
    };

    if (isError) {
        return <Text>Error loading issues: {error.message}</Text>;
    }

    return (
        <View className="flex-1 p-2 bg-background">
            <Stack.Screen
                options={{
                    headerTitle: "Issues for Project",
                    headerRight: () => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Pressable>
                                    {({ pressed }) => (
                                        <Ionicons
                                            name="filter"
                                            size={25}
                                            color="white"
                                            className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`}
                                            testID="filter"
                                        />
                                    )}
                                </Pressable>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='w-lg'>
                                <DropdownMenuItem onPress={() => setFilter('all')}>
                                    <Text className="font-semibold text-white">All Issues</Text>
                                </DropdownMenuItem>
                                <DropdownMenuItem onPress={() => setFilter('opened')}>
                                    <Text className="font-semibold text-white">Open Issues</Text>
                                </DropdownMenuItem>
                                <DropdownMenuItem onPress={() => setFilter('closed')}>
                                    <Text className="font-semibold text-white">Closed Issues</Text>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ),
                }}
            />
            <Text className="mb-4 text-2xl font-bold">Issues</Text>
            {isLoading && page === 1 ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={issues}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <IssueCard item={item} />}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={renderFooter}
                />
            )}
        </View>
    );
};

export default IssuesList;
