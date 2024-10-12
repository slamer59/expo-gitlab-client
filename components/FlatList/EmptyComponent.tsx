import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

export function EmptyComponent(items, loading, error): React.ComponentType<any> | React.ReactElement<any, string | React.JSXElementConstructor<any>> | null | undefined {
    return <>
        {items?.length === 0 && !loading && (
            <View className="flex-row items-center p-4 m-2 space-x-4 rounded-lg bg-card">
                <View className="items-center justify-center w-full m-2 ">
                    <View className="p-4 m-6">
                        <Ionicons name="search" size={32} color="red" />
                    </View>
                    <Text className="mb-2 text-2xl font-bold text-center text-white rounded-4xl">
                        No items Found
                    </Text>
                    <Text className="mb-6 text-center text-muted">
                        There are currently no items to display.
                    </Text>
                </View>
            </View>
        )
        }
    </>
}