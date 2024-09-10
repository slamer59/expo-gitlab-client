import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useSession } from '@/lib/session/SessionProvider';

import Loading from '@/components/Loading';
import { defaultOptionsHeader } from '@/lib/constants';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

  const { session, isLoading } = useSession();
  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Loading />
  }
  if (!session) {
    return <Redirect href="/login" />;
  }


  return (
    <Tabs
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          backgroundColor: 'hsl(213, 45%, 5.2%)',
          borderTopColor: 'hsl(213, 50%, 12%)',
          // Darker border color for better visibility
          // Adjust the height as needed
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          ...defaultOptionsHeader
          // headerRight: () => (
          //   <View className='flex-row items-center'>
          //     <Link href="/search" asChild>
          //       <Pressable>
          //         {({ pressed }) => (
          //           <FontAwesome
          //             name="search"
          //             size={25}
          //             color={Colors[colorScheme ?? 'light'].text}
          //             style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //           />
          //         )}
          //       </Pressable>
          //     </Link>
          //     <Link href="/add-project" asChild>
          //       <Pressable>
          //         {({ pressed }) => (
          //           <FontAwesome
          //             name="plus"
          //             size={25}
          //             color={Colors[colorScheme ?? 'light'].text}
          //             style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //           />
          //         )}
          //       </Pressable>
          //     </Link>
          //     <Link href="/options" asChild>
          //       <Pressable>
          //         {({ pressed }) => (
          //           <FontAwesome
          //             name="ellipsis-v"
          //             size={25}
          //             color={Colors[colorScheme ?? 'light'].text}
          //             style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //           />
          //         )}
          //       </Pressable>
          //     </Link>
          //   </View>
          // ),
        }}
      />


      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          ...defaultOptionsHeader,
          headerRight: () => (
            <View className='flex-row items-center'>
              <Link href="/share"
                className='m-1'
                asChild
              >
                <Pressable>
                  {
                    ({ pressed }) => (
                      <FontAwesome
                        name="share-alt"
                        size={25}
                        // color={Colors[colorScheme ?? 'light'].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                </Pressable>
              </Link >
              <Link
                href="/options"
                className='m-1'
                asChild
              >
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="ellipsis-v"
                      size={25}
                      // color={Colors[colorScheme ?? 'light'].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            </View >
          ),

        }}
      />
    </Tabs >
  );
}
