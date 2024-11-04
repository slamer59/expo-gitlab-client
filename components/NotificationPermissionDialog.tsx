import * as Notifications from 'expo-notifications';
import { Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useNotificationStore } from '../lib/notification/state';
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
import { Button } from './ui/button';
import { Text } from './ui/text';

export function NotificationPermissionDialog() {
    const { setHasShownRGPDNotice, setExpoPushToken } = useNotificationStore();

    const handleAccept = async () => {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
                const token = (await Notifications.getExpoPushTokenAsync()).data;
                if (token) {
                    setExpoPushToken(token);
                }
            }
            setHasShownRGPDNotice(true);
        } catch (error) {
            console.error('Error requesting notification permissions:', error);
        }
    };

    const handleDecline = () => {
        setHasShownRGPDNotice(true);
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

                            <Link href="/workspace/privacy-policy" asChild>
                                <Button variant="outline" className="w-full">
                                    <Text>View Privacy Policy</Text>
                                </Button>
                            </Link>
                        </View>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
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
