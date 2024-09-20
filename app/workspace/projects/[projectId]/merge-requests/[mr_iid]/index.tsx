import IssueNotes from "@/components/Issue/issue-note";
import Loading from "@/components/Loading";
import MergeRequestComment from "@/components/MergeRequest/mr-comment";
import MergeRequestHeader from "@/components/MergeRequest/mr-header";
import { Pills } from "@/components/Pills";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Text } from "@/components/ui/text";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { formatDate } from "@/lib/utils";
import { Ionicons } from '@expo/vector-icons';
import { Label } from "@rn-primitives/select";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Platform, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { LinearTransition } from "react-native-reanimated";
import { headerRightProjectMr } from "./headerRight";


function CommitItem({ commit }) {
    const [isOpen, setIsOpen] = useState(false);
    const initials = commit.author_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <>
            <Collapsible className="mb-3" asChild open={isOpen} onOpenChange={setIsOpen}>
                <Animated.View layout={Platform.OS !== 'web' ? LinearTransition : undefined}>
                    <CollapsibleTrigger>
                        <View
                            className="flex-row items-center justify-between py-2"
                        >
                            <View className="flex-row items-center">
                                {/* <Ionicons name="chevron-back-circle" size={20} color={"white"} /> */}
                                <Ionicons name="git-commit-outline" size={16} color="gray" />

                                <Text className="ml-2 text-white">{commit.title}</Text>

                            </View>
                            <Ionicons
                                name={isOpen ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="gray"
                            />
                        </View>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <View className="flex-row items-center p-2">
                            <Avatar alt={`${commit.author_name}'s Avatar`}>
                                <AvatarImage source={{ uri: `https://www.gravatar.com/avatar/${commit.author_email}?d=identicon` }} />
                                <AvatarFallback>
                                    <Text>{initials}</Text>
                                </AvatarFallback>
                            </Avatar>
                            <View className="flex-1 ml-3">
                                <Text className="mt-2 text-xs text-gray-400">
                                    Committed on {format(new Date(commit.committed_date), 'MMM d, yyyy HH:mm')}
                                </Text>
                                <Text className="font-semibold text-white">{commit.author_name}</Text>
                            </View>
                        </View>
                    </CollapsibleContent>
                </Animated.View>
            </Collapsible>
        </>
    );
}


function CommitsSection({ commits, changeSummaries }) {
    return (
        <View className="p-3 mb-4 rounded-lg bg-card-600">
            <Text className="mb-4 text-lg font-semibold text-white">Commits</Text>
            {commits.length > 0 ? (
                <Text className="ml-2 text-sm text-muted">
                    There is {`${commits.length} commit${commits.length === 1 ? '' : 's'}`} in this merge request.
                </Text>
            ) :
                <Text className="ml-2 text-sm text-muted">
                    There is no commit in this merge request.
                </Text>
            }

            {commits && commits.map((commit, index) => (
                <CommitItem key={index} commit={commit} />
            ))}
        </View>
    );
}

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

const getMergeStatusText = (status: string): string => {
    switch (status) {
        case 'can_be_merged':
            return 'Can be merged';
        case 'cannot_be_merged':
            return 'Cannot be merged';
        case 'unchecked':
            return 'Not checked';
        case 'checking':
            return 'Checking';
        default:
            return 'Unknown status';
    }
};
const getMergeStatusColor = (status: string): string => {
    switch (status) {
        case 'can_be_merged':
            return 'green';
        case 'cannot_be_merged':
            return 'red';
        case 'unchecked':
        case 'checking':
            return 'yellow';
        default:
            return 'gray';
    }
};

const StatusSection = ({ mr }) => (
    <View className="p-3 mb-4 rounded-lg bg-card-600">
        <Text className="mb-2 text-lg font-semibold text-white">Status</Text>

        <StatusItem
            icon="git-merge-outline"
            text={getMergeStatusText(mr.merge_status)}
            color={getMergeStatusColor(mr.merge_status)}
        />

        {/* <StatusItem
            icon="git-branch-outline"
            text={`Source: ${mr.source_branch}`}
            color="blue"
        />

        <StatusItem
            icon="git-branch-outline"
            text={`Target: ${mr.target_branch}`}
            color="purple"
        /> */}

        <StatusItem
            icon="chatbubble-outline"
            text={`${mr.user_notes_count} comments`}
            color="gray"
        />

        <StatusItem
            icon="time-outline"
            text={`Created: ${format(new Date(mr.created_at), 'MMM d, yyyy')}`}
            color="purple"
        />

        {mr.labels.length > 0 && (
            <StatusItem
                icon="pricetag-outline"
                text={
                    <View className="flex-row flex-wrap items-center">
                        <Text className="mr-2 text-white">Labels:</Text>
                        {mr.labels.map((label, index) => (
                            <View key={index} className="mb-1 mr-2">
                                <Pills
                                    key={index}
                                    label={label}
                                    variant="#000"
                                />
                            </View>
                        ))}
                    </View>
                }
                color="orange"
            />
        )}
    </View>
);

function ActionButtons({ mr, onMerge, onClose, onReopen }) {
    const [deleteSourceBranch, setDeleteSourceBranch] = useState(false);
    const [squashCommits, setSquashCommits] = useState(false);
    const [editCommitMessage, setEditCommitMessage] = useState(false);

    const handleDeleteSourceBranch = () => {
        setDeleteSourceBranch((prev) => !prev);
        // Add any additional logic here
    };

    const handleSquashCommits = () => {
        setSquashCommits((prev) => !prev);
        // Add any additional logic here
    };

    const handleEditCommitMessage = () => {
        setEditCommitMessage((prev) => !prev);
        // Add any additional logic here
    };
    return <View className="p-3 mb-4 rounded-lg bg-card-600">

        {mr.mr.state === 'open' ? <Text className="mb-2 text-lg font-semibold text-white">Ready to merge!</Text> : <Text className="mb-2 text-lg font-semibold text-danger">Merge request is closed</Text>}

        {mr.mr.state === 'open' && (
            <>
                <View className='justify-center flex-1 gap-4 p-2'>
                    <View className='flex-row items-center gap-3'>
                        <Checkbox
                            aria-labelledby='delete-source-branch'
                            checked={deleteSourceBranch}
                            onCheckedChange={setDeleteSourceBranch}
                        />
                        <Label nativeID='delete-source-branch' className="text-white" onPress={() => setDeleteSourceBranch((prev) => !prev)}>
                            Delete source branch
                        </Label>
                    </View>
                    <View className='flex-row items-center gap-3'>
                        <Checkbox
                            aria-labelledby='squash-commits'
                            checked={squashCommits}
                            onCheckedChange={setSquashCommits}
                        />
                        <Label nativeID='squash-commits' className="text-white" onPress={() => setSquashCommits((prev) => !prev)}>
                            Squash commits
                        </Label>
                    </View>
                    <View className='flex-row items-center gap-3'>
                        <Checkbox
                            aria-labelledby='edit-commit-message'
                            checked={editCommitMessage}
                            onCheckedChange={setEditCommitMessage}
                        />
                        <Label nativeID='edit-commit-message' className="text-white" onPress={() => setEditCommitMessage((prev) => !prev)}>
                            Edit commit message
                        </Label>
                    </View>
                </View>

                <Text className="mb-3 text-sm text-gray-400">
                    {mr.commits?.length} commit will be added to {mr.mr.target_branch}.
                </Text>
                <TouchableOpacity
                    className="px-4 py-2 bg-blue-600 rounded-md"
                    onPress={onMerge}
                >
                    <Text className="text-center text-white">Merge</Text>
                </TouchableOpacity>
            </>
        )}

        {mr.state === 'closed' && (
            <TouchableOpacity
                className="px-4 py-2 bg-blue-600 rounded-md"
                onPress={onReopen}
            >
                <Text className="text-center text-white">Reopen</Text>
            </TouchableOpacity>
        )}
    </View>
}

const ChangesSection = ({ mr, changeSummaries }) => {

    const { totalAdditions, totalDeletions, newFiles, modifiedFiles, renamedFiles, deletedFiles } = changeSummaries

    return (
        <View className="p-3 mb-4 rounded-lg bg-card-600">
            <Text className="mb-2 text-lg font-semibold text-white">Changes</Text>
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Ionicons name="document-text-outline" size={16} color="white" />
                    <Text className="ml-2 text-white">
                        {mr.changes_count || "No"} files changed
                    </Text>
                </View>
                <View className="flex-row">
                    <Text className="mr-2 text-success">+{totalAdditions}</Text>
                    <Text className="text-danger">-{totalDeletions}</Text>
                </View>
            </View>
            <View className="mt-2">
                <Text className="text-sm text-white">
                    {newFiles} new, {deletedFiles} deleted, {modifiedFiles} modified
                </Text>
            </View>
            <Text className="mt-1 text-sm text-muted">
                Last updated: {formatDate(mr.updated_at)}
            </Text>
            {mr.has_conflicts && (
                <Text className="mt-2 text-sm text-danger">
                    This merge request has conflicts
                </Text>
            )}
            {mr.draft && (
                <Text className="mt-2 text-sm text-warning">
                    This is a draft merge request
                </Text>
            )}
        </View>
    );
};



// const ChangesSection = ({ mr }) => (
//     <View className="p-3 mb-4 rounded-lg bg-card-600">
//         <Text className="mb-2 text-lg font-semibold text-white">Changes</Text>
//         <View className="flex-row items-center justify-between">
//             <View className="flex-row items-center">
//                 <Ionicons name="document-text-outline" size={16} color="white" />
//                 <Text className="ml-2 text-white">
//                     {mr.changes_count || "No"} files changed
//                 </Text>
//             </View>
//             <View className="flex-row">
//                 <Text className="mr-2 text-green-500">+{mr.additions || 18}</Text>
//                 <Text className="text-danger">-{mr.deletions || 0}
//                     GET /projects/:id/merge_requests/:merge_request_iid/versions/:version_id



//                 </Text>
//             </View>
//         </View>
//         <Text className="mt-1 text-sm text-muted">
//             You reviewed these changes 1y ago.
//             {mr.updated_at}
//         </Text>
//         <View className="flex flex-row items-center justify-between mb-2">


//         </View>
//     </View>
// );



const api = axios.create({
    baseURL: "https://gitlab.com/api/v4/",
    headers: { 'PRIVATE-TOKEN': "GITLAB_PAT_REMOVED" },
});

const calculateFileChanges = (change) => {
    // Default values
    let additions = 0;
    let deletions = 0;
    let status = 'modified';

    if (change.new_file) {
        status = 'new';
        additions = change.new_lines || 0;
    } else if (change.deleted_file) {
        status = 'deleted';
        deletions = change.old_lines || 0;
    }
    // Extract information from @@ patterns
    const chunkHeaders = change.diff.match(/@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@/g);

    if (chunkHeaders) {
        chunkHeaders.forEach(header => {
            const [, oldStart, oldLines, newStart, newLines] = header.match(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);

            deletions += parseInt(oldLines) || 0;
            additions += parseInt(newLines) || 0;
        });
    }
    return {
        additions,
        deletions,
        total_changes: additions + deletions,
        status
    };
};



const fetchMergeRequestDetails = async (projectId, mergeRequestIid) => {
    try {
        const [mergeRequest, commits, notes, changes] = await Promise.all([
            api.get(`/projects/${projectId}/merge_requests/${mergeRequestIid}`),
            api.get(`/projects/${projectId}/merge_requests/${mergeRequestIid}/commits`),
            api.get(`/projects/${projectId}/merge_requests/${mergeRequestIid}/notes`),
            api.get(`/projects/${projectId}/merge_requests/${mergeRequestIid}/changes`),
        ]);

        const fileChanges = changes.data.changes.map(change => ({
            file_path: change.new_path || change.old_path,
            // ...calculateFileChanges(change)
        }));
        console.log('File changes:', fileChanges); // Add this for debugging

        return {
            mr: mergeRequest.data,
            commits: commits.data,
            notes: notes.data,
            changes: changes.data,
            fileChanges: fileChanges
        };
    } catch (error) {
        console.error('Error fetching merge request details:', error.message);
        throw error;
    }
};


const useMergeRequestDetails = (projectId, mergeRequestIid) => {
    return useQuery({
        queryKey: ['mergeRequestDetails', projectId, mergeRequestIid],
        queryFn: () => fetchMergeRequestDetails(projectId, mergeRequestIid),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};


export default function MergeRequestDetails() {
    const { projectId, mr_iid } = useLocalSearchParams();
    const { session } = useSession()
    const router = useRouter();

    const api = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });
    // Delete Merge Request
    const deleteMergeRequest = async () => {
        try {
            router.push(`/workspace/projects/${projectId}/merge-requests/list`);
            await api.deleteMergeRequest(projectId, mr_iid);
        } catch (error) {
            console.error("Error deleting merge request:", error);
        }
    };

    // Close Merge Request
    const closeMergeRequest = async () => {
        try {
            await api.updateMergeRequest(projectId, mr_iid, {
                state_event: "close",
            });
            // router.push(`/projects/${projectId}`);
        } catch (error) {
            console.error("Error closing merge request:", error);
        }
    }

    // Reopening Merge Request
    const reopenMergeRequest = async () => {
        try {
            await api.updateMergeRequest(projectId, mr_iid, {
                state_event: "reopen",
            });
            // router.push(`/projects/${projectId}`);
        } catch (error) {
            console.error("Error reopening merge request:", error);
        }
    }

    const params = {
        path: {
            id: projectId,
            mr_iid: mr_iid,
        },
    };

    // const { data: mr, isLoading, isError, error } = useGetData(
    //     ["project_merge_request", params.path],
    //     `/api/v4/projects/{id}/merge_requests/{mr_iid}`,
    //     params,
    // );
    const { data: mr, isLoading, isError, error } = useMergeRequestDetails(projectId, mr_iid);




    // console.log("Merge Request", mr.notes)
    if (isLoading) return <Loading />;
    if (isError) return <Text className="text-white">Error: {error.message}</Text>;

    const fileChanges = mr?.changes.changes.map(change => calculateFileChanges(change));
    const changeSummaries = {
        newFiles: fileChanges.filter(file => file.status === 'new').length,
        deletedFiles: fileChanges.filter(file => file.status === 'deleted').length,
        modifiedFiles: fileChanges.filter(file => file.status === 'modified').length,
        totalAdditions: fileChanges.reduce((sum, file) => sum + file.additions, 0),
        totalDeletions: fileChanges.reduce((sum, file) => sum + file.deletions, 0),
    }
    return (
        <>
            <SafeAreaView className="flex-1">
                <Stack.Screen
                    options={{
                        title: "",
                        headerRight: headerRightProjectMr(reopenMergeRequest, closeMergeRequest, deleteMergeRequest, mr.mr),
                    }}
                />
                <ScrollView
                    className="flex-1 p-4 bg-card"
                    contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
                >
                    <MergeRequestHeader mr={mr.mr} />
                    <MergeRequestComment mr={mr.mr} projectId={projectId} />
                    <ChangesSection mr={mr.mr} changeSummaries={changeSummaries} />

                    {/* <View className="mb-4">
                        <Text className="mb-2 font-semibold text-white">Changes</Text>
                        <View className="p-3 bg-gray-800 rounded-md">
                            <Text className="text-white">2 files changed</Text>
                            <Text className="text-green-500">+18</Text>
                            <Text className="text-danger">-2</Text>
                        </View>
                    </View> */}

                    <CommitsSection commits={mr?.commits} fileChanges={changeSummaries} />
                    <StatusSection mr={mr.mr} />
                    <ActionButtons
                        mr={mr}
                        onMerge={() => {/* Implement merge logic */ }}
                        onClose={closeMergeRequest}
                        onReopen={reopenMergeRequest}
                    />

                    <IssueNotes notes={mr.notes} />
                </ScrollView>
            </SafeAreaView>
        </>
    );
}