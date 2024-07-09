import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { View } from 'react-native';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
import { RepositoryCard } from './repository-card';

export function GroupCard(
  { name, description, icon, handlePress }: { name: string, description: string, icon: any, handlePress: () => any }
) {
  const [repositories, setRepositories] = React.useState<any[]>([]);

  const onOpenChange = async (isOpen: boolean) => {
    if (isOpen) {
      setRepositories(await handlePress())
    }
  };
  return (
    <Collapsible className='w-full max-w-sm native:max-w-md' onOpenChange={onOpenChange} >
      <CollapsibleTrigger >
        <View className='flex-row items-center gap-3'>
          <Ionicons name="folder-outline" size={24} color="black" />
          <Text className='mt-2 text-lg font-bold'>{name}</Text>
          <Text className='mt-1 text-gray-600'>{description}</Text>
        </View>
      </CollapsibleTrigger>
      <CollapsibleContent className='w-full p-4' >
        {repositories.map((repo: React.JSX.IntrinsicAttributes & { id: string; name: string; description: string; icon: any; }, index: React.Key | null | undefined) =>
          <RepositoryCard key={index} {...repo} />
        )}
      </CollapsibleContent >
    </Collapsible >
  );
}