import Loading from "@/components/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { useGetData } from "@/lib/gitlab/hooks";
import { formatDate } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
const mrExamples = {
    "id": 155016530,
    "iid": 133,
    "project_id": 15513260,
    "title": "Manual job rules",
    "description": "",
    "state": "opened",
    "imported": false,
    "imported_from": "none",
    "created_at": "2022-05-13T07:26:38.402Z",
    "updated_at": "2022-05-14T03:38:31.354Z",
    "merged_by": null, // Deprecated and will be removed in API v5. Use `merge_user` instead.
    "merge_user": null,
    "merged_at": null,
    "prepared_at": "2018-09-04T11:16:17.520Z",
    "closed_by": null,
    "closed_at": null,
    "target_branch": "main",
    "source_branch": "manual-job-rules",
    "user_notes_count": 0,
    "upvotes": 0,
    "downvotes": 0,
    "author": {
        "id": 4155490,
        "username": "marcel.amirault",
        "name": "Marcel Amirault",
        "state": "active",
        "avatar_url": "https://gitlab.com/uploads/-/system/user/avatar/4155490/avatar.png",
        "web_url": "https://gitlab.com/marcel.amirault"
    },
    "assignees": [],
    "assignee": null,
    "reviewers": [],
    "source_project_id": 15513260,
    "target_project_id": 15513260,
    "labels": [],
    "draft": false,
    "work_in_progress": false,
    "milestone": null,
    "merge_when_pipeline_succeeds": false,
    "merge_status": "can_be_merged",
    "detailed_merge_status": "can_be_merged",
    "sha": "e82eb4a098e32c796079ca3915e07487fc4db24c",
    "merge_commit_sha": null,
    "squash_commit_sha": null,
    "discussion_locked": null,
    "should_remove_source_branch": null,
    "force_remove_source_branch": true,
    "reference": "!133", // Deprecated. Use `references` instead.
    "references": {
        "short": "!133",
        "relative": "!133",
        "full": "marcel.amirault/test-project!133"
    },
    "web_url": "https://gitlab.com/marcel.amirault/test-project/-/merge_requests/133",
    "time_stats": {
        "time_estimate": 0,
        "total_time_spent": 0,
        "human_time_estimate": null,
        "human_total_time_spent": null
    },
    "squash": false,
    "task_completion_status": {
        "count": 0,
        "completed_count": 0
    },
    "has_conflicts": false,
    "blocking_discussions_resolved": true,
    "approvals_before_merge": null, // deprecated, use [Merge request approvals API](merge_request_approvals.md)
    "subscribed": true,
    "changes_count": "1",
    "latest_build_started_at": "2022-05-13T09:46:50.032Z",
    "latest_build_finished_at": null,
    "first_deployed_to_production_at": null,
    "pipeline": { // Use `head_pipeline` instead.
        "id": 538317940,
        "iid": 1877,
        "project_id": 15513260,
        "sha": "1604b0c46c395822e4e9478777f8e54ac99fe5b9",
        "ref": "refs/merge-requests/133/merge",
        "status": "failed",
        "source": "merge_request_event",
        "created_at": "2022-05-13T09:46:39.560Z",
        "updated_at": "2022-05-13T09:47:20.706Z",
        "web_url": "https://gitlab.com/marcel.amirault/test-project/-/pipelines/538317940"
    },
    "head_pipeline": {
        "id": 538317940,
        "iid": 1877,
        "project_id": 15513260,
        "sha": "1604b0c46c395822e4e9478777f8e54ac99fe5b9",
        "ref": "refs/merge-requests/133/merge",
        "status": "failed",
        "source": "merge_request_event",
        "created_at": "2022-05-13T09:46:39.560Z",
        "updated_at": "2022-05-13T09:47:20.706Z",
        "web_url": "https://gitlab.com/marcel.amirault/test-project/-/pipelines/538317940",
        "before_sha": "1604b0c46c395822e4e9478777f8e54ac99fe5b9",
        "tag": false,
        "yaml_errors": null,
        "user": {
            "id": 4155490,
            "username": "marcel.amirault",
            "name": "Marcel Amirault",
            "state": "active",
            "avatar_url": "https://gitlab.com/uploads/-/system/user/avatar/4155490/avatar.png",
            "web_url": "https://gitlab.com/marcel.amirault"
        },
        "started_at": "2022-05-13T09:46:50.032Z",
        "finished_at": "2022-05-13T09:47:20.697Z",
        "committed_at": null,
        "duration": 30,
        "queued_duration": 10,
        "coverage": null,
        "detailed_status": {
            "icon": "status_failed",
            "text": "failed",
            "label": "failed",
            "group": "failed",
            "tooltip": "failed",
            "has_details": true,
            "details_path": "/marcel.amirault/test-project/-/pipelines/538317940",
            "illustration": null,
            "favicon": "/assets/ci_favicons/favicon_status_failed-41304d7f7e3828808b0c26771f0309e55296819a9beea3ea9fbf6689d9857c12.png"
        }
    },
    "diff_refs": {
        "base_sha": "1162f719d711319a2efb2a35566f3bfdadee8bab",
        "head_sha": "e82eb4a098e32c796079ca3915e07487fc4db24c",
        "start_sha": "1162f719d711319a2efb2a35566f3bfdadee8bab"
    },
    "merge_error": null,
    "first_contribution": false,
    "user": {
        "can_merge": true
    },
    "approvals_before_merge": { // Available for GitLab Premium and Ultimate tiers only
        "id": 1,
        "title": "test1",
        "approvals_before_merge": null
    },
}

export default function MergeRequestDetails() {
    const { projectId, mr_iid } = useLocalSearchParams();

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
        error,
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

    if (isLoading) {
        return <Loading />
    }
    if (isError) {
        return <Error error={error} />
    }


    return (
        <>
            {/* https://docs.gitlab.com/ee/api/merge_requests.html */}
            <Stack.Screen
                options={{
                    // title: "Merge Request Details",
                    headerTitle: props => (
                        <View className="flex flex-col justify-center">
                            <Text className="text-xl font-bold">{mr.title}</Text>
                            <Text className="text-sm text-gray-500">{mr.references.full}</Text>
                        </View>)
                    ,
                }}
            />
            <ScrollView className="min-h-screen p-4 bg-gray-100">
                <View className="max-w-xl p-4 mb-6 bg-white rounded-lg shadow-md">
                    {/* <Text className="mb-2 text-2xl font-bold">
                        {mr.title}
                    </Text> */}
                    <View className="flex flex-row items-center justify-between mb-2">
                        {/* {MergeRequestStatusIcon(mr.state, true)} */}
                        <Text className="px-2 bg-gray-300 border-b border-gray-300 rounded-md">
                            {mr.state}
                        </Text>
                        <View className="flex flex-row items-center">
                            <Text className="px-2 bg-blue-100 border-b border-gray-300 rounded-md">
                                {mr.source_branch}
                            </Text>
                            <Ionicons name="arrow-forward" size={16} color="black" />
                            <Text className="px-2 bg-blue-100 border-b border-gray-300 rounded-md">
                                {mr.target_branch}
                            </Text>
                        </View>
                    </View>


                    {/* Header with repository information */}
                    <View className={"flex justify-between mb-6 flex-row"}>
                        <View className={"flex flex-row items-center"}>
                            <Avatar alt={`${mr?.author?.name}`}
                                className="mr-2"
                            >
                                <AvatarImage source={{ uri: mr?.author.avatar_url }} />
                                <AvatarFallback>
                                    <Text>{mr?.author?.name.charAt(0)}</Text>
                                </AvatarFallback>
                            </Avatar>
                            <Text className="mr-2 text-sm font-semibold">
                                {mr?.author?.username}
                            </Text>
                            <Text className="mr-2 text-sm text-gray-400">
                                {/* opened MR #{mr?.iid}*/}
                                - {formatDate(mr?.created_at)}
                                {/* # {mr.project_id} */}
                            </Text>
                        </View>
                        {/* <Button
                            variant={"outline"}
                            size={"sm"}
                        >
                            <Text className={"mr-2"}>Watch</Text>
                        </Button> */}
                    </View>
                    <View className="mb-6">
                        <Text className="mb-2">{mr.description}</Text>
                    </View>
                </View >
                <View className="max-w-xl p-4 mb-6 bg-white rounded-lg shadow-md">
                    <Text className="mb-2 text-lg font-semibold">
                        Changes
                    </Text>
                    <View className="flex flex-row items-center justify-between mb-2">
                        {/* <Text className="text-sm text-gray-400">

                                {mr?.changes_count} changes
                            </Text> */}
                        < View className="flex flex-row items-center" >
                            {/* Filetitle */}
                            <Ionicons name="document" size={16} />

                            <Text className="ml-1 text-sm text-gray-400">
                                18 files changed
                            </Text>
                            < View className="*:ml-1 flex flex-row items-center" >
                                <Text className="ml-1 text-sm text-green-400">
                                    18
                                </Text>
                                <Text className="ml-1 text-sm text-red-400">
                                    -2
                                </Text>

                            </View>
                        </View>
                        <View className="flex flex-row items-center">
                            {mr?.diverged_commits_count &&
                                <>
                                    < Ionicons name="git-commit" size={16} />
                                    <Text className="mr-2 text-sm text-gray-400">
                                        {mr?.diverged_commits_count} commits
                                    </Text>
                                </>
                            }
                        </View>
                        {/* Changes cards */}


                    </View>
                </View>
                {/* <View className="max-w-xl p-4 mb-6 bg-white rounded-lg shadow-md">
                    <Text className="mb-2 text-lg font-semibold">
                        Status
                    </Text>
                </View>

                <View className="max-w-xl p-4 mb-6 bg-white rounded-lg shadow-md">
                    <Text className="mb-2 text-lg font-semibold">
                        Conversation
                    </Text>
                </View>
                <View className="max-w-xl p-4 mb-6 bg-white rounded-lg shadow-md">
                    <Text className="mb-2 text-lg font-semibold">
                        Notifications
                    </Text>
                </View> */}





                {/* Pull request title and description */}
                {/* Status badge */}
                {/* <View className={'mb-6'}>
                        <Badge value="Open" status="success" textStyle={'text-lg px-3 py-1'} />
                    </View> */}

                {/* Branch and commit information */}
                {/* <View className={'flex items-center space-x-4 mb-6'}>
                        <View className={'flex items-center'}>
                            <Ionicons name="source-branch" size={20} className={'mr-2'} />
                            <Text>octocat:patch-1</Text>
                        </View>
                        <View className={'flex items-center'}>
                            <Ionicons name="source-commit" size={20} className={'mr-2'} />
                            <Text>2 commits</Text>
                        </View>
                        <View className={'flex items-center'}>
                            <Ionicons name="file-document-outline" size={20} className={'mr-2'} />
                            <Text>2 changed files</Text>
                        </View>
                    </View> */}

                {/* Separator */}
                {/* <View className={'my-6 border-t border-gray-300'} /> */}

                {/* File changes summary */}
                {/* <View className={'mb-6'}>
                        <Text className={'text-xl font-semibold mb-2'}>Files changed</Text>
                        <View className={'bg-muted p-4 rounded-md'}>
                            <Text>README.md (+15 -2)</Text>
                            <Text>CONTRIBUTING.md (+10 -0)</Text>
                        </View>
                    </View> */}

                {/* Reviewers section */}
                {/* <View className={'mb-6'}>
                        <Text className={'text-xl font-semibold mb-2'}>Reviewers</Text>
                        <View className={'flex items-center space-x-2'}>
                            <Avatar source={{ uri: 'https://github.com/shadcn.png' }} />
                            <Avatar source={{ uri: 'https://github.com/vercel.png' }} />
                            <Button mode="outline" icon="account-multiple">
                                <Text className={'mr-2'}>Add</Text>

                            </Button>
                        </View>
                    </View> */}

                {/* Labels section */}
                {/* <View className={'mb-6'}>
                        <Text className={'text-xl font-semibold mb-2'}>Labels</Text>
                        <View className={'flex items-center space-x-2'}>
                            <Badge value="documentation" status="secondary" />
                            <Badge value="enhancement" status="secondary" />
                            <Button mode="outline" icon="tag">
                                <Text className={'mr-2'}>Add</Text>
                            </Button>
                        </View>
                    </View> */}

                {/* Separator */}
                {/* <View className={'my-6 border-t border-gray-300'} /> */}

                {/* Merge and Close buttons */}
                {/* <View className={'flex justify-between mb-6'}>
                        <Button mode="contained" className={'bg-green-600'}>
                            <Text className={'mr-2'}>Merge pull request</Text>

                        </Button>
                        <Button mode="contained" className={'bg-red-600'}>
                            <Text className={'mr-2'}>Close pull request</Text>
                        </Button>
                    </View> */}

                {/* Comment section */}
                {/* <View className={'mb-6'}>
                        <Text className={'text-xl font-semibold mb-2'}>
                            Leave a comment</Text>
                        <TextInput placeholder="Type your comment here." />
                        <Button mode="contained" className={'mt-2'}>
                            <Text className={'mr-2'}>Comment</Text>
                        </Button>
                    </View> */}

                {/* Timeline of events */}
                {/* <View>
                        <Text className={'text-xl font-semibold mb-2'}>Timeline</Text>
                        <View className={'space-y-4'}>
                            <View className={'flex items-start'}>
                                <Ionicons name="clock-outline" size={20} className={'mr-2 mt-1'} />
                                <View>
                                    <Text className={'font-semibold'}>octocat opened this pull request 2 hours ago</Text>
                                    <Text className={'text-muted-foreground'}>1 commit with 25 additions and 2 deletions</Text>
                                </View>
                            </View>
                            <View className={'flex items-start'}>
                                <Ionicons name="message-text-outline" size={20} className={'mr-2 mt-1'} />
                                <View>
                                    <Text className={'font-semibold'}>shadcn commented 1 hour ago</Text>
                                    <Text>Looks good to me! Ready for review.</Text>
                                </View>
                            </View>
                        </View>
                    </View> */}


            </ScrollView >
        </>
    );
}
