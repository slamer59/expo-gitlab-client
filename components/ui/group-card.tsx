import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

export function GroupCard(
  { name, description, icon, handlePress }: { name: string, description: string, icon: any, handlePress: () => any }
) {
  const insets = useSafeAreaInsets();
  const [repositories, setRepositories] = React.useState<any[]>([]);
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };
  const onOpenChange = async (isOpen: boolean) => {
    setRepositories(await handlePress())
  };
  console.log(repositories)
  return (
    <Collapsible className='w-full max-w-sm native:max-w-md' onOpenChange={onOpenChange} >
      <CollapsibleTrigger >
        <View className='flex-row items-center gap-3'>
          <Ionicons name="folder-outline" size={24} color="green" />
          <Text className='mt-2 text-lg font-bold'>{name}</Text>
          <Text className='mt-1 text-gray-600'>{description}</Text>
        </View>
      </CollapsibleTrigger>
      <CollapsibleContent >
        {repositories.map((repo: any) => (<View className='flex-row items-start m-2'>
          <View>
            {icon ?
              <Image
                className='w-10 h-10'
                source={{
                  uri: icon
                }}
              /> :
              <Text
                className='w-10 h-10'
                style={{ fontSize: 20, color: 'green' }}>
                {repo.name.charAt(0).toUpperCase()}
              </Text>}
          </View>
          <View className='flex-col items-start'>
            <Text className='mt-2 text-lg font-bold'>{repo.name}</Text>
            {repo.description && <Text className='mt-1 text-gray-600'>{repo.description}</Text>}
          </View>
        </View>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}