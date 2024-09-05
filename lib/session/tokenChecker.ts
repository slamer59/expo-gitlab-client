import * as BackgroundFetch from "expo-background-fetch";
import * as SecureStore from "expo-secure-store";
import * as TaskManager from "expo-task-manager";
import { Alert } from "react-native";

const BACKGROUND_FETCH_TASK = "background-token-check";

async function validateGitLabCredentials(url: string, token: string) {
    try {
        const response = await fetch(`${url}/api/v4/user`, {
            headers: { "PRIVATE-TOKEN": token },
        });
        return response.ok;
    } catch (error) {
        console.error("Error validating credentials:", error);
        return false;
    }
}

async function tokenCheckTask() {
    const url = await SecureStore.getItemAsync("gitlabUrl");
    const token = await SecureStore.getItemAsync("gitlabToken");
    let isValid = false;

    if (url && token) {
        isValid = await validateGitLabCredentials(url, token);
        if (!isValid) {
            // Token is invalid, clear stored credentials
            await SecureStore.deleteItemAsync("gitlabUrl");
            await SecureStore.deleteItemAsync("gitlabToken");

            // Show an alert to the user (note: this might not work in the background)
            Alert.alert("Session Expired", "Please log in again.");
        }
    }

    return isValid
        ? BackgroundFetch.BackgroundFetchResult.NewData
        : BackgroundFetch.BackgroundFetchResult.Failed;
}

TaskManager.defineTask(BACKGROUND_FETCH_TASK, tokenCheckTask);

export async function registerBackgroundFetch() {
    try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 60 * 60 * 24, // 1 day in seconds
            stopOnTerminate: false,
            startOnBoot: true,
        });
        console.log("Task registered");
    } catch (err) {
        console.log("Task Register failed:", err);
    }
}

export function initializeTokenChecker() {
    registerBackgroundFetch();
}
