import { router } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type GitLabClient from "../gitlab/gitlab-api-wrapper";
import type { FirebaseNotification, GitLabProject } from "./interfaces";

export const RGPD_ACCEPTED_KEY = "@notification_rgpd_accepted";
export const EXPO_TOKEN_KEY = "expoPushToken";
export const STORED_PROJECTS_KEY = "@stored_projects";

export interface ProjectComparisonResult {
	newProjects: GitLabProject[];
	existingProjects: GitLabProject[];
	allProjects: GitLabProject[];
	hasNewProjects: boolean;
}

export async function getAllProjects(
	client: GitLabClient,
	page = 1,
	allProjects: GitLabProject[] = [],
): Promise<GitLabProject[]> {
	try {
		const perPage = 100; // Maximum allowed by GitLab API
		const projects = await client.Projects.all({
			membership: true,
			owned: true,
			per_page: perPage,
			page: page,
		});

		allProjects = allProjects.concat(projects);

		if (projects.length === perPage) {
			// There might be more pages
			return getAllProjects(client, page + 1, allProjects);
		} else {
			// No more pages
			return allProjects;
		}
	} catch (error) {
		console.error("Error fetching projects:", error);
		if (error.response?.status === 401) {
			router.push("/login");
		}
		return [];
	}
}

export async function getStoredProjectFingerprints(): Promise<Set<number>> {
	try {
		const storedProjectsJson = await AsyncStorage.getItem(STORED_PROJECTS_KEY);
		if (storedProjectsJson) {
			const storedProjects: GitLabProject[] = JSON.parse(storedProjectsJson);
			return new Set(storedProjects.map((p) => p.id));
		}
		return new Set();
	} catch (error) {
		console.error("Error getting stored project fingerprints:", error);
		return new Set();
	}
}

export async function storeProjectFingerprints(
	projects: GitLabProject[],
): Promise<void> {
	try {
		const projectsToStore = projects.map((p) => ({
			id: p.id,
			path_with_namespace: p.path_with_namespace,
			created_at: p.created_at,
			last_activity_at: p.last_activity_at,
		}));
		await AsyncStorage.setItem(
			STORED_PROJECTS_KEY,
			JSON.stringify(projectsToStore),
		);
	} catch (error) {
		console.error("Error storing project fingerprints:", error);
	}
}

export async function detectNewProjects(
	client: GitLabClient,
): Promise<ProjectComparisonResult> {
	try {
		const allProjects = await getAllProjects(client);
		const storedProjectIds = await getStoredProjectFingerprints();

		const newProjects = allProjects.filter(
			(project) => !storedProjectIds.has(project.id),
		);
		const existingProjects = allProjects.filter((project) =>
			storedProjectIds.has(project.id),
		);

		return {
			newProjects,
			existingProjects,
			allProjects,
			hasNewProjects: newProjects.length > 0,
		};
	} catch (error) {
		console.error("Error detecting new projects:", error);
		return {
			newProjects: [],
			existingProjects: [],
			allProjects: [],
			hasNewProjects: false,
		};
	}
}

export async function getAllProjectsWithComparison(
	client: GitLabClient,
): Promise<ProjectComparisonResult> {
	const result = await detectNewProjects(client);

	// Update stored projects with current state
	if (result.allProjects.length > 0) {
		await storeProjectFingerprints(result.allProjects);
	}

	return result;
}

export const notificationLevels = [
	{
		value: "global",
		label: "Global",
		description: "Use your global notification setting",
		icon: "globe",
	},
	{
		value: "participating",
		label: "Participate",
		description:
			"You will only receive notifications for issues you have participated in",
		icon: "chatbubbles",
	},
	{
		value: "disabled",
		label: "Disabled",
		description: "You will not receive any notifications",
		icon: "notifications-off",
	},
] as const;

export async function updateNotificationLevel(
	db: any,
	expoToken: string,
	globalNotification: { notification_level: string; custom_events: any[] },
	notifications: FirebaseNotification[],
): Promise<void> {
	try {
		const currentDate = new Date().toISOString();
		await setDoc(
			doc(db, "userNotifications", expoToken),
			{
				changedDate: currentDate,
				global_notification: globalNotification,
				notifications,
			},
			{ merge: true },
		);
		console.log("Update mobile notification successfully");
	} catch (error) {
		console.error("Error mobile notification: ", error);
	}
}
