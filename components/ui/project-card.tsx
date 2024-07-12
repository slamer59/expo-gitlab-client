


import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import React from 'react';
import { Text, View } from 'react-native';
// name={project.name}
// last_activity_at={project.last_activity_at}
// path={project.path}
// star_count={project.star_count}
// avatar_url={project.avatar_url}
// private={project.private}
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  console.log(color)
  return color;
}

export function ProjectCard({ name, name_with_namespace, last_activity_at, star_count, avatar_url, owner
}) {
  return (
    <View className="flex-row items-center p-4 space-x-4">
      <View className="flex items-center justify-center w-12 h-12 m-2 bg-pink-100 rounded">
        {avatar_url ?
          <Image
            source={{ uri: avatar_url }}
            className="w-10 h-10 rounded-full"
          /> :
          <Text className="text-lg font-medium text-gray-800">{name.charAt(0).toUpperCase()}</Text>
        }
      </View>
      <View>
        <Text className="text-sm text-gray-800">
          <Text className="font-medium">{name_with_namespace}</Text>
        </Text>

        <View className="flex-row items-center mt-1 space-x-2">
          {owner?.locked && <Ionicons name="lock-closed" size={12} color={`#${getRandomColor()}`} />}
          <Text className="text-xs text-gray-500">{owner?.name}</Text>
        </View>
        <View className="flex-row items-center m-1 space-x-2">
          <Text className="justify-center m-1 text-xs text-gray-500">
            <Ionicons name="star" size={12} color="gold" /> {star_count} stars - { }
            {new Date(last_activity_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>

        </View>
      </View>
    </View >
  );
};


