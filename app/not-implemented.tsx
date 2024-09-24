import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, Text, View } from 'react-native';

export default function NotImplemented({ message }) {
    return (
        <View className="items-center justify-center flex-1 bg-">
            <Text className="mb-4 text-3xl font-bold text-primary">{message}</Text>
            <View className="items-center justify-center w-16 h-16 mb-4 bg-yellow-500 rounded-full">
                <Text className="text-2xl text-white">🚧</Text>
            </View>
            <Text className="mb-2 text-xl text-muted">Not Implemented Yet</Text>
            <Text className="px-4 text-sm text-center text-muted">
                We're working on bringing you a great file and folder management experience. Check back soon!
            </Text>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
}
