
import { Text } from "@/components/ui/text";
import { getData } from '@/lib/gitlab/client';
import { formatDate } from "@/lib/utils";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

enum IssueScreenPopupActions {
    edit,
    reopen,
    close,
    delete,
    share,
    openWeb,
}

interface Issue {
    id: number;
    title: string;
    state: 'open' | 'closed';
    author: string;
    createdAt: string;
    updatedAt: string;
    description?: string;
    labels: string[];
}

const issue: Issue = {
    id: 1,
    title: 'Fix bug in login page',
    state: 'open',
    author: 'John Doe',
    createdAt: '2022-01-01T00:00:00Z',
    updatedAt: '2022-01-02T00:00:00Z',
    description: 'The login page is not working correctly. Users are unable to log in with their credentials.',
    labels: ['bug', 'login'],
};

export default function ProjectIssueScreen() {
    const { projectId, issue_iid } = useLocalSearchParams();
    console.log(projectId, issue_iid)
    const handlePopupSelected = (value: IssueScreenPopupActions) => {
        // Handle popup menu item selection
    };
    const params = {
        path: {
            id: projectId,
            issue_iid: issue_iid,
        },
    }
    const { data: issue } = getData(
        ['project_issue', params.path],
        `/api/v4/projects/{id}/issues/{issue_iid}`,
        params
    )
    console.log(issue?.id)
    return (
        <View className='flex-1 bg-white'>
            <StatusBar style="auto" />
            <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-300'>
                <Text className='text-lg font-bold'>#{issue?.id}</Text>
                <TouchableOpacity onPress={() => handlePopupSelected(IssueScreenPopupActions.edit)}>
                    <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View className='p-4'>
                {/* <Text className='mb-2 text-xl font-bold'>{issue?.title}</Text> */}
                {/* <Text className='mb-2 text-lg font-bold text-green-600'>
                    {issue?.state === 'open' ? 'Open' : 'Closed'}
                </Text> */}
                {issue?.state === 'opened' ? (
                    <Ionicons name="checkmark-circle" size={24} color="green" />
                ) : issue?.state === 'closed' ? (
                    <Ionicons name="close-circle" size={24} color="red" />
                ) : issue?.state === 'locked' ? (
                    <Ionicons name="lock-closed" size={24} color="orange" />
                ) : issue?.state === 'merged' ? (
                    <Ionicons name="git-branch" size={24} color="purple" />
                ) : (
                    <Ionicons name="help-circle" size={24} color="blue" />
                )}
                <Text className='mb-4 text-sm text-gray-600'>
                    {issue?.author.name} opened this issue {formatDate(issue?.created_at)}, updated {formatDate(issue?.updated_at)}
                </Text>
                {issue?.description && <Text className='mb-4 text-base'>{issue?.description}</Text>}
                {issue?.milestone?.description && <Text className='mb-4 text-base'>{issue?.milestone?.description}</Text>}

                {issue?.labels.length > 0 && (
                    <View className='mb-4'>
                        <Text className='mb-2 text-lg font-bold'>Labels</Text>
                        <View className='flex-row flex-wrap'>
                            {issue?.labels.map((label) => (
                                <Text
                                    key={label}
                                    className='px-2 py-1 mb-2 mr-2 text-sm font-bold text-gray-700 bg-gray-200 rounded-md'
                                >
                                    {label}
                                </Text>
                            ))}
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}
