import React from 'react';
import { Text, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

export default function FilesFolderList() {
    return (
        <View className="items-center justify-center flex-1">
            <Text className="text-2xl font-bold">Modal</Text>
            <View className="w-4/5 h-px my-6 bg-gray-300 dark:bg-gray-700" />
            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
}
