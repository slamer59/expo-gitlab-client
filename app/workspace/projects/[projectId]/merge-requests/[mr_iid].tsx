import Loading from "@/components/Loading";
import MergeStatusIcon from "@/components/MergeRequest/mr-status-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { useGetData } from "@/lib/gitlab/hooks";
import { formatDate } from "@/lib/utils";
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';


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

const CommitItem = ({ message }) => (
    <View className="flex-row items-center py-2 border-b border-gray-700">
        <Ionicons name="git-commit-outline" size={16} color="gray" />
        <Text className="ml-2 text-sm text-white">{message}</Text>
    </View>
);

const StatusItem = ({ icon, text, color, expandable, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View className="mb-2">
            <TouchableOpacity
                className="flex-row items-center justify-between py-2"
                onPress={() => expandable && setIsExpanded(!isExpanded)}
            >
                <View className="flex-row items-center">
                    <Ionicons name={icon} size={20} color={color} />
                    <Text className="ml-2 text-white">{text}</Text>
                </View>
                {expandable && (
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="gray"
                    />
                )}
            </TouchableOpacity>
            {isExpanded && children}
        </View>
    );
};

const StatusSection = ({ mr }) => (
    <View className="p-3 mb-4 bg-gray-800 rounded-lg">
        <Text className="mb-2 text-lg font-semibold text-white">Status</Text>

        <StatusItem
            icon="ellipse-outline"
            text="Reviews"
            color="gray"
            expandable={true}
        />

        <StatusItem
            icon="checkmark-circle"
            text="Checks"
            color="green"
            expandable={true}
        />

        <StatusItem
            icon="close-circle"
            text="Unable to merge"
            color="red"
            expandable={false}
        >
            <Text className="mt-1 ml-6 text-sm text-gray-400">
                A review is required.
            </Text>
        </StatusItem>
    </View>
);
const ConversationItem = ({ title }) => (
    <View className="flex-row items-center py-2 border-b border-gray-700">
        <Ionicons name="chatbubble-outline" size={16} color="gray" />
        <Text className="ml-2 text-sm text-white">{title}</Text>
    </View>
);


const ChangesSection = ({ mr }) => (
    <View className="p-3 mb-4 bg-gray-800 rounded-lg">
        <Text className="mb-2 text-lg font-semibold text-white">Changes</Text>
        <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
                <Ionicons name="document-text-outline" size={16} color="white" />
                <Text className="ml-2 text-white">
                    {mr.changes_count || 2} files changed
                </Text>
            </View>
            <View className="flex-row">
                <Text className="mr-2 text-green-500">+{mr.additions || 18}</Text>
                <Text className="text-red-500">-{mr.deletions || 2}</Text>
            </View>
        </View>
        <Text className="mt-1 text-sm text-gray-400">
            You reviewed these changes 1y ago.
        </Text>
    </View>
);

export default function MergeRequestDetails() {
    const { projectId, mr_iid } = useLocalSearchParams();

    const params = {
        path: {
            id: projectId,
            mr_iid: mr_iid,
        },
    };

    const { data: mr, isLoading, isError, error } = useGetData(
        ["project_merge_request", params.path],
        `/api/v4/projects/{id}/merge_requests/{mr_iid}`,
        params,
    );

    if (isLoading) return <Loading />;
    if (isError) return <Text className="text-white">Error: {error.message}</Text>;

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <View className="flex-col justify-center">
                            <Text className="text-lg font-bold text-white">{mr?.title}</Text>
                            <Text className="text-sm text-gray-400">{mr?.references?.full}</Text>
                        </View>
                    ),
                    headerRight: () => (
                        <View className="flex-row">
                            <TouchableOpacity className="mr-4">
                                <Ionicons name="share-outline" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Ionicons name="ellipsis-vertical" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />
            <ScrollView className="flex-1 bg-background">

                <View className="max-w-xl p-4 mb-6 rounded-lg shadow-md bg-card">
                    <View className="flex flex-row items-center justify-between mb-2">
                        {MergeStatusIcon(mr, true)}
                        <View className="flex flex-row items-center">
                            <Text className="px-2 border rounded-md bg-card border-muted">
                                {mr.source_branch}
                            </Text>
                            <Ionicons name="arrow-forward" size={16} color="gray" />
                            <Text className="px-2 border rounded-md border-muted bg-card">
                                {mr.target_branch}
                            </Text>
                        </View>
                    </View>

                    <View className="flex flex-row justify-between mb-6">
                        <View className="flex flex-row items-center">
                            <Avatar alt={`${mr?.author?.name}`} className="mr-2">
                                <AvatarImage source={{ uri: mr?.author.avatar_url }} />
                                <AvatarFallback>
                                    <Text>{mr?.author?.name.charAt(0)}</Text>
                                </AvatarFallback>
                            </Avatar>
                            <Text className="mr-2 text-sm font-semibold">
                                {mr?.author?.username}
                            </Text>
                            <Text className="mr-2 text-sm text-gray-400">
                                - {formatDate(mr?.created_at)}
                            </Text>
                        </View>
                    </View>
                    <View className="mb-6">
                        <Text className="mb-2">{mr.description}</Text>
                    </View>
                </View>

                <View className="max-w-xl p-4 mb-6 rounded-lg shadow-md bg-card">
                    <Text className="mb-2 text-lg font-semibold">
                        Changes
                    </Text>
                    <View className="flex flex-row items-center justify-between mb-2">
                        <View className="flex flex-row items-center">
                            <Ionicons name="document" size={16} color="white" />
                            <Text className="ml-1 text-sm text-muted">
                                18 files changed
                            </Text>
                            <View className="*:ml-1 flex flex-row items-center">
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
                                    <Ionicons name="git-commit" size={16} />
                                    <Text className="mr-2 text-sm text-gray-400">
                                        {mr?.diverged_commits_count} commits
                                    </Text>
                                </>
                            }
                        </View>
                    </View>
                </View>
                <View className="p-4">
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <Text className="mr-2 font-semibold text-green-500">Open</Text>
                            <Text className="text-gray-400">main → main</Text>
                        </View>
                        {MergeStatusIcon(mr, true)}
                    </View>

                    <View className="mb-4">
                        <Text className="mb-2 text-white">{mr?.description || "No description provided."}</Text>
                        <View className="flex-row items-center">
                            <Avatar className="w-6 h-6 mr-2">
                                <AvatarImage source={{ uri: mr?.author?.avatar_url }} />
                                <AvatarFallback>{mr?.author?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <Text className="text-gray-400">
                                {mr?.author?.name} opened {formatDate(mr?.created_at)}
                            </Text>
                        </View>
                    </View>
                    <ChangesSection mr={mr} />

                    {/* <View className="mb-4">
                        <Text className="mb-2 font-semibold text-white">Changes</Text>
                        <View className="p-3 bg-gray-800 rounded-md">
                            <Text className="text-white">2 files changed</Text>
                            <Text className="text-green-500">+18</Text>
                            <Text className="text-red-500">-2</Text>
                        </View>
                    </View> */}

                    <View className="mb-4">
                        <Text className="mb-2 font-semibold text-white">Commits</Text>
                        <View className="p-3 bg-gray-800 rounded-md">
                            <CommitItem message="Manual job rules" />
                            <CommitItem message="Update README.md" />
                            <CommitItem message="Initial commit" />
                        </View>
                    </View>
                    <StatusSection mr={mr} />

                    {/* <View className="mb-4">
                        <Text className="mb-2 font-semibold text-white">Status</Text>
                        <View className="p-3 bg-gray-800 rounded-md">
                            <StatusItem icon="checkmark-circle" text="Reviews" color="green" />
                            <StatusItem icon="checkmark-circle" text="Checks" color="green" />
                            <StatusItem icon="close-circle" text="Unable to merge" color="red" />
                        </View>
                    </View> */}

                    <View className="mb-4">
                        <Text className="mb-2 font-semibold text-white">Conversation</Text>
                        <View className="p-3 bg-gray-800 rounded-md">
                            <ConversationItem title="Allow APIRouter to be made from create_service" />
                            <ConversationItem title="Update README.md" />
                            <ConversationItem title="Merge pull request #1 from slamer59" />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}