import { router } from 'expo-router';
import GitLabClient from 'lib/gitlab/gitlab-api-wrapper';
import { useNotificationStore } from 'lib/notification/state';
import { useSession } from 'lib/session/SessionProvider';
import React, { useMemo, useState } from 'react';
import InfoAlert from './InfoAlert';
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

interface ErrorWithResponse extends Error {
    response?: {
        status?: number;
    };
}

export function NotificationPermissionDialog() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorInfo, setErrorInfo] = useState<{ title: string; message: string } | null>(null);
    const { session } = useSession();

    const client = useMemo(() => new GitLabClient({
        url: session?.url,
        token: session?.token,
    }), [session?.url, session?.token]);

    const {
        manageGdprConsent,
        manageWebhooks,
    } = useNotificationStore();

    const handleConsent = async (consent: boolean) => {
        setIsProcessing(true);
        try {
            if (!session) {
                router.push('/login');
                return;
            }
            await manageGdprConsent(consent);
            await manageWebhooks(session, client);

        } catch (error: unknown) {
            console.error('Error during synchronization:', error);

            if (error instanceof Error) {
                const typedError = error as ErrorWithResponse;
                if (typedError.response?.status === 401) {
                    router.push('/login');
                } else {
                    const errorMessage = typedError.message || 'Unknown error occurred';
                    setErrorInfo({
                        title: 'Notification Setup Error',
                        message: `Failed to setup notifications: ${errorMessage}. Please try again.`
                    });
                }
            } else {
                setErrorInfo({
                    title: 'Unexpected Error',
                    message: 'An unexpected error occurred while setting up notifications. Please try again.'
                });
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <AlertDialog
                defaultOpen
            >
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
                            disabled={isProcessing}
                        >
                            <Text className="text-secondary">
                                View Privacy Policy
                            </Text>
                        </AlertDialogAction>
                        <AlertDialogCancel
                            onPress={() => handleConsent(false)}
                            disabled={isProcessing}
                        >
                            <Text>Decline</Text>
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onPress={() => handleConsent(true)}
                            disabled={isProcessing}
                        >
                            <Text>{isProcessing ? 'Processing...' : 'Accept'}</Text>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {errorInfo && (
                <InfoAlert
                    isOpen={!!errorInfo}
                    onClose={() => setErrorInfo(null)}
                    title={errorInfo.title}
                    message={errorInfo.message}
                />
            )}
        </>
    );
}
