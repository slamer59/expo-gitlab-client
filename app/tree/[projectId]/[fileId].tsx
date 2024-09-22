import { Text } from "@/components/ui/text";
import { useGetData } from '@/lib/gitlab/hooks';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import * as mime from 'react-native-mime-types';



const Component = (mimeType, content) => {
    console.log('MIME Type:', mimeType);

    // console.log('Content:', content);
    let contentComponent;
    const decodedContent = content ? atob(content) : 'Cannot read this file yet';

    switch (mimeType) {
        case 'text/yaml':
        case 'text/x-yaml':
        case 'application/json':
        case 'text/markdown':
        case 'text/plain':
            contentComponent = <Markdown>{decodedContent}</Markdown>;
            break;
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
            const { width } = Dimensions.get('window');
            contentComponent = <Image source={{ uri: `data:image/png;base64,${content}` }} style={{ width, height: width }} />
            break;
        default:
            contentComponent = <Text>Cannot read this file yet</Text>;
    }
    return contentComponent;

}

export default function FileView() {
    const { projectId, path, ref } = useLocalSearchParams();
    console.log('Project ID:', projectId);
    console.log('Path:', path);

    const params = {
        path: {
            id: projectId, // Replace with your project ID
            file_path: path, // Replace with your file path
        },
        query: {
            ref: ref || 'master', // Replace with your branch name
        }
    }

    const { data: file, isLoading, isError } = useGetData(
        ['project_repository_file_path', params.query],
        "/api/v4/projects/{id}/repository/files/{file_path}",
        params
    );
    if (isLoading) return <Text>Loading...</Text>;
    if (isError) return <Text>Error fetching data</Text>;


    const { content, commit, file_path, file_name, encoding } = file || {};
    // console.log('File:', content, commit, file_path, file_name, encoding);
    return (
        <ScrollView
            className='flex-1 p-4 m-2 bg-white safe-area-inset-bottom'
            contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
        >
            <Stack.Screen
                options={{
                    title: "Explore",
                    // ...defaultOptionsHeader
                }}
            />
            {Component(mime.lookup(file_name), content)}
            <Text>{file_name}</Text>
            <View className='flex-row h-6'></View>
        </ScrollView>
    );
}
