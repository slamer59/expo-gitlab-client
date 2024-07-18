import { View } from '@/components/Themed';
import { Text } from '@/components/ui/text';
import { formatDate } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons'; // You can use any icon library you prefer
import * as React from 'react';

export function NotificationCard(
  { status, repository, date, title, description }: { description: string, status: 'success' | 'error'; repository: string; date: string; title: string; }
) {
  return (
    <View
      className='w-full p-4 bg-white rounded-lg shadow-md' >
      <View className='flex-row items-center gap-3'>
        <Text className={`mt-1 text-lg font-bold ${status === 'success' ? 'text-black-500' : 'text-red-500'}`}>
          {status === 'success' ?
            <Ionicons name="checkmark-circle" size={24} color="black" /> :
            <Ionicons name="close-circle-outline" size={24} color="red" />
          }
        </Text>

        <Text className='text-light dark:text-primaryDark'>{repository}</Text>
        <Text className='mt-2 text-sm text-light dark:text-primaryDark'>
          {formatDate(date)}
        </Text>
      </View>
      <Text className='mt-2 text-lg font-bold'>{title}</Text>
      <Text className='mt-1 text-light dark:text-dark'>{description}</Text>
    </View>
  );
}