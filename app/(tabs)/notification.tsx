import { NotificationCard } from '@/components/ui/notification-card';
import { Text } from '@/components/ui/text';
import { TopFilterList } from '@/components/ui/top-filter-list';
import { Ionicons } from '@expo/vector-icons'; // You can use any icon library you prefer
import { Link } from 'expo-router';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
const GITHUB_AVATAR_URI =
  'https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg';

export default function Screen() {

  const notifications = [
    {
      title: 'Notification Title',
      description: 'Notification description cut to a certain number of characters...',
      repository: 'github.com/username/repo',
      avatarUri: GITHUB_AVATAR_URI,
      date: 1631625600000, // Unix timestamp for the notification date
      status: "fail"
    },
    {
      title: 'Notification Title',
      description: 'Notification description cut to a certain number of characters...',
      repository: 'github.com/username/repo',
      avatarUri: GITHUB_AVATAR_URI,
      date: 1631625600000, // Unix timestamp for the notification date
      status: "success"
    }
  ];
  return (
    <ScrollView className="flex-1 px-4 bg-light dark:bg-light"
      contentContainerStyle={{
        paddingVertical: 20,
        alignItems: 'center',
        gap: 20,
      }}
    >
      <TopFilterList />
      <Ionicons name="notifications-outline" size={24} color="black" />
      <Text className='text-2xl font-bold text-light dark:text-dark'>Customize notification</Text>
      <Text className='text-center'>Here you can customize your notification settings.</Text>
      <Link href="/notification-settings">
        <Pressable className='px-4 py-2 rounded-md bg-dark dark:bg-light'>
          <Text className='text-light dark:text-dark'>Go to Notification Settings</Text>
        </Pressable>
      </Link>
      {notifications.map((notificationStatus, index) => (
        <View key={index} className='w-full'>
          <NotificationCard {...notificationStatus} />
        </View>
      ))}
    </ScrollView>
  );
}
