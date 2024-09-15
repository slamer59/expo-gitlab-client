import Loading from "@/components/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { GitLabSession, useSession } from "@/lib/session/SessionProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";

async function getUserInfo(session: GitLabSession) {
  // https://docs.gitlab.com/ee/api/users.html#single-user
  try {
    const response = await fetch(`${session.url}/api/v4/user`, {
      headers: {
        "PRIVATE-TOKEN": session.token,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    // You can return a default value or rethrow the error based on your needs
    return null;
  }
}

async function getUserProjects(
  session: GitLabSession,
  userId: any,
  params: { membership: boolean; order_by: string; sort: string },
) {
  // Construct the query string from the params object
  const queryString = new URLSearchParams(params).toString();

  try {
    const response = await fetch(
      // `${session.url}/api/v4/users/${userId}/projects?${queryString}`,
      `${session.url}/api/v4/projects?${queryString}`,
      {
        headers: {
          "PRIVATE-TOKEN": session.token,
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const projects = await response.json();

    return projects;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    // You can return a default value or rethrow the error based on your needs
    return [];
  }
}

async function getUserStarredProjects(
  session: GitLabSession,
  userId: any,
  params: { path: { id: any }; query: { order_by: string; sort: string } },
) {
  const queryString = new URLSearchParams(params.query).toString();
  try {
    const response = await fetch(
      `${session.url}/api/v4/users/${userId}/starred_projects?${queryString}`,
      {
        headers: {
          "PRIVATE-TOKEN": session.token,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const starredProjects = await response.json();
    return starredProjects;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    // You can return a default value or rethrow the error based on your needs
    return [];
  }
}

export default function ProfileScreen() {
  const { session } = useSession();
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
      const projects = await getUserProjects(session, user.id, paramsProjects);
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

      const starredProjects = await getUserStarredProjects(
        session,
        user.id,
        paramsStarredProjects,
      );
      setStarredProjects(starredProjects);
    }
    fetchData();
  }, [session]);

  if (!user) {
    return <Loading />;
  }

  return (
    <View className="flex-1 p-4 bg-background">
      <View className="flex-row items-center mb-4">
        <Avatar alt={`${user.name}'s Avatar`}>
          <AvatarImage source={{ uri: user.avatar_url }} />
          <AvatarFallback>
            <Ionicons name="person-circle-outline" size={32} color="white" />
          </AvatarFallback>
        </Avatar>
        <View className="flex-1 ml-3">
          <Text className="font-semibold">{user.name} </Text>
          <Text className="text-sm text-white">@{user.username}</Text>
        </View>
      </View>

      <View className="flex mb-4 space-x-2 flex-2">
        {user.location && (
          <View className="flex-row items-center m-2">
            <Ionicons
              name="location-outline"
              size={24}
              color="gray"
              className="mr-2"
            />
            <Text className="text-">{user.location}</Text>
          </View>
        )}
        {user.public_email && (
          <View className="flex-row items-center m-2">
            <Ionicons
              name="mail-outline"
              size={24}
              color="gray"
              className="mr-2"
            />
            <Text className="text-white">
              {user.public_email}
            </Text>
          </View>
        )}
        {user.followers && (
          <View className="flex-row items-center mb-2">
            <Ionicons
              name="people-outline"
              size={24}
              color="gray"
              className="mr-2"
            />
            <Text className="text-white">
              {user.followers} followers • {user.following} following
            </Text>
          </View>
        )}
      </View>

      {/* <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="thumbtack" size={24} color="gray" className="mr-2" />
          <Text className="text-white">Pinned</Text>
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
      <Card className="border rounded-lg shadow-sm bg-card">
        <CardHeader>
          <CardTitle className="flex flex-col text-white">
            Workspace
          </CardTitle>
        </CardHeader>
        {/* <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate(button.screen || "/")
            }
          > */}
        <TouchableOpacity
          onPress={() => router.push({
            pathname: "/workspace/projects/list",
            params: { owned: "true" },
          })}
          className="flex-row bg-card"
          activeOpacity={0.7}
        >
          <CardContent className="flex-row items-center flex-1">
            <View className="flex-row items-center flex-1">
              <View className="flex items-center justify-center p-2 rounded-lg bg-projects">
                <Ionicons
                  name="folder-outline"
                  size={24}
                  color="white"
                />
              </View>
              <Text className="ml-4 text-lg text-white">
                Projects
              </Text>
            </View>
            <Text className="text-base text-white" testID="project-count">
              {projects.length >= 20 ? '20+' : projects.length}
            </Text>
          </CardContent>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push({
            pathname: "/workspace/projects/list",
            params: { starred: "true" },
          })}
          className="flex-row items-center justify-between bg-card"
          activeOpacity={0.7}
        >
          <CardContent className="flex-row items-center flex-1">
            <View className="flex-row items-center flex-1">
              <View className="flex items-center justify-center p-2 rounded-lg bg-starred">
                <Ionicons
                  name="star-outline" size={24}
                  color="white"
                />
              </View>
              <Text className="ml-4 text-lg text-white">
                Starred
              </Text>
            </View>
            <Text className="ml-2 text-base" testID="starred-count">
              {starredProjects.length >= 20 ? '20+' : starredProjects.length}
            </Text>
          </CardContent>
        </TouchableOpacity>
      </Card>
    </View >
  );
}
