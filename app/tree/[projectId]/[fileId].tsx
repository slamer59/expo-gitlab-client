import MarkdownCustom from "@/components/CustomMarkdown";
import Loading from "@/components/Loading";
import { Text } from "@/components/ui/text";
import { useGetData } from '@/lib/gitlab/hooks';
import { styles } from "@/lib/markdown-styles";
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import * as mime from 'react-native-mime-types';


const decodeBase64 = (str) => {
    try {
        return atob(str);
    } catch (e) {
        console.error('Error decoding base64:', e);
        return str; // Return the original string if decoding fails
    }
};


const Component = ({ mimeType, content }) => {
    console.log('MIME Type:', mimeType);

    // console.log('Content:', content);
    let contentComponent;
    const decodedContent = content ? decodeBase64(content) : 'Cannot read this file yet';
    // console.log("🚀 ~ Component ~ decodedContent:", decodedContent)

    switch (mimeType) {
        case 'text/yaml':
        case 'text/x-yaml':
        case 'application/json':
        case 'text/markdown':
        case 'text/plain':
            contentComponent = <MarkdownCustom
                className="mb-4"
                style={styles}

            >{decodedContent}</MarkdownCustom>;
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
        ['project_repository_file_path', params.query, path],
        "/api/v4/projects/{id}/repository/files/{file_path}",
        params
    );
    if (isLoading) return <Text>Loading...</Text>;
    if (isError) return <Text>Error fetching data</Text>;


    const { content, commit, file_path, file_name, encoding } = file || {};
    // console.log('File:', content);
    return (
        <ScrollView
            className="flex-1 p-2 bg-card"
            contentContainerStyle={{ paddingBottom: 100 }}
        >
            <Stack.Screen
                options={{
                    title: file_name
                    // ...defaultOptionsHeader
                }}
            />
            {isLoading ? <Loading />
                :
                <Component
                    mimeType={mime.lookup(file_name)}
                    content={content}
                />}
            <View className='flex-row h-6'></View>
        </ScrollView>
    );
}
