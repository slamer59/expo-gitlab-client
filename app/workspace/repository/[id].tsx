import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

const baseUrl = "https://gitlab.com/api/v4"

const fetchProject = async (groupId: string) => {
    const encodedGroupId = encodeURIComponent(groupId);

    const response = await fetch(`${baseUrl}/projects/${encodedGroupId}`, {
        headers: {
            'PRIVATE-TOKEN': process.env.EXPO_PUBLIC_GITLAB_TOKEN
        }
    })
    const data = await response.json();
    return data
};

const useProject = (projectId: string) => {
    return useQuery({
        queryKey: ['project', projectId],
        queryFn: () => fetchProject(projectId),
    });
};
const Page = () => {

    const { id: projectId } = useLocalSearchParams();
    const { data: repository, isLoading, isError } = useProject(projectId)

    const navigation = useNavigation();

    const buttons = [
        { icon: 'alert-circle-outline', text: 'Issues', kpi: 1 },
        { icon: 'git-merge', text: 'Merge Requests', kpi: 1 },
        { icon: 'play-outline', text: 'CI/CD', kpi: 1 },
        // { icon: 'chatbubbles-outline', text: 'Discussions', kpi: 1},
        { icon: 'eye-outline', text: 'Watchers', kpi: 1 },
        { icon: 'folder-open-outline', text: 'Repositories', screen: 'workspace/repositories', kpi: 1 },
        { icon: "people-circle-outline", text: 'Contributors', kpi: 1 },
        { icon: "document-text-outline", text: 'Licences', kpi: 1 },
        { icon: 'star-outline', text: 'Starred', kpi: 1 },
    ];

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (isError) {
        return <Text>Error fetching data</Text>;
    }
    console.log(repository)
    return (
        <ScrollView className="flex-1">
            <View className="p-4 m-2">
                <View className="flex-row items-center">
                    <Ionicons name="person-circle-outline" size={32} color="black" />
                    <Text className="ml-2 text-lg font-bold text-gray-400">{repository.owner || "Default name"}</Text>
                </View>
                <Text className='mb-4 text-2xl font-bold'>{repository.name}</Text>
                <Text className="mb-4 text-base">{repository.description}</Text>

                <View className="flex-row items-center">
                    <Ionicons name="lock-closed-outline" size={16} color="black" />
                    <Text className="ml-2 text-lg font-bold text-gray-400">{repository.visibility || "Default vis"}</Text>
                </View>
                {/* <View className="flex-row items-center mr-4">
                    <Link href={repository.web_url}>
                        <Ionicons name="link" size={16} color="black" />
                        <Text className="ml-2 text-lg font-bold text-gray-400">{repository.web_url}</Text>
                    </Link>

                </View> */}

                <View className='flex-row'>
                    <View className="flex-row items-center mr-4">
                        <Ionicons name="star" size={16} color="black" />
                        <Text className="ml-2 text-lg font-bold text-gray-400">{repository.stargazers_count || 0} stars</Text>
                    </View>
                    <View className="flex-row items-center mr-4">
                        <Ionicons name="git-network" size={16} color="black" />
                        <Text className="ml-2 text-lg font-bold text-gray-400">{repository.forks_count} forks</Text>
                    </View>

                </View>
                <View className='flex-row'>
                    {/* <Button><Text>OK</Text></Button> */}
                </View>
                <Text>{repository.language}</Text>
            </View>
            <View className="p-4 m-2 bg-gray-200 rounded-lg">
                {/* <Text className="mb-2 text-lg font-bold">Workspace</Text> */}
                {buttons.map((button, index) => (
                    <TouchableOpacity
                        key={index}
                        className="flex-row items-center justify-between py-2"
                        onPress={() => navigation.navigate(button.screen || 'home')}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name={button.icon} size={24} color="black" />
                            <Text className="ml-2 text-base">{button.text}</Text>
                        </View>
                        {/* <Text className="ml-2 text-base text-right">{button.kpi}</Text> */}
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView >
    );
};

export default Page;
