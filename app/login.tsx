import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useSession } from "@/lib/session/SessionProvider";
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Linking, View } from 'react-native';

export default function LoginScreen() {

    const [url, setUrl] = useState('https://gitlab.com');
    const [token, setToken] = useState('');
    const navigation = useNavigation();
    const { signIn, signOut, session, isLoading } = useSession();
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    useEffect(() => {
        if (session) {
            navigation.navigate("(tabs)", { screen: "/" });
        }
    }, [session]);

    async function handleLogin() {
        if (!url || !token) {
            Alert.alert('Error', 'Please enter both URL and token.');
            return;
        }

        setIsLoginLoading(true);

        try {
            await signIn(url, token);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('401')) {
                    Alert.alert('Error', 'Invalid Personal Access Token. Please check and try again.');
                } else if (error.message.includes('404')) {
                    Alert.alert('Error', 'GitLab instance not found. Please check the URL and try again.');
                } else {
                    Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
                }
            } else {
                Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
            }
            setToken('');
        } finally {
            setIsLoginLoading(false);
        }
    }

    function openUserSettingsPAT() {
        Linking.openURL(`${url}/-/profile/personal_access_tokens`);
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
        <View className="items-center justify-center flex-1 p-4 bg-background">
            <Image
                source={require('@/assets/images/logo.png')}
                style={{ width: 100, height: 100 }}
                className="mb-6 bg-white rounded-full"

            />
            <Text className="mb-6 text-xl font-bold text-center text-secondary">GitAlchemy: Your GitLab Companion</Text>
            <Input
                className="w-full px-3 py-2 mb-6 text-black bg-white rounded-lg native:h-14"
                placeholder="GitLab URL"
                value={url}
                onChangeText={setUrl}
                aria-labelledby='input-gitlab-label'
                aria-errormessage='input-gitlab-error'
            />

            <Input
                className="w-full px-3 py-2 mb-6 font-bold text-black bg-white rounded-lg native:h-14"
                placeholder="Enter your GitLab Personal Access Token (PAT)"
                value={token}
                onChangeText={setToken}
                secureTextEntry
                aria-labelledby='input-token-label'
                aria-errormessage='input-token-error'
                data-no-capture // Add this line to prevent autocapture
            />

            <Button
                variant="secondary"
                size="lg"
                onPress={handleLogin}
                className="w-full mt-4 mb-4 text-xl"
                disabled={isLoginLoading}
            >
                {isLoginLoading ? (
                    <Text className="text-xl font-bold text-white">Provide you access...</Text>
                ) : (
                    <Text className="text-xl font-bold text-white">Login</Text>
                )}
            </Button>
            <Text className="mt-4 mb-4 text-lg font-bold text-primary" onPress={openUserSettingsPAT}>
                Setup Personal Access Token
            </Text>
            <Text className="mt-4 mb-4 text-lg font-bold text-primary" onPress={openTokenInfoPage}>
                Official Documentation to set up a Personal Access Token
            </Text>
            <Text className="mb-4 font-semibold text-center text-danger">By signing in you accept our <Text className="text-blue-500" onPress={() => navigation.navigate("/workspace/terms")}>Terms of use</Text> and <Text className="text-primary-700" onPress={() => navigation.navigate("/workspace/privacy-policy")}>Privacy policy</Text>.</Text>

        </View >
    );
}