import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { GitLabProject } from "./interfaces";

export interface RepositoryConsent {
	projectId: number;
	projectName: string;
	hasConsent: boolean;
	consentDate?: string;
}

export interface NewRepositoryDetection {
	newProjects: GitLabProject[];
	detectedAt: string;
	hasBeenShown: boolean;
}

interface ConsentStore {
	// General GDPR consent
	consentGiven: boolean;

	// Per-repository consent
	repositoryConsents: Map<number, RepositoryConsent>;

	// New repository detection
	newRepositoryDetection: NewRepositoryDetection | null;
	pendingNewRepos: GitLabProject[];

	// Actions
	setConsent: (consent: boolean) => void;
	setRepositoryConsent: (
		projectId: number,
		projectName: string,
		consent: boolean,
	) => void;
	setBulkRepositoryConsent: (
		projects: GitLabProject[],
		consent: boolean,
	) => void;
	getRepositoryConsent: (projectId: number) => boolean;
	setNewRepositoryDetection: (detection: NewRepositoryDetection) => void;
	clearNewRepositoryDetection: () => void;
	markNewReposAsShown: () => void;
	setPendingNewRepos: (repos: GitLabProject[]) => void;
	clearPendingNewRepos: () => void;
	getConsentedRepositoryIds: () => number[];
	removeRepositoryConsent: (projectId: number) => void;
}

const useConsentStore = create<ConsentStore>()(
	persist(
		(set, get) => ({
			consentGiven: false,
			repositoryConsents: new Map(),
			newRepositoryDetection: null,
			pendingNewRepos: [],

			setConsent: (consent: boolean) => set({ consentGiven: consent }),

			setRepositoryConsent: (
				projectId: number,
				projectName: string,
				consent: boolean,
			) => {
				const repositoryConsents = new Map(get().repositoryConsents);
				repositoryConsents.set(projectId, {
					projectId,
					projectName,
					hasConsent: consent,
					consentDate: consent ? new Date().toISOString() : undefined,
				});
				set({ repositoryConsents });
			},

			setBulkRepositoryConsent: (
				projects: GitLabProject[],
				consent: boolean,
			) => {
				const repositoryConsents = new Map(get().repositoryConsents);
				const now = new Date().toISOString();

				for (const project of projects) {
					repositoryConsents.set(project.id, {
						projectId: project.id,
						projectName: project.path_with_namespace || project.name,
						hasConsent: consent,
						consentDate: consent ? now : undefined,
					});
				}

				set({ repositoryConsents });
			},

			getRepositoryConsent: (projectId: number): boolean => {
				const consent = get().repositoryConsents.get(projectId);
				return consent?.hasConsent ?? false;
			},

			setNewRepositoryDetection: (detection: NewRepositoryDetection) => {
				set({ newRepositoryDetection: detection });
			},

			clearNewRepositoryDetection: () => {
				set({ newRepositoryDetection: null });
			},

			markNewReposAsShown: () => {
				const current = get().newRepositoryDetection;
				if (current) {
					set({
						newRepositoryDetection: {
							...current,
							hasBeenShown: true,
						},
					});
				}
			},

			setPendingNewRepos: (repos: GitLabProject[]) => {
				set({ pendingNewRepos: repos });
			},

			clearPendingNewRepos: () => {
				set({ pendingNewRepos: [] });
			},

			getConsentedRepositoryIds: (): number[] => {
				const consents = get().repositoryConsents;
				const consentedIds: number[] = [];

				for (const consent of consents.values()) {
					if (consent.hasConsent) {
						consentedIds.push(consent.projectId);
					}
				}

				return consentedIds;
			},

			removeRepositoryConsent: (projectId: number) => {
				const repositoryConsents = new Map(get().repositoryConsents);
				repositoryConsents.delete(projectId);
				set({ repositoryConsents });
			},
		}),
		{
			name: "consent-storage",
			storage: createJSONStorage(() => AsyncStorage),
			serialize: (state) => {
				// Convert Map to array for serialization
				const serializedState = {
					...state,
					repositoryConsents: Array.from(state.repositoryConsents.entries()),
				};
				return JSON.stringify(serializedState);
			},
			deserialize: (str) => {
				const parsed = JSON.parse(str);
				// Convert array back to Map after deserialization
				const repositoryConsents = new Map(parsed.repositoryConsents || []);
				return {
					...parsed,
					repositoryConsents,
				};
			},
		},
	),
);

export default useConsentStore;
