import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { registerForPushNotificationsAsync } from "@/lib/gitlab/helpers";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { Button, Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// https://docs.expo.dev/versions/latest/sdk/notifications/
const gitlabEvents = [
    {
        "id": 1,
        "type": "Pipeline Event",
        "title": "🚫 Pipeline #123456 has failed",
        "description": "🔍 Please check the details at the pipeline URL.",
        "icon": "🏗️",
        "url": "https://gitlab.com/your-project/pipelines/123456"
    },
    {
        "id": 2,
        "type": "Merge Request Event",
        "title": "🔄 Merge request #789012 has been updated",
        "description": "👀 Please review the changes at the merge request URL.",
        "icon": "🔀",
        "url": "https://gitlab.com/your-project/merge_requests/789012"
    },
    {
        "id": 3,
        "type": "Issue Event",
        "title": "📝 Issue #345678 has been updated",
        "description": "🔍 Please check the new details at the issue URL.",
        "icon": "🐛",
        "url": "/workspace/projects/59795263/issues/29"
    },
    {
        "id": 4,
        "type": "Push Event",
        "title": "🚀 New commits have been pushed to the main branch",
        "description": "👀 Please check the changes at the repository URL.",
        "icon": "📦",
        "url": "https://gitlab.com/your-project"
    },
    {
        "id": 5,
        "type": "Wiki Page Event",
        "title": "📚 The wiki page 'Getting Started' has been updated",
        "description": "👀 Please review the changes at the wiki page URL.",
        "icon": "📖",
        "url": "https://gitlab.com/your-project/wikis/getting-started"
    },
    {
        "id": 6,
        "type": "Deployment Event",
        "title": "✅ Deployment #901234 has succeeded",
        "description": "🔍 Please check the details at the deployment URL.",
        "icon": "🚀",
        "url": "https://gitlab.com/your-project/environments/901234"
    },
    {
        "id": 7,
        "type": "Release Event",
        "title": "🎉 A new release v1.2.3 has been created",
        "description": "🔍 Please check the details at the release URL.",
        "icon": "📦",
        "url":
            "https://gitlab.com/your-project/releases/v1.2.3"
    },
    {
        "id": 8,
        "type": "User Event",
        "title": "👤 User @username has been added to the project",
        "description": "🔑 The user has been granted Developer access.",
        "icon": "👥",
        "url": "https://gitlab.com/your-project/project_members"
    }
];




Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

async function sendPushNotification(expoPushToken: string) {
    const message = {
        to: expoPushToken,
        sound: "default",
        title: "Original Title",
        body: "And here is the body!",
        data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });
}


async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here', test: { test1: 'more data' } },
        },
        trigger: { seconds: 2 },
    });
}

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

export default function NotificationExempleScreen() {
    const [expoPushToken, setExpoPushToken] = useState("");
    const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);

    const [notification, setNotification] = useState<Notifications.Notification | null>(null);
    const [selectedEvent, setSelectedEvent] = useState(gitlabEvents[0]);
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();
    const insets = useSafeAreaInsets();

    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 12,
        right: 12,
    };

    useEffect(() => {
        if (Platform.OS === 'android') {
            Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
        }

        registerForPushNotificationsAsync()
            .then((token) => setExpoPushToken(token ?? ""))
            .catch((error: any) => setExpoPushToken(`${error}`));

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log(response);
                },
            );

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(
                    notificationListener.current,
                );
            responseListener.current &&
                Notifications.removeNotificationSubscription(
                    responseListener.current,
                );
        };
    }, []);

    const handleEventSelect = (eventId: number) => {
        const event = gitlabEvents.find(e => e.id === eventId);
        if (event) {
            setSelectedEvent(event);
            setNotification(null); // Reset notification when a new event is selected
        }
    };

    const sendNotificationForSelectedEvent = async () => {
        if (expoPushToken) {
            const message = {
                to: expoPushToken,
                sound: "default",
                title: selectedEvent.title,
                body: selectedEvent.description,
                data: { type: selectedEvent.type, url: selectedEvent.url },
                icon: selectedEvent.icon, // Add this line
            };

            await fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Accept-encoding": "gzip, deflate",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
            });

            // Simulate receiving the notification
            setNotification({
                request: {
                    content: {
                        title: message.title,
                        body: message.body,
                        data: message.data,
                    },
                },
            } as Notifications.Notification);
        }
    };

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "space-around",
                padding: 20,
            }}
        >
            <Text>Your Expo push token: {expoPushToken}</Text>
            <Text>{`Channels: ${JSON.stringify(
                channels.map(c => c.id),
                null,
                2
            )}`}</Text>
            <Select
                defaultValue={{ value: selectedEvent.id.toString(), label: selectedEvent.title }}
                onValueChange={(event) => handleEventSelect(parseInt(event?.value))}
            >
                <SelectTrigger className='w-[250px]'>
                    <SelectValue
                        className='text-sm text-foreground native:text-lg'
                        placeholder='Select an event'
                    />
                </SelectTrigger>
                <SelectContent insets={contentInsets} className='w-[250px]'>
                    <SelectGroup>
                        <SelectLabel>GitLab Events</SelectLabel>
                        {gitlabEvents.map((event) => (
                            <SelectItem key={event.id} label={event.title} value={event.id.toString()}>
                                {event.title}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontWeight: 'bold' }}>Selected Event:</Text>
                <Text>Title: {selectedEvent.title}</Text>
                <Text>Type: {selectedEvent.type}</Text>
                <Text>Description: {selectedEvent.description}</Text>
            </View>

            {notification && (
                <View className="items-center justify-center p-4 m-4 rounded-lg shadow-md bg-gray">
                    <Text className="mb-3 text-lg font-bold text-gray-800">Last Notification</Text>
                    <View className="space-y-2">
                        <View className="flex-row">
                            <Text className="w-16 font-semibold text-gray-600">Title:</Text>
                            <Text className="flex-1 text-gray-800">{notification.request.content.title}</Text>
                        </View>
                        <View className="flex-row">
                            <Text className="w-16 font-semibold text-gray-600">Body:</Text>
                            <Text className="flex-1 text-gray-800">{notification.request.content.body}</Text>
                        </View>
                        <View className="flex-row">
                            <Text className="w-16 font-semibold text-gray-600">Data:</Text>
                            <Text className="flex-1 text-gray-800">{JSON.stringify(notification.request.content.data)}</Text>
                        </View>
                    </View>
                </View>
            )}


            <Button
                title="Send Notification for Selected Event"
                onPress={sendNotificationForSelectedEvent}
            />

            <Button
                title="Press to schedule a notification 2 seconds from now"
                onPress={async () => {
                    await schedulePushNotification();
                }}
            />
        </View>
    );
}