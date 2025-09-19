import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { styles } from '@/lib/markdown-styles';
import { formatDate } from '@/lib/utils';

import MarkdownCustom from '../CustomMarkdown';

const MergeRequestComment = ({ mr, projectId }) => {
    const { author, created_at, title, description, body, iid, web_url } = mr;
    const router = useRouter();

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(web_url);
    };

    const handleEdit = () => {
        router.push(`/workspace/projects/${projectId}/merge-requests/${iid}/edit`);
    };

    const handleComment = () => {
        // Navigate to comment section or open comment modal
        // This depends on your app's structure
        // For example:
        // router.push(`/workspace/projects/${projectId}/mrs/${iid}/comments`);
    };

    return (
        <View className="p-4 mb-4 rounded-lg bg-card-600">
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                    {author.avatar_url ? (
                        <Image
                            source={{ uri: author.avatar_url }}
                            className="w-8 h-8 mr-2 rounded-full"
                        />
                    ) : (
                        <View className="items-center justify-center w-8 h-8 mr-2 bg-purple-500 rounded-full">
                            <Text className="font-bold text-white">{author.name.charAt(0).toUpperCase()}</Text>
                        </View>
                    )}
                    <Text className="font-semibold text-white">{author.name}</Text>
                </View>
                <Text className="text-sm text-gray-400">{formatDate(created_at)}</Text>
            </View>

            {title && <Text className="mb-2 font-bold text-white">{title}</Text>}
            <MarkdownCustom
                className="mb-4"
                style={styles}
            >
                {description || body || "No description provided."}
            </MarkdownCustom>


            <View className="flex-row justify-end">
                <TouchableOpacity onPress={copyToClipboard} className="mr-4">
                    <Ionicons name="share-outline" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEdit} className="mr-4">
                    <Ionicons name="create-outline" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleComment}>
                    <Ionicons name="chatbubble-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default MergeRequestComment;
