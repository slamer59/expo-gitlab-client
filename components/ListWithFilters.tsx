import { ListComponent } from "@/components/ListCards";
import { useGetData } from "@/lib/gitlab/hooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";
import FilterForm from "./Filter/FilterForm";
import { Text } from "./ui/text";

interface Filter {
  label: string;
  options: FilterOption[];
  placeholder: string;
}

interface FilterOption {
  value: string;
  label: string;
  filter: any;
}

interface ListWithFiltersProps {
  UIFilters: Filter[];
  ItemComponent: React.ComponentType<any>;
  SkeletonComponent: React.ComponentType<any>;
  pathname: string;
  defaultParams: any;
  paramsMap: any;
  endpoint: string;
  query_cache_name: string;
}
export default function ListWithFilters({
  UIFilters,
  ItemComponent,
  SkeletonComponent,
  pathname,
  endpoint,
  query_cache_name,
  paramsMap,
  defaultParams,
}: ListWithFiltersProps) {
  const [params, setParams] = useState(defaultParams)

  const handleFiltersChange = useCallback((newFilters) => {
    const newQuery = UIFilters.reduce((acc, filter) => {
      const selectedValue = newFilters[filter.label]?.value;
      if (!selectedValue) return acc;

      const selectedOption = filter.options.find(option => option.value === selectedValue)?.filter;
      return { ...acc, ...selectedOption };
    }, {});

    setParams(prevParams => ({
      ...prevParams,
      query: newQuery
    }));
  }, []);

  const {
    data: items,
    isLoading,
    isError,
    error,
  } = useGetData(
    [query_cache_name, params.query, params.path],
    endpoint,
    params,
    {
      enabled: true,
    }
  );

  return (
    <ScrollView className="flex-1 m-2">
      <FilterForm
        UIFilters={UIFilters}
        onFiltersChange={handleFiltersChange}
      />
      {/* {isLoading && <Loading />} */}
      {/* <Text>
        {
          JSON.stringify(params)}
      </Text> */}
      {/* No items to display */}
      {items?.length === 0 && !isLoading && (

        <View className="flex-row items-center p-4 m-2 space-x-4 bg-white rounded-lg">
          <View className="items-center justify-center w-full m-2 ">
            <View className="p-4 m-6">
              <Ionicons name="search" size={32} color="red" />
            </View>
            <Text className="mb-2 text-2xl font-bold text-center text-gray-800 rounded-4xl">
              No items Found
            </Text>
            <Text className="mb-6 text-center text-gray-600">
              There are currently no items to display.
            </Text>
          </View>
        </View>
      )}
      {!isError ? (
        <ListComponent
          isLoading={isLoading}
          items={items}
          ItemComponent={ItemComponent}
          SkeletonComponent={SkeletonComponent}
          paramsMap={paramsMap}
          params={defaultParams}
          pathname={pathname}
        />
      ) : (
        <Error
          error={error}
          reset={() => console.error("To be implemented")}
        />
      )}

    </ScrollView>
  );
}