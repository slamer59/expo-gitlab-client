import { FlatListComponents } from '@/components/FlatList/FlatListCards';
import { IssueCard, IssueCardSkeleton } from '@/components/Issue/issue-card';
import { GlobalIssueUIFilters } from '@/constants/UIFilters';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { extractDefaultFilters, extractDefaultUIOptions } from '@/lib/utils';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

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

    const projectId = '278964'; // 59795263 59853773 278964
    const UIFilters = GlobalIssueUIFilters;
    const defaultParams = extractDefaultFilters(UIFilters);
    const defaultUIFilterValues = extractDefaultUIOptions(UIFilters);
    const pathname = "/workspace/projects/[projectId]/issues/[issue_iid]"
    const paramsMap = {
        "projectId": "project_id", "issue_iid": "iid"
    }
    const { data, error, isLoading, isError, refetch } = api.useProjectIssues(projectId, { page, per_page: 20 });

    useEffect(() => {
        if (data) {
            if (data.length > 0) {
                setIssues(prevIssues => [...prevIssues, ...data]);
                setHasMore(true);
            } else {
                setHasMore(false);
            }
            setIsLoadingMore(false);
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, [page, refetch]);


    const handleLoadMore = () => {
        if (!isLoading && !isLoadingMore && hasMore) {
            setIsLoadingMore(true);
            setPage(prevPage => prevPage + 1);
        }
    };

    if (isError) {
        return <Text>Error loading issues: {error.message}</Text>;
    }
    const ItemComponent = IssueCard
    const SkeletonComponent = IssueCardSkeleton
    const items = issues
    return (
        <View className="flex-1 p-2 bg-background">
            <Stack.Screen
                options={{
                    headerTitle: "Issues for Project",
                }}
            />

            {!isError ? (
                <FlatListComponents
                    isLoading={isLoading}
                    isLoadingMore={isLoadingMore}
                    items={items}
                    ItemComponent={ItemComponent}
                    SkeletonComponent={SkeletonComponent}
                    paramsMap={paramsMap}
                    pathname={pathname}
                    handleLoadMore={handleLoadMore}
                />
            ) : (
                <Error
                    error={error}
                    reset={() => console.error("To be implemented")}
                />
            )}
        </View>
    );
};

export default IssuesList;
