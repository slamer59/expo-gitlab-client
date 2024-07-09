import { Text } from '@/components/ui/text';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Image, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 p-4">
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="map-marker-alt" size={24} color="gray" className="mr-2" />
          <Text className="text-gray-400">Toulouse, FRANCE</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="envelope" size={24} color="gray" className="mr-2" />
          <Text className="text-gray-400">thomas.pedot@gmail.com</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="user-friends" size={24} color="gray" className="mr-2" />
          <Text className="text-gray-400">9 followers • 12 following</Text>
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
          <Text className="text-gray-400">Pinned</Text>
        </View>
        <View className="p-4 mb-2 rounded-lg bg-slate-100">
          <View className="flex-row items-center mb-2">
            <Image
              source={{ uri: 'https://placehold.co/30x30' }}
              style={{ width: 24, height: 24, borderRadius: 12, marginRight: 8 }}
            />
            <Text className="text-gray-400">slamer59</Text>
          </View>
          <Text className="mb-2 ">batch8_mednum</Text>
          <View className="flex-row items-center text-gray-400">
            <FontAwesome5 name="star" size={24} color="yellow" className="mr-1" />
            <Text className="mr-4">0</Text>
            <Text>Jupyter Notebook</Text>
          </View>
        </View>
        <View className="p-4 rounded-lg bg-slate-100">
          <View className="flex-row items-center mb-2">
            <Image
              source={{ uri: 'https://placehold.co/30x30' }}
              style={{ width: 24, height: 24, borderRadius: 12, marginRight: 8 }}
            />
            <Text className="text-gray-400">slamer59</Text>
          </View>
          <Text className="mb-2 ">dagster_trial</Text>
          <Text className="mb-2 text-gray-400">Trial for dagster</Text>
          <View className="flex-row items-center text-gray-400">
            <FontAwesome5 name="star" size={24} color="yellow" className="mr-1" />
            <Text className="mr-4">7</Text>
            <Text>Jupyter Notebook</Text>
          </View>
        </View>
      </View>
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="book" size={24} color="gray" className="mr-2" />
          <Text className="text-gray-400">Repositories</Text>
          <Text className="ml-auto ">55</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="building" size={24} color="gray" className="mr-2" />
          <Text className="text-gray-400">Organizations</Text>
          <Text className="ml-auto ">0</Text>
        </View>
        <View className="flex-row items-center">
          <FontAwesome5 name="star" size={24} color="gray" className="mr-2" />
          <Text className="text-gray-400">Starred</Text>
          <Text className="ml-auto ">410</Text>
        </View>
      </View>
    </View>
  );
}
