
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
    const items = {
        label: "Fruits",
        values: [
            { value: 'apple', label: 'Apple' },
            { value: 'banana', label: 'Banana' },
            { value: 'blueberry', label: 'Blueberry' },
            { value: 'grapes', label: 'Grapes' },
            { value: 'pineapple', label: 'Pineapple' },
        ],
        placeholder: "Select a fruit..."

    }
    // {
    //     label: "Meat",
    //     values: [
    //         { value: 'beef', label: 'Beef' },
    //         { value: 'chicken', label: 'Chicken' },
    //         { value: 'lamb', label: 'Lamb' },
    //         { value: 'pork', label: 'Pork' },
    //         { value: 'turkey', label: 'Turkey' },
    //     ]
    // }
    // ]

    return (
        <View className='items-center justify-center flex-1 gap-5 p-6 bg-secondary/30'>

            <Filter items={items} />
        </View>
    );
}