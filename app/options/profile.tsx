import GitLabNotificationSettings from '@/components/Settings/GitlabNotificationSettings';
import SystemSettingsScreen from '@/components/Settings/SystemSettings';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { supportLinks } from '@/lib/links/support';
import { useSession } from '@/lib/session/SessionProvider';
import { Ionicons } from '@expo/vector-icons';
import * as Application from 'expo-application';

import { Redirect, Stack } from 'expo-router';
import { default as React } from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';

export default function OptionScreen() {
  const { signOut, session } = useSession();

  if (!session) {
    return <Redirect href='/login' />;
  }

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
