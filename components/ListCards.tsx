import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";

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
};

export function ListComponent<T extends ListItem>({
  items,
  ItemComponent,
  SkeletonComponent,
  pathname,
  paramsMap,
}: ListComponentProps<T>) {
  const router = useRouter();
  return (
    <>
      {items
        ? items.map((item) => {
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
              >
                <ItemComponent item={item} />
                <View className="my-2 border-b border-gray-300" />
                <Text>

                </Text>
              </TouchableOpacity>
            </>
          );
        })
        : Array.from({ length: 5 }).map((_, index) => (
          <>
            <SkeletonComponent key={index} />
            <View className="my-2 border-b border-gray-300" />
          </>
        ))}
    </>
  );
}