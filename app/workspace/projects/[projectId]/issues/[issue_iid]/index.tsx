import React from "react";
import { SafeAreaView, ScrollView } from "react-native";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import CreateDiscussion from "@/components/CreateDiscussion";
import { HeaderAction, HeaderOption, HeaderRight } from "@/components/HeaderRight";
import IssueComment from "@/components/Issue/issue-comment";
import IssueHeader from "@/components/Issue/issue-header";
import IssueNotes from "@/components/Issue/issue-note";
import { CommentSkeleton } from "@/components/Skeleton/comment";
import { HeaderSkeleton } from "@/components/Skeleton/header";
import { LinkedItemSkeleton } from "@/components/Skeleton/linkedItems";
import NotesSkeleton from "@/components/Skeleton/notes";
import { LinksMergeRequestsSection } from "@/components/ui/link-issue-merge-request";
import { LinkedIssuesSection } from "@/components/ui/link-issue-section";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { shareView } from "@/lib/utils";
import { Separator } from "@rn-primitives/select";
import { Text } from "~/components/ui/text";



export default function IssueDetails() {
    const { projectId, issue_iid } = useLocalSearchParams();
    const { session } = useSession()
    const router = useRouter();

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const [
        { data: issue, isLoading: isLoadingIssue, error: errorIssue },
        { data: notes, isLoading: isLoadingNotes, error: errorNotes },
        { data: relatedMRs, isLoading: isLoadingRelatedMergeRequests, error: errorRelatedMRs },
        { data: linkedIssues, isLoading: isLoadingLinkedIssues, error: errorLinkedIssues },
    ] = api.useProjectIssueDetails(projectId, issue_iid);

    if (errorIssue || errorNotes || errorRelatedMRs || errorLinkedIssues) {
        return <Text>Error fetching data: {errorIssue?.message || errorNotes?.message || errorRelatedMRs?.message || errorLinkedIssues?.message}
        </Text>;
    }

    const updateIssueMutation = api.useUpdateProjectIssue();
    const deleteIssueMutation = api.useDeleteProjectIssue();

    const openIssue = async () => updateIssueMutation.mutateAsync(
        { projectId, issueIid: issue_iid, updateData: { state_event: 'reopen' } },
    );
    const closeIssue = async () => updateIssueMutation.mutateAsync(
        { projectId, issueIid: issue_iid, updateData: { state_event: 'close' } }
    );

    const deleteIssue = async () => {
        await deleteIssueMutation.mutateAsync(
            { projectId, issueIid: issue_iid },
            {
                onSuccess: () => {
                    router.back()
                },
            }
        );
    };

    const headerActions: HeaderAction[] = [
        {
            icon: "share-social-outline",
            onPress: () => shareView(issue?.web_url),
            testID: "share-issue-button"
        }
    ];

    const headerOptions: HeaderOption[] = [
        {
            icon: "pencil",
            label: "Edit Issue",
            onPress: () => router.push(`/workspace/projects/${projectId}/issues/${issue_iid}/edit`),
            testID: "issue-edit-option"
        },
        {
            icon: issue?.state === 'opened' ? 'close-circle-outline' : 'checkmark-circle-outline',
            color: issue?.state === 'opened' ? 'red' : 'green',
            label: issue?.state === 'opened' ? 'Close Issue' : 'Reopen Issue',
            onPress: issue?.state === 'opened' ? closeIssue : openIssue,
            testID: "toggle-issue-state-option"
        },
        // Create merge request
        {
            icon: "git-merge",
            label: "Create Merge Request",
            onPress: () => router.push(`/workspace/projects/${projectId}/merge-requests/create?issue_iid=${issue_iid}&title=${encodeURIComponent(issue?.title || '')}`),
            testID: "create-merge-request-option"
        },
        {
            icon: "trash-outline",
            color: "red",
            label: "Delete Issue",
            onPress: deleteIssue,
            testID: "delete-issue-option"
        }
    ];
    console.log("issue", issue)
    return (
        <SafeAreaView className="flex-1">
            <Stack.Screen
                options={{
                    title: "",
                    headerRight: () => (
                        <HeaderRight
                            actions={headerActions}
                            options={headerOptions}
                        />
                    )
                }}
            />
            <ScrollView
                className="flex-1 p-4 bg-card"
                contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
            >
                {isLoadingIssue ? <HeaderSkeleton /> :
                    <IssueHeader issue={issue} />
                }

                {isLoadingIssue ? <CommentSkeleton /> :
                    <IssueComment issue={issue} />
                }

                {isLoadingLinkedIssues ? <LinkedItemSkeleton /> :
                    <LinkedIssuesSection
                        title="Linked Items"
                        array={linkedIssues}
                        empty={
                            <Text className="mt-2 text-white">
                                Link issues together to show that they're
                                related.
                            </Text>
                        }
                    />
                }

                {isLoadingRelatedMergeRequests ? <LinkedItemSkeleton /> :
                    <LinksMergeRequestsSection
                        title="Related merge requests"
                        array={relatedMRs}
                        empty={
                            <Text className="mt-2 text-white">
                                Related merge requests will appear here.
                            </Text>
                        }
                    />
                }

                <Text className="text-4xl font-bold text-white">Events</Text>
                {isLoadingNotes ? <NotesSkeleton /> :
                    <IssueNotes notes={notes} />
                }

                <Separator className="my-4" />
                {isLoadingIssue ? <CommentSkeleton /> :
                    <CreateDiscussion issue={issue} />
                }

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
