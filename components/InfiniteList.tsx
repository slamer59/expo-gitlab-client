import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { create } from 'zustand';

interface ListState {
    items: any[];
    page: number;
    hasMore: boolean;
    isLoadingMore: boolean;
    filter: string;
    setItems: (items: any[]) => void;
    setPage: (page: number) => void;
    setHasMore: (hasMore: boolean) => void;
    setIsLoadingMore: (isLoadingMore: boolean) => void;
    setFilter: (filter: string) => void;
}

const useListStore = create<ListState>((set) => ({
    items: [],
    page: 1,
    hasMore: true,
    isLoadingMore: false,
    filter: 'all',
    setItems: (items) => set({ items }),
    setPage: (page) => set({ page }),
    setHasMore: (hasMore) => set({ hasMore }),
    setIsLoadingMore: (isLoadingMore) => set({ isLoadingMore }),
    setFilter: (filter) => set({ filter }),
}));

interface GenericListProps {
    title: string;
    fetchItems: (page: number, filter: string) => Promise<any[]>;
    renderItem: (item: any) => React.ReactElement;
    filters: { value: string; label: string }[];
}

const GenericList: React.FC<GenericListProps> = ({ title, fetchItems, renderItem, filters }) => {
    const { items, page, hasMore, isLoadingMore, filter, setItems, setPage, setHasMore, setIsLoadingMore, setFilter } = useListStore();

    const loadItems = async () => {
        try {
            const newItems = await fetchItems(page, filter);
            if (newItems.length > 0) {
                setItems(page === 1 ? newItems : [...items, ...newItems]);
                setHasMore(true);
            } else {
                setHasMore(false);
            }
            setIsLoadingMore(false);
        } catch (error) {
            console.error("Error loading items:", error);
            setHasMore(false);
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, [page, filter]);

    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            setIsLoadingMore(true);
            setPage(page + 1);
        }
    };

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        setPage(1);
        setItems([]);
    };

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="large" />
            </View>
        );
    };

    return (
        <View className="flex-1 p-2 bg-background">
            <Stack.Screen
                options={{
                    headerTitle: title,
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
                                {filters.map((filterOption) => (
                                    <DropdownMenuItem key={filterOption.value} onPress={() => handleFilterChange(filterOption.value)}>
                                        <Text className="font-semibold text-white">{filterOption.label}</Text>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ),
                }}
            />
            <Text className="mb-4 text-2xl font-bold">{title}</Text>
            {items.length === 0 && isLoadingMore ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => renderItem(item)}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={renderFooter}
                />
            )}
        </View>
    );
};

export default GenericList;
