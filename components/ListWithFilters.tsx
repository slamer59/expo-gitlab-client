import { ListComponent } from "@/components/ListCards";
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
  queryFn: (params: any) => Promise<any>;
  ItemComponent: React.ComponentType<any>;
  SkeletonComponent: React.ComponentType<any>;
  defaultParams: any;
  pathname: string;
  paramsMap: any;
  projectId?: string;
  defaultUIFilterValues?: any;
}
export default function ListWithFilters({
  UIFilters,
  queryFn,
  ItemComponent,
  SkeletonComponent,
  pathname,
  paramsMap,
  defaultParams,
  defaultUIFilterValues,
  projectId,
}: ListWithFiltersProps) {
  const [params, setParams] = useState(defaultParams);



  const handleFiltersChange = useCallback((newFilters) => {

    const newQuery = UIFilters.reduce((acc, filter) => {
      const selectedValue = newFilters[filter.label]?.value;
      if (!selectedValue) return acc;

      const selectedOption = filter.options.find(option => option.value === selectedValue)?.filter;
      return { ...acc, ...selectedOption };
    }, {});

    setParams(prevParams => ({
      ...prevParams,  // Preserve existing query parameters
      ...newQuery  // Apply new filters
    }));
  }, [UIFilters]);


  let result;
  if (projectId === undefined) {
    result = queryFn(params);

  } else {
    result = queryFn(projectId, params);
  }
  const items = result.data;
  const isLoading = result.isLoading;
  const isError = result.isError;
  const error = result.error;
  return (
    <ScrollView className="flex-1 mt-2">
      <FilterForm
        UIFilters={UIFilters}
        onFiltersChange={handleFiltersChange}
        defaultUIFilterValues={defaultUIFilterValues}
      />
      {/* {isLoading && <Loading />} */}
      {/* <Text>
        {
          JSON.stringify(params)}
      </Text> */}
      {/* No items to display */}
      {items?.length === 0 && !isLoading && (
        <View className="flex-row items-center p-4 m-2 space-x-4 rounded-lg bg-card">
          <View className="items-center justify-center w-full m-2 ">
            <View className="p-4 m-6">
              <Ionicons name="search" size={32} color="red" />
            </View>
            <Text className="mb-2 text-2xl font-bold text-center text-white rounded-4xl">
              No items Found
            </Text>
            <Text className="mb-6 text-center text-muted">
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