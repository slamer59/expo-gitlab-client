import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import * as mime from 'react-native-mime-types';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
/*by default component uses hljs so access hljs styles, import from /prism for prism styles */

import { a11yDark as highlightStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { HeaderAction, HeaderOption, HeaderRight } from "@/components/HeaderRight";
import Loading from "@/components/Loading";
import { Text } from "@/components/ui/text";
import { useGetData } from '@/lib/gitlab/hooks';

const decodeBase64 = (str) => {
    try {
        return atob(str);
    } catch (e) {
        console.error('Error decoding base64:', e);
        return str; // Return the original string if decoding fails
    }
};

const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    switch (extension) {
        case 'js':
        case 'jsx':
            return 'javascript';
        case 'tsx':
        case 'ts':
            return 'typescript';
        case 'py':
            return 'python';
        case 'rb':
            return 'ruby';
        case 'java':
            return 'java';
        case 'cpp':
        case 'c':
            return 'c';
        case 'html':
            return 'html';
        case 'css':
            return 'css';
        case 'php':
            return 'php';
        case 'go':
            return 'go';
        case 'rust':
        case 'rs':
            return 'rust';
        case 'swift':
            return 'swift';
        case 'kt':
        case 'kts':
            return 'kotlin';
        case 'scala':
            return 'scala';
        case 'sh':
        case 'bash':
            return 'bash';
        case 'yml':
        case 'yaml':
            return 'yaml';
        case 'json':
            return 'json';
        case 'md':
            return 'markdown';
        case 'sql':
            return 'sql';
        case 'txt':
            return 'text';
        default:
            return 'text';
    }
};


const Component = ({ mimeType, fileType, content }) => {
    console.log('MIME Type:', mimeType);
    console.log('File Type:', fileType);

    const decodedContent = content ? decodeBase64(content) : 'Cannot read this file yet';

    let contentComponent;

    if (mimeType && mimeType.startsWith('image/')) {
        const { width } = Dimensions.get('window');
        contentComponent = <Image source={{ uri: `data:${mimeType};base64,${content}` }} style={{ width, height: width }} />;
    } else if (fileType !== 'text') {
        contentComponent = <SyntaxHighlighter
            language='javascript'
            style={highlightStyle}
            highlighter={"prism" || "hljs"}
        >
            {decodedContent}
        </SyntaxHighlighter>;

    } else {
        contentComponent = <Text>{decodedContent}</Text>;
    }

    return contentComponent
};



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

    const mimeType = mime.lookup(file_name) || 'text/plain';
    const fileType = getFileType(file_name);

    const headerActions: HeaderAction[] = [
        {
            icon: "share-social-outline",
            onPress: () => console.log("To Be Implemented"), // shareView(issue?.web_url),
            testID: "share-issue-button"
        }
    ];

    const headerOptions: HeaderOption[] = [
        // Choose theme 
        {
            icon: "color-palette-outline",
            label: "Choose theme",
            onPress: () => console.log("To Be Implemented"), // shareView(issue?.web_url),
            testID: "choose-theme-button"
        }
    ];

    return (
        <ScrollView
            className="flex-1 p-4 bg-card"
            contentContainerStyle={{ paddingBottom: 100 }}
        >
            <Stack.Screen
                options={{
                    title: file_name,
                    headerRight: () => (
                        <HeaderRight
                            actions={headerActions}
                            options={headerOptions}
                        />
                    )
                }}
            />
            {/* <Text className="mb-2 text-lg font-bold">File Path: {file_path}</Text>
            <Text className="mb-2">MIME Type: {mimeType}</Text>
            <Text className="mb-2">File Type: {fileType}</Text> */}

            {isLoading ? <Loading />
                :
                <Component
                    mimeType={mimeType}
                    fileType={fileType}
                    content={content}
                />}
            <View className='flex-row h-6'></View>
        </ScrollView>
    );
}