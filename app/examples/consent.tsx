import { NotificationPermissionDialog } from '@/components/NotificationPermissionDialog';
import { useNotificationStore } from '@/lib/notification/state';
import React from 'react';
import { Button, Text, View } from 'react-native';

const GDPRConsentScreen = () => {
    const { consentToRGPDGiven, setRGPDConsent } = useNotificationStore();

    const handleConsent = async (consent) => {
        try {
            await setRGPDConsent(consent);
            if (consent) {
                // Initialize Firebase or start data tracking here
                // setupFirebase();
            } else {
                // Handle when user declines consent, perhaps disable Firebase
                // disableFirebase();
            }
        } catch (error) {
            console.error('Error handling consent:', error);
            // Handle the error here, perhaps display an error message to the user
        }
    };


    return (
        <View>
            <Text>We need your consent to use data for analytics and notifications.</Text>
            <Button title="I Consent" onPress={async () => await handleConsent(true)} />
            <Button title="I Do Not Consent" onPress={async () => await handleConsent(false)} />
            {!consentToRGPDGiven && <NotificationPermissionDialog />}
            <View className='mt-4'>
                <Text>Consent Status: {consentToRGPDGiven ? 'Given' : 'Not Given'}</Text>
            </View>
        </View>
    );
};

export default GDPRConsentScreen;
