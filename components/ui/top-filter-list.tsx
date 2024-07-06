
import { Filter } from "@/components/ui/filter-select";
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export function TopFilterList() {
    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 12,
        right: 12,
    };
    const filters = [{
        label: "Fruits",
        values: [
            { value: 'apple', label: 'Apple' },
            { value: 'banana', label: 'Banana' },
            { value: 'blueberry', label: 'Blueberry' },
            { value: 'grapes', label: 'Grapes' },
            { value: 'pineapple', label: 'Pineapple' },
        ],
        placeholder: "Select a fruit..."

    },
    {
        label: "Meats",
        values: [
            { value: 'beef', label: 'Beef' },
            { value: 'chicken', label: 'Chicken' },
            { value: 'lamb', label: 'Lamb' },
            { value: 'pork', label: 'Pork' },
            { value: 'turkey', label: 'Turkey' },
        ],
        placeholder: "Select a meat..."
    },
    {
        label: "Vegetables",
        values: [
            { value: 'broccoli', label: 'Broccoli' },
            { value: 'carrot', label: 'Carrot' },
            { value: 'corn', label: 'Corn' },
            { value: 'cucumber', label: 'Cucumber' },
            { value: 'potato', label: 'Potato' },
        ],
        placeholder: "Select a vegetable..."
    }
    ]

    return (
        <View className='flex flex-row items-center justify-center flex-1 gap-5'>
            {filters.map((filter, index) => (
                <Filter items={filter} />
            ))}
        </View>
    );
}