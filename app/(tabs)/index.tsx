import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, router } from "expo-router";
import { LucideComponent } from "lucide-react-native";
import { useFeatureFlag } from "posthog-react-native";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;

interface ButtonConfig {
  icon: IconName | 'lucide';
  iconNode?: React.ReactNode;
  text: string;
  screen: Href<string>;
  itemColor: string;
}

const useDevFeature = (flagName: string) => {
  const isDev = __DEV__;
  const featureEnabled = useFeatureFlag(flagName);
  return isDev || featureEnabled;
};

export default function Home() {
  const devModeEnabled = useDevFeature("development-mode");

  const buttons: ButtonConfig[] = [
    {
      icon: "alert-circle-outline" as IconName,
      text: "Issues",
      screen: "/workspace/issues/list" as Href<string>,
      itemColor: "bg-issues"
    },
    {
      icon: "git-pull-request" as IconName,
      text: "Merge Requests",
      screen: "/workspace/merge-requests/list" as Href<string>,
      itemColor: "bg-merge-requests"
    },
    {
      icon: "folder-outline" as IconName,
      text: "Projects",
      screen: "/workspace/projects/list" as Href<string>,
      itemColor: "bg-projects"
    },
    {
      icon: 'lucide',
      iconNode: <LucideComponent size={24} color="white" />,
      text: "Groups",
      screen: "/workspace/groups/dashboard-list" as Href<string>,
      itemColor: "bg-groups",
    },
    {
      icon: "star-outline" as IconName,
      text: "Starred",
      screen: "/workspace/starred/list" as Href<string>,
      itemColor: "bg-starred"
    },
    ...(devModeEnabled ? [
      {
        icon: "chatbubbles-outline" as IconName,
        text: "Discussions",
        screen: "/workspace/discussions/list" as Href<string>,
        itemColor: "bg-discussions"
      },
      {
        icon: "folder-open-outline" as IconName,
        text: "Repositories",
        screen: "/workspace/repositories/list" as Href<string>,
        itemColor: "bg-repositories"
      },
      {
        icon: "people-outline" as IconName,
        text: "Organizations",
        screen: "/workspace/organizations/list" as Href<string>,
        itemColor: "bg-organizations"
      },
      {
        icon: "arrow-forward" as IconName,
        text: "DevGitlabNotification",
        screen: "/options/profile" as Href<string>,
        itemColor: "bg-green"
      },
      {
        icon: "arrow-forward" as IconName,
        text: "DevMember",
        screen: "/workspace/projects/59795263/members/11041577" as Href<string>,
        itemColor: "bg-green"
      },
      {
        icon: "arrow-forward" as IconName,
        text: "DevIssue",
        screen: "/workspace/projects/59795263/issues/43" as Href<string>,
        itemColor: "bg-green"
      },
      {
        icon: "arrow-forward" as IconName,
        text: "DevCommitList",
        screen: "/workspace/projects/59853773/commits/list" as Href<string>,
        itemColor: "bg-green"
      },
      {
        icon: "arrow-forward" as IconName,
        text: "DevFileDisplay",
        screen: "/tree/59853773/" as Href<string>,
        itemColor: "bg-tree"
      },
      {
        icon: "arrow-forward" as IconName,
        text: "DevFolderTree",
        screen: "/tree/59853773" as Href<string>,
        itemColor: "bg-tree"
      },
      {
        icon: "arrow-forward" as IconName,
        text: "DevMergeRequest",
        screen: "/workspace/projects/59795263/merge-requests/1" as Href<string>,
        itemColor: "bg-green"
      },
      {
        icon: "arrow-forward" as IconName,
        text: "DevMergeRequestEdit",
        screen: "/workspace/projects/59795263/merge-requests/1/edit" as Href<string>,
        itemColor: "bg-green"
      },
      {
        icon: "arrow-forward" as IconName,
        text: "DevProject",
        screen: "/workspace/projects/59795263" as Href<string>,
        itemColor: "bg-green"
      },
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

  return (
    <ScrollView
      className="flex-1 p-4 bg-background"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {showWelcomeCard && (
        <Card
          className="mb-4 border rounded-lg shadow-sm bg-card"
          onClose={() => handleCloseWelcomeCard()}
        >
          <CardHeader>
            <CardTitle className="text-white">
              <Image
                source={require('../../assets/images/logo.png')}
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
          <TouchableOpacity
            key={index}
            onPress={() => router.push(button.screen)}
            activeOpacity={0.7}
          >
            <CardContent className="flex-row items-center">
              <View
                className={`flex items-center justify-center rounded-lg p-2 ${button.itemColor || "bg-gray"}`}
              >
                {button.iconNode ? (
                  button.iconNode
                ) : (
                  <Ionicons name={button.icon} size={24} color="white" />
                )}
              </View>
              <Text className="ml-4 text-lg text-white">
                {button.text}
              </Text>
            </CardContent>
          </TouchableOpacity>

        ))}
      </Card>
    </ScrollView>
  );
}
