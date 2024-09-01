import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { getData } from '@/lib/gitlab/hooks';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

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
  const userId = "11041577"
  // https://docs.gitlab.com/ee/api/users.html#single-user
  const params = {
    path: {
      id: userId,
    },
    query: {
    },
  };
  const { data: user, isLoading, isError } = getData(
    ["user_info", params.path],
    "/api/v4/users/{id}",
    params
  );
  // https://docs.gitlab.com/ee/api/projects.html#list-projects-a-user-has-contributed-to
  // https://docs.gitlab.com/ee/api/projects.html#list-user-projects
  const paramsProjects = {
    path: {
      id: userId,
    },
    query: {
      membership: true,
      order_by: "last_activity_at",
      sort: "desc",
    },
  };
  const { data: projects, isLoading: isLoadingProjects, isError: isErrorProjects } = getData(
    ["user_projects", params.path],
    "/api/v4/users/{id}/projects",
    paramsProjects
  );
  console.log(projects)
  // https://docs.gitlab.com/ee/api/projects.html#list-projects-starred-by-a-user
  const paramsStarredProjects = {
    path: {
      id: userId,
    },
    query: {
      order_by: "last_activity_at",
      sort: "desc",
    },
  };
  const { data: starredProjects, isLoading: isLoadingStarredProjects, isError: isErrorStarredProjects } = getData(
    ["user_starred_projects", params.path],
    "/api/v4/users/{id}/starred_projects",
    paramsStarredProjects
  );
  console.log(starredProjects)

  if (isLoading || isLoadingProjects) {
    return <Text>Loading...</Text>;
  }
  if (isError || isErrorProjects) {
    return <Text>Error</Text>;
  }
  return (
    <View className="flex-1 p-4 ">
      <View className="flex-row items-center mb-4">
        <Avatar alt={`${user.name}'s Avatar`}>
          <AvatarImage
            source={{ uri: user.avatar_url }}
          />
          <AvatarFallback>
            <Text>{`${user.name.substring(0, 2).toUpperCase()}`}</Text>
          </AvatarFallback>
        </Avatar>
        <View className="flex-1 ml-3">
          <Text className="font-semibold">
            {user.name}{' '}
          </Text>
          <Text className="text-sm text-gray-500">
            @{user.username}</Text>
        </View>
      </View>

      <View className="flex mb-4 space-x-2 flex-2">
        {user.location && <View className="flex-row items-center m-2">
          <Ionicons name="location-outline" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-dark">{user.location}</Text>
        </View>
        }
        {user.public_email && <View className="flex-row items-center m-2">
          <Ionicons name="mail-outline" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-dark">{user.public_email}</Text>
        </View>
        }
        {user.followers &&
          <View className="flex-row items-center mb-2">
            <Ionicons name="people-outline" size={24} color="gray" className="mr-2" />
            <Text className="text-light dark:text-dark">{user.followers} followers • {user.following} following</Text>
          </View>}
      </View>
      {/* <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="thumbtack" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-dark">Pinned</Text>
        </View>

         {user.projects.map(project => (
          <View key={project.id} className="p-4 m-2 rounded-lg ">
            <Text className="mb-2 font-extrabold text-dark dark:text-light">{project.name}</Text>
            <Text className="mb-2 text-dark dark:text-light">{project.description}</Text>
            <View className="flex-row items-center text-dark dark:text-light">
              <Ionicons name="star" size={24} color="yellow" className="mr-1" />
              <Text className="mr-4 text-dark dark:text-light">{project.stars} stars</Text>
            </View>
          </View>
        ))} 


      </View> */}
      <View className="p-4 m-4 bg-gray-200 rounded-lg">
        <Text className="mb-2 text-lg font-bold">Workspace</Text>
        <View className="flex-row items-center mb-2">
          <Ionicons name="git-branch-outline" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-dark">Repositories</Text>
          <Text className="ml-auto ">{projects.length}</Text>
        </View>
        {/* <View className="flex-row items-center mb-2">
          <Ionicons name="building" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-dark">Organizations</Text>
          <Text className="ml-auto ">0</Text>
        </View> */}
        <View className="flex-row items-center">
          <Ionicons name="star" size={24} color="gray" className="mr-2" />
          <Text className="text-light dark:text-dark">Starred</Text>
          <Text className="ml-auto ">{starredProjects.length}</Text>
        </View>
      </View>
    </View>
  );
}
