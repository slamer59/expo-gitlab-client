import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useNotificationStore } from '@/lib/notification/notifications-state';
import { useSession } from '@/lib/session/SessionProvider';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';

const GdprConsentScreen = () => {

    const { session } = useSession();
    const client = useMemo(() => new GitLabClient({
        url: session?.url,
        token: session?.token,
    }), [session?.url, session?.token]);

    const api = useGitLab(client);

    // const { data: personalProjects, isLoading: isLoadingPersonal, error: errorPersonal } = api.useProjects({ membership: true });


    const { setGdprConsent, manageGdprConsent, setPersonalProjects, setSessionClient } = useNotificationStore();
    const [loadingConsent, setLoadingConsent] = useState<boolean | null>(null);

    const handleGdprConsent = async (consent: boolean) => {
        setLoadingConsent(consent);
        try {
            console.log(consent ? 'GDPR consent granted' : 'GDPR consent denied');
            setGdprConsent(consent);
            // setPersonalProjects();
            // setSessionClient(session, client)
            manageGdprConsent(consent);
            // initializeNotifications()
            // syncNotificationSettings(client)
            // checkNotificationRegistration();
            // await manageWebhookAndFirebase(session, client, personalProjects);
        } catch (error) {
            console.error('Error during synchronization:', error);
        } finally {
            setLoadingConsent(null);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>GDPR Consent</Text>
            <Text style={styles.text}>
                Please provide your GDPR consent to access additional features:
            </Text>
            <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                    <Button
                        title={loadingConsent === true ? "Loading..." : "I Consent"}
                        onPress={() => handleGdprConsent(true)}
                        disabled={loadingConsent !== null}
                        accessibilityLabel="Grant consent to enable features"
                    />
                    {loadingConsent === true && (
                        <ActivityIndicator
                            size="small"
                            color="#0000ff"
                            style={styles.buttonLoader}
                        />
                    )}
                </View>
                <View style={styles.buttonWrapper}>
                    <Button
                        title={loadingConsent === false ? "Loading..." : "I Do Not Consent"}
                        onPress={() => handleGdprConsent(false)}
                        disabled={loadingConsent !== null}
                        accessibilityLabel="Deny consent"
                    />
                    {loadingConsent === false && (
                        <ActivityIndicator
                            size="small"
                            color="#0000ff"
                            style={styles.buttonLoader}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    buttonWrapper: {
        position: 'relative',
    },
    buttonLoader: {
        position: 'absolute',
        right: -25,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
});

export default GdprConsentScreen;
