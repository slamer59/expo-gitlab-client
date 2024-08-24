import * as SecureStore from 'expo-secure-store';

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { getToken } from '@/lib/utils';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
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
    const mapDeviceToProjectEndpoint = "https://add-device-to-nofitication-et4qi4c73q-uc.a.run.app/"
    const mapDeviceToProjectURL = `${mapDeviceToProjectEndpoint}/add_device_to_nofitication`
    const getProjects = async () => {
        const savedToken = await getToken();

        if (savedToken) {
            try {
                const params = {
                    membership: 'true',
                };

                const response = await fetch('https://gitlab.com/api/v4/projects' + '?' + new URLSearchParams(params), {
                    method: 'GET',
                    headers: {
                        'PRIVATE-TOKEN': savedToken,
                    },
                })
                    .then((response) => response.json())
                    .then((projects) => {
                        console.log('Gitlab API response successful');
                        return projects;
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            } catch (error) {
                console.error('Error:', error);
            }

        }
    }
    const expoToken = async function getToken() {
        let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (status !== 'granted') {
            alert('No notification permissions!');
            return;
        }
        let token = await Notifications.getExpoPushTokenAsync();
        console.log(token);
    }
    const mapDeviceToProject = async () => {
        console.log('Mapping device to project');
        const push_token = await expoToken();
        const projects = await getProjects();
        console.log(projects);
        console.log(push_token);
        fetch(mapDeviceToProjectURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                push_token: push_token,
                projects: projects
            })
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    }


    const checkToken = async () => {
        console.log('Checking token');
        const savedToken = await getToken();
        if (savedToken) {
            console.log('Token found, navigating to home');
            await mapDeviceToProject();
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
            <Text className="mb-4 text-center text-light dark:text-primaryDark">By signing in you accept our <Text className="text-blue-500" onPress={() => Linking.openURL('#')}>Terms of use</Text> and <Text className="text-blue-500" onPress={() => Linking.openURL('#')}>Privacy policy</Text>.</Text>
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
