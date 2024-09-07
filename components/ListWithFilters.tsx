import { ListComponent } from "@/components/ListCards";
import { useGetData } from "@/lib/gitlab/hooks";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import Loading from "./Loading";
import { TopFilterList } from "./ui/top-filter-list";

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
  items: any[];
  title: string;
  UIFilters: Filter[];
  ItemComponent: React.ComponentType<any>;
  SkeletonComponent: React.ComponentType<any>;
  pathname: string;
  params: any;
  paramsMap: any;
  isLoading: boolean;
  isError: boolean;
  error: any;
}
export default function ListWithFilters({
  title,
  UIFilters,
  ItemComponent,
  SkeletonComponent,
  pathname,
  paramsMap,
  params,
  endpoint,
  cache_name,
}: ListWithFiltersProps) {


  const {
    data: items,
    isLoading,
    isError,
    error,
  } = useGetData(
    [cache_name, params?.query, params?.path],
    endpoint,
    params,
  );

  function updateParams(filterValues: any, params: any) {
    // Update the params object based on the selected filter values
    if (params) {
      params.query = {
        ...params.query,
        ...filterValues,
      };
    }

    return params;
  }
  const [selectedFilters, setSelectedFilters] = useState({});

  const clearFilters = () => {
    setSelectedFilters({});
  };

  useEffect(() => {
    // loop over filters and check if selectedFilters has the same key and value
    // if it does, then add it to the params
    for (const key in selectedFilters) {
      if (selectedFilters.hasOwnProperty(key)) {
        const value = selectedFilters[key];
        // where label == Items
        for (const filter of UIFilters) {
          if (filter.label === key) {
            for (const option of filter.options) {
              if (option.value === value.value) {
                updateParams(option.filter, params);
              }
            }
          }
        }
      }
    }
  }, [selectedFilters, UIFilters, params]);
  // filter values
  console.log(paramsMap)
  return (
    <>
      <Stack.Screen
        options={{
          title: title,
        }}
      />
      <ScrollView className="flex-1 m-2">
        <TopFilterList
          UIFilters={UIFilters}
          setSelectedFilters={setSelectedFilters}
          selectedFilters={selectedFilters}
          clearFilters={clearFilters}
        />
        {isLoading && <Loading />}
        {!isError ? (
          <ListComponent
            items={items}
            ItemComponent={ItemComponent}
            SkeletonComponent={SkeletonComponent}
            pathname={pathname}
            paramsMap={paramsMap}
          />
        ) : (
          <Error
            error={error}
            reset={() => console.error("To be implemented")}
          />
        )}
      </ScrollView>
    </>
  );
}
