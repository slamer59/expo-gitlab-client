import { GitLabNotificationSettings } from '@/components/Settings/GitlabNotificationSettings';
import SystemSettingsScreen from '@/components/Settings/SystemSettings';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useSession } from '@/lib/session/SessionProvider';
import * as Application from 'expo-application';
import { Redirect } from 'expo-router';
import { default as React } from 'react';
import { Alert, View } from 'react-native';

export default function OptionScreen() {

  const { signOut, session } = useSession()

  if (!session) {
    return <Redirect href='/login' />;
  }

  // const bundleIdentifier = Application.applicationId;

  return (
    <View className='flex-1 p-4 m-2'>
      <Text className='mb-4 text-2xl font-bold'>General settings</Text>
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
        <Button
          onPress={async () => {
            Alert.alert(
              "Logout",
              "Are you sure you want to logout?",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                {
                  text: "OK", onPress: () => {
                    signOut()
                  }
                }
              ]
            )
          }}
          className='m-1 bg-red-500 '>
          <Text className='text-light dark:text-primary'>Sign Out</Text>
        </Button>
      </View>
      <Text className='mt-2 text-sm'>{Application.applicationName} v{Application.nativeBuildVersion}</Text>
    </View >
  );
}


