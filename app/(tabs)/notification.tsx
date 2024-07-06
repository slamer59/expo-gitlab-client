import { NotificationCard } from '@/components/ui/notification-card';
import { Text } from '@/components/ui/text';
import { TopFilterList } from '@/components/ui/top-filter-list';
import { Ionicons } from '@expo/vector-icons'; // You can use any icon library you prefer
import { Link } from 'expo-router';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const GITHUB_AVATAR_URI =
  'https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg';

export default function Screen() {
  const [progress, setProgress] = React.useState(78);

  function updateProgressValue() {
    setProgress(Math.floor(Math.random() * 100));
  }

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };
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

    <View className='flex items-center gap-5'>
      <TopFilterList />
      <Ionicons name="notifications-outline" size={24} color="black" />
      <Text className='text-2xl font-bold'>Customize notification</Text>
      <Text>Here you can customize your notification settings.</Text>
      <Link href="/notification-settings">
        <Pressable className='px-4 py-2 bg-blue-500 rounded-md'>
          <Text className='text-white'>Go to Notification Settings</Text>
        </Pressable>
      </Link>
      {/* Notification Status Card */}
      {notifications.map((notificationStatus, index) =>
        <View key={index}>
          <NotificationCard {...notificationStatus} />
        </View>
      )}
    </View>
  );
}
