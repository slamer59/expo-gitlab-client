import { Text } from '@/components/ui/text';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Image, View } from 'react-native';

const stars = [
  {
    id: 1,
    name: 'slamer59',
    stars: 5,
    description: 'Awarded for outstanding contributions to the community.',

  },
  // add more stars here
];


const user = {
  name: 'Thomas PEDOT',
  username: 'slamer59',
  location: 'Toulouse, FRANCE',
  email: 'thomas.pedot@gmail.com',
  avatar: 'https://placehold.co/100x100',
  followerCount: 1000,
  followingCount: 500,
  bio: 'I am a software engineer with a passion for building scalable and maintainable applications. I have experience with React Native, Node.js, and AWS.',
  skills: ['React Native', 'Node.js', 'AWS', 'JavaScript', 'TypeScript'],
  projects: [
    {
      id: 1,
      name: 'Project 1',
      description: 'A mobile app for tracking fitness progress.',
      stars: 15,
      technologies: ['React Native', 'Node.js', 'AWS'],
    },
    {
      id: 2,
      name: 'Project 2',
      description: 'A web application for managing customer relationships.',
      technologies: ['React', 'Node.js', 'MongoDB'],
      stars: 10,
    },
  ],


}
export default function ProfileScreen() {
  return (
    <View className="flex-1 p-4 ">
      <View className="flex-row items-center mb-4">
        <Image
          source={{ uri: user.avatar }}
          style={{ width: 64, height: 64, borderRadius: 32 }}
          className="mr-4"
        />
        <View>
          <Text className="text-2xl font-bold ">{user.name}</Text>
          <Text className="text-light dark:text-dark">{user.username}</Text>
        </View>
      </View>

      <View className="flex mb-4 space-x-2 flex-2">
        <View className="flex-row items-center m-2">
          <FontAwesome5 name="map-marker-alt" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-dark">{user.location}</Text>
        </View>
        <View className="flex-row items-center m-2">
          <FontAwesome5 name="envelope" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-dark">{user.email}</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="user-friends" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-dark">{user.followerCount} followers • {user.followingCount} following</Text>
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
          <Text className="text-light dark:text-dark">Pinned</Text>
        </View>

        {user.projects.map(project => (
          <View key={project.id} className="p-4 m-2 rounded-lg ">
            <Text className="mb-2 font-extrabold text-dark dark:text-light">{project.name}</Text>
            <Text className="mb-2 text-dark dark:text-light">{project.description}</Text>
            <View className="flex-row items-center text-dark dark:text-light">
              <FontAwesome5 name="star" size={24} color="yellow" className="mr-1" />
              <Text className="mr-4 text-dark dark:text-light">{project.stars} stars</Text>
            </View>
          </View>
        ))}


      </View>
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="book" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-dark">Repositories</Text>
          <Text className="ml-auto ">55</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name="building" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-dark">Organizations</Text>
          <Text className="ml-auto ">0</Text>
        </View>
        <View className="flex-row items-center">
          <FontAwesome5 name="star" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-dark">Starred</Text>
          <Text className="ml-auto ">410</Text>
        </View>
      </View>
    </View>
  );
}
