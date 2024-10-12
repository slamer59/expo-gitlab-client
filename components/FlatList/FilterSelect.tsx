import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import React from 'react';

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
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
