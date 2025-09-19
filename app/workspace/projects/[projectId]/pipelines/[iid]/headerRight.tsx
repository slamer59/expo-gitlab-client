import { Ionicons, Octicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { copyToClipboard, shareView } from "@/lib/utils";

interface PipelineOptionsMenuProps {
    retryPipeline: () => Promise<void>;
    cancelPipeline: () => Promise<void>;
    deletePipeline: () => Promise<void>;
    status: string;
    projectId: number;
    pipelineId: number;
    pipelineUrl: string;
}

function PipelineOptionsMenu({ retryPipeline, cancelPipeline, deletePipeline, status, projectId, pipelineId, pipelineUrl }: PipelineOptionsMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Pressable testID="pipeline-options-menu">
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
                <DropdownMenuItem onPress={async () => await copyToClipboard(pipelineUrl)} testID="pipeline-copy-url-option">
                    <Ionicons name="copy" size={20} color="white" style={{ marginRight: 10 }} />
                    <Text className="font-semibold">Copy Url</Text>
                </DropdownMenuItem>
                {status !== 'running' && status !== 'pending' ? (
                    <DropdownMenuItem onPress={() => retryPipeline()} testID="pipeline-retry-option">
                        <Octicons name="sync" size={20} color="green" style={{ marginRight: 10 }} />
                        <Text className="font-semibold text-success">Retry Pipeline</Text>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onPress={() => cancelPipeline()} testID="pipeline-cancel-option">
                        <Ionicons name="stop-circle-outline" size={20} color="red" style={{ marginRight: 10 }} />
                        <Text className="font-semibold text-danger">Cancel Pipeline</Text>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onPress={() => deletePipeline()} testID="pipeline-delete-option">
                    <Ionicons name="trash-outline" size={20} color="red" style={{ marginRight: 10 }} />
                    <Text className="font-semibold text-danger">Delete Pipeline</Text>
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

export function headerRightProjectPipeline(
    retryPipeline: () => Promise<void>,
    cancelPipeline: () => Promise<void>,
    deletePipeline: () => Promise<void>,
    pipeline: TQueryFnData
) {
    // console.log('pipeline', pipeline);
    return () => (
        <View className='flex-row items-center'>
            <Pressable
                onPress={async () => {
                    await shareView(pipeline?.web_url);
                }}
                className='pl-2 pr-2 m-2'
                testID="pipeline-share-button"
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
            <PipelineOptionsMenu
                retryPipeline={retryPipeline}
                cancelPipeline={cancelPipeline}
                deletePipeline={deletePipeline}
                status={pipeline?.status}
                projectId={pipeline?.project_id}
                pipelineId={pipeline?.id}
                pipelineUrl={pipeline?.web_url}
            />
        </View>
    );
}
