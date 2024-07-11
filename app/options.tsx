import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { resetToken } from '@/lib/utils';
import { useNavigation } from 'expo-router';
import React from 'react';
import { Alert, View } from 'react-native';

export default function OptionScreen() {
  const navigation = useNavigation()
  return (
    <View className='flex-1 p-4 bg-light dark:bg-dark'>
      <View className='flex-row items-center mb-4'>
        <Text className='text-2xl font-bold text-light dark:text-primaryDark'>Settings</Text>
      </View>
      {/* <View className='mb-6'>
        <Text className='text-light dark:text-primaryDark'>Notifications</Text>
        <Text className='mt-2 text-light dark:text-primaryDark'>Configure Notifications</Text>
      </View> */}
      {/* <View className='mb-6 border-t border-gray-700' /> */}
      {/* <View className='mb-6'>
        <Text className='text-light dark:text-primaryDark'>General</Text>
        <Text className='mt-2 text-light dark:text-primaryDark'>Theme</Text>
        <Text className='text-light dark:text-primaryDark'>Follow system</Text>
        <Text className='mt-2 text-light dark:text-primaryDark'>Code Options</Text>
        <Text className='mt-2 text-light dark:text-primaryDark'>Language</Text>
        <Text className='text-light dark:text-primaryDark'>Follow system</Text>
        <Text className='mt-2 text-light dark:text-primaryDark'>Accounts</Text>
      </View> */}
      {/* <View className='mb-6 border-t border-gray-700' /> */}
      {/* <View className='mb-6'>
        <Text className='text-light dark:text-primaryDark'>Subscriptions</Text>
        <Text className='mt-2 text-light dark:text-primaryDark'>Copilot</Text>
      </View> */}
      {/* <View className='mb-6 border-t border-gray-700' /> */}
      <View className='mb-6'>
        {/* <Text className='text-light dark:text-primaryDark'>More Options</Text>
        <Text className='mt-2 text-light dark:text-primaryDark'>Feature Preview</Text>
        <Text className='mt-2 text-light dark:text-primaryDark'>Share Feedback</Text>
        <Text className='mt-2 text-light dark:text-primaryDark'>Get Help</Text>
        <Text className='mt-2 text-light dark:text-primaryDark'>Terms of Service</Text>
        <Text className='mt-2 text-light dark:text-primaryDark'>Privacy Policy & Analytics</Text>
        <Text className='mt-2 text-light dark:text-primaryDark'>Open Source Libraries</Text> */}
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
                    resetToken()
                    navigation.navigate("login")
                  }
                }
              ]
            )
          }}
          className='mt-2 bg-red-500 text-light dark:text-primaryDark'>
          <Text className='text-light dark:text-primary'>Sign Out</Text>
        </Button>
      </View>
      <Text className='mt-6 text-sm text-light dark:text-primaryDark'>GitAlchemy v0.1.0</Text>
    </View>
  );
}


