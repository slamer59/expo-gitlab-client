import Error from '@/components/Error';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export async function sendPushNotification(expoPushToken: string) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

function handleRegistrationError(errorMessage: string) {
    // alert(errorMessage);
    throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }

        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }

        try {
            const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}



export const getGitLabIssueUrl = () => {
    const baseUrl = "https://gitlab.com/thomas.pedot1/gitalchemy/-/issues/new";
    const title = encodeURIComponent("Feedback: Gitalchemy Mobile App");
    const description = encodeURIComponent(
        `## App Information\n` +
        `- App Version: ${Application.applicationName} v${Application.nativeBuildVersion}\n` +
        `- Platform: ${Platform.OS}\n` +
        `- OS Version: ${Platform.Version}\n` +
        `- GitLab API: v4\n\n` +
        `## Feedback\n` +
        `<!-- Please describe your feedback, issue, or suggestion here -->\n\n` +
        `## Steps to Reproduce (if applicable)\n` +
        `1. \n2. \n3. \n\n` +
        `## Expected Behavior\n\n` +
        `## Actual Behavior\n\n` +
        `## Additional Information\n`
    );

    return `${baseUrl}?issue[title]=${title}&issue[description]=${description}&issue[labels]=support,discussion`;
};


export const getHelpWithGitalchemy = () => {
    return encodeURIComponent(
        `## App Information\n` +
        `- App Version: ${Application.applicationName} v${Application.nativeBuildVersion}\n` +
        `- Platform: ${Platform.OS}\n` +
        `- OS Version: ${Platform.Version}\n` +
        `- GitLab API: v4\n\n` +
        `## Feedback\n` +
        `<!-- Please describe your feedback, issue, or suggestion here -->\n\n` +
        `## Steps to Reproduce (if applicable)\n` +
        `1. \n2. \n3. \n\n` +
        `## Expected Behavior\n\n` +
        `## Actual Behavior\n\n` +
        `## Additional Information\n`
    );
};
