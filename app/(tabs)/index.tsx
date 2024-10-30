import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Link } from "expo-router";
import { useFeatureFlag } from "posthog-react-native";
import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const useDevFeature = (flagName) => {
  const isDev = __DEV__;
  const featureEnabled = useFeatureFlag(flagName);
  // console.log(`Feature ${flagName} is ${featureEnabled ? 'enabled' : 'disabled'}`);
  // console.log(`Returning ${isDev || featureEnabled}`);
  return isDev || featureEnabled;
};

export default function Home() {

  const devModeEnabled = useDevFeature("development-mode");

  const buttons = [
    {
      icon: "alert-circle-outline",
      text: "Issues",
      screen: "workspace/issues/list",
      itemColor: "bg-issues"
    },
    {
      icon: "git-pull-request",
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
    {
      icon: "people-outline" as const,
      text: "Groups",
      screen: "/workspace/groups/dashboard-list",
      itemColor: "bg-groups",
    },
    {
      icon: "star-outline",
      text: "Starred",
      screen: "workspace/starred/list",
      itemColor: "bg-starred"
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
        icon: "arrow-forward",
        text: "DevGitlabNotification",
        screen: "options/profile",
        itemColor: "bg-green"
      },
      {
        icon: "arrow-forward",
        text: "DevMember",
        screen: "workspace/projects/59795263/members/11041577",
        itemColor: "bg-green"
      },
      {
        icon: "arrow-forward",
        text: "DevIssue",
        screen: "workspace/projects/59795263/issues/43",
        itemColor: "bg-green"
      },
      {
        icon: "arrow-forward",
        text: "DevCommitList",
        screen: "workspace/projects/59853773/commits/list",
        itemColor: "bg-green"
      },
      // {
      //   icon: "arrow-forward",
      //   text: "DevIssueCreate",
      //   screen: "workspace/projects/59795263/issues/create",
      //   itemColor: "bg-green"
      // },
      // {
      //   icon: "arrow-forward",
      //   text: "DevIssueEdit",
      //   screen: "workspace/projects/59795263/issues/29/edit",
      //   itemColor: "bg-green"
      // },
      // Tree 
      {
        icon: "arrow-forward",
        text: "DevFileDisplay",
        screen: "tree/59853773/",
        itemColor: "bg-tree"
      },
      {
        icon: "arrow-forward",
        text: "DevFolderTree",
        screen: "tree/59853773",
        itemColor: "bg-tree"
      },
      {
        icon: "arrow-forward",
        text: "DevMergeRequest",
        screen: "workspace/projects/59795263/merge-requests/1",
        itemColor: "bg-green"
      },
      {
        icon: "arrow-forward",
        text: "DevMergeRequestEdit",
        screen: "workspace/projects/59795263/merge-requests/1/edit",
        itemColor: "bg-green"
      },
      // {
      //   icon: "arrow-forward",
      //   text: "DevMergeRequestCreate",
      //   screen: "workspace/projects/59795263/merge-requests/create?issue_iid=34&title=ok&source_branch=34-real-image-should-show-in-editmarkdown-instead-of-generique-picture&target_branch=master",
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



  return (
    <ScrollView
      className="flex-1 p-4 bg-background"
      contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
    >
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
