import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { shareView } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { router } from "expo-router";
import React from 'react';
import { Pressable, View } from 'react-native';

// Assume you have set up your GitLab API base URL and token
const GITLAB_API_BASE_URL = 'https://gitlab.com/api/v4';
const GITLAB_TOKEN = 'GITLAB_PAT_REMOVED';

const axiosInstance = axios.create({
    baseURL: GITLAB_API_BASE_URL,
    headers: { 'Authorization': `Bearer ${GITLAB_TOKEN}` }
});

function ProjectOptionsMenu({ projectId }) {
    const queryClient = useQueryClient();

    // Query to fetch project details
    const { data: project } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => axiosInstance.get(`/projects/${projectId}`).then(res => res.data)
    });

    // Mutation to archive/unarchive project
    const toggleArchiveMutation = useMutation({
        mutationFn: (shouldArchive) => axiosInstance.post(`/projects/${projectId}/${shouldArchive ? 'archive' : 'unarchive'}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['project', projectId]);
        },
    });

    const menuItems = [
        {
            icon: "pencil",
            label: "Edit Project",
            onPress: () => router.push(`/workspace/projects/${projectId}/edit`),
            testID: "project-edit-option"
        },
        {
            icon: "git-merge-outline",
            label: "Create Merge Request",
            onPress: () => router.push(`/workspace/projects/${projectId}/merge-requests/create`),
            testID: "create-mr-option"
        },
        {
            icon: project?.archived ? "archive-outline" : "archive",
            label: project?.archived ? "Unarchive Project" : "Archive Project",
            onPress: () => toggleArchiveMutation.mutate(!project?.archived),
            testID: "toggle-archive-option"
        }
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Pressable>
                    {({ pressed }) => (
                        <Ionicons
                            name="ellipsis-vertical"
                            size={25}
                            color="white"
                            className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`}
                            testID="options"
                        />
                    )}
                </Pressable>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-64 native:w-72'>
                <DropdownMenuLabel>This repository</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {menuItems.map((item, index) => (
                        <DropdownMenuItem key={index} onPress={item.onPress} testID={item.testID}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons color="white" name={item.icon} size={20} style={{ marginRight: 10 }} />
                                <Text>{item.label}</Text>
                            </View>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function headerRightProject(project) {
    return () => (
        <View className='flex-row items-center'>
            <Pressable
                onPress={async () => {
                    await shareView(project?.web_url);
                }}
                className='pl-2 pr-2 m-2'
                testID="mr-share-button"
            >
                {({ pressed }) => (
                    <Ionicons
                        name="share-social-outline"
                        size={25}
                        color="white"
                        className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`}
                    />
                )}
            </Pressable>
            <Pressable
                onPress={() => router.push(`/workspace/projects/${project?.id}/issues/create`)}
                className='pl-2 pr-2 m-2'
            >
                {({ pressed }) => (
                    <Ionicons
                        name="add"
                        size={25}
                        color="white"
                        className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`}
                    />
                )}
            </Pressable>
            <ProjectOptionsMenu projectId={project?.id} />
        </View>
    );
}