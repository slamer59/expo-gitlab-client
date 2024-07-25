
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';

import IssueStatusIcon from '@/components/ui/issue-status-icon';
import { getData } from '@/lib/gitlab/client';
import { formatDate } from '@/lib/utils';
import { Text } from '~/components/ui/text';


export default function IssueDetails() {
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
    const { data: issue, isLoading, isError } = getData(
        ['project_issue', params.path],
        `/api/v4/projects/{id}/issues/{issue_iid}`,
        params
    )

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (isError) {
        return <Text>Error fetching data</Text>;
    }
    console.log(issue)

    return (<>
        <Stack.Screen
            options={{
                title: `#${issue.iid}`
            }}
        />
        <ScrollView className='min-h-screen p-4 bg-gray-100'>
            <View className='max-w-xl p-4 bg-white rounded-lg shadow-md '>
                {/* # "mx-auto" */}
                <Text className='mb-2 text-2xl font-bold'>{issue.title}</Text>
                {/* <View className='mb-4'> */}
                {/* <Picker className='px-2 py-1 border border-gray-300 rounded'>
                        <Picker.Item label="Issue actions" value="issue-actions" />
                    </Picker> */}

                {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline'>
                                <Text>Edit</Text>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-64 native:w-72'>
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSubContent>
                                <Animated.View entering={FadeIn.duration(200)}>
                                    <DropdownMenuItem>
                                        <Text>On</Text>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Text>Off</Text>
                                    </DropdownMenuItem>
                                </Animated.View>
                            </DropdownMenuSubContent>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <Text>Close issue</Text>
                                    </DropdownMenuSubTrigger>
                                </DropdownMenuSub>
                                <DropdownMenuItem>
                                    <Text>New Team</Text>
                                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Text>GitHub</Text>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Text>Support</Text>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <Text>API</Text>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Text>Log out</Text>
                                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}
                {/* </View> */}
                <View className='flex-row items-center mb-4'>
                    {IssueStatusIcon(issue, true)}
                    <Text className='ml-1 text-gray-500'>Issue created {formatDate(issue.created_at)} by</Text>
                    <Text className='ml-1 text-blue-500'>{issue.author.name}</Text>
                </View>
                <View className='flex-row items-center justify-between mb-4'>
                    <View className='flex-row items-center'>
                        <TouchableOpacity className='flex-row items-center mr-2'>
                            <FontAwesome name="thumbs-up" size={20} color="gray" />
                            <Text className='ml-1 text-gray-500'>{issue.upvotes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='flex-row items-center mr-2'>
                            <FontAwesome name="thumbs-down" size={20} color="gray" />
                            <Text className='ml-1 text-gray-500'>{issue.downvotes}</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity>
                            <FontAwesome name="bookmark" size={20} color="gray" />
                        </TouchableOpacity> */}
                    </View>
                    {/* <Button title="Create merge request" color="#1E90FF" /> */}
                </View>
                {/* <View className='p-4 mb-4 border border-gray-300 border-dashed'>
                    <Text className='mb-2 text-gray-500'>Drag your designs here or <Text className='text-blue-500'>click to upload</Text>.</Text>
                    <View className='flex-row items-center justify-between'>
                        <Text className='text-gray-500'>Child items</Text>
                        <Button title="Add" color="#BEBEBE" />
                    </View>
                    <Text className='mt-2 text-gray-500'>No child items are currently assigned. Use child items to break down this issue into smaller parts.</Text>
                </View> */}
                {/* <View className='p-4 mb-4 border border-gray-300 border-dashed'>
                    <View className='flex-row items-center justify-between'>
                        <Text className='text-gray-500'>Linked items</Text>
                        <Button title="Add" color="#BEBEBE" />
                    </View>
                    <Text className='mt-2 text-gray-500'>Link issues together to show that they're related. <Text className='text-blue-500'>Learn more.</Text></Text>
                </View> */}
                {/* <View className='p-4 mb-4 border border-gray-300 border-dashed'>
                    <View className='flex-row items-center justify-between'>
                        <Text className='text-gray-500'>Related merge requests</Text>
                        <Text className='px-2 py-1 text-gray-700 bg-gray-200 rounded'>1</Text>
                    </View>
                    <Text className='mt-2 text-gray-500'>When this merge request is accepted, this issue will be closed automatically.</Text>
                    <View className='flex-row items-center mt-2'>
                        <FontAwesome name="code-branch" size={20} color="gray" className='mr-2' />
                        <Text className='text-gray-500'>Draft: Resolve "next/head migration"</Text>
                        <Text className='ml-auto text-gray-500'>#1290</Text>
                    </View>
                </View> */}
                {/* <View>
                    <Text className='mb-2 text-lg font-bold'>Activity</Text>
                    <Picker className='px-2 py-1 mb-4 border border-gray-300 rounded'>
                        <Picker.Item label="Sort or filter" value="sort-or-filter" />
                    </Picker> 
                    <View className='mb-4'>
                        <View className='flex-row items-start mb-2'>
                            <FontAwesome name="user-circle" size={20} color="gray" className='mr-2' />
                            <View>
                                <Text className='text-gray-500'><Text className='text-blue-500'>Thomas Pedot</Text> added <Text className='px-2 py-1 text-sm font-semibold text-green-800 bg-green-200 rounded'>enhancement</Text> <Text className='px-2 py-1 text-sm font-semibold text-blue-800 bg-blue-200 rounded'>major</Text> 4 months ago</Text>
                            </View>
                        </View>
                        <View className='flex-row items-start mb-2'>
                            <FontAwesome name="user-circle" size={20} color="gray" className='mr-2' />
                            <View>
                                <Text className='text-gray-500'><Text className='text-blue-500'>Thomas Pedot</Text> created branch <Text className='text-blue-500'>176-next-head-migration</Text> to address this issue 4 months ago</Text>
                            </View>
                        </View>
                        <View className='flex-row items-start mb-2'>
                            <FontAwesome name="user-circle" size={20} color="gray" className='mr-2' />
                            <View>
                                <Text className='text-gray-500'><Text className='text-blue-500'>Thomas Pedot</Text> mentioned in merge request <Text className='text-blue-500'>#1290</Text> 4 months ago</Text>
                            </View>
                        </View>
                    </View>
                </View> */}
                {/* <View className='p-4 mb-4 border border-gray-300 rounded'>
                    <View className='flex-row items-center mb-2'>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome name="bold" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome name="italic" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome name="link" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome name="quote-right" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome name="code" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome name="list-ul" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome name="list-ol" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome name="image" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome name="smile" size={20} color="gray" />
                        </TouchableOpacity>
                    </View>
                    <Input
                        className='w-full p-2 mb-2 border border-gray-300 rounded'
                        multiline
                        numberOfLines={4}
                        placeholder="Write a comment or drag your files here..."
                    />
                    <View className='flex-row items-center'>
                        <Checkbox className='mr-2' />
                        <Text className='text-gray-500'>Make this an internal note</Text>
                    </View>
                </View> */}
                {/* <View className='flex-row items-center justify-between'>
                    <Button title="Comment" color="#BEBEBE" />
                    <Picker className='px-2 py-1 border border-gray-300 rounded'>
                        <Picker.Item label="Close issue" value="close-issue" />
                    </Picker>
                </View> */}
            </View>
        </ScrollView >
    </>
    );
};
