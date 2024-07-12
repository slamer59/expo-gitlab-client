import { useClientOnlyValue } from '@/components/useClientOnlyValue';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
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
      {/* <Tabs.Screen
        name="notification"
        options={{
          title: 'Notification',
          tabBarIcon: ({ color }) => <TabBarIcon name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <TabBarIcon name="compass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerRight: () => (
            <View className='flex-row items-center'>
              <Link href="/share" asChild>
                <Pressable>
                  {
                    ({ pressed }) => (
                      <FontAwesome
                        name="share-alt"
                        size={25}
                        color={Colors[colorScheme ?? 'light'].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                </Pressable>
              </Link >
              <Link href="/options" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="ellipsis-v"
                      size={25}
                      color={Colors[colorScheme ?? 'light'].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            </View >
          ),

        }}
      /> */}
    </Tabs >
  );
}
