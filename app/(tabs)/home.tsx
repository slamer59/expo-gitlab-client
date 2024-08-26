import { getToken } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons"; // You can use any icon library you prefer

import * as Notifications from "expo-notifications";
import { useFocusEffect, useNavigation } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const ButtonList = () => {
  const navigation = useNavigation();

  const buttons = [
    {
      icon: "alert-circle-outline",
      text: "Issues",
      screen: "workspace/issues/list",
    },
    // { icon: 'git-merge', text: 'Merge Requests' screen: 'workspace/merge-requests/list' },
    // { icon: 'chatbubbles-outline', text: 'Discussions' },
    {
      icon: "folder-outline",
      text: "Projects",
      screen: "workspace/projects/list",
    },
    // { icon: 'folder-open-outline', text: 'Repositories', screen: 'workspace/repositories/list' },
    // { icon: 'people-outline', text: 'Organizations' },
    // { icon: 'star-outline', text: 'Starred' },
  ];

  const mapDeviceToProjectEndpoint =
    "https://add-device-to-nofitication-et4qi4c73q-uc.a.run.app";
  const mapDeviceToProjectURL = `${mapDeviceToProjectEndpoint}/add_device_to_nofitication`;
  const getProjects = async () => {
    const savedToken = await getToken();

    if (savedToken) {
      try {
        const params = {
          membership: "true",
        };
        const response = await fetch(
          "https://gitlab.com/api/v4/projects" +
            "?" +
            new URLSearchParams(params),
          {
            method: "GET",
            headers: {
              "PRIVATE-TOKEN": savedToken,
            },
          }
        );

        if (!response.ok) {
          navigation.navigate("login");
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Gitlab API response");
        const projects = data.map(
          (project: { http_url_to_repo: string }) => project.http_url_to_repo
        );
        return projects;
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("No token found");
    }
  };
  const expoToken = async function getToken() {
    let token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  };
  const mapDeviceToProject = async () => {
    console.log("Mapping device to project");
    const push_token = await expoToken();
    const projects = await getProjects();

    const response = await fetch(mapDeviceToProjectURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        push_token: push_token,
        projects: projects,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Map device to project done");
  };

  useFocusEffect(
    React.useCallback(() => {
      if (__DEV__) {
        mapDeviceToProject();
      } else {
        // Schedules the function to run every hour
        const intervalId = setInterval(mapDeviceToProject, 60 * 60 * 1000);
        return () => clearInterval(intervalId);
      }
    }, [])
  );
  return (
    <ScrollView className="flex-1 ">
      <View className="p-4 m-4 bg-gray-200 rounded-lg">
        <Text className="mb-2 text-lg font-bold">Workspace</Text>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center py-2"
            onPress={() => navigation.navigate(button.screen || "home")}
          >
            <Ionicons name={button.icon} size={24} color="black" />
            <Text className="ml-2 text-base">{button.text}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          key={"123"}
          className="flex-row items-center py-2"
          onPress={() => navigation.navigate('login')}
        >
          <Text className="ml-2 text-base">{"login"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ButtonList;
