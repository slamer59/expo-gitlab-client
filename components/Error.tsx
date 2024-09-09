import { Ionicons } from "@expo/vector-icons"; // You can use any icon library you prefer
import { useNavigation } from "expo-router";

import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error }: ErrorProps) {
    React.useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);
    const navigate = useNavigation();
    return (
        <SafeAreaView className="items-center justify-center flex-1 p-4">
            <View className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
                <View className="items-center">
                    <View className="flex-row items-center justify-center m-4">
                        <Ionicons name="warning" size={24} color="red" />
                        <Text className="ml-2 text-2xl font-bold text-gray-800">
                            Oops! Something went wrong
                        </Text>
                    </View>
                    <Text className="mb-6 text-center text-gray-600">
                        {error.message ||
                            "An unexpected error occurred. Please try again later."}
                    </Text>
                    <View className="flex-row justify-center mb-6 space-x-4">
                        <TouchableOpacity
                            onPress={() => navigate.goBack()}
                            className="flex-row items-center px-4 py-2 m-2 bg-blue-500 rounded-full"
                        >
                            <Ionicons name="refresh" size={16} color="white" />
                            <Text className="ml-2 font-semibold text-white">
                                Try again
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigate.navigate("/")}
                            className="flex-row items-center px-4 py-2 m-2 bg-gray-300 rounded-full"
                        >
                            <Ionicons name="home" size={16} color="gray" />
                            <Text className="ml-2 font-semibold text-gray-800">
                                Go home
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* {error.digest && (
                        <View className="pt-4 mt-6 border-t border-gray-200">
                            <Text className="text-sm text-center text-gray-500">
                                <Text className="font-semibold">Error ID: </Text>
                                {error.digest}
                            </Text>
                        </View>
                    )} */}
            </View>
        </SafeAreaView>
    );
}
