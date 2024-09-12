import { Text } from "@/components/ui/text";
import { View } from "react-native";

interface PillProps {
    label: string;
    variant?: PillsColor;
}
enum PillsColor {
    black,
    white,
    gray,
    silver,
    maroon,
    purple,
    fuchsia,
    lime,
    olive,
    navy,
    teal,
    aqua,
    violet,
    indigo,
    blue,
    green,
    yellow,
    orange,
    red
}

export function Pills({ label, variant }: { label: any, variant?: PillProps }) {
    const color = variant ? `bg-pills-${variant}` : "bg-pills-purple"
    return <View className={`px-2 py-1 rounded-full ${color}`}>
        <Text
            className="text-xs font-medium text-white"
            key={label}
        >{label}
        </Text>
    </View>
}

