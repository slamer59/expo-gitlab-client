import { HeaderAction, HeaderOption, HeaderRight } from "@/components/HeaderRight";
import IssueNotes from "@/components/Issue/issue-note";
import MergeRequestComment from "@/components/MergeRequest/mr-comment";
import MergeRequestHeader from "@/components/MergeRequest/mr-header";
import { Pills } from "@/components/Pills";
import { CommentSkeleton } from "@/components/Skeleton/comment";
import { HeaderSkeleton } from "@/components/Skeleton/header";
import NotesSkeleton from "@/components/Skeleton/notes";
import SectionSkeleton from "@/components/Skeleton/section";
import StatusItemSkeleton from "@/components/Skeleton/status";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Text } from "@/components/ui/text";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { formatDate, shareView } from "@/lib/utils";
import { Ionicons } from '@expo/vector-icons';
import { Label } from "@rn-primitives/select";
import { format } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Platform, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { LinearTransition } from "react-native-reanimated";


function CommitItem({ commit }) {
    const [isOpen, setIsOpen] = useState(false);
    const initials = commit?.author_name
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


function CommitsSection({ commits }) {
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

            {commits && commits?.map((commit, index) => (
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
            icon="git-pull-request-outline"
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

        {mr.state === 'open' ? <Text className="mb-2 text-lg font-semibold text-white">Ready to merge!</Text> : <Text className="mb-2 text-lg font-semibold text-danger">Merge request is closed</Text>}

        {mr.state === 'open' && (
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
                    {mr.commits?.length} commit will be added to {mr.target_branch}.
                </Text>
                <TouchableOpacity
                    className="px-4 py-2 bg-blue-600 rounded-md"
                    onPress={onMerge}
                >
                    <Text className="text-center text-white">Merge</Text>
                </TouchableOpacity>
            </>
        )}
    </View>
}

const ChangesSection = ({ mr, changeSummaries }) => {

    const { totalAdditions, totalDeletions, newFiles, modifiedFiles, deletedFiles } = changeSummaries

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
                    <Text className="mr-2 text-success-500">+{totalAdditions}</Text>
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


export default function MergeRequestDetails() {
    const { projectId, mr_iid } = useLocalSearchParams();
    const { session } = useSession()
    const router = useRouter();

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const [
        { data: mr, isLoading: isLoadingMR, error: errorMR },
        { data: commits, isLoading: isLoadingCommits, error: errorCommits },
        { data: notes, isLoading: isLoadingNotes, error: errorNotes },
        { data: changes, isLoading: isLoadingChanges, error: errorChanges },

    ] = api.useMergeRequestDetails(projectId, mr_iid);

    const updateMrMutation = api.useUpdateProjectMergeRequest();
    const deleteMrMutation = api.useDeleteProjectMergeRequest();

    const openMr = async () => updateMrMutation.mutateAsync(
        { projectId, mergeRequestIid: mr_iid, updateData: { state_event: 'reopen' } },
    );
    const closeMr = async () => updateMrMutation.mutateAsync(
        { projectId, mergeRequestIid: mr_iid, updateData: { state_event: 'close' } }
    );

    const deleteMr = async () => {
        await deleteMrMutation.mutateAsync(
            { projectId, mergeRequestIid: mr_iid },
            {
                onSuccess: () => {
                    router.back()
                },
            }
        );
    };
    if (errorMR || errorCommits || errorNotes || errorChanges) {
        return <Text>Error: {errorMR?.message || errorCommits?.message || errorNotes?.message || errorChanges?.message}</Text>;
    }

    const isLoading = isLoadingChanges || isLoadingCommits || isLoadingMR || isLoadingNotes;

    let fileChanges = null
    let changeSummaries = null
    if (!isLoading) {
        fileChanges = changes?.changes?.map(change => calculateFileChanges(change));
        changeSummaries = {
            newFiles: fileChanges?.filter(file => file.status === 'new').length,
            deletedFiles: fileChanges?.filter(file => file.status === 'deleted').length,
            modifiedFiles: fileChanges?.filter(file => file.status === 'modified').length,
            totalAdditions: fileChanges?.reduce((sum, file) => sum + file.additions, 0),
            totalDeletions: fileChanges?.reduce((sum, file) => sum + file.deletions, 0),
        }
    }

    const headerActions: HeaderAction[] = [
        {
            icon: "share-social-outline",
            onPress: () => shareView(mr?.web_url),
            testID: "share-mr-button"
        }
    ];

    const headerOptions: HeaderOption[] = [
        {
            icon: "pencil",
            label: "Edit Merge Request",
            onPress: () => router.push(`/workspace/projects/${projectId}/merge-requests/${mr_iid}/edit`),
            testID: "mr-edit-option"
        },
        {
            icon: mr?.state === 'opened' ? 'close-circle-outline' : 'checkmark-circle-outline',
            color: mr?.state === 'opened' ? 'red' : 'green',
            label: mr?.state === 'opened' ? 'Close Merge Request' : 'Reopen Merge Request',
            onPress: mr?.state === 'opened' ? closeMr : openMr,
            testID: "toggle-mr-state-option"
        },
        {
            icon: "trash-outline",
            color: "red",
            label: "Delete Merge Request",
            onPress: deleteMr,
            testID: "delete-mr-option"
        }
    ];

    return (
        <>
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
                    {isLoadingMR ?
                        <HeaderSkeleton /> :
                        <MergeRequestHeader mr={mr} />
                    }
                    {isLoadingMR ?
                        <CommentSkeleton /> :
                        <MergeRequestComment mr={mr} projectId={projectId} />
                    }
                    {isLoading ?
                        <SectionSkeleton /> :
                        <ChangesSection mr={mr} changeSummaries={changeSummaries} />
                    }

                    {/* <View className="mb-4">
                        <Text className="mb-2 font-semibold text-white">Changes</Text>
                        <View className="p-3 bg-gray-800 rounded-md">
                            <Text className="text-white">2 files changed</Text>
                            <Text className="text-green-500">+18</Text>
                            <Text className="text-danger">-2</Text>
                        </View>
                    </View> */}

                    {isLoadingCommits ?
                        <SectionSkeleton /> :
                        <CommitsSection commits={commits} /> //fileChanges={changeSummaries} />
                    }
                    {isLoadingMR ?
                        <StatusItemSkeleton /> :
                        <StatusSection mr={mr} />
                    }
                    {isLoadingMR ?
                        <SectionSkeleton /> :
                        <ActionButtons
                            mr={mr}
                            onMerge={() => { console.log("ok") }}
                            onClose={closeMr}
                            onReopen={openMr}
                        />
                    }
                    <Text className="text-4xl font-bold text-white">Events</Text>
                    {isLoadingNotes ? <NotesSkeleton /> : <IssueNotes notes={notes} />
                    }
                </ScrollView>
            </SafeAreaView>
        </>
    );
}