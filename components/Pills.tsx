import { Text } from "@/components/ui/text";
import React from "react";
import { View } from "react-native";

export interface PillProps {
    label: string;
    variant?: string;
    className?: string;
}

// Function to determine if a color is light or dark
function isColorLight(color: string): boolean {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 155; // You can adjust this threshold
}

// Function to get contrasting text color
function getTextColor(backgroundColor: string): string {
    return isColorLight(backgroundColor) ? 'black' : 'white';
}

export function Pills({ label, variant = 'purple', className }: PillProps) {
    let backgroundColor;
    let textColor;

    if (variant) {
        if (variant.startsWith('#')) {
            backgroundColor = variant;
            textColor = getTextColor(variant);
        } else {
            backgroundColor = `bg-pills-${variant}`;
            // For predefined colors, you might need to map them to their hex values
            // and then determine the text color. For now, we'll use white as default.
            textColor = 'white';
        }
    } else {
        backgroundColor = "bg-pills-purple";
        textColor = 'white';
    }

    return (
        <View style={{ backgroundColor }} className={`px-2 mr-2 rounded-full self-start ${className}`}>
            <Text
                style={{ color: textColor }}
                className="text-xs font-medium"
                key={label}
            >
                {label}
            </Text>
        </View>
    );
}
