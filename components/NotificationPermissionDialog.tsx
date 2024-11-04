import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { useNotificationStore } from '@/lib/notification/state';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './ui/alert-dialog';
import { Text } from './ui/text';

export function NotificationPermissionDialog() {
    const { setHasAcceptedRGPD, setExpoPushToken } = useNotificationStore();

    const handleAccept = async () => {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
                const token = (await Notifications.getExpoPushTokenAsync()).data;
                if (token) {
                    setExpoPushToken(token);
                }
            }
            setHasAcceptedRGPD(true);
        } catch (error) {
            console.error('Error requesting notification permissions:', error);
        }
    };

    const handleDecline = () => {
        setHasAcceptedRGPD(false);
    };

    return (
        <AlertDialog defaultOpen>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Enable Notifications</AlertDialogTitle>
                    <AlertDialogDescription>
                        <View className="space-y-4">
                            <Text>
                                To keep you updated with your GitLab activities, we need to store a device token for push notifications.
                            </Text>

                            <View className="space-y-2">
                                <Text>This token will:</Text>
                                <Text>• Only be used for GitLab notifications</Text>
                                <Text>• Be stored securely following RGPD guidelines</Text>
                                <Text>• Be deleted when you disable notifications</Text>
                            </View>

                            <Text>
                                You can disable notifications at any time in settings.
                            </Text>


                        </View>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onPress={() => router.push("/workspace/privacy-policy")}
                        className="p-0 bg-transparent border-none"
                    >
                        <Text className="text-blue-500">
                            View Privacy Policy
                        </Text>

                    </AlertDialogAction>
                    <AlertDialogCancel onPress={handleDecline}>
                        <Text>Not Now</Text>
                    </AlertDialogCancel>
                    <AlertDialogAction onPress={handleAccept}>
                        <Text>Enable</Text>
                    </AlertDialogAction>

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
