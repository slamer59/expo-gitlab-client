import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import React from 'react';

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
                        {`
To keep you updated with your GitLab activities, we need to store a device token for push notifications.
This token will:

    • Only be used for GitLab notifications
    • Be stored securely following RGPD guidelines
    • Be deleted when you disable notifications

You can disable notifications at any time in settings.`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onPress={() => router.push("/workspace/privacy-policy")}
                        className="p-0 bg-transparent"
                    >
                        <Text className="text-secondary">
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
        </AlertDialog >
    );
}
