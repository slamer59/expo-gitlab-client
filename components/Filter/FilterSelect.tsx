import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import React from 'react';

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
            className='m-1 bg-transparent'
            value={selectedValue}
            onValueChange={onValueChange}
        >
            <SelectTrigger
                className='bg-white rounded-3xl'
            >
                <SelectValue
                    className='font-bold text-black'
                    placeholder={placeholder}
                />
            </SelectTrigger>
            <SelectContent
                className='font-bold rounded-3xl'
            >
                <SelectGroup
                >
                    <SelectLabel
                        className=''
                    >
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
