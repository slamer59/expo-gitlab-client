import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { resetToken } from '@/lib/utils';
import { useNavigation } from 'expo-router';
import React from 'react';
import { Alert, View } from 'react-native';

export default function OptionScreen() {
  const navigation = useNavigation()
  return (
    <View className='flex-1 p-4 bg-gray-900'>
      <View className='flex-row items-center mb-4'>
        <Text className='text-2xl font-bold text-black'>Settings</Text>
      </View>
      {/* <View className='mb-6'>
        <Text className='text-gray-400'>Notifications</Text>
        <Text className='mt-2 text-black'>Configure Notifications</Text>
      </View> */}
      {/* <View className='mb-6 border-t border-gray-700' /> */}
      {/* <View className='mb-6'>
        <Text className='text-gray-400'>General</Text>
        <Text className='mt-2 text-black'>Theme</Text>
        <Text className='text-gray-400'>Follow system</Text>
        <Text className='mt-2 text-black'>Code Options</Text>
        <Text className='mt-2 text-black'>Language</Text>
        <Text className='text-gray-400'>Follow system</Text>
        <Text className='mt-2 text-black'>Accounts</Text>
      </View> */}
      {/* <View className='mb-6 border-t border-gray-700' /> */}
      {/* <View className='mb-6'>
        <Text className='text-gray-400'>Subscriptions</Text>
        <Text className='mt-2 text-black'>Copilot</Text>
      </View> */}
      {/* <View className='mb-6 border-t border-gray-700' /> */}
      <View className='mb-6'>
        {/* <Text className='text-gray-400'>More Options</Text>
        <Text className='mt-2 text-black'>Feature Preview</Text>
        <Text className='mt-2 text-black'>Share Feedback</Text>
        <Text className='mt-2 text-black'>Get Help</Text>
        <Text className='mt-2 text-black'>Terms of Service</Text>
        <Text className='mt-2 text-black'>Privacy Policy & Analytics</Text>
        <Text className='mt-2 text-black'>Open Source Libraries</Text> */}
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
          className='mt-2 text-black bg-red-500'>
          <Text className='text-black'>Sign Out</Text>
        </Button>
      </View>
      <Text className='mt-6 text-sm text-gray-500'>GitAlchemy v0.1.0</Text>
    </View>
  );
}


