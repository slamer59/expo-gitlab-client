import InfoAlert from "@/components/InfoAlert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { tapForExpoToken } from "@/lib/utils";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";

const UserSkeleton = () => (
  <>
    <View className="flex-row items-center mb-4">
      <Skeleton className="w-12 h-12 rounded-full bg-muted" />
      <View className="flex-1 ml-3">
        <Skeleton className="w-24 h-4 mb-2 bg-muted" />
        <Skeleton className="w-16 h-3 bg-muted" />
      </View>
    </View>
    <View className="flex mb-4 space-x-2 flex-2">
      <View className="flex-row items-center m-2">
        <Skeleton className="w-6 h-6 mr-2 bg-muted" />
        <Skeleton className="w-24 h-4 bg-muted" />
      </View>
    </View>
  </>
);

export default function ProfileScreen() {
  const [alert, setAlert] = useState({ message: "", isOpen: false });
  const [tapCount, setTapCount] = useState(0);
  const lastTapTimeRef = useRef(0);

  const handlePress = async () => {
    const result = await tapForExpoToken(tapCount, setTapCount, lastTapTimeRef);
    if (result) {
      setAlert({ message: result, isOpen: true });
    }
  };


  const { session } = useSession()

  const client = new GitLabClient({
    url: session?.url,
    token: session?.token,
  });

  const api = useGitLab(client);

  const [
    { data: user, isLoading: isLoadingUser, error: errorUser },
    { data: personalProjects, isLoading: isLoadingPersonal, error: errorPersonal },
    { data: contributedProjects, isLoading: isLoadingContributed, error: errorContributed },
    { data: starredProjects, isLoading: isLoadingStarred, error: errorStarred }
  ] = api.useProfileDetails();

  if (errorContributed || errorPersonal || errorStarred || errorUser) return <Text>Error: {errorUser?.message || errorPersonal?.message || errorContributed?.message || errorStarred?.message}</Text>;
  return (
    <View className="flex-1 p-4 bg-background">
      {isLoadingUser ? <UserSkeleton /> : (
        <>
          <InfoAlert
            isOpen={alert.isOpen}
            onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
            title="Information"
            message={alert.message}
          />
          <TouchableOpacity
            onPress={handlePress}
            className="flex-row items-center mb-4">
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

          </TouchableOpacity>
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
        </>
      )
      }

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
              <View className="flex items-center justify-center p-2 rounded-lg bg-contributed">
                <Octicons
                  name="project"
                  size={24}
                  color="white"
                />
              </View>
              <Text className="ml-4 text-lg text-white">
                Contributed Projects
              </Text>
            </View>
            <Text className="text-base text-white" testID="project-count">
              {isLoadingContributed ? <Skeleton className="w-6 h-6 rounded-full bg-muted" /> :
                contributedProjects.length >= 20 ? '20+' : contributedProjects?.length
              }
            </Text>
          </CardContent>
        </TouchableOpacity>

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
              <View className="flex items-center justify-center p-2 rounded-lg bg-personal">
                <Ionicons
                  name="folder-outline"
                  size={24}
                  color="white"
                />
              </View>
              <Text className="ml-4 text-lg text-white">
                Personal Projects
              </Text>
            </View>
            <Text className="text-base text-white" testID="personal-project-count">
              {isLoadingPersonal ? <Skeleton className="w-6 h-6 rounded-full bg-muted" /> :
                personalProjects?.length >= 20 ? '20+' : personalProjects?.length
              }
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
              {isLoadingStarred ? <Skeleton className="w-6 h-6 rounded-full bg-muted" /> :
                starredProjects?.length >= 20 ? '20+' : starredProjects?.length
              }
            </Text>
          </CardContent>
        </TouchableOpacity>
      </Card>
    </View >
  );
}
