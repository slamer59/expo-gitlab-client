import { View } from '@/components/Themed';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export function RepositoryCard(
  { name, description, icon }: { name: string, description: string, icon: any },
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
        {icon ?
          <Image
            className='w-10 h-10'
            source={{
              uri: icon
            }}
          /> :
          <Ionicons name="folder-open-outline" size={24} color="green" />
        }
        <Text className='mt-2 text-lg font-bold'>{name}</Text>
      </View>
      <Text className='mt-1 text-gray-600'>{description}</Text>
    </View>
  );
}