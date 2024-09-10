import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

type ListItem = {
  id: string | number;
  // Add other properties that are common to all items in your list
};

type ListComponentProps<T extends ListItem> = {
  items: T[] | null;
  ItemComponent: React.ComponentType<{ item: T }>;
  SkeletonComponent: React.ComponentType;
  pathname: string;
  paramsMap: { [key: string]: keyof T };
  isLoading: boolean;
};

export function ListComponent<T extends ListItem>({
  items,
  ItemComponent,
  SkeletonComponent,
  pathname,
  paramsMap,
  isLoading
}: ListComponentProps<T>) {
  const router = useRouter();
  return (
    <>
      {isLoading && Array.from({ length: 5 }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}

      {items && !isLoading && (
        items.map((item, index) => {
          const params = Object.keys(paramsMap).reduce((acc, key) => {
            acc[key] = item[paramsMap[key]];
            return acc;
          }, {});
          return (
            <>
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  router.push({
                    pathname: pathname,
                    params: params,
                  });
                }}
                testID={`card-${index}`}
              >
                <ItemComponent
                  item={item}
                />
              </TouchableOpacity >
            </>
          );
        })
      )}

    </>
  );
}
