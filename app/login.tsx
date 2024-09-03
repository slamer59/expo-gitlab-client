import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSession } from "@/lib/session/SessionProvider";
import { useNavigation } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Linking, TextInput, View } from 'react-native';

// Function to validate GitLab URL and PAT
async function validateGitLabCredentials(url: string, token: string) {
    try {
        const response = await fetch(`${url}/api/v4/user`, {
            headers: { 'PRIVATE-TOKEN': token }
        });
        return response.ok;
    } catch (error) {
        console.error('Error validating credentials:', error);
        return false;
    }
}

export default function LoginScreen() {
    const [url, setUrl] = useState('https://gitlab.com');
    const [token, setToken] = useState('');
    const navigation = useNavigation();
    const { signIn, signOut, session, isLoading } = useSession();

    useEffect(() => {
        if (session) {
            navigation.navigate("(tabs)", { screen: "home" });
        }
    }, [session]);

    async function handleLogin() {
        if (!url || !token) {
            Alert.alert('Error', 'Please enter both URL and token.');
            return;
        }

        const isValid = await validateGitLabCredentials(url, token);
        if (isValid) {
            await SecureStore.setItemAsync('gitlabUrl', url);
            await SecureStore.setItemAsync('gitlabToken', token);
            signIn(url, token);
        } else {
            Alert.alert('Error', 'Invalid credentials. Please try again.');
            setToken('');
        }
    }

    function openTokenInfoPage() {
        Linking.openURL('https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html');
    }

    if (isLoading) {
        return (
            <View className="items-center justify-center flex-1">
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View className="items-center justify-center flex-1 p-4">
            <Image
                source={require('@/assets/logo.png')}
                style={{ width: 100, height: 100 }}

            />
            <Text className="mb-6 text-xl font-bold text-center text-primaryDark dark:text-dark">GitAlchemy: Your GitLab Companion</Text>

            <TextInput
                className="w-full px-3 py-2 mb-4 bg-gray-100 rounded"
                placeholder="GitLab URL"
                value={url}
                onChangeText={setUrl}
            />

            <TextInput
                className="w-full px-3 py-2 mb-4 bg-gray-100 rounded"
                placeholder="Enter your GitLab Personal Access Token (PAT)"
                value={token}
                onChangeText={setToken}
                secureTextEntry
            />

            <Button onPress={handleLogin} className="w-full mb-4">
                <Text>Login</Text>
            </Button>

            <Text className="mb-4 text-blue-500" onPress={openTokenInfoPage}>
                How to set up a Personal Access Token
            </Text>
            <Text className="mb-4 text-center text-light dark:text-primaryDark">By signing in you accept our <Text className="text-blue-500" onPress={() => Linking.openURL('#')}>Terms of use</Text> and <Text className="text-blue-500" onPress={() => Linking.openURL('#')}>Privacy policy</Text>.</Text>

        </View>
    );
}