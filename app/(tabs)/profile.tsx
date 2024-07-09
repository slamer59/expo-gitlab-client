
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabTwoScreen() {
  return (
    <View className="items-center justify-center flex-1">
      <Text className="text-2xl font-bold">Tab Two</Text>
      <View className="w-4/5 h-1 my-6 bg-gray-200 dark:bg-gray-700" lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>

  );
}

