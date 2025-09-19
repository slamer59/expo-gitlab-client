import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { CommitCard, CommitCardSkeleton } from '@/components/Commit/commit-card';
import { FlatFilterButton } from '@/components/FlatList/FilterSelect';
import { FlatListCards } from '@/components/FlatList/FlatListCards';
import { createScreenStore } from '@/lib/filter/state';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';


export default function CommitsList() {
    const { projectId } = useLocalSearchParams();

    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });
    const api = useGitLab(client);

    const { data: branches, loading: branchesLoading } = api.useProjectBranches(projectId);
    // GET /projects/:id/repository/commits/:sha/diff

    const UIFilters = [
        {
            label: 'Branch',
            placeholder: 'Select Branch',
            options: [
                { label: 'All Branches', value: '', default: true, ref_name: '' },
                ...(branches?.map(branch => ({
                    label: branch.name,
                    value: branch.name,

                    filter: { ref_name: branch.name },
                })) || [])
            ],
        },
    ];
    const useScreenStore = useMemo(() => createScreenStore(client.Commits.all, projectId, UIFilters), []);
    const { items, loading, filters, error, fetchItems, setFilter } = useScreenStore();

    const pathname = `/workspace/projects/${projectId}/commits/[sha]`;
    const paramsMap = {
        "sha": "short_id"
    }

    useEffect(() => {
        fetchItems(true);
    }, [filters, fetchItems]);


    const handleLoadMore = useCallback(() => {
        if (!loading) {
            fetchItems();
        }
    }, [loading, fetchItems]);


    return (
        <View className="flex-1 p-2 bg-background">
            <Stack.Screen
                options={{
                    headerTitle: "Commits",
                }}
            />
            <View className="*:mb-2 flex-col justify-between">
                <ScrollView horizontal className='px-2'>
                    {UIFilters.map((filter, index) => (
                        <FlatFilterButton
                            key={index}
                            options={filter.options}
                            placeholder={filter.placeholder}
                            selectedValue={filters[filter.label]}
                            onValueChange={(option) => setFilter(filter.label.toLowerCase(), option.value)}
                        />
                    ))}
                </ScrollView>

                <FlatListCards
                    items={items}
                    handleLoadMore={handleLoadMore}
                    ItemComponent={CommitCard}
                    SkeletonComponent={CommitCardSkeleton}
                    pathname={pathname}
                    paramsMap={paramsMap}
                    isLoading={loading}
                    error={error}
                />
            </View>
        </View>
    );
}
