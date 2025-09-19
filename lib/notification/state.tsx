import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { getApps, initializeApp } from "firebase/app";
import "firebase/firestore";
import {
	deleteDoc,
	doc,
	getDoc,
	getFirestore,
	setDoc,
} from "firebase/firestore";
import { usePostHog } from "posthog-react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { firebaseConfig } from "lib/firebase/helpers";
import type GitLabClient from "lib/gitlab/gitlab-api-wrapper";

import AsyncStorage from "@react-native-async-storage/async-storage";

import useConsentStore from "./consent";
import type {
	FirebaseDocument,
	FirebaseNotification,
	GitLabNotificationSettings,
	GitLabProject,
	NotificationLevel,
	NotificationStore,
} from "./interfaces";
import { sendNewRepositoryNotification } from "./local-notifications";
import {
	getAllProjects,
	getAllProjectsWithComparison,
	notificationLevels,
	updateNotificationLevel,
} from "./utils";

import "firebase/firestore";

import { removeWebhooks, updateOrCreateWebhooks } from "../gitlab/webhooks";
import { getExpoToken } from "../utils";

const captureError = (eventName: string, error: Error) => {
	try {
		// Use PostHog capture in a safer way for non-component context
		console.error(`[${eventName}]`, error.message, error.stack);
		// PostHog capture should be called from component context
	} catch (e) {
		console.error("Error in captureError:", e);
	}
};

// Initialize Firebase
let app;
const initializeFirebase = () => {
	try {
		if (!getApps().length) {
			app = initializeApp(firebaseConfig);
		} else {
			app = getApps()[0];
		}
		return getFirestore(app);
	} catch (error) {
		console.error("Error initializing Firebase:", error);
		captureError("firebase_initialization_error", error);
		return null;
	}
};

const db = initializeFirebase();

const prepareProjects = (
	projects: GitLabProject[] | undefined,
): { id: number; name: string; level: NotificationLevel }[] => {
	if (!projects || !Array.isArray(projects)) {
		console.error("Projects are undefined or not an array");
		return [];
	}

	return projects
		.filter((project) => project.id && typeof project.id === "number")
		.map((project) => ({
			id: project.id,
			name: project.path_with_namespace || String(project.id),
			level: notificationLevels[0],
		}));
};

const fetchNotificationSettings = async (
	client: GitLabClient,
	type: string,
	id: number | null,
	name: string,
): Promise<any> => {
	try {
		let settings: GitLabNotificationSettings;
		if (type === "global") {
			settings = await client.GlobalNotification.all();
		} else if (type === "group") {
			settings = await client.GroupNotifications.all(id!);
		} else if (type === "project") {
			settings = await client.ProjectNotifications.all(id!);
		} else {
			settings = { level: "global" };
		}
		return {
			id,
			name,
			level:
				notificationLevels.find((level) => level.value === settings.level) ||
				notificationLevels[0],
			notification_email: settings.notification_email || "",
		};
	} catch (error) {
		console.error(`Error fetching ${type} notification settings:`, error);
		captureError(`firebase_fetch_${type}_settings_error`, error);
		return {
			id,
			name,
			level: notificationLevels[0],
			notification_email: "",
		};
	}
};

const withErrorHandling =
	(fn, set) =>
	async (...args) => {
		try {
			await fn(...args);
		} catch (err) {
			set({ error: err.message });
			captureError("error", err);
		}
	};

export const useNotificationStore = create<NotificationStore>()(
	persist(
		(set, get) => ({
			error: null,
			groups: [],
			projects: [],
			global: { level: notificationLevels[0], notification_email: "" },
			modalVisible: false,
			selectedItemType: "",
			selectedItemIndex: -1,
			isLoading: false,
			isInitialized: false,
			expoPushToken: null,
			consentToRGPDGiven: false,
			session: null,
			client: null,
			permissionStatus: null,
			repositoryPollingInterval: null,

			setGroups: (groups) => set({ groups }),
			setProjects: (projects) => set({ projects }),
			setGlobal: (global) => set({ global }),
			setModalVisible: (visible) => set({ modalVisible: visible }),
			setSelectedItemType: (type) => set({ selectedItemType: type }),
			setSelectedItemIndex: (index) => set({ selectedItemIndex: index }),
			setIsInitialized: (initialized) => set({ isInitialized: initialized }),
			setPermissionStatus: (status) => set({ permissionStatus: status }),
			setPersonalProjects: (projects) =>
				set({ projects: prepareProjects(projects) }),

			setGdprConsent: (accepted: any) => set({ consentToRGPDGiven: accepted }),

			restoreConsentFromFirebase: async () => {
				try {
					const token = await getExpoToken();
					if (token && db) {
						const docRef = doc(db, "userNotifications", token);
						const docSnap = await getDoc(docRef);
						if (docSnap.exists()) {
							const data = docSnap.data();
							if (data?.consentDate) {
								set({ consentToRGPDGiven: true });
								console.log("RGPD consent restored from Firebase");
							}
						}
					}
				} catch (error) {
					console.error("Error restoring consent from Firebase:", error);
					captureError("firebase_restore_consent_error", error);
				}
			},

			requestPermissions: withErrorHandling(async () => {
				if (Device.isDevice) {
					const { status } = await Notifications.requestPermissionsAsync();
					set({ permissionStatus: status });
				} else {
					alert("Must use physical device for Push Notifications");
				}
			}, set),

			manageConsentFirebase: withErrorHandling(async () => {
				// const { expoPushToken: token, consentToRGPDGiven } = get();
				const { consentToRGPDGiven } = get();
				const token = await getExpoToken();

				if (token !== null && db) {
					const docRef = doc(db, "userNotifications", token);

					if (consentToRGPDGiven) {
						await setDoc(
							docRef,
							{
								changedDate: new Date().toISOString(),
								consentDate: new Date().toISOString(),
							},
							{ merge: true },
						);
					} else {
						await deleteDoc(docRef);
						console.log("Removed from Firebase");
					}
				}
			}, set),

			setExpoPushToken: withErrorHandling(async () => {
				try {
					const token = await getExpoToken();
					if (token) {
						set({ expoPushToken: token });
					}
				} catch (error) {
					console.error("Error getting Expo push token:", error);
					captureError("firebase_get_expo_token_error", error);
					throw error;
				}
			}, set),

			manageGdprConsent: withErrorHandling(async (accepted: boolean) => {
				try {
					get().setGdprConsent(accepted);

					if (accepted) {
						await get().requestPermissions();
						await get().setExpoPushToken();
						await get().manageConsentFirebase();
					} else {
						await get().setExpoPushToken();
						await get().manageConsentFirebase();
					}
				} catch (error) {
					console.error("Error syncing Firebase:", error);
					captureError("firebase_manage_gdpr_consent_error", error);
				}
			}, set),

			manageWebhooks: withErrorHandling(async (session, client) => {
				const { consentToRGPDGiven: consent } = get();
				set({ isLoading: true });

				try {
					if (consent) {
						const projects = await getAllProjects(client);
						get().setPersonalProjects(projects);

						await Promise.all([
							get().addWebhookToGitLab(session),
							get().syncNotificationSettings(client),
						]);
					} else {
						await Promise.all([get().removeWebhookFromGitLab(session)]);
					}
				} catch (error) {
					console.error("Error managing webhooks:", error);
					captureError("firebase_manage_webhooks_error", error);
				} finally {
					set({ isLoading: false });
				}
			}, set),

			addWebhookToGitLab: withErrorHandling(async (session) => {
				const { projects } = get();

				if (!session?.url || !session?.token) {
					throw new Error("Invalid session data");
				}

				try {
					await updateOrCreateWebhooks(
						{ url: session.url, token: session.token },
						projects,
						undefined,
					);
				} catch (error) {
					console.error("Error updating webhooks:", error);
					captureError("firebase_add_webhook_error", error);
				}
			}, set),

			removeWebhookFromGitLab: withErrorHandling(async (session) => {
				const { projects } = get();
				if (session?.url && session?.token) {
					try {
						await removeWebhooks(session, projects);
					} catch (error) {
						console.error("Error removing webhooks:", error);
						captureError("firebase_remove_webhook_error", error);
					}
				}
			}, set),

			fetchFirebaseData: async (expoToken: string) => {
				if (!db) return null;

				try {
					const docRef = doc(db, "userNotifications", expoToken);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists()) {
						return docSnap.data() as FirebaseDocument;
					}
					return null;
				} catch (error) {
					console.error("Error fetching Firebase data:", error);
					captureError("firebase_fetch_data_error", error);
					set({ error: (error as Error).message });
					return null;
				}
			},

			syncNotificationSettings: withErrorHandling(
				async (client: GitLabClient) => {
					set({ isLoading: true });

					try {
						const { isInitialized } = get();
						const expoToken = await getExpoToken();

						if (!expoToken) {
							throw new Error("Failed to retrieve Expo token");
						}

						if (!isInitialized) {
							const groups = await client.Groups.all();
							const projects = await getAllProjects(client);

							const [groupsWithSettings, projectsWithSettings, globalSettings] =
								await Promise.all([
									Promise.all(
										groups.map(
											(group: { id: number | null; full_name: string }) =>
												fetchNotificationSettings(
													client,
													"group",
													group.id,
													group.full_name,
												),
										),
									),
									Promise.all(
										projects.map((project) =>
											fetchNotificationSettings(
												client,
												"project",
												project.id,
												project.path_with_namespace,
											),
										),
									),
									fetchNotificationSettings(client, "global", null, "Global"),
								]);

							const global = {
								level:
									notificationLevels.find(
										(level) => level.value === globalSettings.level,
									) || notificationLevels[0],
								notification_email: globalSettings.notification_email || "",
							};

							if (db) {
								const firebaseData = await get().fetchFirebaseData(expoToken);

								if (!firebaseData || !firebaseData.notifications) {
									await updateNotificationLevel(
										db,
										expoToken,
										{
											notification_level: global.level.value,
											custom_events: [],
										},
										projectsWithSettings.map((project) => ({
											id: project.id,
											name: project.name,
											notification_level: project.level.value,
											custom_events: [],
										})),
									);

									set({
										groups: groupsWithSettings,
										projects: projectsWithSettings,
										global,
										isInitialized: true,
									});
								} else {
									set({
										projects: firebaseData.notifications.map((n) => ({
											id: n.id,
											name: n.name,
											level:
												notificationLevels.find(
													(l) => l.value === n.notification_level,
												) || notificationLevels[0],
										})),
										global: {
											level:
												notificationLevels.find(
													(l) =>
														l.value ===
														firebaseData.global_notification.notification_level,
												) || notificationLevels[0],
											notification_email: global.notification_email,
										},
										groups: groupsWithSettings,
										isInitialized: true,
									});
								}
							}
						} else if (db) {
							const firebaseData = await get().fetchFirebaseData(expoToken);
							if (firebaseData && firebaseData.notifications) {
								set({
									projects: firebaseData.notifications.map((n) => ({
										id: n.id,
										name: n.name,
										level:
											notificationLevels.find(
												(l) => l.value === n.notification_level,
											) || notificationLevels[0],
									})),
									global: {
										level:
											notificationLevels.find(
												(l) =>
													l.value ===
													firebaseData.global_notification.notification_level,
											) || notificationLevels[0],
										notification_email: get().global.notification_email,
									},
								});
							}
						}
					} catch (error) {
						console.error("Error syncing notification settings:", error);
						captureError("firebase_sync_settings_error", error);
					} finally {
						set({ isLoading: false });
					}
				},
				set,
			),

			selectNotificationLevel: withErrorHandling(
				async (level: NotificationLevel) => {
					const { selectedItemType, selectedItemIndex, projects, global } =
						get();
					let updatedProjects = [...projects];
					const updatedGlobal = { ...global };

					if (selectedItemType === "global") {
						updatedGlobal.level = level;
					} else if (selectedItemType === "project") {
						updatedProjects = projects.map((project, index) =>
							index === selectedItemIndex ? { ...project, level } : project,
						);
					}

					set({
						projects: updatedProjects,
						global: updatedGlobal,
						modalVisible: false,
					});

					try {
						const expoToken = await getExpoToken();
						if (!expoToken && Device.isDevice) {
							throw new Error("Failed to retrieve Expo token");
						}

						if (db) {
							const globalNotification = {
								notification_level: updatedGlobal.level.value,
								custom_events: [],
							};

							const updatedNotifications = updatedProjects.map((project) => ({
								id: project.id,
								name: project.name,
								notification_level: project.level.value,
								custom_events: [],
							}));

							await updateNotificationLevel(
								db,
								expoToken,
								globalNotification,
								updatedNotifications,
							);
						}
					} catch (error) {
						console.error("Error updating notification level:", error);
						captureError("firebase_update_notification_level_error", error);
					}
				},
				set,
			),

			openModal: (type: any, index = -1) => {
				set({
					selectedItemType: type,
					selectedItemIndex: index,
					modalVisible: true,
				});
			},

			fetchGitLabEmailSettings: withErrorHandling(
				async (client: GitLabClient) => {
					try {
						const response =
							(await client.GlobalNotification.all()) as GitLabNotificationSettings;
						set({
							global: {
								level:
									notificationLevels.find(
										(level) => level.value === response.level,
									) || notificationLevels[0],
								notification_email: response.notification_email || "",
							},
						});
					} catch (error) {
						console.error("Error fetching GitLab email settings:", error);
						captureError("firebase_fetch_gitlab_email_settings_error", error);
					}
				},
				set,
			),

			fetchFirebaseNotifications: withErrorHandling(
				async (expoToken: string) => {
					if (!db) return;

					try {
						const firebaseData = await get().fetchFirebaseData(expoToken);
						if (firebaseData && firebaseData.notifications) {
							set({
								projects: firebaseData.notifications.map((n) => ({
									id: n.id,
									name: n.name,
									level:
										notificationLevels.find(
											(l) => l.value === n.notification_level,
										) || notificationLevels[0],
								})),
								global: {
									level:
										notificationLevels.find(
											(l) =>
												l.value ===
												firebaseData.global_notification.notification_level,
										) || notificationLevels[0],
									notification_email: get().global.notification_email,
								},
							});
						}
					} catch (error) {
						console.error("Error fetching Firebase notifications:", error);
						captureError("firebase_fetch_notifications_error", error);
					}
				},
				set,
			),

			syncGitLabWithFirebase: withErrorHandling(
				async (client: GitLabClient, expoToken: string) => {
					if (!db) return;

					try {
						const projects = await getAllProjects(client);
						const firebaseData = await get().fetchFirebaseData(expoToken);
						const firebaseProjects = firebaseData?.notifications || [];

						const firebaseProjectMap = new Map(
							firebaseProjects.map((p) => [p.id, p]),
						);

						const updatedNotifications = projects.map((project) => {
							const firebaseProject: FirebaseNotification | undefined =
								firebaseProjectMap.get(project.id);
							return {
								id: project.id,
								name: project.path_with_namespace,
								notification_level:
									firebaseProject?.notification_level ||
									get().global.level.value,
								custom_events: firebaseProject?.custom_events || [],
							};
						});

						await updateNotificationLevel(
							db,
							expoToken,
							{
								notification_level: get().global.level.value,
								custom_events: [],
							},
							updatedNotifications,
						);

						set({
							projects: updatedNotifications.map((n) => ({
								id: n.id,
								name: n.name,
								level:
									notificationLevels.find(
										(l) => l.value === n.notification_level,
									) || notificationLevels[0],
							})),
						});
					} catch (error) {
						console.error("Error syncing GitLab with Firebase:", error);
						captureError("firebase_sync_gitlab_error", error);
					}
				},
				set,
			),

			detectNewRepositories: withErrorHandling(async (client: GitLabClient) => {
				try {
					const result = await getAllProjectsWithComparison(client);

					if (result.hasNewProjects) {
						// Get consent store actions
						const consentStore = useConsentStore.getState();

						// Store new repositories for user review
						consentStore.setNewRepositoryDetection({
							newProjects: result.newProjects,
							detectedAt: new Date().toISOString(),
							hasBeenShown: false,
						});

						// Also set as pending for immediate access
						consentStore.setPendingNewRepos(result.newProjects);

						console.log(
							`Detected ${result.newProjects.length} new repositories`,
						);

						// Send push notification for new repositories
						await sendNewRepositoryNotification(result.newProjects, {
							title: "New GitLab Repositories Found",
							sound: true,
							badge: true,
						});

						return {
							hasNewProjects: true,
							newProjects: result.newProjects,
							count: result.newProjects.length,
						};
					}

					return {
						hasNewProjects: false,
						newProjects: [],
						count: 0,
					};
				} catch (error) {
					console.error("Error detecting new repositories:", error);
					captureError("repository_detection_error", error);
					return {
						hasNewProjects: false,
						newProjects: [],
						count: 0,
					};
				}
			}, set),

			startRepositoryPolling: (client: GitLabClient, intervalMinutes = 30) => {
				// Clear any existing interval
				const state = get();
				if (state.repositoryPollingInterval) {
					clearInterval(state.repositoryPollingInterval);
				}

				// Start new polling interval
				const intervalId = setInterval(
					async () => {
						if (get().consentToRGPDGiven) {
							await get().detectNewRepositories(client);
						}
					},
					intervalMinutes * 60 * 1000,
				);

				set({ repositoryPollingInterval: intervalId });
			},

			stopRepositoryPolling: () => {
				const state = get();
				if (state.repositoryPollingInterval) {
					clearInterval(state.repositoryPollingInterval);
					set({ repositoryPollingInterval: null });
				}
			},
		}),
		{
			name: "notification-storage",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				consentToRGPDGiven: state.consentToRGPDGiven,
			}),
		},
	),
);
