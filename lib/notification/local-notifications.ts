import * as Notifications from "expo-notifications";

import type { GitLabProject } from "./interfaces";

// Configure notification behavior
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

export interface NewRepoNotificationOptions {
	title?: string;
	sound?: boolean;
	badge?: boolean;
	data?: any;
}

export async function sendNewRepositoryNotification(
	newRepos: GitLabProject[],
	options: NewRepoNotificationOptions = {},
): Promise<void> {
	try {
		const count = newRepos.length;
		const repoNames = newRepos
			.slice(0, 2)
			.map((repo) => repo.path_with_namespace || repo.name);

		let body: string;
		if (count === 1) {
			body = `New repository: ${repoNames[0]}`;
		} else if (count === 2) {
			body = `New repositories: ${repoNames.join(", ")}`;
		} else {
			body = `${repoNames.join(", ")} and ${count - 2} more new repositories`;
		}

		await Notifications.scheduleNotificationAsync({
			content: {
				title: options.title || "New GitLab Repositories Found",
				body,
				sound: options.sound !== false,
				badge: options.badge !== false ? count : undefined,
				data: {
					type: "new_repositories",
					repositories: newRepos.map((repo) => ({
						id: repo.id,
						name: repo.path_with_namespace || repo.name,
					})),
					...options.data,
				},
			},
			trigger: null, // Send immediately
		});

		console.log(`Sent notification for ${count} new repositories`);
	} catch (error) {
		console.error("Failed to send new repository notification:", error);
	}
}

export async function sendRepositoryCountBadge(count: number): Promise<void> {
	try {
		await Notifications.setBadgeCountAsync(count);
	} catch (error) {
		console.error("Failed to set badge count:", error);
	}
}

export function setupNotificationResponseHandler() {
	// Handle notification taps
	const subscription = Notifications.addNotificationResponseReceivedListener(
		(response) => {
			const data = response.notification.request.content.data;

			if (data?.type === "new_repositories") {
				// Navigate to settings page or new repo modal
				console.log("User tapped new repositories notification");
				// You could use router.push('/settings') here
			}
		},
	);

	return subscription;
}

// Clear badge when user reviews new repositories
export async function clearNewRepositoryBadge(): Promise<void> {
	try {
		await Notifications.setBadgeCountAsync(0);
	} catch (error) {
		console.error("Failed to clear badge:", error);
	}
}
