import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { useSession } from '@/lib/session/SessionProvider';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';

async function getUserInfo(session: { url: string, token: string }) {
  // https://docs.gitlab.com/ee/api/users.html#single-user
  try {
    const response = await fetch(`${session.url}/api/v4/user`, {
      headers: {
        'PRIVATE-TOKEN': session.token,
        'Content-Type': 'application/json'
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // You can return a default value or rethrow the error based on your needs
    return null;
  }
}

async function getUserProjects(session: { url: string, token: string }, userId: any, params: { membership: boolean, order_by: string, sort: string }) {
  // Construct the query string from the params object
  const queryString = new URLSearchParams(params).toString();

  try {
    const response = await fetch(`${session.url}/api/v4/users/${userId}/projects?${queryString}`, {
      headers: {
        'PRIVATE-TOKEN': session.token,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const projects = await response.json();

    return projects;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // You can return a default value or rethrow the error based on your needs
    return [];
  }
}


async function getUserStarredProjects(session: { url: string, token: string }, userId: any, params: { path: { id: any; }; query: { order_by: string; sort: string; }; }) {
  const queryString = new URLSearchParams(params.query).toString();
  try {
    const response = await fetch(`${session.url}/api/v4/users/${userId}/starred_projects?${queryString}`, {
      headers: {
        'PRIVATE-TOKEN': session.token,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const starredProjects = await response.json();
    return starredProjects;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // You can return a default value or rethrow the error based on your needs
    return [];
  }
}


export default function ProfileScreen() {
  const { session } = useSession()
  const [user, setUser] = React.useState(null);
  const [projects, setProjects] = React.useState([]);
  const [starredProjects, setStarredProjects] = React.useState([]);

  useEffect(() => {
    async function fetchData() {
      const user = await getUserInfo(session);
      setUser(user);

      const paramsProjects = {
        path: {
          id: user.id,
        },
        query: {
          membership: true,
          order_by: "last_activity_at",
          sort: "desc",
        },
      };
      const projects = await getUserProjects(session, user.id, paramsProjects)
      setProjects(projects);

      // https://docs.gitlab.com/ee/api/projects.html#list-projects-starred-by-a-user
      const paramsStarredProjects = {
        path: {
          id: user.id,
        },
        query: {
          order_by: "last_activity_at",
          sort: "desc",
        },
      };

      const starredProjects = await getUserStarredProjects(session, user.id, paramsStarredProjects)
      setStarredProjects(starredProjects);
    }
    fetchData();
  }, [session]);



  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="flex-1 p-4 ">
      <View className="flex-row items-center mb-4">
        <Avatar alt={`${user.name}'s Avatar`}>
          <AvatarImage
            source={{ uri: user.avatar_url }}
          />
          <AvatarFallback>
            <Ionicons name="person-circle-outline" size={32} color="black" />
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
        <View className="flex-row items-center justify-between mb-2">
          <Link
            href={{
              pathname: '/workspace/projects/list',
              params: { owned: "true" }
            }}>
            <View className="flex-row items-center">
              <Ionicons name="folder-outline" size={24} color="gray" className="mr-2" />
              <Text className="text-light dark:text-dark">Projects</Text>
            </View>
          </Link>
          <Text className="ml-2 text-base">{projects.length}</Text>
        </View>
        {/* <View className="flex-row items-center mb-2">
            <Ionicons name="building" size={24} color="gray" className="mr-2" />
            <Text className="text-light dark:text-dark">Organizations</Text>
            <Text className="ml-auto ">0</Text>
          </View> */}
        <View className="flex-row items-center justify-between mb-2">
          <Link
            href={{
              pathname: '/workspace/projects/list',
              params: { starred: "true" }
            }}>
            <View className="flex-row items-center">
              <Ionicons name="star-outline" size={24} color="gray" className="mr-2" />
              <Text className="text-light dark:text-dark">Starred</Text>
            </View>
          </Link>
          <Text className="ml-2 text-base">{starredProjects.length}</Text>
        </View>
      </View>

    </View>
  );
}
