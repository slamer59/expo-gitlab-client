import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useSession } from "@/lib/session/SessionProvider";
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Linking, View } from 'react-native';

export default function LoginScreen() {

    const [domain, setDomain] = useState('gitlab.com');
    const [token, setToken] = useState('');
    const navigation = useNavigation();
    const { signIn, signOut, session, isLoading } = useSession();
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    function normalizeDomain(input: string): string {
        // Remove any leading or trailing whitespace
        let normalized = input.trim();

        // Remove 'http://' or 'https://' if present
        normalized = normalized.replace(/^(https?:\/\/)/, '');

        // Remove any trailing slash
        normalized = normalized.replace(/\/$/, '');

        return normalized;
    }

    async function handleLogin() {
        if (!domain || !token) {
            Alert.alert('Error', 'Please enter both domain and Personal Access Token.');
            return;
        }

        const normalizedDomain = normalizeDomain(domain);

        try {
            const fullUrl = `https://${normalizedDomain}`;
            await signIn(fullUrl, token);
            navigation.navigate("(tabs)", { screen: "/" });
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
                placeholder="GitLab Domain (e.g. gitlab.com, https://gitlab.com)"
                value={domain}
                onChangeText={setDomain}
                aria-labelledby='input-gitlab-label'
                aria-errormessage='input-gitlab-error'
                testID="gitlab-url-input"
            />

            <Input
                className="w-full px-3 py-2 mb-6 text-black bg-white rounded-lg native:h-14"
                placeholder="Enter your GitLab Personal Access Token (PAT)"
                value={token}
                onChangeText={setToken}
                secureTextEntry
                aria-labelledby='input-token-label'
                aria-errormessage='input-token-error'
                data-no-capture // Add this line to prevent autocapture
                testID="gitlab-token-input"  // Add this line
            />

            <Button
                variant="secondary"
                size="lg"
                onPress={handleLogin}
                className="w-full mt-4 mb-4 text-xl"
                disabled={isLoginLoading}
                testID="login-button"  // Add this line
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