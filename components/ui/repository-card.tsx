import { View } from '@/components/Themed';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Image } from 'react-native';
export function RepositoryCard(
  { id, name, description, icon }: { id: string, name: string, description: string, icon: any },
) {

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
          <Text style={{ fontSize: 20, color: 'green' }}>
            {name.charAt(0).toUpperCase()}
          </Text>}
        <Text className='mt-2 text-lg font-bold'>{name}</Text>
      </View>
      <Text className='mt-1 text-gray-600'>{description}</Text>
    </View>
  );
}