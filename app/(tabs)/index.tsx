import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { landingButtons } from "@/lib/links/landing";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { useFeatureFlag } from "posthog-react-native";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";



const useDevFeature = (flagName: string) => {
  const isDev = __DEV__;
  const featureEnabled = useFeatureFlag(flagName);
  return isDev || featureEnabled;
};

export default function Home() {
  const devModeEnabled = useDevFeature("development-mode");
  const buttons = landingButtons(devModeEnabled as boolean);
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
