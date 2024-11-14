import "@/global.css";
import { defaultOptionsHeader } from "@/lib/constants";
import { SessionProvider, useSession } from "@/lib/session/SessionProvider";
import { initializeTokenChecker } from "@/lib/session/tokenChecker";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from 'expo-notifications';
import { router, SplashScreen, Stack } from "expo-router";
import { PostHogProvider } from 'posthog-react-native';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export {
  ErrorBoundary
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      console.log("🚀 ~ redirect ~ url:", url)
      if (url) {
        router.push(url);
      }
    }

    Notifications.getLastNotificationResponseAsync()
      .then(response => {
        if (!isMounted || !response?.notification) {
          return;
        }
        redirect(response?.notification);
      });

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, isLoading: isSessionLoading } = useSession();
  const queryClient = new QueryClient();
  const [isReady, setIsReady] = React.useState({
    preparation: false
  });

  useNotificationObserver();

  // Effect for other preparations
  React.useEffect(() => {
    async function prepare() {
      try {
        initializeTokenChecker();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(prev => ({ ...prev, preparation: true }));
      }
    }

    prepare();
  }, []);

  // Effect to hide splash screen
  React.useEffect(() => {
    if (isReady.preparation && !isSessionLoading) {
      SplashScreen.hideAsync();
    }
  }, [isReady, isSessionLoading]);

  if (!isReady.preparation || isSessionLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          title: "",
          ...defaultOptionsHeader
        }}
        initialRouteName={session ? "(tabs)" : "login"}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>

      {/* {session && !hasShownRGPDNotice && <NotificationPermissionDialog />} */}
      <PortalHost />
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PostHogProvider
        apiKey="POSTHOG_API_KEY_REMOVED"
        options={{
          host: "https://eu.i.posthog.com",
        }}
        autocapture={{
          captureTouches: true,
          captureLifecycleEvents: true,
          noCaptureProp: 'data-no-capture',
          navigation: {
            routeToProperties: (name, properties) => properties,
            routeToName: (name, properties) => name,
          },
        }}
      >
        <SessionProvider>
          <SafeAreaProvider>
            <RootLayoutNav />
          </SafeAreaProvider>
        </SessionProvider>
      </PostHogProvider>
    </GestureHandlerRootView>
  );
}
