import React from "react";
import { ScrollView, View } from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { useGetData } from "@/lib/gitlab/hooks";
import { useLocalSearchParams } from "expo-router";


export default function MergeRequestDetails() {
    const { projectId, mr_iid } = useLocalSearchParams();
    console.log(projectId, mr_iid);

    const params = {
        path: {
            id: projectId,
            mr_iid: mr_iid,
        },
    };
    const {
        data: mr,
        isLoading,
        isError,
        error
    } = useGetData(
        ["project_issue", params.path],
        `/api/v4/projects/{id}/merge_requests/{mr_iid}`,
        params,
    );
    console.log(mr);
    // const {
    //     data: notes,
    //     isLoading: isLoadingNotes,
    //     isError: isErrorNotes,
    // } = useGetData(
    //     ["project_issue_notes", params.path],
    //     `/api/v4/projects/{id}/issues/{mr_iid}/notes`,
    //     params,
    // );

    // const {
    //     data: relatedMRs,
    //     isLoading: isLoadingMR,
    //     isError: isErrorMR,
    // } = useGetData(
    //     ["project_issue_mr", params.path],
    //     `/api/v4/projects/{id}/issues/{mr_iid}/related_merge_requests`,
    //     params,
    // );

    // const {
    //     data: linkedMergeRequests,
    //     isLoading: isLoadingLinkedMergeRequests,
    //     isError: isErrorLinkedMergeRequests,
    // } = useGetData(
    //     ["project_issue_linked_issues", params.path],
    //     `/api/v4/projects/{id}/issues/{mr_iid}/links`,
    //     params,
    // );

    // if (isLoading || isLoadingNotes || isLoadingMR || isLoadingLinkedMergeRequests) {
    //     return <Text>Loading...</Text>;
    // }

    // if (isError || isErrorNotes || isErrorMR || isErrorLinkedMergeRequests) {
    //     return <Text>Error fetching data</Text>;
    // }

    return (
        <>
            {/* <Stack.Screen
                options={{
                    title: `${issue.references.full}`,
                }}
            /> */}
            <ScrollView className="min-h-screen p-4 bg-gray-100">
                {mr &&
                    <View className="max-w-xl p-4 bg-white rounded-lg shadow-md ">
                        {/* # "mx-auto" */}

                        <Text className="mb-2 text-2xl font-bold">{mr.title}</Text>
                        <Text className="mb-2 text-gray-500">#{mr.iid} by {mr.author.name}</Text>
                        <Text className="mb-2">{mr.description}</Text>
                        <Text className="mb-2">State: {mr.state}</Text>
                        <Text className="mb-2">Merge Status: {mr.merge_status}</Text>
                        <Text className="mb-2">Created at: {mr.created_at}</Text>
                        <Text className="mb-2">Updated at: {mr.updated_at}</Text>
                        <Text className="mb-2">Labels: {mr.labels.join(', ')}</Text>
                        <Text className="mb-2">Source Branch: {mr.source_branch}</Text>
                        <Text className="mb-2">Target Branch: {mr.target_branch}</Text>
                        <Text className="mb-2">Changes Count: {mr.changes_count}</Text>
                        <Text className="mb-2">Upvotes: {mr.upvotes}</Text>
                        <Text className="mb-2">Downvotes: {mr.downvotes}</Text>
                        <View className="flex-row items-center mb-2">
                            <Avatar
                                source={{ uri: mr.author.avatar_url }} style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
                            />
                            <Text>Author: {mr.author.name}</Text>
                        </View>
                        {/* Add more details as needed */}
                    </View>
                }
            </ScrollView >
        </>
    );
}
