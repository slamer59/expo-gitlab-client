import ErrorAlert from "@/components/ErrorAlert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mapDeviceToProject } from "@/lib/firebase/helpers";
import { getExpoToken, getProjects } from "@/lib/gitlab/helpers";
import { updateOrCreateWebhooks } from "@/lib/gitlab/webhooks";
import { useSession } from "@/lib/session/SessionProvider";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useFocusEffect } from "expo-router";
import { useFeatureFlag } from "posthog-react-native";
import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const useDevFeature = (flagName) => {
  const isDev = __DEV__;
  // console.log(`__DEV__ is ${isDev}`);
  const featureEnabled = useFeatureFlag(flagName);
  // console.log(`Feature ${flagName} is ${featureEnabled ? 'enabled' : 'disabled'}`);
  // console.log(`Returning ${isDev || featureEnabled}`);
  return isDev || featureEnabled;
};

export default function Home() {
  const { session } = useSession();
  const devModeEnabled = useDevFeature("development-mode");

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
      icon: "folder-outline",
      text: "Projects",
      screen: "workspace/projects/list",
      itemColor: "bg-projects"
    },
    // Development-only buttons
    ...(devModeEnabled ? [
      {
        icon: "chatbubbles-outline",
        text: "Discussions",
        screen: "workspace/discussions/list",
        itemColor: "bg-discussions"
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
      {
        icon: "arrow-forward",
        text: "DevIssue",
        screen: "workspace/projects/59795263/issues/29",
        itemColor: "bg-green"
      },
      // {
      //   icon: "arrow-forward",
      //   text: "DevIssueEdit",
      //   screen: "workspace/projects/59795263/issues/29/edit",
      //   itemColor: "bg-green"
      // },
      // {
      //   icon: "arrow-forward",
      //   text: "DevMergeRequest",
      //   screen: "workspace/projects/59795263/merge-requests/1",
      //   itemColor: "bg-green"
      // },
      // {
      //   icon: "arrow-forward",
      //   text: "DevMergeRequestEdit",
      //   screen: "workspace/projects/59795263/merge-requests/1/edit",
      //   itemColor: "bg-green"
      // },
      {
        icon: "arrow-forward",
        text: "DevProject",
        screen: "workspace/projects/59795263",
        itemColor: "bg-green"
      },
      // {
      //   icon: "arrow-forward",
      //   text: "DevProjectEdit",
      //   screen: "workspace/projects/59795263/edit",
      //   itemColor: "bg-green"
      // },
      // {
      //   icon: "arrow-forward",
      //   text: "DevProjectPipeline",
      //   screen: "workspace/projects/59795263/pipelines/1462352939",
      //   itemColor: "bg-green"
      // },
    ] : [])
  ];
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);

  useEffect(() => {
    const loadWelcomeCardState = async () => {
      try {
        const value = await AsyncStorage.getItem('@welcome_card_shown');
        if (value !== null) {
          setShowWelcomeCard(value !== 'true');
        }
      } catch (error) {
        console.error('Error loading welcome card state:', error);
      }
    };

    loadWelcomeCardState();
  }, []);
  const handleCloseWelcomeCard = async () => {
    setShowWelcomeCard(false);
    try {
      await AsyncStorage.setItem('@welcome_card_shown', 'true');
    } catch (error) {
      console.error('Error saving welcome card state:', error);
    }
  };

  // 1. Fetch projects
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const push_token = await getExpoToken();
          const projects = await getProjects(session);
          await updateOrCreateWebhooks(session, projects, undefined);
          console.log("Webhooks updated");
          await mapDeviceToProject(push_token, projects);
          console.log("Device mapped to project");
        } catch (error) {
          console.error("Error in fetchData:", error);
          setAlertMessage(`An error occurred. Notification might not be possible :${error}`);
          setIsAlertOpen(true);
        }
      };
      fetchData();
    }, [session]),
  );
  return (
    <ScrollView
      className="flex-1 p-4 bg-background"
      contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
    >
      <ErrorAlert
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        message={alertMessage}
      />
      {showWelcomeCard && (
        <Card
          className="mb-4 border rounded-lg shadow-sm bg-card"
          onClose={() => handleCloseWelcomeCard()}
        >
          <CardHeader>
            <CardTitle className="text-white">
              <Image
                source={require('@/assets/images/logo.png')}
                style={{ width: 30, height: 30 }}
                className="mr-2"
              />
              Welcome to Gitalchemy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-white">
              This app allows you to manage your GitLab projects, issues, and merge requests on the go.
            </Text>
          </CardContent>
        </Card>
      )}

      <Card className="mb-2 border rounded-lg shadow-sm bg-card">
        <CardHeader>
          <CardTitle className="flex flex-col text-white">
            Workspace
          </CardTitle>
        </CardHeader>
        {buttons.map((button, index) => (
          <Link
            key={index}
            href={button.screen || "/"}
            asChild
          >
            <Pressable>
              <CardContent className="flex-row items-center">
                <View
                  className={`flex items-center justify-center rounded-lg p-2 ${button.itemColor || "bg-gray"}`}
                >
                  <Ionicons name={button.icon} size={24} color="white" />
                </View>
                <Text className="ml-4 text-lg text-white">
                  {button.text}
                </Text>
              </CardContent>
            </Pressable>
          </Link>
        ))}
      </Card>
    </ScrollView>
  );
}
