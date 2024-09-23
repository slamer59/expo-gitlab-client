
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PipelineStatusIcon from './pipeline-status-icon';

const PipelineHeader = ({ commit }) => {
    return (
        <View className="mb-4">
            <Text className="mb-2 font-bold text-md text-muted">
                {commit?.last_pipeline.ref}
            </Text>
            <View className="flex-row items-center mb-2 space-x-4">
                <PipelineStatusIcon status={commit?.status} size={20} />

                <Text className="ml-2 text-4xl font-bold text-white truncate">
                    {commit?.message}
                </Text>
            </View>
            <View className="flex-row items-center">
                <TouchableOpacity className="flex-row items-center commit-2">
                    <Ionicons
                        name="git-commit-outline"
                        size={20}
                        color="gray"
                    />
                    <Text className="ml-1 text-muted">
                        {commit?.id.substring(0, 8)}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center ml-4 commit-2">
                    <Ionicons
                        name="person-outline"
                        size={20}
                        color="gray"
                    />
                    <Text className="ml-1 text-muted">
                        {commit?.author_name}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PipelineHeader;
