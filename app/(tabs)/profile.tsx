import { Ionicons, Octicons } from "@expo/vector-icons";
import * as Application from 'expo-application';
import { Image } from "expo-image";
import { router } from "expo-router";
import { LucideComponent, LucideGitlab } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Linking, Pressable, ScrollView, TouchableOpacity, View } from "react-native";

import InfoAlert from '@/components/InfoAlert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { getHelpWithGitalchemy } from '@/lib/gitlab/helpers';
import { useSession } from '@/lib/session/SessionProvider';
import { tapForExpoToken } from '@/lib/utils';

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
    { data: starredProjects, isLoading: isLoadingStarred, error: errorStarred },
    { data: groups, isLoading: isLoadingGroups, error: errorGroups },
  ] = api.useProfileDetails();

  if (errorContributed || errorPersonal || errorStarred || errorUser || errorGroups) return <Text>Error: {errorUser?.message || errorPersonal?.message || errorContributed?.message || errorStarred?.message || errorGroups?.message}</Text>;


  const supportLinks = [
    {
      icon: "heart-outline",
      text: "Support on Patreon",
      url: "https://www.patreon.com/c/teepeetlse",
      color: "#FF424D",
      external: true
    },
    {
      icon: "cafe-outline",
      text: "Buy Me a Coffee",
      url: "https://buymeacoffee.com/thomaspedo6",
      color: "#FFDD00",
      external: true
    },
    {
      icon: "globe-outline",
      text: "Visit Website",
      url: "https://www.gitalchemy.app",
      color: "#0085CA",
      external: true
    },
    {
      icon: "star-outline",
      text: "Rate on Google Play",
      url: "https://play.google.com/store/apps/details?id=com.thomaspedot.gitalchemy",
      color: "#34A853",
      external: true
    },
    {
      icon: "chatbubble-outline",
      text: "Submit Feedback",
      color: "#FC6D26",
      external: false,
      onPress: () => router.push({
        pathname: '/workspace/projects/[projectId]/issues/create',
        params: {
          projectId: '62930051',
          title: 'Feedback: Gitalchemy Mobile App',
          description: getHelpWithGitalchemy()
        }
      })
    }
  ];


  return (
    <ScrollView className="flex-1 p-4 bg-background">
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
      )}

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
      <Card className="mb-6 border rounded-lg shadow-sm bg-card">
        <CardHeader>
          <CardTitle className="flex flex-col text-white">
            Workspace
          </CardTitle>
        </CardHeader>
        {/* <TouchableOpacity
          onPress={() => router.push({
            pathname: `/workspace/users/${user?.id}/list`,
            params: { groups: true }
          })}
          className="flex-row bg-card"
          activeOpacity={0.7}
        >
          <CardContent className="flex-row items-center flex-1">
            <View className="flex-row items-center flex-1">
              <View className="flex items-center justify-center p-2 rounded-lg bg-members">
                <Octicons
                  name="people"
                  size={24}
                  color="white"
                />
              </View>
              <Text className="ml-4 text-lg text-white">
                Groups
              </Text>
            </View>
            <Text className="text-base text-white" testID="project-count">
              {isLoadingContributed ? <Skeleton className="w-6 h-6 rounded-full bg-muted" /> :
                contributedProjects.length >= 20 ? '20+' : contributedProjects?.length
              }
            </Text>
          </CardContent>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => router.push({
            pathname: `/workspace/users/${user?.id}/list`,
            params: { contributed: "true" },
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
            pathname: `/workspace/users/${user?.id}/list`,
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
            pathname: `/workspace/users/${user?.id}/list`,
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
        {/* Users Group */}
        <TouchableOpacity
          onPress={() => router.push({
            pathname: `/workspace/groups/list`,
          })}
          className="flex-row items-center justify-between bg-card"
          activeOpacity={0.7}
        >
          <CardContent className="flex-row items-center flex-1">
            <View className="flex-row items-center flex-1">
              <View className="flex items-center justify-center p-2 rounded-lg bg-groups">
                <LucideComponent size={24} color="white" />
              </View>
              <Text className="ml-4 text-lg text-white">
                Groups
              </Text>
            </View>
            <Text className="ml-2 text-base" testID="starred-count">
              {isLoadingGroups ? <Skeleton className="w-6 h-6 rounded-full bg-muted" /> :
                groups?.length >= 20 ? '20+' : groups?.length
              }
            </Text>
          </CardContent>
        </TouchableOpacity>
      </Card>

      <Card className="mb-6 border rounded-lg shadow-sm bg-card">
        <CardHeader>
          <CardTitle className="flex flex-col text-white">About</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <LucideGitlab color="white" size={24} />
              <Text className="m-2 text-white">
                Version: {Application.applicationName} v{Application.nativeApplicationVersion}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Image source={require("@/assets/images/logo.png")} style={{ width: 24, height: 24 }} />
              <Text className="m-2 text-white">GitLab API: v4</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      <Card className="mb-6 border rounded-lg shadow-sm bg-card">
        <CardHeader>
          <CardTitle className="flex flex-col text-white">Support</CardTitle>
        </CardHeader>
        <CardContent>
          {supportLinks.map((link, index) => (
            <Pressable
              key={index}
              onPress={() => link.external ? Linking.openURL(link.url!) : link.onPress?.()}
              className="flex-row items-center py-3"
            >
              <Ionicons
                name={link.icon as any}
                size={24}
                color={link.color}
                style={{ marginRight: 12 }}
              />
              <Text className="text-lg text-white">{link.text}</Text>
            </Pressable>
          ))}
        </CardContent>
      </Card>
      {/* <View className='mb-6'>
        <Text className='mb-4 text-xl font-bold text-white'>About</Text>
        <View className='mb-4'>
          <View className='flex-row items-center mb-2'>
            <LucideGitlab color="white" size={24} />
            <Text className='mr-2 text-white'>Version: {Application.applicationName} v{Application.nativeApplicationVersion}</Text>
          </View>
          <View className='flex-row items-center'>
            <Image
              source={require('@/assets/images/logo.png')}
              style={{ width: 24, height: 24 }}
            />
            <Text className='mr-2 text-white'>GitLab API: v4</Text>
          </View>
        </View>
      </View>
      <View className='mb-6 border-t border-gray-700' />

      <View className='mb-6'>
        <Text className='mb-4 text-xl font-bold text-white'>Support</Text>
        {supportLinks.map((link, index) => (
          <Pressable
            key={index}
            onPress={() => Linking.openURL(link.url)}
            className='flex-row items-center py-3'
          >
            <Ionicons
              name={link.icon as any}
              size={24}
              color={link.color}
              style={{ marginRight: 12 }}
            />
            <Text className='text-lg text-white'>{link.text}</Text>
          </Pressable>
        ))}
      </View> */}

    </ScrollView >
  );
}
