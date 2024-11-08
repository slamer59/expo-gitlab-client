import { Ionicons } from "@expo/vector-icons";
import { Href } from "expo-router";

export type IconName = keyof typeof Ionicons.glyphMap;

export interface ButtonConfig {
    icon: IconName | 'lucide';
    iconNode?: React.ReactNode;
    text: string;
    screen: Href<string>;
    itemColor: string;
}