import { Ionicons } from '@expo/vector-icons';
import { formatDuration, intervalToDuration } from 'date-fns';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { formatDate } from '@/lib/utils';

const PipelineComment = ({ pipeline, projectId }) => {
    const { user, created_at, id, status, ref, web_url } = pipeline;
    const router = useRouter();
    const { session } = useSession();

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);
    const retryPipelineMutation = api.useRetryPipeline();

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(web_url);
    };

    const handleViewDetails = () => {
        router.push(`/workspace/projects/${projectId}/pipelines/${id}`);
    };

    const handleRetry = async () => {
        try {
            await retryPipelineMutation.mutateAsync({ projectId, pipelineId: id });
        } catch (error) {
            console.error("Error retrying pipeline:", error);
        }
    };

    return (
        <View className="p-4 mb-4 rounded-lg bg-card-600">
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                    {user.avatar_url ? (
                        <Image
                            source={{ uri: user.avatar_url }}
                            className="w-8 h-8 mr-2 rounded-full"
                        />
                    ) : (
                        <View className="items-center justify-center w-8 h-8 mr-2 bg-purple-500 rounded-full">
                            <Text className="font-bold text-white">{user.name.charAt(0).toUpperCase()}</Text>
                        </View>
                    )}
                    <Text className="font-semibold text-white">{user.name}</Text>
                </View>
                <Text className="text-sm text-gray-400">{formatDate(created_at)}</Text>
            </View>

            <View className="items-start flex-1 mb-2">
                <TouchableOpacity className="flex-row items-center commit-2">
                    <Ionicons
                        name="time-outline"
                        size={20}
                        color="gray"
                    />
                    <Text className="ml-1 text-muted">
                        Duration: {formatDuration(
                            intervalToDuration({ start: 0, end: pipeline?.duration * 1000 }),
                            { format: ['hours', 'minutes', 'seconds'] }
                        )}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center ">
                    <Ionicons
                        name="walk-outline"
                        size={20}
                        color="gray"
                    />
                    <Text className="ml-1 text-muted">
                        Queue Duration: {formatDuration(
                            intervalToDuration({ start: 0, end: pipeline?.queued_duration * 1000 }),
                            { format: ['hours', 'minutes', 'seconds'] }
                        )}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center mt-2">
                    <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="gray"
                    />
                    <Text className="ml-1 text-muted">
                        Created: {new Date(pipeline?.created_at).toLocaleString()}
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row justify-end">
                <TouchableOpacity onPress={copyToClipboard} className="mr-4">
                    <Ionicons name="share-outline" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleViewDetails} className="mr-4">
                    <Ionicons name="eye-outline" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRetry}>
                    <Ionicons name="refresh-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PipelineComment;
