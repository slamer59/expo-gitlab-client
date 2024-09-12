if (__DEV__) {
  require("../ReactotronConfig");
}
import "@/global.css";
import { SessionProvider, useSession } from "@/lib/session/SessionProvider";
import { initializeTokenChecker } from "@/lib/session/tokenChecker";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from 'expo-navigation-bar';
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PostHogProvider } from 'posthog-react-native';
import React from 'react';
import { Platform } from "react-native";
import "react-native-reanimated";

// import { Theme } from '@react-navigation/native';
// import { NAV_THEME } from '~/lib/constants';

// const LIGHT_THEME: Theme = {
//   dark: false,
//   colors: NAV_THEME.light,
// };
// const DARK_THEME: Theme = {
//   dark: true,
//   colors: NAV_THEME.dark,
// };


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
  // const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const { session, isLoading: isSessionLoading } = useSession();
  const queryClient = new QueryClient();

  const [isReady, setIsReady] = React.useState({
    colorScheme: false,
    preparation: false
  });

  // Effect for color scheme
  React.useEffect(() => {
    const setBackgroundColor = async () => {
      console.log("ok")
      if (Platform.OS === 'android') {
        await NavigationBar.setBackgroundColorAsync('#ffffff00')
      }
    };
    setBackgroundColor();
  }, []);



  // React.useEffect(() => {
  //   async function loadColorScheme() {
  //     const theme = await AsyncStorage.getItem('theme');
  //     if (Platform.OS === 'web') {
  //       document.documentElement.classList.add('bg-background');
  //     }
  //     if (!theme) {
  //       await AsyncStorage.setItem('theme', colorScheme);
  //     } else {
  //       const colorTheme = theme === 'dark' ? 'dark' : 'light';
  //       if (colorTheme !== colorScheme) {
  //         setColorScheme(colorTheme);
  //         setAndroidNavigationBar(colorTheme);
  //       } else {
  //         setAndroidNavigationBar(colorTheme);
  //       }
  //     }
  //     setIsReady(prev => ({ ...prev, colorScheme: true }));
  //   }
  //   loadColorScheme();
  // }, []);

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

  // if (!isReady.colorScheme || !isReady.preparation || isSessionLoading) {
  if (!isReady.preparation || isSessionLoading) {
    return null;
  }
  return (

    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}> */}
      <StatusBar />

      <Stack initialRouteName={session ? "(tabs)" : "login"}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>

      <PortalHost />
      {/* </ThemeProvider> */}
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

    </PostHogProvider >

  );
}