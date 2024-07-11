import { View } from '@/components/Themed';
import { Text } from '@/components/ui/text';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import * as React from 'react';
export function RepositoryCard(
  { id, name, description, icon }: { id: string, name: string, description: string, icon: any },
) {

  return (
    <Link className='flex flex-row items-center m-2'
      href={`/workspace/repositories/${id}`}
      key={id}
    >

      {icon ?
        <Image
          className='m-2 items-center *:text-center justify-center w-10 h-10 rounded-lg'
          source={{
            uri: icon
          }}
        /> :
        <Text className='w-10 h-10 m-2 rounded-lg' >
          {name.charAt(0).toUpperCase()}
        </Text>}

      <View className='flex flex-col items-start '>
        <Text className='mt-2 text-lg font-bold '>{name}</Text>
        {description && <Text className='mt-1 text-light dark:text-primaryDark'>{description}</Text>}
      </View>
    </Link >

  );
}
