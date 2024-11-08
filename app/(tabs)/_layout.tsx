import { HeaderAction, HeaderOption, HeaderRight } from '@/components/HeaderRight';
import Loading from '@/components/Loading';
import { Text } from "@/components/ui/text";
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { supportLinks } from '@/constants/links/support';
import { useSession } from '@/lib/session/SessionProvider';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { Link, Redirect, router, Tabs } from 'expo-router';
import { LucideHeartHandshake, LucideSmile } from 'lucide-react-native';
import React from 'react';
import { Image, Linking, Pressable, View } from 'react-native';


function TabBarIcon(props: {
  name: React.ComponentProps<typeof Octicons>['name'];
  color: string;
}) {
  return <Octicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Loading />
  }
  if (!session) {
    return <Redirect href="/login" />;
  }

  const headerActions: HeaderAction[] = supportLinks
    .filter(
      (link) => link.icon === "cafe-outline" || link.icon === "star-outline"
    )
    .map((link) => ({
      icon: link.icon,
      label: link.text,
      color: link.color,
      onPress: () => {
        link.onPress ? link.onPress() : Linking.openURL(link.url);
      },
      testID: link.testID
    }));


  const headerOptions: HeaderOption[] = [
    ...supportLinks.map(
      (link) =>
      ({
        icon: link.icon,
        label: link.text,
        color: link.color,
        onPress: () => { link.onPress ? link.onPress() : Linking.openURL(link.url) },
        testID: link.testID
      } as HeaderOption)
    ),
    {
      icon: "shield-checkmark-outline",
      onPress: () => router.push("/workspace/privacy-policy"),
      color: "#0085CA",
      label: "Privacy Policy",
      testID: "privacy-policy-button"
    },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: useClientOnlyValue(false, true),
          tabBarStyle: {
            backgroundColor: 'hsl(213, 45%, 5.2%)',
            borderTopColor: 'hsl(213, 50%, 12%)',
          },
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            color: 'white',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerRight: () => (
              <HeaderRight
                actions={headerActions}
                options={headerOptions}
                dropdownLabel={
                  <View className="flex-row items-center justify-center mr-2">
                    {/* <LucideThumbsUp color="red" /> */}
                    <LucideHeartHandshake color="red" />
                    <Text className="m-2 text-xl font-bold text-foreground">Support</Text>
                    <LucideSmile color="yellow" />
                  </View>}
              />
            ),
            // <View className="flex-row items-center">
            //   {supportLinks.map((item, index) => (
            //     <Pressable
            //       key={index}
            //       onPress={() => item.external ? Linking.openURL(item.url!) : item.onPress?.()}
            //     >
            //       {({ pressed }) => (
            //         <Ionicons
            //           name={item.icon}
            //           size={25}
            //           color={item.color}
            //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            //         />
            //       )}
            //     </Pressable>
            //   )
            //   )}
            // </View>
            // ),
            headerTitle: () => (
              <View className="flex-row items-center">
                <Image
                  source={require('@/assets/images/logo.png')}
                  style={{ width: 30, height: 30 }}
                  className="flex flex-row items-center justify-center p-6 mr-4 bg-white rounded-lg"
                />
                <Text className="text-4xl font-bold text-white">Home</Text>
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
            headerRight: () => (
              <View className='flex-row items-center'>
                <Link
                  href="/share/profile"
                  className='pl-2 pr-2 m-2'
                  asChild
                >
                  <Pressable>
                    {({ pressed }) => (
                      <Ionicons
                        name="share-social"
                        size={25}
                        color="white"
                        className="m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}"
                      />
                    )}
                  </Pressable>
                </Link>
                <Link
                  href="/options/profile"
                  className='pl-2 pr-2 m-2'
                  asChild
                >
                  <Pressable>
                    {({ pressed }) => (
                      <Ionicons
                        name="ellipsis-vertical"
                        size={25}
                        color="white"
                        className="m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}"
                        testID="options"
                      />
                    )}
                  </Pressable>
                </Link>
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
