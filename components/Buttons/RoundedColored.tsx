import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

import { ButtonConfig } from "./ButtonConfig";

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const sizeMap: { [key in Size]: number } = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
};

type RoundedColoredButtonProps = {
    button: ButtonConfig,
    size?: Size,
};

export function RoundedColoredButton({ button, size = 'md' }: RoundedColoredButtonProps) {
    return <View
        style={{
            backgroundColor: button.itemColor ? button.itemColor : '#1f1f1f',
            padding: 8,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
    >
        {button.iconNode ? (
            button.iconNode
        ) : (
            <Ionicons
                name={button.icon}
                size={sizeMap[size]}
                color="white" />
        )}
    </View>;
}
