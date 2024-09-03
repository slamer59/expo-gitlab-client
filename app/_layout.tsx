if (__DEV__) {
  require("../ReactotronConfig");
}
import "@/global.css";
import { initializeTokenChecker } from "@/lib/session/tokenChecker";

import { SessionProvider, useSession } from "@/lib/session/SessionProvider";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PostHogProvider } from 'posthog-react-native';
import React from 'react';
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

function RootLayoutNav() {
  const { session, isLoading } = useSession();
  const [isReady, setIsReady] = React.useState(false);
  const queryClient = new QueryClient();

  React.useEffect(() => {
    async function prepare() {
      try {
        // Perform any initialization tasks here
        initializeTokenChecker();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  React.useEffect(() => {
    if (isReady && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isReady, isLoading]);

  if (!isReady || isLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar />
      <Stack initialRouteName={session ? "(tabs)" : "login"}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
      <PortalHost />
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  return (
    <PostHogProvider apiKey="POSTHOG_API_KEY_REMOVED" options={{
      host: "https://eu.i.posthog.com",
    }}>
      <SessionProvider>
        <RootLayoutNav />
      </SessionProvider>
    </PostHogProvider>
  );
}