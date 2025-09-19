import { Ionicons, Octicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { copyToClipboard, shareView } from "@/lib/utils";

interface JobOptionsMenuProps {
    retryJob: () => Promise<void>;
    cancelJob: () => Promise<void>;
    deleteJob: () => Promise<void>;
    status: string;
    projectId: number;
    jobId: number;
    jobUrl: string;
}

function JobOptionsMenu({ retryJob, cancelJob, deleteJob, status, projectId, jobId, jobUrl }: JobOptionsMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Pressable testID="job-options-menu">
                    {({ pressed }) => (
                        <Ionicons
                            name="ellipsis-vertical"
                            size={25}
                            color="white"
                            className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`}
                        />
                    )}
                </Pressable>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-lg'>
                <DropdownMenuItem onPress={async () => await copyToClipboard(jobUrl)} testID="job-copy-url-option">
                    <Ionicons name="copy" size={20} color="white" style={{ marginRight: 10 }} />
                    <Text className="font-semibold">Copy Url</Text>
                </DropdownMenuItem>
                {status !== 'running' && status !== 'pending' ? (
                    <DropdownMenuItem onPress={() => retryJob()} testID="job-retry-option">
                        <Octicons name="sync" size={20} color="green" style={{ marginRight: 10 }} />
                        <Text className="font-semibold text-success">Retry Job</Text>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onPress={() => cancelJob()} testID="job-cancel-option">
                        <Ionicons name="stop-circle-outline" size={20} color="red" style={{ marginRight: 10 }} />
                        <Text className="font-semibold text-danger">Cancel Job</Text>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onPress={() => deleteJob()} testID="job-delete-option">
                    <Ionicons name="trash-outline" size={20} color="red" style={{ marginRight: 10 }} />
                    <Text className="font-semibold text-danger">Delete Job</Text>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface TQueryFnData {
    status: string;
    project_id: number;
    id: number;
    web_url: string;
}

export function headerRightProjectJob(
    retryJob: () => Promise<void>,
    cancelJob: () => Promise<void>,
    deleteJob: () => Promise<void>,
    job: TQueryFnData
) {
    // console.log('job', job);
    return () => (
        <View className='flex-row items-center'>
            <Pressable
                onPress={async () => {
                    await shareView(job?.web_url);
                }}
                className='pl-2 pr-2 m-2'
                testID="job-share-button"
            >
                {({ pressed }) => (
                    <Ionicons
                        name="share-social-outline"
                        size={25}
                        color="white"
                        className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`}
                    />
                )}
            </Pressable>
            <JobOptionsMenu
                retryJob={retryJob}
                cancelJob={cancelJob}
                deleteJob={deleteJob}
                status={job?.status}
                projectId={job?.project_id}
                jobId={job?.id}
                jobUrl={job?.web_url}
            />
        </View>
    );
}
