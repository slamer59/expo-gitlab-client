import { router } from 'expo-router';
import { useNotificationStore } from 'lib/notification/state';
import { useSession } from 'lib/session/SessionProvider';
import React from 'react';
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
    const { setRGPDConsent } = useNotificationStore();
    const { session } = useSession();

    // React.useEffect(() => {
    //     if (session) {
    //         setSession(session);
    //     }
    // }, [session]);

    const handleConsent = async (consent: boolean) => {
        try {
            if (!session) {
                router.push('/login');
                return;
            }

            await setRGPDConsent(consent);
            // if (consent) {
            //     router.push('/options/profile');
            // }
        } catch (error) {
            console.error('Error handling consent:', error);
            if (error.response?.status === 401) {
                router.push('/login');
            } else {
                alert('Failed to setup notifications. Please try again.');
            }
        }
    };

    return (
        <AlertDialog defaultOpen>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Enable Notifications</AlertDialogTitle>
                    <AlertDialogDescription>
                        {`To keep you updated with your GitLab activities, we need to:

1. Store a device token for push notifications
2. Set up webhooks for your GitLab projects
3. Store notification preferences

This data will:
• Only be used for GitLab notifications
• Be stored securely following RGPD guidelines
• Be completely removed when you disable notifications

You can manage these settings at any time.`}
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
                    <AlertDialogCancel onPress={() => handleConsent(false)}>
                        <Text>Decline</Text>
                    </AlertDialogCancel>
                    <AlertDialogAction onPress={() => handleConsent(true)}>
                        <Text>Accept</Text>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
