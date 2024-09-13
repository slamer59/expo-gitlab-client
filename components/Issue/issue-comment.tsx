import { styles } from '@/lib/markdown-styles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

const IssueComment = ({ issue }) => {
    const { author, created_at, title, description, body } = issue;
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
                <Text className="text-sm text-gray-400">{new Date(created_at).toLocaleDateString()}</Text>
            </View>

            {title && <Text className="mb-2 font-bold text-white">{title}</Text>}
            <Markdown
                className="mb-4"
                style={styles}
            >
                {description || body || "No description provided."}
            </Markdown>
            <View className="flex-row justify-end">
                <TouchableOpacity onPress={() => { }} className="mr-4">
                    <Ionicons name="share-outline" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { }} className="mr-4">
                    <Ionicons name="create-outline" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { }}>
                    <Ionicons name="chatbubble-outline" size={20} color="white" />
                </TouchableOpacity>

            </View>
        </View >
    );
};

export default IssueComment;
