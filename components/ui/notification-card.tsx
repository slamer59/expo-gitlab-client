import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons'; // You can use any icon library you prefer
import * as React from 'react';
import { View } from '@/components/Themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function NotificationCard(
  { status, repository, date, title, description }: { description: string, status: 'success' | 'error'; repository: string; date: string; title: string; }
) {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };
  return (
    <View
      className='w-full p-4 bg-white rounded-lg shadow-md' >
      <View className='flex-row items-center gap-3'>
        <Text className={`mt-1 text-lg font-bold ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          {status === 'success' ?
            <Ionicons name="checkmark-circle" size={24} color="green" /> :
            <Ionicons name="close-circle-outline" size={24} color="red" />
          }
        </Text>

        <Text className='text-gray-500'>{repository}</Text>
        <Text className='mt-2 text-sm text-gray-500'>
          {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
      </View>
      <Text className='mt-2 text-lg font-bold'>{title}</Text>
      <Text className='mt-1 text-gray-600'>{description}</Text>
    </View>
  );
}