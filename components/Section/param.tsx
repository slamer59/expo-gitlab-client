import { View } from "react-native";

import { Text } from "@/components/ui/text";

export const SectionTitle = ({ title, children }) => (
    <View className='flex-row justify-between'>
        <Text className="mb-2 text-lg font-semibold text-white">{title}</Text>
        {children}
    </View>
);

export const SectionContent = ({ content }) => (
    <Text className="mb-4 text-muted">{content}</Text>
);