import React from 'react';
import { Text, View } from 'react-native';

import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

export default function TestgitlabHook() {
    const { session } = useSession()
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const { data: user, isLoading: isLoadingCurrent, error: errorUser } = api.useCurrentUser();
    const { data: projects, isLoading, error } = api.useUserProjects(user?.username);

    if (isLoading) return <Text>Loading user projects...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;
    return (
        <View className="items-center justify-center flex-1">
            <Text className="text-2xl font-bold">Modal</Text>
            <View>
                {/* <Text className='text-xl'>{username}'s Projects</Text> */}
                <View>
                    {projects?.map((project) => (
                        <Text key={project.id}>{project.name}</Text>
                    ))}
                </View>
            </View>
            <View className="w-4/5 h-px my-6 bg-gray-300 dark:bg-gray-700" />
            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
}
