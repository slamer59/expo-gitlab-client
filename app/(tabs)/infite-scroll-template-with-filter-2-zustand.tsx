import { FlatFilterButton } from '@/components/FlatList/FilterSelect';
import { FlatListCards } from '@/components/FlatList/FlatListCards';
import { IssueCard, IssueCardSkeleton } from '@/components/Issue/issue-card';
import { GlobalIssueUIFilters } from '@/constants/UIFilters';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { extractDefaultUIOptions } from '@/lib/utils';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { create } from 'zustand';

const PROJECT_ID = '59853773';

export const UIFilters = GlobalIssueUIFilters;

interface Issue {
    id: number;
    web_url: string;
    state: string;
    title: string;
    type: string;
    created_at: string;
    updated_at: string;
}

interface FilterState {
    [key: string]: string;
}

interface ScreenState {
    items: Issue[];
    page: number;
    loading: boolean;
    filters: FilterState;
    hasMore: boolean;
    error: string | null;
    setItems: (items: Issue[]) => void;
    setPage: (page: number) => void;
    setLoading: (loading: boolean) => void;
    setFilter: (key: string, value: string) => void;
    setHasMore: (hasMore: boolean) => void;
    setError: (error: string | null) => void;
    fetchItems: (refresh?: boolean) => Promise<void>;
}

const createScreenStore = (queryFn: { (projectId: any, params?: {}): Promise<any>; (arg0: { page: number; per_page: number; }, arg1: { page: number; per_page: number; } | undefined): any; }, itemId: string | undefined) => create<ScreenState>((set, get) => ({
    items: [],
    page: 1,
    loading: false,
    filters: UIFilters.reduce((acc, filter) => {
        const defaultOption = filter.options.find(option => option.default);
        if (defaultOption) {
            acc[filter.label.toLowerCase()] = defaultOption.value;
        }
        return acc;
    }, {} as FilterState),
    hasMore: true,
    error: null,
    setItems: (items) => set({ items }),
    setPage: (page) => set({ page }),
    setLoading: (loading) => set({ loading }),
    setFilter: (key, value) => set(state => ({
        filters: { ...state.filters, [key]: value }
    })),
    setHasMore: (hasMore) => set({ hasMore }),
    setError: (error) => set({ error }),
    fetchItems: async (refresh = false) => {
        const { loading, hasMore, page, filters, items } = get();
        if (loading || (!refresh && !hasMore)) return;

        set({ loading: true, error: null });
        try {
            const params = UIFilters.reduce((acc, filter) => {
                const selectedOption = filter.options.find(option => option.value === filters[filter.label.toLowerCase()]);
                if (selectedOption) {
                    return { ...acc, ...selectedOption.filter };
                }
                return acc;
            }, {});
            let result;
            if (itemId === undefined) {
                result = await queryFn({
                    ...params,
                    page: refresh ? 1 : page,
                    per_page: 20,
                });

            } else {
                result = await queryFn(itemId, {
                    ...params,
                    page: refresh ? 1 : page,
                    per_page: 20,
                });
            }
            const newItems = result;

            if (refresh) {
                set({ items: newItems, page: 2 });
            } else {
                set({ items: [...items, ...newItems], page: page + 1 });
            }

            set({ hasMore: newItems.length === 20 });
        } catch (error) {
            console.error('Error fetching items:', error);
            set({ error: 'Failed to fetch items. Please try again.' });
        } finally {
            set({ loading: false });
        }
    },
}));

const GitLabProjectsList = () => {
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const useScreenStore = useMemo(() => createScreenStore(client.ProjectIssues.all, PROJECT_ID), []);
    const { items, loading, filters, error, fetchItems, setFilter } = useScreenStore();
    console.log("🚀 ~ GitLabProjectsList ~ filters:", filters)
    const defaultUIFilterValues = extractDefaultUIOptions(UIFilters);
    const pathname = "/workspace/projects/[projectId]/issues/[issue_iid]"
    const paramsMap = {
        "projectId": "project_id", "issue_iid": "iid"
    }
    useEffect(() => {
        fetchItems(true);
    }, [filters, fetchItems]);


    const handleLoadMore = useCallback(() => {
        if (!loading) {
            fetchItems();
        }
    }, [loading, fetchItems]);

    const handleRefresh = useCallback(() => {
        fetchItems(true);
    }, [fetchItems]);

    return (
        <View className="flex-1 p-2.5">
            <ScrollView horizontal className="flex-row mb-2.5">
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
                useScreenStore={useScreenStore}
                handleLoadMore={handleLoadMore}
                handleRefresh={handleRefresh}
                ItemComponent={IssueCard}
                SkeletonComponent={IssueCardSkeleton}
                pathname={pathname}
                paramsMap={paramsMap}
                isLoading={loading}
                error={error}
            />
        </View>
    );


};

export default GitLabProjectsList;