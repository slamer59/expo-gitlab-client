import { ReactNode } from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/text";

interface SectionTitleProps {
    title: string;
    children?: ReactNode;
}

export const SectionTitle = ({ title, children }: SectionTitleProps) => (
    <View className='flex-row justify-between mb-2'>
        <Text className="mb-2 text-lg font-semibold text-white">{title}</Text>
        {children}
    </View>
);

interface SectionContentProps {
    content: string;
}

export const SectionContent = ({ content }: SectionContentProps) => (
    <Text className="mb-4 text-muted">{content}</Text>
);
