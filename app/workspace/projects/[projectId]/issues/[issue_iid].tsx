import React from "react";
import { ScrollView } from "react-native";

import { Stack, useLocalSearchParams } from "expo-router";

import IssueComment from "@/components/Issue/issue-comment";

import IssueHeader from "@/components/Issue/issue-header";
import IssueNotes from "@/components/Issue/issue-note";
import Loading from "@/components/Loading";
import LinksToIssueSection from "@/components/ui/link-issue-section";
import { defaultOptionsHeader } from "@/lib/constants";
import { useGetData } from "@/lib/gitlab/hooks";
import { Text } from "~/components/ui/text";

export default function IssueDetails() {
    const { projectId, issue_iid } = useLocalSearchParams();
    console.log(projectId, issue_iid);

    const params = {
        path: {
            id: projectId,
            issue_iid: issue_iid,
        },
    };
    const {
        data: issue,
        isLoading,
        isError,
    } = useGetData(
        ["project_issue", params.path],
        `/api/v4/projects/{id}/issues/{issue_iid}`,
        params,
    );
    // console.log("issue_iid", issue);
    const {
        data: notes,
        isLoading: isLoadingNotes,
        isError: isErrorNotes,
    } = useGetData(
        ["project_issue_notes", params.path],
        `/api/v4/projects/{id}/issues/{issue_iid}/notes`,
        params,
    );
    // console.log("issue_iid-notes", notes);
    const {
        data: relatedMRs,
        isLoading: isLoadingMR,
        isError: isErrorMR,
    } = useGetData(
        ["project_issue_mr", params.path],
        `/api/v4/projects/{id}/issues/{issue_iid}/related_merge_requests`,
        params,
    );
    // console.log("issue_iid-related_merge_requests", relatedMRs);

    const {
        data: linkedIssues,
        isLoading: isLoadingLinkedIssues,
        isError: isErrorLinkedIssues,
    } = useGetData(
        ["project_issue_linked_issues", params.path],
        `/api/v4/projects/{id}/issues/{issue_iid}/links`,
        params,
    );
    // console.log("issue_iid-links", linkedIssues);
    if (isLoading || isLoadingNotes || isLoadingMR || isLoadingLinkedIssues) {
        return <Loading />
    }

    if (isError || isErrorNotes || isErrorMR || isErrorLinkedIssues) {
        return <Text>Error fetching data</Text>;
    }
    // GET /projects/:id/issues/:issue_iid/resource_label_events

    return (
        <>
            <Stack.Screen
                options={{
                    title: `${issue.references.full}`,
                    ...defaultOptionsHeader,
                    // headerTintColor: "black",
                }}
            />
            <ScrollView className="min-h-screen p-4 bg-card">
                <IssueHeader issue={issue} />
                <IssueComment issue={issue} />
                {/* </View> */}
                {/* <View className="flex-row items-center mb-4">
                        {IssueStatusIcon(issue, true)}
                        <Text className="ml-1 text-gray-500">
                            Issue created {formatDate(issue.created_at)} by
                        </Text>
                        <Text className="ml-1 text-blue-500">
                            {issue.author.name}
                        </Text>
                    </View> */}
                {/* <View className='p-4 mb-4 border border-gray-300 border-dashed'>
                    <Text className='mb-2 text-gray-500'>Drag your designs here or <Text className='text-blue-500'>click to upload</Text>.</Text>
                    <View className='flex-row items-center justify-between'>
                        <Text className='text-gray-500'>Child items</Text>
                        <Button title="Add" color="#BEBEBE" />
                    </View>
                    <Text className='mt-2 text-gray-500'>No child items are currently assigned. Use child items to break down this issue into smaller parts.</Text>
                </View> */}

                {/* <LinksToIssueSection
                    title="Child Items"
                    iconName="checklist"
                    array={linkedIssues}
                    empty={
                        <Text className="mt-2 text-white">
                            Link issues together to show that they're
                            related.{" "}
                            <Text className="text-blue-500">
                                Learn more.
                            </Text>
                        </Text>
                    }
                /> */}
                <LinksToIssueSection
                    title="Linked Items"
                    iconName="link"
                    array={linkedIssues}
                    empty={
                        <Text className="mt-2 text-white">
                            Link issues together to show that they're
                            related.{" "}
                            <Text className="text-blue-500">
                                Learn more.
                            </Text>
                        </Text>
                    }
                />

                <LinksToIssueSection
                    title="Related merge requests"
                    iconName="link"
                    array={relatedMRs}
                    empty={
                        <Text className="mt-2 text-white">
                            Related merge requests will appear here.
                            <Text className="text-blue-500">
                                Learn more.
                            </Text>
                        </Text>
                    }
                />

                {/* <View>
                    <Text className='mb-2 text-lg font-bold'>Activity</Text>
                    <Picker className='px-2 py-1 mb-4 border border-gray-300 rounded'>
                        <Picker.Item label="Sort or filter" value="sort-or-filter" />
                    </Picker> 
                    <View className='mb-4'>
                        <View className='flex-row items-start mb-2'>
                            <FontAwesome6 name="user-circle" size={20} color="gray" className='mr-2' />
                            <View>
                                <Text className='text-gray-500'><Text className='text-blue-500'>Thomas Pedot</Text> added <Text className='px-2 py-1 text-sm font-semibold text-green-800 bg-green-200 rounded'>enhancement</Text> <Text className='px-2 py-1 text-sm font-semibold text-blue-800 bg-blue-200 rounded'>major</Text> 4 months ago</Text>
                            </View>
                        </View>
                        <View className='flex-row items-start mb-2'>
                            <FontAwesome6 name="user-circle" size={20} color="gray" className='mr-2' />
                            <View>
                                <Text className='text-gray-500'><Text className='text-blue-500'>Thomas Pedot</Text> created branch <Text className='text-blue-500'>176-next-head-migration</Text> to address this issue 4 months ago</Text>
                            </View>
                        </View>
                        <View className='flex-row items-start mb-2'>
                            <FontAwesome6 name="user-circle" size={20} color="gray" className='mr-2' />
                            <View>
                                <Text className='text-gray-500'><Text className='text-blue-500'>Thomas Pedot</Text> mentioned in merge request <Text className='text-blue-500'>#1290</Text> 4 months ago</Text>
                            </View>
                        </View>
                    </View>
                </View> */}
                {/* <IssueEventComponent notes={notes} /> */}

                <IssueNotes notes={notes} />

                {/* {notes?.map((note, index) => (
                        <View
                            key={index}
                            className="flex-row items-start mb-4"
                        >
                            <View className="flex-1">
                                <View className="flex-row items-center mb-1">
                                    <FontAwesome6
                                        name="comment"
                                        size={20}
                                        color="gray"
                                    />
                                    <Text className="ml-1 font-bold text-white">
                                        {note.author.name}
                                    </Text>
                                    <Text className="ml-1 text-white">
                                        at {formatDate(note.created_at)}
                                    </Text>
                                </View>
                                <Markdown
                                    style={styles}
                                >{note.body}</Markdown>
                            </View>
                        </View>
                    ))} */}


                {/* <View className='p-4 mb-4 border border-gray-300 rounded'>
                    <View className='flex-row items-center mb-2'>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome6 name="bold" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome6 name="italic" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome6 name="link" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome6 name="quote-right" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome6 name="code" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome6 name="list-ul" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome6 name="list-ol" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome6 name="image" size={20} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mr-2'>
                            <FontAwesome6 name="smile" size={20} color="gray" />
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

            </ScrollView >
        </>
    );
}
