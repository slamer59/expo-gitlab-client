import { authorize } from "react-native-app-auth";
import * as AuthSession from "expo-auth-session";
import { makeRedirectUri } from "expo-auth-session";

const discovery = {
  authorizationEndpoint: "https://gitlab.com/oauth/authorize",
  tokenEndpoint: "https://gitlab.com/oauth/token",
  revocationEndpoint: "https://gitlab.com/oauth/revoke",
};

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { checkValidity, getToken } from "@/lib/utils";

import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Linking, TextInput, View } from "react-native";
import { config } from "@/config";
async function login() {
  const redirectUri = makeRedirectUri();
  const clientId = process.env.CLIENT_ID || "";

  const authRequest = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    scopes: ["api", "read_user"],
    responseType: AuthSession.ResponseType.Token,
  });

  const result = await authRequest.promptAsync(discovery);

  if (result.type === "success") {
    console.log(result.params.access_token);
    // Handle the access token and other details here
  } else {
    console.error(result);
  }
}
export default function LoginScreen() {
  const [serverUrl, onChangeKey] = useState("https://gitlab.com");
  const [token, onChangeValue] = useState("");
  const navigation = useNavigation();
  const handleRegister = () => {
    Linking.openURL("https://gitlab.com/users/sign_in");
  };
  // async function login() {
  //   try {
  //     const result = await authorize(config);
  //     console.log(result);
  //     // Handle the accessToken and other details
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  return (
    <View className="items-center justify-center flex-1 p-2 ">
      <Button onPress={handleRegister}>
        <Text>Register</Text>
      </Button>
      <Button onPress={login}>
        <Text>Login</Text>
      </Button>
    </View>
  );
}
