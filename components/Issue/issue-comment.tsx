import { styles } from '@/lib/markdown-styles';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MarkdownCustom from '../CustomMarkdown';


const IssueComment = ({ issue, commentId, showCopy = false, showEdit = false }: { issue: any; showCopy: boolean; showEdit: boolean; commentId?: string }) => {
    const { author, created_at, title, description, body, id, web_url } = issue;
    const router = useRouter();

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(web_url);
    };

    const handleEdit = () => {
        router.push(`/workspace/projects/${issue.project_id}/issues/${id}/edit`);
    };
    const scrollViewRef = useRef<ScrollView>(null);

    const handleComment = (commentId: string) => {

        // scrollViewRef.current?.scrollToEnd({ animated: true });

        router.push(`/workspace/projects/${issue.project_id}/issues/${id}/comments/${commentId}`);
    };

    return (
        <View className="p-4 mt-4 mb-4 rounded-lg bg-card-600">
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                    {author?.avatar_url ? (
                        <Image
                            source={{ uri: author?.avatar_url }}
                            className="w-8 h-8 mr-2 rounded-full"
                        />
                    ) : (
                        <View className="items-center justify-center w-8 h-8 mr-2 bg-purple-500 rounded-full">
                            <Text className="font-bold text-white">{author?.name.charAt(0).toUpperCase()}</Text>
                        </View>
                    )}
                    <Text className="font-semibold text-white">{author?.name}</Text>
                </View>
                <Text className="text-sm text-gray-400">{new Date(created_at).toLocaleDateString()}</Text>
            </View>

            {title && <Text className="mb-2 font-bold text-white">{title}</Text>}
            <MarkdownCustom
                // className="mb-4"
                style={styles}
            >
                {description || body || "No description provided."}
            </MarkdownCustom>
            <View className="flex-row justify-end">
                {showCopy && <TouchableOpacity onPress={copyToClipboard} >
                    <Ionicons name="share-outline" size={20} color="white" />
                </TouchableOpacity>}
                {showEdit && <TouchableOpacity onPress={handleEdit} className="ml-4">
                    <Ionicons name="create-outline" size={20} color="white" />
                </TouchableOpacity>}
                {commentId && <TouchableOpacity
                    className="ml-4"
                    onPress={() => handleComment(commentId)}>
                    <Ionicons name="chatbubble-outline" size={20} color="white" />
                </TouchableOpacity>}
            </View>
        </View>
    );
};

export default IssueComment;
