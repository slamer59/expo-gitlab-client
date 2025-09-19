import React from 'react';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

interface FilterProps {
    options: {
        label: string;
        value: string;
    }[];
    placeholder: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
}

export function Filter({
    options,
    placeholder,
    selectedValue,
    onValueChange }: FilterProps) {

    return (
        <Select
            className='m-2'
            value={selectedValue}
            onValueChange={onValueChange}
        >
            <SelectTrigger
                className='flex-row items-center justify-center flex-1 bg-filters rounded-3xl'
            >
                <SelectValue
                    className='mr-1 text-sm font-bold text-white'
                    placeholder={placeholder}
                />
            </SelectTrigger>
            <SelectContent
                className='max-h-screen mt-1 font-bold rounded-2xl bg-filters'
            >
                <SelectGroup>
                    <SelectLabel>
                        {"Items"}
                    </SelectLabel>
                    {Object.keys(options).map((key, index) => (
                        <SelectItem
                            key={index}
                            label={options[key].label}
                            value={options[key].value}
                        >
                            {options[key].label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select >
    );
}
