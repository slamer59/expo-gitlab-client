/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

import "@testing-library/jest-native/extend-expect";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
	require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Mock Firebase
const mockFirebase = {
	getApps: jest.fn(() => []),
	initializeApp: jest.fn(),
	getFirestore: jest.fn(() => ({
		doc: jest.fn(),
		getDoc: jest.fn(),
		setDoc: jest.fn(),
		deleteDoc: jest.fn(),
	})),
};

jest.mock("firebase/app", () => mockFirebase);
jest.mock("firebase/firestore", () => ({
	getFirestore: mockFirebase.getFirestore,
	doc: jest.fn(),
	getDoc: jest.fn(),
	setDoc: jest.fn(),
	deleteDoc: jest.fn(),
}));

// Mock Expo modules
jest.mock("expo-device", () => ({
	isDevice: true,
}));

jest.mock("expo-notifications", () => ({
	requestPermissionsAsync: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => ({
	Ionicons: "Ionicons",
	Octicons: "Octicons",
	AntDesign: "AntDesign",
	MaterialIcons: "MaterialIcons",
	FontAwesome: "FontAwesome",
	Feather: "Feather",
}));

jest.mock("expo-font", () => ({
	loadAsync: jest.fn(),
	isLoaded: jest.fn(() => true),
}));

// Mock @rn-primitives components
jest.mock("@rn-primitives/separator", () => ({
	Separator: "Separator",
}));

jest.mock("@rn-primitives/switch", () => ({
	Switch: "Switch",
}));

jest.mock("@rn-primitives/label", () => ({
	Label: "Label",
}));

jest.mock("@rn-primitives/select", () => ({
	Select: {
		Root: "Select.Root",
		Trigger: "Select.Trigger",
		Value: "Select.Value",
		Portal: "Select.Portal",
		Content: "Select.Content",
		ScrollUpButton: "Select.ScrollUpButton",
		Viewport: "Select.Viewport",
		Item: "Select.Item",
		ItemText: "Select.ItemText",
		ItemIndicator: "Select.ItemIndicator",
		ScrollDownButton: "Select.ScrollDownButton",
	},
}));

// Mock PostHog
jest.mock("posthog-react-native", () => ({
	usePostHog: jest.fn(() => ({
		capture: jest.fn(),
	})),
}));

// Mock lib/utils
jest.mock("@/lib/utils", () => ({
	getExpoToken: jest.fn(() => Promise.resolve("mock-expo-token")),
	tapForExpoToken: jest.fn(),
}));

// Mock Firebase helpers
jest.mock("@/lib/firebase/helpers", () => ({
	firebaseConfig: {
		apiKey: "mock-api-key",
		authDomain: "mock-auth-domain",
		projectId: "mock-project-id",
	},
}));

// Mock Firebase helpers for direct lib/ imports (now handled by moduleNameMapper)
jest.mock("lib/firebase/helpers", () => ({
	firebaseConfig: {
		apiKey: "mock-api-key",
		authDomain: "mock-auth-domain",
		projectId: "mock-project-id",
	},
}));

// Mock GitLab API
jest.mock("@/lib/gitlab/gitlab-api-wrapper", () => {
	return jest.fn().mockImplementation(() => ({
		Groups: { all: jest.fn(() => Promise.resolve([])) },
		GlobalNotification: {
			all: jest.fn(() => Promise.resolve({ level: "global" })),
		},
		GroupNotifications: {
			all: jest.fn(() => Promise.resolve({ level: "global" })),
		},
		ProjectNotifications: {
			all: jest.fn(() => Promise.resolve({ level: "global" })),
		},
	}));
});

// Mock webhooks
jest.mock("@/lib/gitlab/webhooks", () => ({
	updateOrCreateWebhooks: jest.fn(),
	removeWebhooks: jest.fn(),
}));

// Mock notification utils
jest.mock("@/lib/notification/utils", () => ({
	getAllProjects: jest.fn(() => Promise.resolve([])),
	getAllProjectsWithComparison: jest.fn(() =>
		Promise.resolve({ hasNewProjects: false, newProjects: [] }),
	),
	notificationLevels: [
		{ value: "global", label: "Global" },
		{ value: "watch", label: "Watch" },
		{ value: "mention", label: "On mention" },
		{ value: "participating", label: "Participating" },
		{ value: "disabled", label: "Disabled" },
	],
	updateNotificationLevel: jest.fn(),
}));

// Mock local notifications
jest.mock("@/lib/notification/local-notifications", () => ({
	sendNewRepositoryNotification: jest.fn(),
}));

// Mock react-native-css-interop
jest.mock("react-native-css-interop", () => ({
	styled: jest.fn().mockImplementation(() => jest.fn()),
	StyledProvider: jest.fn((props) => props.children),
	useColorScheme: jest.fn(() => "light"),
}));

// Mock React Native Reanimated
jest.mock("react-native-reanimated", () => ({
	default: {
		View: "Animated.View",
		Text: "Animated.Text",
		Image: "Animated.Image",
		ScrollView: "Animated.ScrollView",
		createAnimatedComponent: jest.fn(() => "AnimatedComponent"),
	},
	useAnimatedStyle: jest.fn(() => ({})),
	useSharedValue: jest.fn(() => ({ value: 0 })),
	withRepeat: jest.fn((value) => value),
	withTiming: jest.fn((value) => value),
	withSpring: jest.fn((value) => value),
	interpolate: jest.fn(),
	Extrapolate: { CLAMP: "clamp" },
	runOnJS: jest.fn((fn) => fn),
	useDerivedValue: jest.fn(),
	useAnimatedGestureHandler: jest.fn(),
	useAnimatedProps: jest.fn(() => ({})),
	createAnimatedPropAdapter: jest.fn(),
	processColor: jest.fn(),
	useWorkletCallback: jest.fn((fn) => fn),
	makeMutable: jest.fn(() => ({ value: 0 })),
	useAnimatedReaction: jest.fn(),
	useAnimatedScrollHandler: jest.fn(),
	useFrameCallback: jest.fn(),
	useAnimatedKeyboard: jest.fn(() => ({ height: { value: 0 } })),
	useReducedMotion: jest.fn(() => false),
	cancelAnimation: jest.fn(),
	measure: jest.fn(),
	scrollTo: jest.fn(),
	FadeIn: jest.fn(),
	FadeOut: jest.fn(),
	SlideInRight: jest.fn(),
	SlideOutLeft: jest.fn(),
	Layout: jest.fn(),
}));

// Mock React Native Safe Area Context
jest.mock("react-native-safe-area-context", () => ({
	SafeAreaProvider: jest.fn((props) => props.children),
	SafeAreaView: "SafeAreaView",
	useSafeAreaInsets: jest.fn(() => ({
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	})),
	useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
	initialWindowMetrics: {
		insets: { top: 0, bottom: 0, left: 0, right: 0 },
		frame: { x: 0, y: 0, width: 390, height: 844 },
	},
}));

// Mock React Native components
jest.mock("react-native", () => {
	const RN = jest.requireActual("react-native");

	// Mock components that might cause issues
	RN.Alert = {
		alert: jest.fn(),
	};

	return RN;
});

// Global test helpers
global.mockAsyncStorage = () => {
	const storage = require("@react-native-async-storage/async-storage/jest/async-storage-mock");
	return storage;
};

// Clean up mocks before each test
beforeEach(() => {
	jest.clearAllMocks();
});
