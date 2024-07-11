import { Text, View } from '@/components/Themed';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="items-center justify-center flex-1 px-5">
        <Text className="text-lg font-bold">This screen doesn't exist.</Text>

        <Link href="/" className="py-3 mt-3">
          <Text className="text-sm text-blue-500">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
