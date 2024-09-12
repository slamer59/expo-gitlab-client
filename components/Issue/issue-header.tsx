import { getIssueStateColor, IssueState } from '@/lib/utils';
import { Octicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { PillProps, Pills } from '../Pills';


const IssueHeader = ({ issue }) => {

    return (
        <View className="mb-4">
            <Text className="mb-2 font-bold text-md text-muted" >
                {issue.references.full}
            </Text>
            <Text className="mb-2 text-4xl font-bold text-white" >
                {issue.title}
            </Text>
            <Pills
                label={issue.state}
                variant={getIssueStateColor(issue.state as IssueState) as unknown as PillProps}
            />
            <View className="flex-row items-center mt-2">
                <TouchableOpacity className="flex-row items-center mr-2">
                    <Octicons
                        name="thumbsup"
                        size={20}
                        color="gray"
                    />
                    <Text className="ml-1 text-gray-500">
                        {issue.upvotes}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center mr-2">
                    <Octicons
                        name="thumbsdown"
                        size={20}
                        color="gray"
                    />
                    <Text className="ml-1 text-gray-500">
                        {issue.downvotes}
                    </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity>
                            <FontAwesome6 name="bookmark" size={20} color="gray" />
                        </TouchableOpacity> */}
            </View>

        </View>
    );
};

export default IssueHeader
