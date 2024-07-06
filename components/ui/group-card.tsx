import { View } from '@/components/Themed';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '~/components/ui/accordion';

export function GroupCard(
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
    <AccordionItem value='item-2'>
      <AccordionTrigger>
        <View className='flex-row items-center gap-3'>
          <Ionicons name="folder-outline" size={24} color="green" />
          <Text className='mt-2 text-lg font-bold'>{name}</Text>
        </View>
      </AccordionTrigger>
      <AccordionContent>
        <Text className='mt-1 text-gray-600'>{description}</Text>
      </AccordionContent>
    </AccordionItem>
  );
}