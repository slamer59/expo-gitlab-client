import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { copyToClipboard, shareView } from "@/lib/utils";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, View } from "react-native";

interface MergeRequestOptionsMenuProps {
    openMr: () => Promise<void>;
    closeMr: () => Promise<void>;
    deleteMr: () => Promise<void>;
    state: string;
    projectId: number;
    mrIid: number;
}
function MergeRequestOptionsMenu({ openMr, closeMr, deleteMr, state, projectId, mrIid, mrUrl }: MergeRequestOptionsMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Pressable testID="mr-options-menu">
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
                <DropdownMenuItem onPress={() => router.push(`/workspace/projects/${projectId}/merge-requests/${mrIid}/edit`)} testID="mr-edit-option">
                    <Ionicons name="pencil" size={20} color="white" style={{ marginRight: 10 }} />
                    <Text className="font-semibold">Edit</Text>
                </DropdownMenuItem>
                <DropdownMenuItem onPress={async () => await copyToClipboard(mrUrl)} testID="mr-copy-url-option">
                    <Ionicons name="copy" size={20} color="white" style={{ marginRight: 10 }} />
                    <Text className="font-semibold">Copy Url</Text>
                </DropdownMenuItem>
                {state === 'closed' ? (
                    <DropdownMenuItem onPress={() => openMr()} testID="mr-reopen-option">
                        <Octicons name="issue-opened" size={20} color="green" style={{ marginRight: 10 }} />
                        <Text className="font-semibold text-success">Reopen Merge Request</Text>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onPress={() => closeMr()} testID="mr-close-option">
                        <Ionicons name="close-circle-outline" size={20} color="red" style={{ marginRight: 10 }} />
                        <Text className="font-semibold text-danger">Close Merge Request</Text>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface TQueryFnData {
    state: string;
    project_id: number;
    iid: number;
    web_url: string;
}

export function headerRightProjectMr(
    reopenMr: () => Promise<void>,
    closeMr: () => Promise<void>,
    deleteMr: () => Promise<void>,
    mr: TQueryFnData
) {
    return () => (
        <View className='flex-row items-center'>
            <Pressable
                onPress={async () => {
                    await shareView(mr?.web_url);
                }}
                className='pl-2 pr-2 m-2'
                testID="mr-share-button"
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
            <MergeRequestOptionsMenu
                openMr={reopenMr}
                closeMr={closeMr}
                deleteMr={deleteMr}
                state={mr?.state}
                projectId={mr?.project_id}
                mrIid={mr?.iid}
                mrUrl={mr?.web_url}
            />
        </View>
    );
}