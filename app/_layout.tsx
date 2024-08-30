if (__DEV__) {
  require("../ReactotronConfig");
}
import "@/global.css";

import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PostHogProvider } from 'posthog-react-native';
import * as React from "react";

import "react-native-reanimated";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <PostHogProvider apiKey="POSTHOG_API_KEY_REMOVED" options={{
      host: "https://eu.i.posthog.com",
    }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar />
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          {/* <Stack.Screen name="home" options={{ headerShown: false }} /> */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
        <PortalHost />
      </QueryClientProvider>
    </PostHogProvider>
  );
}
