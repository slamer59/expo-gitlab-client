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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FilterProps {
    items: { label: string; values: { value: string; label: string }[]; placeholder: string };
}


export function Filter({ items }: FilterProps) {
    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 12,
        right: 12,
    };

    return (

        <Select defaultValue={{ value: items.values, label: items.label }}>
            <SelectTrigger>
                <SelectValue
                    className='text-sm text-foreground native:text-lg'
                    placeholder={items.placeholder}
                />
            </SelectTrigger>
            <SelectContent insets={contentInsets} className='w-[250px]'>
                <SelectGroup>
                    <SelectLabel>{items.label || "Items"}</SelectLabel>
                    {items.values.map((item) => (
                        <SelectItem key={item.value} label={item.label} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}