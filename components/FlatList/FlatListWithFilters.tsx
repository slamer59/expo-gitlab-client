import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import { ListComponent } from "@/components/ListCards";
import { GlobalProjectsUIFilters } from "@/constants/UIFilters";

import FilterForm from "../Filter/FilterForm";
import { Text } from "../ui/text";

interface ListWithFiltersProps {
  queryFn: (params: any) => Promise<any>;
  ItemComponent: React.ComponentType<any>;
  SkeletonComponent: React.ComponentType<any>;
  defaultParams: any;
  pathname: string;
  paramsMap: any;
  itemId?: string;
}

const ErrorDisplay = ({ error, onRetry }) => {
  console.log("🚀 ~ error:", error)
  return <View style={{ padding: 20, alignItems: 'center' }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>An error occurred</Text>
    {/* <Text style={{ marginBottom: 20 }}>{error.message || "Failed to load items"}</Text> */}
    <TouchableOpacity onPress={onRetry} style={{ padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }}>
      <Text style={{ color: 'white' }}>Retry</Text>
    </TouchableOpacity>
  </View>
}


export default function FlatListWithFilters({
  queryFn,
  ItemComponent,
  SkeletonComponent,
  pathname,
  paramsMap,
  defaultParams,
  itemId,
}: ListWithFiltersProps) {
  const [params, setParams] = useState(defaultParams);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      let result;
      if (itemId === undefined) {
        result = await queryFn({ ...params, page, per_page: 20 });
      } else {
        result = await queryFn(itemId, { ...params, page, per_page: 20 });
      }

      if (result.data.length > 0) {
        setItems(prevItems => [...prevItems, ...result.data]);
        setPage(prevPage => prevPage + 1);
      } else {
        setHasMore(false);
      }
      setIsError(false);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, params, page, itemId, isLoading, hasMore]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleFiltersChange = useCallback((newFilters) => {
    const newQuery = GlobalProjectsUIFilters.reduce((acc, filter) => {
      const selectedValue = newFilters[filter.label]?.value;
      if (!selectedValue) return acc;

      const selectedOption = filter.options.find(option => option.value === selectedValue)?.filter;
      return { ...acc, ...selectedOption };
    }, {});

    setParams(prevParams => ({
      ...prevParams,
      ...newQuery
    }));
    setItems([]); // Clear existing items
    setPage(1); // Reset page
    setHasMore(true); // Reset hasMore
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchItems();
    }
  }, [fetchItems, isLoading, hasMore]);

  const renderFooter = useCallback(() => {
    if (!isLoading) return null;
    return (
      <View style={{ padding: 10 }}>
        <SkeletonComponent />
      </View>
    );
  }, [isLoading, SkeletonComponent]);

  const defaultUIFilterValues = React.useMemo(() => {
    return GlobalProjectsUIFilters.reduce((acc, filter) => {
      const defaultOption = filter.options.find(option => option.default);
      if (defaultOption) {
        acc[filter.label] = defaultOption.value;
      }
      return acc;
    }, {});
  }, []);

  const resetError = useCallback(() => {
    setError(null);
    setPage(1);
    setHasMore(true);
    fetchItems();
  }, [fetchItems]);

  return (
    <View style={{ flex: 1 }}>
      <FilterForm
        UIFilters={GlobalProjectsUIFilters}
        onFiltersChange={handleFiltersChange}
        defaultUIFilterValues={defaultUIFilterValues}
      />

      {items.length === 0 && !isLoading && (
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, margin: 8, borderRadius: 8, backgroundColor: '#f0f0f0' }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', margin: 8 }}>
            <View style={{ padding: 16, margin: 24 }}>
              <Ionicons name="search" size={32} color="red" />
            </View>
            <Text style={{ marginBottom: 8, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
              No items Found
            </Text>
            <Text style={{ marginBottom: 24, textAlign: 'center', color: '#666' }}>
              There are currently no items to display.
            </Text>
          </View>
        </View>
      )}

      {!isError ? (
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <ListComponent
              items={[item]}
              ItemComponent={ItemComponent}
              SkeletonComponent={SkeletonComponent}
              paramsMap={paramsMap}
              pathname={pathname}
              isLoading={false}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <ErrorDisplay
          error={error}
          onRetry={resetError}
        />
      )}
    </View>
  );
}