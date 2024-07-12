import { Ionicons } from '@expo/vector-icons'; // You can use any icon library you prefer
import { useNavigation } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const ButtonList = () => {
  const navigation = useNavigation();

  const buttons = [
    // { icon: 'alert-circle-outline', text: 'Issues' },
    // { icon: 'git-merge', text: 'Merge Requests' },
    // { icon: 'chatbubbles-outline', text: 'Discussions' },
    // { icon: 'folder-outline', text: 'Projects' },
    { icon: 'folder-open-outline', text: 'Repositories', screen: 'workspace/repositories/list' },
    // { icon: 'people-outline', text: 'Organizations' },
    // { icon: 'star-outline', text: 'Starred' },
  ];

  return (
    <ScrollView className="flex-1 bg-light dark:bg-light">
      <View className="p-4 m-4 bg-gray-200 rounded-lg">
        <Text className="mb-2 text-lg font-bold">Workspace</Text>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center py-2"
            onPress={() => navigation.navigate(button.screen || 'home')}
          >
            <Ionicons name={button.icon} size={24} color="black" />
            <Text className="ml-2 text-base">{button.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView >
  );
};


export default ButtonList;
