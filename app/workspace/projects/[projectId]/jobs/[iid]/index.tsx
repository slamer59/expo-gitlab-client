import { Ionicons } from '@expo/vector-icons';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';

import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { copyToClipboard } from '@/lib/utils';

import JobStatusIcon from '@/components/Pipeline/job-status-icon';
import { CommentSkeleton } from '@/components/Skeleton/comment';
import { HeaderSkeleton } from '@/components/Skeleton/header';
import { Text } from '@/components/ui/text';
import { headerRightProjectJob } from './headerRight';

function JobHeader({ job }) {
    return (
        <View className="p-4 mb-4 rounded-lg bg-card-600">
            <View className="flex-row items-center mb-2">
                <JobStatusIcon status={job.status} withText={true} />
                <Text className="ml-2 text-2xl font-bold text-white">{job.name}</Text>
            </View>
            <View className="flex-row items-center mb-2">
                <Ionicons name="git-branch-outline" size={20} color="gray" />
                <Text className="ml-2 text-sm text-muted">
                    Pipeline #{job.pipeline.id} for {job.ref}
                </Text>
            </View>
            <View className="flex-row items-center mb-2">
                <Ionicons name="time-outline" size={20} color="gray" />
                <Text className="ml-2 text-sm text-muted">
                    Started on {format(new Date(job.started_at || job.created_at), 'MMM d, yyyy HH:mm')}
                </Text>
            </View>
            {job.finished_at && (
                <View className="flex-row items-center mb-2">
                    <Ionicons name="checkmark-done-outline" size={20} color="gray" />
                    <Text className="ml-2 text-sm text-muted">
                        Finished on {format(new Date(job.finished_at), 'MMM d, yyyy HH:mm')}
                    </Text>
                </View>
            )}
            {job.duration && (
                <View className="flex-row items-center mb-2">
                    <Ionicons name="hourglass-outline" size={20} color="gray" />
                    <Text className="ml-2 text-sm text-muted">
                        Duration: {formatDuration(
                            intervalToDuration({ start: 0, end: job.duration * 1000 }),
                            { format: ['hours', 'minutes', 'seconds'] }
                        )}
                    </Text>
                </View>
            )}
            <View className="flex-row items-center mb-2">
                <Ionicons name="flag-outline" size={20} color="gray" />
                <Text className="ml-2 text-sm text-muted">
                    Stage: {job.stage}
                </Text>
            </View>
            {job.user && (
                <View className="flex-row items-center mb-2">
                    <Ionicons name="person-outline" size={20} color="gray" />
                    <Text className="ml-2 text-sm text-muted">
                        Triggered by: {job.user.name}
                    </Text>
                </View>
            )}
            {job.runner && (
                <View className="flex-row items-center mb-2">
                    <Ionicons name="hardware-chip-outline" size={20} color="gray" />
                    <Text className="ml-2 text-sm text-muted">
                        Runner: {job.runner.description || job.runner.id}
                    </Text>
                </View>
            )}
            {job.artifacts && job.artifacts.length > 0 && (
                <View className="flex-row items-center mb-2">
                    <Ionicons name="cube-outline" size={20} color="gray" />
                    <Text className="ml-2 text-sm text-muted">
                        Artifacts: {job.artifacts.length} available
                    </Text>
                </View>
            )}
        </View>
    );
}

function JobTrace({ trace }) {
    console.log("🚀 ~ JobTrace ~ trace:", trace)
    return (
        <View className="p-4 mb-4 rounded-lg bg-card-600">
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold text-white">Job Log</Text>
                <TouchableOpacity onPress={() => copyToClipboard(trace)}>
                    <Ionicons name="copy-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
            <View className="p-2 bg-black rounded-md">
                <ScrollView style={{ maxHeight: 500 }}>
                    <Text className="font-mono text-xs text-white whitespace-pre-wrap">
                        {trace}
                    </Text>
                </ScrollView>
            </View>
        </View>
    );
}

export default function JobDetails() {
    const { projectId, iid: jobId } = useLocalSearchParams();
    const { session } = useSession();
    const router = useRouter();

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const [
        { data: job, isLoading: isLoadingJob, error: errorJob },
        { data: trace, isLoading: isLoadingTrace, error: errorTrace },
    ] = api.useJobDetails(projectId, jobId);

    // Retry Job
    const retryJob = async () => {
        try {
            await api.useRetryJob({ projectId, jobId });
        } catch (error) {
            console.error("Error retrying job:", error);
        }
    };

    // Cancel Job
    const cancelJob = async () => {
        try {
            await client.Jobs.cancel(projectId, jobId);
        } catch (error) {
            console.error("Error cancelling job:", error);
        }
    };

    // Delete Job (Erase)
    const deleteJob = async () => {
        try {
            await client.Jobs.erase(projectId, jobId);
            router.push(`/workspace/projects/${projectId}/pipelines/${job?.pipeline?.id}`);
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };

    if (errorJob || errorTrace) {
        return <Text>Error: {errorJob?.message || errorTrace?.message}</Text>;
    }

    return (
        <SafeAreaView className="flex-1">
            <Stack.Screen
                options={{
                    title: "",
                    headerRight: headerRightProjectJob(retryJob, cancelJob, deleteJob, job),
                }}
            />
            <ScrollView
                className="flex-1 p-4 bg-card"
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {isLoadingJob ? <HeaderSkeleton /> : <JobHeader job={job} />}

                {isLoadingTrace ? (
                    <CommentSkeleton />
                ) : (
                    trace && <JobTrace trace={trace} />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
