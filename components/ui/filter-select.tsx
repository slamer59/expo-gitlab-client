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
    items: { label: string; values: { value: string; label: string }[]; placeholder: string };
}

export function Filter({ items }: FilterProps) {


    return (
        <Select
            className='bg-transparent'
            defaultValue={{ value: items.values, label: items.label }}>
            <SelectTrigger
                className='bg-transparent'
            >
                <SelectValue
                    placeholder={items.placeholder}
                />
            </SelectTrigger>
            <SelectContent

            >
                <SelectGroup
                >
                    <SelectLabel
                    >{items.label || "Items"}</SelectLabel>
                    {items.values.map((item) => (
                        <SelectItem
                            key={item.value} label={item.label} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))
                    }
                </SelectGroup>
            </SelectContent>
        </Select >
    );
}