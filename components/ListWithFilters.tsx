import { ListComponent } from "@/components/ListCards";
import { useGetData } from "@/lib/gitlab/hooks";
import React, { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import FilterForm from "./Filter/FilterForm";
import Loading from "./Loading";

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
      {isLoading && <Loading />}
      {/* <Text>
        {
          JSON.stringify(params)}
      </Text> */}
      {!isError ? (
        <ListComponent
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