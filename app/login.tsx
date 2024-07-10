import * as SecureStore from 'expo-secure-store';

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { getToken } from '@/lib/utils';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, TextInput, View } from 'react-native';

// async function save(key, value) {
async function save(serverUrl, token) {
    // await SecureStore.setItemAsync(key, value);
    await SecureStore.setItemAsync('serverUrl', serverUrl);
    await SecureStore.setItemAsync('gitlab-token', token);
}

async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        alert("🔐 Here's your value 🔐 \n" + result);
    } else {
        alert('No values stored under that key.');
    }
}

export default function LoginScreen() {
    const [serverUrl, onChangeKey] = useState('https://gitlab.com');
    const [token, onChangeValue] = useState('');
    const navigation = useNavigation();
    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async () => {
        const savedToken = await getToken();
        if (savedToken) {
            console.log('Token found, navigating to home');
            navigation.navigate("(tabs)", { screen: "home" });
        }
    };

    const handleLogin = async () => {
        // Store the server URL and token securely
        if (validateUrl(serverUrl)) {
            save(serverUrl, token);
            onChangeKey('https://gitlab.com');
            onChangeValue('');
            Alert.alert('Success', 'Server URL and token saved successfully.', [
                {
                    text: 'Enter',
                    onPress: () => {
                        navigation.navigate("(tabs)", { screen: "home" });
                    },
                    style: 'default',
                },
            ]
            )
        } else {
            console.log(serverUrl)
            Alert.alert('Error', 'Invalid server URL.');
        }
    };

    const validateUrl = (url) => {
        try {
            return Boolean(new URL(url));
        } catch (e) {
            return false;
        }
    };
    return (
        <View className="items-center justify-center flex-1 p-2 ">
            {/* <Image
                source={require('../../assets/logo.png')}
                style={{ width: 100, height: 100 }}

            /> */}
            <Text className="mb-6 text-xl font-bold text-center text-blue-600">GitAlchemy: Your GitLab Companion</Text>
            <View className="w-full px-4 mb-4">
                <Text className="m-1 text-sm">Server</Text>

                <TextInput
                    className="px-4 py-2 bg-gray-200 rounded"
                    clearTextOnFocus
                    onChangeText={text => onChangeKey(text)}
                    value={serverUrl}
                />

                <Text className="m-1 text-sm text-black">Access Token</Text>
                {/* <View className="flex-row justify-center mb-4">
                <TouchableOpacity
                    className={`px-4 py-2 rounded-l-full bg-gray-200 `}
                // onPress={ }
                >
                    <Text className="text-black">Basic Auth</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`px-4 py-2 rounded-r-full `}

                >
                    <Text className="text-black">Access Token</Text>
                </TouchableOpacity>
            </View> */}
                <TextInput
                    className="px-4 py-2 text-black bg-gray-200 rounded"
                    clearTextOnFocus
                    onChangeText={text => onChangeValue(text)}
                    secureTextEntry={true}
                    placeholder="Enter your GitLab Personal Access Token (PAT)"
                    value={token}
                />
                { }
                <Button
                    className="px-4 py-2 m-2 bg-blue-700 rounded"
                    onPress={() => {
                        handleLogin();
                    }}
                >
                    <Text>Login</Text>
                </Button>
            </View>

            <Text className="text-blue-500">Get Access Token</Text>
            <Text className="mb-4 text-center text-gray-400">By signing in you accept our <Text className="text-blue-500" onPress={() => Linking.openURL('#')}>Terms of use</Text> and <Text className="text-blue-500" onPress={() => Linking.openURL('#')}>Privacy policy</Text>.</Text>
            <Text className="text-blue-500" onPress={() => Linking.openURL('#')}>Trouble signing in?</Text>


            {/* <Text style={styles.paragraph}>🔐 Enter your key 🔐</Text>
            <TextInput
                style={styles.textInput}
                onSubmitEditing={event => {
                    getValueFor(event.nativeEvent.text);
                }}
                placeholder="Enter the key for the value you want to get"
            /> */}
        </View >
    );
}
