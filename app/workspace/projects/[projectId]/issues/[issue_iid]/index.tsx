import React from "react";
import { SafeAreaView, ScrollView } from "react-native";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import IssueComment from "@/components/Issue/issue-comment";

import IssueHeader from "@/components/Issue/issue-header";
import IssueNotes from "@/components/Issue/issue-note";
import Loading from "@/components/Loading";
import { LinksMergeRequestsSection } from "@/components/ui/link-issue-merge-request";
import { LinkedIssuesSection } from "@/components/ui/link-issue-section";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useGetData } from "@/lib/gitlab/hooks";
import { useSession } from "@/lib/session/SessionProvider";
import { Text } from "~/components/ui/text";
import { headerRightProjectIssue } from "./headerRight";



export default function IssueDetails() {
    const { projectId, issue_iid } = useLocalSearchParams();
    const { session } = useSession()
    const router = useRouter();

    const api = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });
    // Delete issue
    const deleteIssue = async () => {
        try {
            router.push(`/workspace/projects/${projectId}/issues/list`);
            await api.deleteProjectIssue(projectId, issue_iid);
            // Issue deleted successfully, you can navigate back or perform other actions

            console.log('Issue deleted successfully');
        } catch (error) {
            // Handle error
            console.error('Error deleting issue:', error);
        }
    };
    const closeIssue = async () => {
        try {
            await api.updateProjectIssue(projectId, issue_iid, { state_event: 'close' });
            // Issue closed successfully, you can navigate back or perform other actions
            console.log('Issue closed successfully');
        } catch (error) {
            // Handle error
            console.error('Error closing issue:', error);
        }
    };
    const openIssue = async () => {
        try {
            await api.updateProjectIssue(projectId, issue_iid, { state_event: 'reopen' });
            // Issue closed successfully, you can navigate back or perform other actions
            console.log('Issue closed successfully');
        } catch (error) {
            // Handle error
            console.error('Error closing issue:', error);
        }
    };
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

    return (
        <SafeAreaView className="flex-1">
            <Stack.Screen
                options={{
                    title: "",
                    //issue.references.full.length > 14
                    //     ? `...${issue.references.full.slice(-14)}`
                    //     : issue.references.full,
                    // ...defaultOptionsHeader,
                    // headerTintColor: "black",
                    headerRight: headerRightProjectIssue(openIssue, closeIssue, deleteIssue, issue)
                }}
            />
            <ScrollView
                className="flex-1 p-4 bg-card"
                contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
            >
                <IssueHeader issue={issue} />
                <IssueComment issue={issue} projectId={projectId} />
                <LinkedIssuesSection
                    title="Linked Items"
                    iconName="link"
                    array={linkedIssues}
                    empty={
                        <Text className="mt-2 text-white">
                            Link issues together to show that they're
                            related.
                        </Text>
                    }
                />

                <LinksMergeRequestsSection
                    title="Related merge requests"
                    iconName="link"
                    array={relatedMRs}
                    empty={
                        <Text className="mt-2 text-white">
                            Related merge requests will appear here.
                        </Text>
                    }
                />

                <IssueNotes notes={notes} />

                {/*                <Input
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


        </SafeAreaView>
    );
}
