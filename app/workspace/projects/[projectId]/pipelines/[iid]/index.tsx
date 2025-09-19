import { Ionicons } from "@expo/vector-icons";
import { format, formatDuration, intervalToDuration } from "date-fns";
import { router, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { default as React, useState } from 'react';
import { Animated, Platform, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { LinearTransition } from "react-native-reanimated";

import JobStatusIcon from "@/components/Pipeline/job-status-icon";
import PipelineComment from "@/components/Pipeline/pipeline-comment";
import PipelineHeader from "@/components/Pipeline/pipeline-header";
import { CommentSkeleton } from "@/components/Skeleton/comment";
import { HeaderSkeleton } from "@/components/Skeleton/header";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { copyToClipboard } from "@/lib/utils";

import { headerRightProjectPipeline } from "./headerRight";


function JobItem({ job }) {
    const { session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);
    const retryJobMutation = api.useRetryJob();

    const handleViewDetails = () => {
        router.push(`/workspace/projects/${job.pipeline.project_id}/jobs/${job.id}`);
    };

    const handleRetry = async () => {
        try {
            await retryJobMutation.mutateAsync({ projectId: job.pipeline.project_id, jobId: job.id });
        } catch (error) {
            console.error("Error retrying job:", error);
        }
    };

    return (
        <>
            <Collapsible className="mb-3" asChild open={isOpen} onOpenChange={setIsOpen}>
                <Animated.View layout={Platform.OS !== 'web' ? LinearTransition : undefined}>
                    <CollapsibleTrigger>
                        <View className="flex-row items-center justify-between py-2">
                            <View className="flex-row items-center">
                                <JobStatusIcon status={job.status} />
                                <Text className="ml-2 font-semibold text-white">{job.name}</Text>
                            </View>
                            <Ionicons
                                name={isOpen ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="gray"
                            />
                        </View>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <View className="p-2">
                            <View className="flex-row items-center mb-2">
                                <Ionicons name="play" size={20} color="gray" />
                                <Text className="ml-2 text-sm text-muted">
                                    Started on {format(new Date(job.started_at), 'MMM d, yyyy HH:mm')}
                                </Text>
                            </View>
                            <View className="flex-row items-center mb-2">
                                <Ionicons name="time-outline" size={20} color="gray" />
                                <Text className="ml-2 text-sm text-muted">
                                    Duration: {formatDuration(
                                        intervalToDuration({ start: 0, end: job.duration * 1000 }),
                                        { format: ['hours', 'minutes', 'seconds'] }
                                    )}
                                </Text>
                            </View>

                            {job.artifacts.length > 0 && (
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="cube" size={20} color="gray" />
                                    <Text className="ml-2 text-sm text-muted">
                                        Artifacts: {job.artifacts[0].filename} ({job.artifacts[0].size} bytes)
                                    </Text>
                                </View>
                            )}
                            <View className="flex-row items-center mb-2">
                                <Ionicons name="flag" size={20} color="gray" />
                                <Text className="ml-2 text-sm text-muted">
                                    Stage: {job.stage}
                                </Text>
                            </View>

                        </View>
                        <View className="flex-row justify-end p-2">
                            <TouchableOpacity onPress={async () => await copyToClipboard(job.web_url)} className="mr-4">
                                <Ionicons name="share-outline" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleViewDetails} className="mr-4">
                                <Ionicons name="eye-outline" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleRetry}>
                                <Ionicons name="refresh-outline" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </CollapsibleContent>
                </Animated.View>
            </Collapsible>
        </>
    );
}


const JobSections = ({ jobs }) => {
    return (
        <View className="p-3 mb-4 rounded-lg bg-card-600">
            <Text className="mb-4 text-lg font-semibold text-white">Jobs</Text>
            {jobs?.length > 0 ? (
                <Text className="mb-2 ml-2 text-sm text-muted">
                    There {jobs?.length === 1 ? 'is' : 'are'} {jobs.length} job{jobs.length === 1 ? '' : 's'} in this pipeline.
                </Text>
            ) :
                <Text className="mb-2 ml-2 text-sm text-muted">
                    There are no jobs in this pipeline.
                </Text>
            }

            {jobs && jobs.map((job, index) => (
                <>
                    <Separator key={`separator-${index}`} className="bg-card" />
                    <JobItem key={index} job={job} />
                </>
            ))}
        </View>
    );
};

const JobItemSkeleton = () => {
    return (
        <View className="p-4 rounded-lg bg-card-600">
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                    <Skeleton className="w-6 h-6 mr-2 rounded-full bg-muted" />
                    <Skeleton className="w-24 h-4 bg-muted" />
                </View>
                <Skeleton className="w-6 h-6 bg-muted" />
            </View>
            <View className="mb-4">
                <Skeleton className="w-full h-4 mb-2 bg-muted" />
                <Skeleton className="w-3/4 h-4 mb-2 bg-muted" />
                <Skeleton className="w-1/2 h-4 bg-muted" />
            </View>
            <View className="flex-row justify-end">
                <Skeleton className="w-6 h-6 mr-4 bg-muted" />
                <Skeleton className="w-6 h-6 mr-4 bg-muted" />
                <Skeleton className="w-6 h-6 bg-muted" />
            </View>
        </View>
    );
};

const JobSectionsSkeleton = () => {
    return (
        <View className="p-3 mb-4 rounded-lg bg-card-600">
            <Skeleton className="w-24 h-6 mb-4 bg-muted" />
            <Skeleton className="w-3/4 h-4 mb-4 bg-muted" />
            {[...Array(3)].map((_, index) => (
                <JobItemSkeleton key={index} />
            ))}
        </View>
    );
};


export default function PipelineDetails() {
    const { projectId, iid: pipelineId } = useLocalSearchParams();
    const { session } = useSession()
    const router = useRouter();

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const [
        { data: pipeline, isLoading: isLoadingPipeline, error: errorPipeline },
        { data: commit, isLoading: isLoadingCommit, error: errorCommit },
        { data: jobs, isLoading: isLoadingJobs, error: errorJobs },
    ] = api.usePipelineDetails(projectId, pipelineId);

    // Delete Pipeline
    const deletePipeline = async () => {
        try {
            router.push(`/workspace/projects/${projectId}/pipelines/list`);
            await api.useDeletePipeline(projectId, pipelineId);
        } catch (error) {
            console.error("Error deleting pipeline:", error);
        }
    };

    // Cancel Pipeline
    const cancelPipeline = async () => {
        try {
            await api.useCancelPipeline(projectId, pipelineId);
        } catch (error) {
            console.error("Error cancelling pipeline:", error);
        }
    }

    // Get the retry pipeline mutation
    const retryPipelineMutation = api.useRetryPipeline();

    // Retry Pipeline
    const retryPipeline = async () => {
        try {
            await retryPipelineMutation.mutateAsync({ projectId, pipelineId });
        } catch (error) {
            console.error("Error retrying pipeline:", error);
        }
    }

    if (errorPipeline || errorJobs || errorCommit) {
        return <Text>Error: {errorPipeline?.message || errorJobs?.message || errorCommit?.message}</Text>;
    }

    const isLoading = isLoadingPipeline || isLoadingJobs || isLoadingCommit;
    // console.log("pipeline", pipeline)
    // console.log("jobs", jobs)
    // console.log("job", job)

    return (
        <>
            <SafeAreaView className="flex-1">
                <Stack.Screen
                    options={{
                        title: "",
                        headerRight: headerRightProjectPipeline(retryPipeline, cancelPipeline, deletePipeline, pipeline),
                    }}
                />
                <ScrollView
                    className="flex-1 p-4 bg-card"
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {isLoadingCommit ?
                        <HeaderSkeleton /> :
                        <PipelineHeader commit={commit} />
                    }
                    {isLoadingPipeline ?
                        <CommentSkeleton /> :
                        <PipelineComment pipeline={pipeline} projectId={projectId} />
                    }

                    {isLoadingJobs ?
                        <JobSectionsSkeleton /> :
                        <JobSections jobs={jobs} />
                    }

                    {/* {isLoadingPipeline ?
                        <SectionSkeleton /> :
                        <ActionButtons
                            pipeline={pipeline}
                            onRetry={retryPipeline}
                            onCancel={cancelPipeline}
                        />
                    }  */}

                </ScrollView>
            </SafeAreaView>
        </>
    );
}
