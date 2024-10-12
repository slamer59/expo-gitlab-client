import { create } from "zustand";

interface FilterState {
    [key: string]: string;
}
interface Item {
    id: number;
    web_url: string;
    state: string;
    title: string;
    type: string;
    created_at: string;
    updated_at: string;
}
interface ScreenState {
    items: Item[];
    page: number;
    loading: boolean;
    filters: FilterState;
    hasMore: boolean;
    error: string | null;
    setItems: (items: Item[]) => void;
    setPage: (page: number) => void;
    setLoading: (loading: boolean) => void;
    setFilter: (key: string, value: string) => void;
    setHasMore: (hasMore: boolean) => void;
    setError: (error: string | null) => void;
    fetchItems: (refresh?: boolean) => Promise<void>;
}


export const createScreenStore = (queryFn, itemId, UIFilters) => {
    const initialState = {
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
    };

    return create<ScreenState>((set, get) => ({
        ...initialState,
        setItems: (items) => set({ items }),
        setPage: (page) => set({ page }),
        setLoading: (loading) => set({ loading }),
        setFilter: (key, value) => set(state => ({
            filters: { ...state.filters, [key]: value }
        })),
        setHasMore: (hasMore) => set({ hasMore }),
        setError: (error) => set({ error }),
        reset: () => set(initialState), // New reset function
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
        // New reset function
    }));
};
