
import { View } from '@/components/Themed';
import { Filter } from "@/components/ui/filter-select";
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export function TopFilterList() {
    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 12,
        right: 12,
    };
    const filters = [
        {
            label: "Inbox",
            values: [
                { value: 'all', label: 'All' },
                { value: 'unread', label: 'Unread' },
                { value: 'starred', label: 'Starred' },
                // Add more inbox options as needed
            ],
            placeholder: "Select an inbox..."
        },
        {
            label: "Notifications",
            values: [
                { value: 'unread', label: 'Unread' },
                { value: 'read', label: 'Read' },
                { value: 'important', label: 'Important' },
                // Add more notification options as needed
            ],
            placeholder: "Select a notification..."
        },
        {
            label: "Repository",
            values: [
                { value: 'public', label: 'Public' },
                { value: 'private', label: 'Private' },
                { value: 'forked', label: 'Forked' },
                // Add more repository options as needed
            ],
            placeholder: "Select a repository..."
        }
    ]

    return (
        <View className='flex flex-row gap-5'>
            {
                filters.map((filter, index) => (
                    <Filter items={filter} />
                ))
            }
        </View>
    );
}