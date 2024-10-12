import { Issue } from "@/lib/gitlab/future/repository";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { EmptyComponent } from "./EmptyComponent";

type ListItem = {
  id: string | number;
  // Add other properties that are common to all items in your list
};

type ListComponentProps<T extends ListItem> = {
  items: T[] | null;
  useScreenStore: () => any;
  ItemComponent: React.ComponentType<{ item: T }>;
  SkeletonComponent: React.ComponentType;
  pathname: string;
  paramsMap: { [key: string]: keyof T };
  isLoading: boolean;
  handleLoadMore: () => void;
  handleRefresh: () => void;
};

export function FlatListCards<T extends ListItem>({
  items,
  // useScreenStore,
  ItemComponent,
  SkeletonComponent,
  pathname,
  paramsMap,
  isLoading,
  error,
  handleLoadMore,
  // handleRefresh
}: ListComponentProps<T>) {
  const router = useRouter();
  const MemoizedItemComponent = React.memo(ItemComponent);
  const getParams = useMemo(() => (item: T) =>
    Object.entries(paramsMap).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: item[value],
      }),
      {}
    ), [paramsMap]);
  const ITEM_HEIGHT = 100; // Adjust this value based on your item height
  return (
    <>
      <FlatList
        data={items}
        renderItem={({ item }: { item: Issue }) => {
          const params = getParams(item);
          return <TouchableOpacity
            key={item.id}
            onPress={() => {
              router.push({
                pathname: pathname,
                params: params,
              });
            }}
            testID={`card-${item.id}`}
          >
            <MemoizedItemComponent item={item} />
          </TouchableOpacity>
        }}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isLoading ? (
            <View className="items-center">
              {isLoading && Array.from({ length: 5 }).map((_, index) => (
                <SkeletonComponent key={index} />
              ))}
            </View>
          ) : null
        }
        // refreshing={isLoading && useScreenStore.getState().page === 1}
        // onRefresh={handleRefresh}
        ListEmptyComponent={() => EmptyComponent(items, isLoading, error)}
        windowSize={5}
        removeClippedSubviews={true}
        // Uncomment and adjust if you know your item height
        getItemLayout={(data, index) => (
          { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
        )}
      />
    </>
  );
}
