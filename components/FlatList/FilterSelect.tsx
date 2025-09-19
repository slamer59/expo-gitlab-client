import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterProps {
    options: FilterOption[];
    placeholder: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
}

export function FlatFilterButton({
    options,
    placeholder,
    selectedValue,
    onValueChange
}: FilterProps) {
    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
        left: 12,
        right: 12,
    };
    return (
        <Select
            className='m-2'
            value={selectedValue}
            onValueChange={onValueChange}
        >
            <SelectTrigger
                className="flex-row items-center justify-between px-4 py-2 rounded-full bg-filters"
            >
                <SelectValue
                    className="text-sm font-semibold text-white"
                    placeholder={placeholder}
                />
                {/* <ChevronDownIcon className="w-4 h-4 text-white" /> */}
            </SelectTrigger>
            <SelectContent
                className="max-h-screen mt-1 text-white border border-gray-700 rounded-2xl bg-filters"
            >
                <SelectGroup>
                    {/* <ScrollView className='max-h-64'> */}
                    {options.map((option, index) => (
                        <SelectItem
                            key={index}
                            label={option.label}
                            value={option.value}
                            className="px-4 py-2 text-sm text-white "
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                    {/* </ScrollView> */}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
