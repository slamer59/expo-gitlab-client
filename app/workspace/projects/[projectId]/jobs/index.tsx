import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';

import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';

import JobStatusIcon from '@/components/Pipeline/job-status-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';

function JobItem({ job, onPress }) {
    return (
        <TouchableOpacity
            className="p-4 mb-3 rounded-lg bg-card-600"
            onPress={onPress}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <JobStatusIcon status={job.status} />
                    <Text className="ml-2 font-semibold text-white">{job.name}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="gray" />
            </View>
            <View className="mt-2">
                <View className="flex-row items-center mb-1">
                    <Ionicons name="git-branch-outline" size={16} color="gray" />
                    <Text className="ml-2 text-xs text-muted">
                        Pipeline #{job.pipeline.id} for {job.ref}
                    </Text>
                </View>
                <View className="flex-row items-center mb-1">
                    <Ionicons name="time-outline" size={16} color="gray" />
                    <Text className="ml-2 text-xs text-muted">
                        {format(new Date(job.created_at), 'MMM d, yyyy HH:mm')}
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="flag-outline" size={16} color="gray" />
                    <Text className="ml-2 text-xs text-muted">
                        Stage: {job.stage}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

function JobItemSkeleton() {
    return (
        <View className="p-4 mb-3 rounded-lg bg-card-600">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Skeleton className="w-6 h-6 mr-2 rounded-full bg-muted" />
                    <Skeleton className="w-32 h-4 bg-muted" />
                </View>
                <Skeleton className="w-5 h-5 bg-muted" />
            </View>
            <View className="mt-2">
                <View className="flex-row items-center mb-1">
                    <Skeleton className="w-4 h-4 mr-2 bg-muted" />
                    <Skeleton className="w-40 h-3 bg-muted" />
                </View>
                <View className="flex-row items-center mb-1">
                    <Skeleton className="w-4 h-4 mr-2 bg-muted" />
                    <Skeleton className="w-32 h-3 bg-muted" />
                </View>
                <View className="flex-row items-center">
                    <Skeleton className="w-4 h-4 mr-2 bg-muted" />
                    <Skeleton className="w-24 h-3 bg-muted" />
                </View>
            </View>
        </View>
    );
}

export default function JobsList() {
    const { projectId } = useLocalSearchParams();
    const { session } = useSession();
    const router = useRouter();

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);
    const { data: jobs, isLoading, error } = api.useProjectJobs(projectId);

    const navigateToJobDetails = (jobId) => {
        router.push(`/workspace/projects/${projectId}/jobs/${jobId}`);
    };

    if (error) {
        return (
            <View className="items-center justify-center flex-1">
                <Text className="text-white">Error loading jobs: {error.message}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1">
            <Stack.Screen options={{ title: "Jobs" }} />
            <ScrollView
                className="flex-1 p-4 bg-card"
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <Text className="mb-4 text-2xl font-bold text-white">Project Jobs</Text>

                {isLoading ? (
                    <>
                        <JobItemSkeleton />
                        <JobItemSkeleton />
                        <JobItemSkeleton />
                    </>
                ) : jobs && jobs.length > 0 ? (
                    jobs.map((job) => (
                        <JobItem
                            key={job.id}
                            job={job}
                            onPress={() => navigateToJobDetails(job.id)}
                        />
                    ))
                ) : (
                    <View className="p-4 rounded-lg bg-card-600">
                        <Text className="text-center text-white">No jobs found for this project.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
