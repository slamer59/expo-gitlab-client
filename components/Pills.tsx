import { Text } from "@/components/ui/text";
import React from "react";
import { View } from "react-native";

export interface PillProps {
    label: string;
    variant?: PillsColor;
}

type PillsColor = "black" | "white" | "gray" | "silver" | "maroon" | "purple" | "fuchsia" | "lime" | "olive" | "navy" | "teal" | "aqua" | "violet" | "indigo" | "blue" | "green" | "yellow" | "orange" | "red"

export function Pills({ label, variant }: { label: any, variant?: PillProps }) {
    const color = variant && variant.startsWith('#')
        ? `bg-[${variant}]`
        : variant
            ? `bg-pills-${variant}`
            : "bg-pills-purple"
    return <View className={`px-2 mr-2 py-0.5 rounded-full ${color} self-start`}>
        <Text
            className="text-xs font-medium text-white"
            key={label}
        >{label}
        </Text>
    </View>
}

