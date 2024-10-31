import { Ionicons } from '@expo/vector-icons';
import { Text } from "components/ui/text";
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface StatusItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
    color: string;
    expandable?: boolean;
    children?: React.ReactNode;
}

export const StatusItem = ({ icon, text, color, expandable, children }: StatusItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View className="mb-2">
            <TouchableOpacity
                className="flex-row items-center justify-between py-2"
                onPress={() => expandable && setIsExpanded(!isExpanded)}
            >
                <View className="flex-row items-center">
                    <Ionicons name={icon} size={20} color={color} />
                    <Text className="ml-2 text-white">{text}</Text>
                </View>
                {expandable && (
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="gray"
                    />
                )}
            </TouchableOpacity>
            {isExpanded && children}
        </View>
    );
};
