import GitLabNotificationSettings from '@/components/Settings/GitlabNotificationSettings';
import SystemSettingsScreen from '@/components/Settings/SystemSettings';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useSession } from '@/lib/session/SessionProvider';
import { Ionicons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import { Redirect, Stack, router } from 'expo-router';
import { default as React } from 'react';
import { Linking, Platform, Pressable, ScrollView, View } from 'react-native';

export default function OptionScreen() {
  const { signOut, session } = useSession();

  if (!session) {
    return <Redirect href='/login' />;
  }

  const getIssueDescription = () => {
    return encodeURIComponent(
      `## App Information\n` +
      `- App Version: ${Application.applicationName} v${Application.nativeBuildVersion}\n` +
      `- Platform: ${Platform.OS}\n` +
      `- OS Version: ${Platform.Version}\n` +
      `- GitLab API: v4\n\n` +
      `## Feedback\n` +
      `<!-- Please describe your feedback, issue, or suggestion here -->\n\n` +
      `## Steps to Reproduce (if applicable)\n` +
      `1. \n2. \n3. \n\n` +
      `## Expected Behavior\n\n` +
      `## Actual Behavior\n\n` +
      `## Additional Information\n`
    );
  };

  const handleFeedback = () => {
    router.push({
      pathname: '/workspace/projects/[projectId]/issues/create',
      params: {
        projectId: '62930051',
        title: 'Feedback: Gitalchemy Mobile App',
        description: getIssueDescription()
      }
    });
  };

  const supportLinks = [
    {
      icon: "heart-outline",
      text: "Support on Patreon",
      url: "https://www.patreon.com/c/teepeetlse",
      color: "#FF424D",
      external: true
    },
    {
      icon: "cafe-outline",
      text: "Buy Me a Coffee",
      url: "https://buymeacoffee.com/thomaspedo6",
      color: "#FFDD00",
      external: true
    },
    {
      icon: "globe-outline",
      text: "Visit Website",
      url: "https://thomaspedot.dev",
      color: "#0085CA",
      external: true
    },
    {
      icon: "star-outline",
      text: "Rate on Google Play",
      url: "https://play.google.com/store/apps/details?id=com.thomaspedot.gitalchemy",
      color: "#34A853",
      external: true
    },
    {
      icon: "chatbubble-outline",
      text: "Submit Feedback",
      color: "#FC6D26",
      external: false,
      onPress: handleFeedback
    }
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "General settings",
        }}
      />

      <ScrollView className='flex-1 p-4 bg-background'>
        <SystemSettingsScreen />
        <GitLabNotificationSettings />

        <View className='mt-6 mb-6 border-t border-gray-700' />

        <View className='mb-6'>
          <Text className='mb-4 text-xl font-bold text-white'>About</Text>
          <View className='space-y-2'>
            <Text className='text-white'>Version: {Application.applicationName} v{Application.nativeBuildVersion}</Text>
            <Text className='text-white'>GitLab API: v4</Text>
          </View>
        </View>

        <View className='mb-6 border-t border-gray-700' />

        <View className='mb-6'>
          <Text className='mb-4 text-xl font-bold text-white'>Support</Text>
          {supportLinks.map((link, index) => (
            <Pressable
              key={index}
              onPress={() => {
                if (link.external) {
                  Linking.openURL(link.url!);
                } else {
                  link.onPress?.();
                }
              }}
              className='flex-row items-center py-3'
            >
              <Ionicons
                name={link.icon as any}
                size={24}
                color={link.color}
                style={{ marginRight: 12 }}
              />
              <Text className='text-lg text-white'>{link.text}</Text>
            </Pressable>
          ))}
        </View>

        <View className='mb-6 border-t border-gray-700' />

        <View className='mb-6'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <Text className='text-2xl font-bold text-white'>Sign Out</Text>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove
                  your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className='bg-border'>
                  <Text>Cancel</Text>
                </AlertDialogCancel>
                <AlertDialogAction
                  className='text-white bg-destructive'
                  onPress={signOut}
                >
                  <Text>Logout</Text>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </View>
      </ScrollView>
    </>
  );
}
