import { GitLabNotificationSettings } from '@/components/Settings/GitlabNotificationSettings';
import SystemSettingsScreen from '@/components/Settings/SystemSettings';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useSession } from '@/lib/session/SessionProvider';
import * as Application from 'expo-application';
import { Redirect, Stack } from 'expo-router';
import { default as React } from 'react';
import { View } from 'react-native';

export default function OptionScreen() {

  const { signOut, session } = useSession()

  if (!session) {
    return <Redirect href='/login' />;
  }

  // const bundleIdentifier = Application.applicationId;

  return (
    <>
      <Stack.Screen
        options={{
          title: "General settings",
          // ...defaultOptionsHeader
        }}
      />

      <View className='flex-1 p-4 bg-background'>
        <SystemSettingsScreen />
        <GitLabNotificationSettings />

        {/* <View className='mb-6 border-t border-gray-700' /> */}
        {/* <View className='mb-6'>
        <Text className=''>General</Text>
        <Text className='mt-2 '>Theme</Text>
        <Text className=''>Follow system</Text>
        <Text className='mt-2 '>Code Options</Text>
        <Text className='mt-2 '>Language</Text>
        <Text className=''>Follow system</Text>
        <Text className='mt-2 '>Accounts</Text>
      </View> */}
        {/* <View className='mb-6 border-t border-gray-700' /> */}
        {/* <View className='mb-6'>
        <Text className=''>Subscriptions</Text>
        <Text className='mt-2 '>Copilot</Text>
      </View> */}
        {/* <View className='mb-6 border-t border-gray-700' /> */}
        <View className='mb-6'>
          {/* <Text className=''>More Options</Text>
        <Text className='mt-2 '>Feature Preview</Text>
        <Text className='mt-2 '>Share Feedback</Text>
        <Text className='mt-2 '>Get Help</Text>
        <Text className='mt-2 '>Terms of Service</Text>
        <Text className='mt-2 '>Privacy Policy & Analytics</Text>
        <Text className='mt-2 '>Open Source Libraries</Text> */}

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
        <Text className='mt-2 text-sm'>{Application.applicationName} v{Application.nativeBuildVersion}</Text>
      </View>
    </>
  );
}


