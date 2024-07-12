import { Filter } from "@/components/ui/filter-select";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

export function TopFilterList({ filters }: {
    filters: { label: string, options: { value: string, label: string }[], placeholder: string }[]
}) {
    const [selectedFilters, setSelectedFilters] = useState({});
    // const [defaultFilters, setDefaultFilters] = useState(filters);

    const clearFilters = () => {
        setSelectedFilters({});
    };

    return (
        <>
            <ScrollView
                horizontal
                className='flex flex-row bg-transparent max-h-14' >
                <TouchableOpacity
                    className="items-center justify-center" // m-1 bg-transparent bg-white rounded-3xl"
                    onPress={clearFilters}>
                    <Ionicons name="close-circle-outline" size={24} color="red" />
                    {/* <Text
                        className="font-bold"
                    >Clear Filters
                    </Text> */}
                </TouchableOpacity>
                {
                    filters.map((filter, index) => (
                        <Filter
                            key={index}
                            items={filter.items}
                            label={filter.label}
                            options={filter.options}
                            placeholder={filter.placeholder}
                            selectedValue={selectedFilters[filter.label]}
                            onValueChange={(value) => setSelectedFilters({ ...selectedFilters, [filter.label]: value })}
                        />
                    ))
                }
            </ScrollView>

            {selectedFilters.length > 0 && (
                <Text>Selected Filters: {JSON.stringify(selectedFilters)}</Text>
            )
            }

        </>
    );
}
