import { Text } from '@/components/ui/text';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Image, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 p-4">

      <View className="flex-row items-center mb-4">
        <Image
          source={{ uri: 'https://placehold.co/100x100' }}
          style={{ width: 64, height: 64, borderRadius: 32 }}
          className="mr-4"
        />
        <View>
          <Text className="text-2xl font-bold ">Thomas PEDOT</Text>
          <Text className="text-light dark:text-primaryDark">slamer59</Text>
        </View>
      </View>

      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="map-marker-alt" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-primaryDark">Toulouse, FRANCE</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="envelope" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-primaryDark">thomas.pedot@gmail.com</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="user-friends" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-primaryDark">9 followers • 12 following</Text>
        </View>
        <View className="flex-row space-x-2">
          <Image
            source={{ uri: 'https://placehold.co/30x30' }}
            style={{ width: 24, height: 24 }}
          />
          <Image
            source={{ uri: 'https://placehold.co/30x30' }}
            style={{ width: 24, height: 24 }}
          />
          <Image
            source={{ uri: 'https://placehold.co/30x30' }}
            style={{ width: 24, height: 24 }}
          />
          <Image
            source={{ uri: 'https://placehold.co/30x30' }}
            style={{ width: 24, height: 24 }}
          />
        </View>
      </View>
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="thumbtack" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-primaryDark">Pinned</Text>
        </View>
        <View className="p-4 mb-2 rounded-lg bg-light dark:bg-primaryDark">
          <View className="flex-row items-center mb-2">
            <Image
              source={{ uri: 'https://placehold.co/30x30' }}
              style={{ width: 24, height: 24, borderRadius: 12, marginRight: 8 }}
            />
            <Text className="text-light dark:text-primaryDark">slamer59</Text>
          </View>
          <Text className="mb-2 ">batch8_mednum</Text>
          <View className="flex-row items-center text-light dark:text-primaryDark">
            <FontAwesome5 name="star" size={24} color="yellow" className="mr-1" />
            <Text className="mr-4">0</Text>
            <Text>Jupyter Notebook</Text>
          </View>
        </View>
        <View className="p-4 rounded-lg bg-light dark:bg-primaryDark">
          <View className="flex-row items-center mb-2">
            <Image
              source={{ uri: 'https://placehold.co/30x30' }}
              style={{ width: 24, height: 24, borderRadius: 12, marginRight: 8 }}
            />
            <Text className="text-light dark:text-primaryDark">slamer59</Text>
          </View>
          <Text className="mb-2 ">dagster_trial</Text>
          <Text className="mb-2 text-light dark:text-primaryDark">Trial for dagster</Text>
          <View className="flex-row items-center text-light dark:text-primaryDark">
            <FontAwesome5 name="star" size={24} color="yellow" className="mr-1" />
            <Text className="mr-4">7</Text>
            <Text>Jupyter Notebook</Text>
          </View>
        </View>
      </View>
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="book" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-primaryDark">Repositories</Text>
          <Text className="ml-auto ">55</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="building" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-primaryDark">Organizations</Text>
          <Text className="ml-auto ">0</Text>
        </View>
        <View className="flex-row items-center">
          <FontAwesome5 name="star" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-primaryDark">Starred</Text>
          <Text className="ml-auto ">410</Text>
        </View>
      </View>
    </View>
  );
}
