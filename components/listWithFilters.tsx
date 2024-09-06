import { Stack } from "expo-router";
import Error from "./Error";
import Loading from "./Loading";
import { TopFilterList } from "./ui/top-filter-list";

interface ListWithFiltersProps {
    title: string;
    filters: Filter[];
    setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
    selectedFilters: string[];
    clearFilters: () => void;
    isLoading: boolean;
    isError: boolean;
    error: any;
    children: React.ReactNode; // Add this line
}

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
export function ListWithFilters({
    title,
    filters,
    setSelectedFilters,
    selectedFilters,
    clearFilters,
    isLoading,
    isError,
    error,
    children
}: ListWithFiltersProps) {
    return (
        <>
            <Stack.Screen
                options={{
                    title: title,
                }}
            />
            <TopFilterList
                filters={filters}
                setSelectedFilters={setSelectedFilters}
                selectedFilters={selectedFilters}
                clearFilters={clearFilters}
            />
            {isLoading && <Loading />}
            {!isError ? (
                <>{children}</>
            ) : (
                <Error error={error} reset={() => console.error("To be implemented")} />
            )}
        </>
    );
}
