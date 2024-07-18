import { Text } from "@/components/ui/text";
import { getData } from "@/lib/gitlab/client";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

const baseUrl = "https://gitlab.com/api/v4"

const ProjectDetailsScreen = () => {

    const { id: projectId } = useLocalSearchParams();

    const params = {
        path: {
            id: projectId
        },
        query: {
            statistics: false,
            with_custom_attributes: false,
            license: false
        }

    }
    const { data: repository, isLoading, isError } = getData(
        ['projects_id', params.query],
        "/api/v4/projects/{id}",
        params
    );
    console.log("repository")
    console.log(repository)
    const navigation = useNavigation();
    // KPI => _links
    const buttons = [
        { icon: 'alert-circle-outline', text: 'Issues', kpi: repository?.open_issues_count || "" },
        { icon: 'git-merge', text: 'Merge Requests', kpi: "" },
        { icon: 'play-outline', text: 'CI/CD', kpi: "" },
        // { icon: 'chatbubbles-outline', text: 'Discussions', kpi: ""},
        { icon: 'eye-outline', text: 'Watchers', kpi: "" },
        // { icon: 'folder-open-outline', text: 'Repositories', screen: 'workspace/repositories', kpi: "" },
        { icon: "people-circle-outline", text: 'Contributors', kpi: "" },
        { icon: "document-text-outline", text: 'Licences', kpi: "" },
        { icon: 'star-outline', text: 'Starred', kpi: repository?.star_count || "" },
    ];

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (isError) {
        return <Text>Error fetching data</Text>;
    }

    return (
        <ScrollView className="flex-1">
            <View className="p-4 m-2">
                <View className="flex-row items-center">
                    <Ionicons name="person-circle-outline" size={32} color="black" />
                    <Text className="ml-2 text-lg font-bold text-light dark:text-black">{repository?.owner?.name || "Default name"}</Text>
                </View>
                <Text className='mb-4 text-2xl font-bold'>{repository.name}</Text>
                <Text className="mb-4 text-base">{repository.description}</Text>

                <View className="flex-row items-center">
                    <Ionicons name="lock-closed-outline" size={16} color="black" />
                    <Text className="ml-2 text-lg font-bold text-light dark:text-black">{repository.visibility || "Default vis"}</Text>
                </View>

                <View className="flex-row items-center mr-4">
                    <Link href={repository.web_url}>
                        <Ionicons name="link" size={16} color="black" />
                        <Text className="ml-4 text-lg font-bold text-light dark:text-black">{repository.web_url}</Text>
                    </Link>
                </View>

                <View className='flex-row'>
                    <View className="flex-row items-center mr-4">
                        <Ionicons name="star" size={16} color="gold" />
                        <Text className="ml-2 text-lg font-bold text-light dark:text-black">{repository.star_count || 0} stars</Text>
                    </View>
                    <View className="flex-row items-center mr-4">
                        <Ionicons name="git-network" size={16} color="red" />
                        <Text className="ml-2 text-lg font-bold text-light dark:text-black">{repository.forks_count} forks</Text>
                    </View>

                </View>
                <Text>{repository.language}</Text>
            </View>
            <View className="p-4 m-2 bg-gray-200 rounded-lg">
                <Text className="mb-2 text-lg font-bold">Workspace</Text>
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
                        <Text className="ml-2 text-base text-right">{button.kpi}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View className="p-4 m-2 bg-gray-200 rounded-lg">
                <TouchableOpacity
                    className="flex-row items-center justify-between py-2"
                    onPress={() => navigation.navigate(button.screen || 'home')}
                >
                    <View className="flex flex-row items-center">
                        <Ionicons name="git-branch-outline" size={18} color="black" />
                        <Text className="ml-2 text-base">{repository.default_branch}</Text>
                        <Ionicons name="checkbox" size={18} color="black" />
                    </View>
                    <Text className="ml-2 font-bold text-right text-blue-500">CHANGE BRANCH</Text>
                </TouchableOpacity>
                <View className="flex-row items-center justify-between py-2">
                    <Link
                        href={{
                            pathname: '/tree/[projectId]',
                            params: {
                                projectId: projectId,
                            },
                        }}
                    >
                        <Ionicons name="document-text-outline" size={18} color="black" />
                        <Text className="ml-2 text-base">Code</Text>
                    </Link>
                </View>
                <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => navigation.navigate(button.screen || 'home')}
                >
                    <Ionicons name="git-commit-outline" size={24} color="black" />
                    <Text className="ml-2 text-base">Commits</Text>
                </TouchableOpacity>
            </View>
            {/* <View className="p-4 m-2">
                <View
                    className="flex-row items-center justify-between py-2"
                    onPress={() => navigation.navigate(button.screen || 'home')}
                >
                    <View className="flex-row items-center">
                        <Ionicons name="information-circle-outline" size={24} color="black" />
                        <Text className="ml-2 text-base">Readme.md</Text>
                    </View>
                    <Text className="font-bold text-right text-blue-500">EDIT</Text>
                </View>
                <View className="flex-row items-center">
                    <Text>TODO MARKDOWN display</Text>
                </View>
            </View> */}

        </ScrollView>
    );
};

export default ProjectDetailsScreen;
