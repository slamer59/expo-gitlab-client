import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";

import { Pressable, View } from "react-native";

function IssueOptionsMenu({ openIssue, closeIssue, deleteIssue, state }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Pressable>
                    {({ pressed }) => (
                        <Ionicons
                            name="ellipsis-vertical"
                            size={25}
                            color="white"
                            className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`}
                            testID="options"
                        />
                    )}
                </Pressable>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-lg'>
                <DropdownMenuItem onPress={() => {/* Handle edit issue */ }}>
                    <Ionicons name="pencil" size={20} color="white" style={{ marginRight: 10 }} />
                    <Text className="font-semibold">Edit Issue</Text>
                </DropdownMenuItem>
                {state == "closed" ? <DropdownMenuItem onPress={() => openIssue()}>
                    <Octicons name="issue-opened" size={20} color="white" style={{ marginRight: 10 }} />
                    <Text className="font-semibold text-white">Reopen Issue</Text>
                </DropdownMenuItem>
                    :
                    <DropdownMenuItem onPress={() => closeIssue()}>
                        <Octicons name="issue-closed" size={20} color="white" style={{ marginRight: 10 }} />
                        <Text className="font-semibold text-white">Close Issue</Text>
                    </DropdownMenuItem>
                }
                <DropdownMenuItem onPress={() => deleteIssue()}>
                    <Ionicons name="trash" size={20} color="red" style={{ marginRight: 10 }} />
                    <Text className="font-semibold text-danger">Delete Issue</Text>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


export function headerRightProjectIssue(openIssue: () => Promise<void>, closeIssue: () => Promise<void>, deleteIssue: () => Promise<void>, issue: TQueryFnData) {
    return () => (
        <View className='flex-row items-center'>
            <Link href="share/issue" className='pl-2 pr-2 m-2'>
                <Pressable>
                    {({ pressed }) => (
                        <Ionicons
                            name="share-social-outline"
                            size={25}
                            color="white"
                            // color={Colors[colorScheme ?? 'light'].text}
                            className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`} />
                    )}
                </Pressable>
            </Link>
            {/* <Link
                href="options/issue"
                className='pl-2 pr-2 m-2'
                asChild
            >
                <Pressable>
                    {({ pressed }) => (
                        <Ionicons
                            name="ellipsis-vertical"
                            size={25}
                            color="white"
                            // color={Colors[colorScheme ?? 'light'].text}
                            className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`}
                            testID="options"
                        />
                    )}
                </Pressable>
            </Link> */}
            <IssueOptionsMenu openIssue={openIssue} closeIssue={closeIssue} deleteIssue={deleteIssue} state={issue.state} />
        </View>
    );
}

