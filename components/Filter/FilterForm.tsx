import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Filter } from "./FilterSelect";

interface Filter {
    label: string;
    options: {
        label: string;
        value: string;
    }[]
    placeholder: string;
}
interface FilterFormProps {
    onFiltersChange: (filters: Record<string, string>) => void;
    UIFilters: Filter[];
}
export default function FilterForm({ onFiltersChange, UIFilters }: FilterFormProps) {
    const [selectedFilters, setSelectedFilters] = useState({});
    const insets = useSafeAreaInsets();

    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 12,
        right: 12,
    };

    const handleFilterChange = (filterLabel, value) => {
        setSelectedFilters(prevFilters => {
            const newFilters = {
                ...prevFilters,
                [filterLabel]: value
            };

            if (value === '') {
                delete newFilters[filterLabel];
            }

            return newFilters;
        });
    };

    const resetAllFilters = () => {
        setSelectedFilters({});
    };

    useEffect(() => {
        onFiltersChange(selectedFilters);
    }, [selectedFilters, onFiltersChange]);

    return (
        <ScrollView
            horizontal
            className="flex flex-row bg-transparent max-h-14"
        >
            <View className="flex-row items-center justify-between mt-4 mb-4">
                <TouchableOpacity
                    onPress={resetAllFilters}
                    className="items-center justify-center" // m-1 bg-transparent bg-white rounded-3xl"
                >
                    <Ionicons
                        name="close-circle-outline"
                        size={24}
                        color="red"
                    />
                </TouchableOpacity>
            </View>
            {UIFilters.map((filter, index) => (
                <Filter
                    key={index}
                    options={filter.options}
                    placeholder={filter.placeholder}
                    selectedValue={selectedFilters[filter.label] || ''}
                    onValueChange={(value) => handleFilterChange(filter.label, value)}
                />
            ))}
        </ScrollView>
    );
}