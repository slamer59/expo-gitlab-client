import { Ionicons } from '@expo/vector-icons';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';

import JobStatusIcon from '@/components/Pipeline/job-status-icon';
import { CommentSkeleton } from '@/components/Skeleton/comment';
import { HeaderSkeleton } from '@/components/Skeleton/header';
import { Text } from '@/components/ui/text';
import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { copyToClipboard } from '@/lib/utils';


import { headerRightProjectJob } from './headerRight';

interface Job {
    name: string;
    status: string;
    pipeline: {
        id: string | number;
    };
    ref: string;
    started_at?: string;
    created_at?: string;
    finished_at?: string;
    duration?: number;
    stage: string;
    user?: {
        name: string;
    };
    runner?: {
        description?: string;
        id: string | number;
    };
    artifacts?: any[];
}

function JobHeader({ job }: { job: Job }) {
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
                    Started on {format(new Date(job.started_at || job.created_at || ''), 'MMM d, yyyy HH:mm')}
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
                            { format: ['hours', 'minutes', 'seconds'] as const }
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

interface TextSegment {
    text: string;
    style: {
        color?: string;
        fontWeight?: "bold" | "normal" | undefined;
    };
}

// Parse ANSI color codes and convert to styled text
function parseAnsiColors(text: string): TextSegment[] {
    if (!text) return [];

    // Handle various ANSI escape sequences that aren't color codes
    text = text.replace(/\[\d*K/g, ''); // Line clearing codes like [0K, [1K, [2K
    text = text.replace(/\[\d*A/g, ''); // Cursor up codes like [1A
    text = text.replace(/\[\d*B/g, ''); // Cursor down codes like [1B
    text = text.replace(/\[\d*C/g, ''); // Cursor forward codes like [1C
    text = text.replace(/\[\d*D/g, ''); // Cursor backward codes like [1D
    text = text.replace(/\[\d*G/g, ''); // Cursor horizontal absolute like [1G
    text = text.replace(/\[\d*;\d*H/g, ''); // Cursor position like [1;1H
    text = text.replace(/\[\d*J/g, ''); // Clear screen codes like [2J

    // Split the text by ANSI color codes
    const parts = text.split(/\[(\d+;?\d*m)/);
    const result: TextSegment[] = [];

    let currentStyle: { color?: string; fontWeight?: "bold" | "normal" | undefined } = {};
    let currentText = '';

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // If this is a color code
        if (i % 2 === 1) {
            const code = part.replace('m', '');

            // Reset
            if (code === '0') {
                currentStyle = {};
            }
            // Bold
            else if (code === '1') {
                currentStyle.fontWeight = 'bold';
            }
            // Colors - using Tailwind theme colors from the config
            else if (code === '30') currentStyle.color = '#000000'; // Black
            else if (code === '31') currentStyle.color = '#B00020'; // Red - using danger color
            else if (code === '32') currentStyle.color = '#8FCF50'; // Green - using success color
            else if (code === '33') currentStyle.color = '#FF9F05'; // Yellow - using warning color
            else if (code === '34') currentStyle.color = '#0495EE'; // Blue - using info color
            else if (code === '35') currentStyle.color = '#9400D3'; // Magenta - using violet pill color
            else if (code === '36') currentStyle.color = '#008080'; // Cyan - using teal pill color
            else if (code === '37') currentStyle.color = '#FFFFFF'; // White

            // Bright colors - using lighter variants of the same colors
            else if (code === '90') currentStyle.color = '#B3B3B3'; // Bright Black (Gray) - using basic color
            else if (code === '91') currentStyle.color = '#B00020'; // Bright Red - using danger color
            else if (code === '92') currentStyle.color = '#8FCF50'; // Bright Green - using success color
            else if (code === '93') currentStyle.color = '#FF9F05'; // Bright Yellow - using warning color
            else if (code === '94') currentStyle.color = '#0495EE'; // Bright Blue - using info color
            else if (code === '95') currentStyle.color = '#9400D3'; // Bright Magenta - using violet pill color
            else if (code === '96') currentStyle.color = '#008080'; // Bright Cyan - using teal pill color
            else if (code === '97') currentStyle.color = '#FFFFFF'; // Bright White

            // Combined codes like "32;1m" (green + bold)
            else if (code.includes(';')) {
                const subCodes = code.split(';');
                for (const subCode of subCodes) {
                    if (subCode === '1') currentStyle.fontWeight = 'bold';
                    else if (subCode === '32') currentStyle.color = '#8FCF50'; // Green - using success color
                    else if (subCode === '31') currentStyle.color = '#B00020'; // Red - using danger color
                    else if (subCode === '33') currentStyle.color = '#FF9F05'; // Yellow - using warning color
                    else if (subCode === '34') currentStyle.color = '#0495EE'; // Blue - using info color
                    else if (subCode === '35') currentStyle.color = '#9400D3'; // Magenta - using violet pill color
                    else if (subCode === '36') currentStyle.color = '#008080'; // Cyan - using teal pill color
                    else if (subCode === '37') currentStyle.color = '#ffffff'; // White
                }
            }
        }
        // This is text content
        else if (i % 2 === 0) {
            if (part) {
                // Add the previous segment if there's any text
                if (currentText) {
                    result.push({ text: currentText, style: { ...currentStyle } });
                    currentText = '';
                }
                currentText = part;
            }
        }
    }

    // Add the last segment
    if (currentText) {
        result.push({ text: currentText, style: { ...currentStyle } });
    }

    return result;
}

function JobTrace({ trace }: { trace: string }) {
    const coloredTextSegments = parseAnsiColors(trace);

    return (
        <View className="p-4 mb-4 rounded-lg bg-card-600">
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold text-white">Job Log</Text>
                <TouchableOpacity onPress={() => copyToClipboard(trace || '')}>
                    <Ionicons name="copy-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
            <View className="p-2 bg-black rounded-md">
                <ScrollView
                    style={{ maxHeight: 500 }}
                    nestedScrollEnabled={true}
                >
                    <Text className="font-mono text-xs text-white whitespace-pre-wrap">
                        {coloredTextSegments.map((segment, index) => (
                            <Text key={index.toString()} style={segment.style}>
                                {segment.text}
                            </Text>
                        ))}
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

    // Get the retry job mutation
    const retryJobMutation = api.useRetryJob();

    // Retry Job
    const retryJob = async () => {
        try {
            await retryJobMutation.mutateAsync({ projectId, jobId });
        } catch (error: any) {
            console.error("Error retrying job:", error);
        }
    };

    // Cancel Job
    const cancelJob = async () => {
        try {
            await client.Jobs.cancel(projectId, jobId);
        } catch (error: any) {
            console.error("Error cancelling job:", error);
        }
    };

    // Delete Job (Erase)
    const deleteJob = async () => {
        try {
            await client.Jobs.erase(projectId, jobId);
            router.push(`/workspace/projects/${projectId}/pipelines/${job?.pipeline?.id}`);
        } catch (error: any) {
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
                    headerRight: headerRightProjectJob(retryJob, cancelJob, deleteJob, job as any),
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
