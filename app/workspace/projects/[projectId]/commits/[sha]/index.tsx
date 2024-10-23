import { HeaderAction, HeaderOption, HeaderRight } from '@/components/HeaderRight';
import { StatusItem } from '@/components/StatusItems';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { formatDate, shareView } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

const getCommitStatusText = (status: string): string => {
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
const getCommitStatusColor = (status: string): string => {
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

const StatusSection = ({ projectId, commit }) => (
    <View className="p-3 mb-4 rounded-lg bg-card-600">

        <StatusItem
            icon="git-commit-outline"
            text={
                <>
                    Parent:{' '}
                    {commit?.parent_ids?.map((parentId, index) => (
                        <>
                            {index > 0 && ', '}
                            <Link
                                style={{ color: '#0085CA', fontWeight: 'bold' }}
                                href={`/workspace/projects/${projectId}/commits/${parentId}`}>
                                {parentId.substring(0, 7)}
                            </Link>
                        </>
                    ))}
                </>
            }
            color="gray"
        />

        <StatusItem
            icon="person-outline"
            text={`Author: ${commit.author_name}`}
            color="green"
        />

        <StatusItem
            icon="time-outline"
            text={`Authored: ${formatDate(new Date(commit.authored_date), 'MMM d, yyyy HH:mm')}`}
            color="purple"
        />

        <StatusItem
            icon="git-merge-outline"
            text={
                <Text>
                    Changes: <Text style={{ color: 'green' }}>+{commit.stats.additions}</Text>{' '}
                    <Text style={{ color: 'red' }}>-{commit.stats.deletions}</Text>
                </Text>
            }
            color="orange"
        />
    </View>
);
const ChangesSection = ({ commit, changeSummaries }) => {

    const { totalAdditions, totalDeletions, newFiles, modifiedFiles, deletedFiles } = changeSummaries

    return (
        <View className="p-3 mb-4 rounded-lg bg-card-600">
            <Text className="mb-2 text-lg font-semibold text-white">Changes</Text>
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Ionicons name="document-text-outline" size={16} color="white" />
                    <Text className="ml-2 text-white">
                        {commit.changes_count || "No"} files changed
                    </Text>
                </View>
                <View className="flex-row">
                    <Text className="commit-2 text-success-500">+{totalAdditions}</Text>
                    <Text className="text-danger">-{totalDeletions}</Text>
                </View>
            </View>
            <View className="mt-2">
                <Text className="text-sm text-white">
                    {newFiles} new, {deletedFiles} deleted, {modifiedFiles} modified
                </Text>
            </View>
            <Text className="mt-1 text-sm text-muted">
                Last updated: {formatDate(commit.updated_at)}
            </Text>
            {commit.has_conflicts && (
                <Text className="mt-2 text-sm text-danger">
                    This merge request has conflicts
                </Text>
            )}
            {commit.draft && (
                <Text className="mt-2 text-sm text-warning">
                    This is a draft merge request
                </Text>
            )}
        </View>
    );
};

export default function Commit() {
    const { projectId, sha } = useLocalSearchParams();

    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });
    const api = useGitLab(client);

    const { data: commit, error, isLoading, isError, refetch } = api.useProjectCommit(projectId, sha);
    console.log("🚀 ~ Commit ~ commit:", commit)

    const handleRevert = () => console.log("revert")
    const handleCherryPick = () => console.log("cherry")
    const handleTag = () => console.log("tag")
    const handleDownloads = () => console.log("download")
    const handlePatches = () => console.log("download")
    const handlePlainDiff = () => console.log("download")

    const headerActions: HeaderAction[] = [
        {
            icon: "share-social-outline",
            onPress: () => shareView(mr?.web_url),
            testID: "share-mr-button"
        }
    ];
    const headerOptions: HeaderOption[] = [
        {
            icon: "refresh-outline",
            label: "Revert",
            onPress: () => handleRevert(),
            testID: "revert-option"
        },
        {
            icon: "git-cherry-pick-outline",
            label: "Cherry-pick",
            onPress: () => handleCherryPick(),
            testID: "cherry-pick-option"
        },
        {
            icon: "pricetag-outline",
            label: "Tag",
            onPress: () => handleTag(),
            testID: "tag-option"
        },
        {
            icon: "download-outline",
            label: "Downloads",
            onPress: () => handleDownloads(),
            testID: "downloads-option"
        },
        {
            icon: "code-outline",
            label: "Patches",
            onPress: () => handlePatches(),
            testID: "patches-option"
        },
        {
            icon: "diff-outline",
            label: "Plain Diff",
            onPress: () => handlePlainDiff(),
            testID: "plain-diff-option"
        }
    ];
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
                <View className="mb-4">
                    <Text className="mb-2 font-bold text-md text-muted" >
                        {commit?.short_id}
                    </Text>
                    <Text className="mb-2 text-4xl font-bold text-white" >
                        {commit?.title}
                    </Text>

                </View>

                {isLoading ?
                    <View className="flex-col p-3 mb-4 rounded-lg bg-card-600">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <View key={index} className="flex-row">
                                <Skeleton className="w-4 h-4 mr-2 space-x-4 rounded-full bg-muted" />
                                <Skeleton className="w-3/4 h-4 mb-2 bg-muted" />
                            </View>
                        ))}
                    </View>
                    :
                    <StatusSection commit={commit} projectId={projectId} />
                }
            </ScrollView>
        </SafeAreaView>
    );
}
