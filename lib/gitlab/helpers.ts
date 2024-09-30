import Error from '@/components/Error';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { GitLabSession } from "../session/SessionProvider";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export async function getProjects(session: GitLabSession): Promise<any> {
    const { token: savedToken, url: baseUrl } = session;

    if (savedToken) {
        try {
            const headers = {
                "PRIVATE-TOKEN": savedToken,
            };
            const params = {
                membership: "true",
            };
            const response = await fetch(
                `${baseUrl}/api/v4/projects` +
                "?" +
                new URLSearchParams(params),
                {
                    method: "GET",
                    headers,
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Gitlab API response");
            const projects = data.map(
                (project: { http_url_to_repo: string; id: number }) => {
                    return {
                        http_url_to_repo: project.http_url_to_repo,
                        id: project.id
                    }
                }
            );
            return projects;
        } catch (error) {
            console.error("Error:", error);
        }
    } else {
        console.log("No token found");
    }
}

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
    alert(errorMessage);
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
            console.log(pushTokenString);
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}

export async function getExpoToken(): Promise<string> {
    try {
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            throw new Error("Project ID not found");
        }

        const token = await Notifications.getExpoPushTokenAsync({
            projectId: projectId,
        });

        if (token && token.data) {
            return token.data;
        } else {
            throw new Error("Failed to get Expo push token: Token or token.data is undefined");
        }
    } catch (error) {
        console.error("Error getting Expo push token:", error);
        throw error; // Re-throw the error
    }
}