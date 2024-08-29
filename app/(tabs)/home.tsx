import { mapDeviceToProject } from "@/lib/firebase/helpers";
import { expoToken, getProjects } from "@/lib/gitlab/helpers";
import { updateOrCreateWebhooks } from "@/lib/gitlab/webhooks";
import { Ionicons } from "@expo/vector-icons"; // You can use any icon library you prefer

import { useFocusEffect, useNavigation } from "expo-router";
import { useFeatureFlag } from "posthog-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";



const ButtonList = () => {
  const navigation = useNavigation();
  const flag = useFeatureFlag('git-merge');
  console.log('Flag value:', flag);
  const featureFlagMapping = {
    'git-merge': useFeatureFlag('git-merge'),
    'chatbubbles-outline': useFeatureFlag('chatbubbles-outline'),
    'folder-open-outline': useFeatureFlag('folder-open-outline'),
    'people-outline': useFeatureFlag('people-outline'),
    'star-outline': useFeatureFlag('star-outline'),
  };

  const buttons = [
    {
      icon: "alert-circle-outline",
      text: "Issues",
      screen: "workspace/issues/list",
    },
    { icon: 'git-merge', text: 'Merge Requests', screen: 'workspace/merge-requests/list' },
    { icon: 'chatbubbles-outline', text: 'Discussions' },
    {
      icon: "folder-outline",
      text: "Projects",
      screen: "workspace/projects/list",
    },
    { icon: 'folder-open-outline', text: 'Repositories', screen: 'workspace/repositories/list' },
    { icon: 'people-outline', text: 'Organizations' },
    { icon: 'star-outline', text: 'Starred' },
  ];
  // Remove icons based on feature flags
  const visibleButtons = buttons.filter((button) => {
    const flagValue = featureFlagMapping[button.icon];
    return flagValue !== undefined ? flagValue : true;
  }).map((button) => (button))

  console.log(visibleButtons);
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const push_token = await expoToken();
        const projects = await getProjects();

        await updateOrCreateWebhooks(projects, undefined)
        console.log("Webhooks updated");

        await mapDeviceToProject(push_token, projects);
        console.log("Device mapped to project");
      };

      fetchData();
    }, [])
  );


  return (
    <ScrollView className="flex-1 ">
      <View className="p-4 m-4 bg-gray-200 rounded-lg">
        <Text className="mb-2 text-lg font-bold">Workspace</Text>
        {visibleButtons.map((button, index) => (

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
