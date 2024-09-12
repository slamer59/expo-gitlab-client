import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mapDeviceToProject } from "@/lib/firebase/helpers";
import { expoToken, getProjects } from "@/lib/gitlab/helpers";
import { updateOrCreateWebhooks } from "@/lib/gitlab/webhooks";
import { useSession } from "@/lib/session/SessionProvider";
import { Ionicons } from "@expo/vector-icons"; // You can use any icon library you prefer
import Constants from "expo-constants";

import { useFocusEffect, useNavigation } from "expo-router";
import { useFeatureFlag } from "posthog-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const navigation = useNavigation();
  const { session } = useSession();
  const featureFlagMapping = {
    "git-merge":
      Constants.releaseChannel === "development"
        ? useFeatureFlag("git-merge")
        : true,
    "chatbubbles-outline":
      Constants.releaseChannel === "development"
        ? useFeatureFlag("chatbubbles-outline")
        : true,
    "folder-open-outline":
      Constants.releaseChannel === "development"
        ? useFeatureFlag("folder-open-outline")
        : true,
    "people-outline":
      Constants.releaseChannel === "development"
        ? useFeatureFlag("people-outline")
        : true,
    "star-outline":
      Constants.releaseChannel === "development"
        ? useFeatureFlag("star-outline")
        : true,
  };

  const buttons = [
    {
      icon: "alert-circle-outline",
      text: "Issues",
      screen: "workspace/issues/list",
      itemColor: "bg-issues"
    },
    {
      icon: "git-merge",
      text: "Merge Requests",
      screen: "workspace/merge-requests/list",
      itemColor: "bg-merge-requests"

    },
    {
      icon: "chatbubbles-outline",
      text: "Discussions",
      screen: "workspace/discussions/list",
      itemColor: "bg-discussions"
    },
    {
      icon: "folder-outline",
      text: "Projects",
      screen: "workspace/projects/list",
      itemColor: "bg-projects"
    },
    {
      icon: "folder-open-outline",
      text: "Repositories",
      screen: "workspace/repositories/list",
      itemColor: "bg-repositories"
    },
    {
      icon: "people-outline",
      text: "Organizations",
      screen: "workspace/organizations/list",
      itemColor: "bg-organizations"
    },
    {
      icon: "star-outline",
      text: "Starred",
      screen: "workspace/starred/list",
      itemColor: "bg-starred"
    },
  ];
  // Remove icons based on feature flags
  const visibleButtons = buttons
    .filter((button) => {
      const flagValue = featureFlagMapping[button.icon];
      return flagValue !== undefined ? flagValue : true;
    })
    .map((button) => button);

  // console.log(visibleButtons);
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const push_token = await expoToken();
        const projects = await getProjects(session);

        await updateOrCreateWebhooks(session, projects, undefined);
        console.log("Webhooks updated");

        await mapDeviceToProject(push_token, projects);
        console.log("Device mapped to project");
      };

      fetchData();
    }, []),
  );

  return (
    <ScrollView className="flex-1 p-4 bg-background">
      <Card className="mb-2 border rounded-lg shadow-sm bg-card">
        <CardHeader>
          <CardTitle className="flex flex-col text-white">
            Workspace
          </CardTitle>
        </CardHeader>
        {visibleButtons.map((button, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate(button.screen || "/")
            }
          >
            <CardContent className="flex-row items-center">
              <View
                // style={{ backgroundColor: item.itemColor }}
                className={`flex items-center justify-center rounded-lg p-2 ${button.itemColor || "bg-gray"}`}
              >
                <Ionicons name={button.icon} size={24} color="white" />
              </View>
              <Text className="ml-4 text-lg text-white">
                {button.text}
              </Text>
            </CardContent>

          </TouchableOpacity>
        ))}
      </Card>
      {/* <Card className="mb-2 border rounded-lg shadow-sm bg-card">
        <CardHeader>
          <CardTitle className="flex flex-col text-white">
            Shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent className="items-center flex-1 m-2">
          <Text className="ml-4 text-lg text-white">
            Coming soon...
          </Text>
          <Button className="ml-4 text-lg text-white">
            <Text className="text-white">
              Coming soon...
            </Text>
          </Button>
        </CardContent>
      </Card> */}
    </ScrollView >
  );
}
