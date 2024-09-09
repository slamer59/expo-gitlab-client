import { Text, View } from '@/components/Themed';
import { Link, Stack, usePathname } from 'expo-router';

export default function NotFoundScreen() {
  const pathname = usePathname();
  console.log(`This screen doesn't exist. Attempted path: ${pathname}`);
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="items-center justify-center flex-1 px-5">
        <Text className="text-lg font-bold">This screen doesn't exist.</Text>

        {__DEV__ && (
          <Text className="mt-2 text-sm">Attempted path: {pathname}</Text>
        )}

        <Link href="/" className="py-3 mt-3">
          <Text className="text-sm text-blue-500">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
