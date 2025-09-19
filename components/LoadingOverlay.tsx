import React from 'react';
import { ActivityIndicator, Animated, Text, View } from 'react-native';

import { useNotificationStore } from '../lib/notification/state';

const messages = [
    "Updating webhooks...",
    "Configuring notification settings...",
    "Syncing with GitLab...",
    "Setting up your preferences...",
    "Almost there...",
];

export const LoadingOverlay = () => {
    const [messageIndex, setMessageIndex] = React.useState(0);
    const fadeAnim = React.useRef(new Animated.Value(1)).current;
    const isLoading = useNotificationStore(state => state.isLoading);

    React.useEffect(() => {
        if (isLoading) {
            const messageInterval = setInterval(() => {
                // Fade out
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    setMessageIndex((prev) => (prev + 1) % messages.length);
                    // Fade in
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                });
            }, 3000); // Change message every 3 seconds

            return () => clearInterval(messageInterval);
        }
    }, [isLoading, fadeAnim]);

    if (!isLoading) return null;

    return (
        <View className='absolute top-0 bottom-0 left-0 right-0 z-50 items-center justify-center bg-black/80'>

            <View className='items-center'>
                <ActivityIndicator size="large" className='mb-5 text-secondary' />
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Text
                        className='px-8 text-2xl font-semibold text-center text-white'
                    >
                        {messages[messageIndex]}
                    </Text>
                </Animated.View>
                <Text
                    className='mt-2 text-xl text-center text-gray-400'
                >
                    Please don't leave this screen
                </Text>
            </View>
        </View>
    );
};
