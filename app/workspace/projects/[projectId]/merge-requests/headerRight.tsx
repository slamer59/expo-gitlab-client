import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";

function MergeRequestOptionsMenu() {
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
                <Link href="edit/merge-request" asChild>
                    <DropdownMenuItem>
                        <Ionicons name="pencil" size={20} color="white" style={{ marginRight: 10 }} />
                        <Text className="font-semibold">Edit</Text>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onPress={() => {/* Implement change base branch functionality */ }}>
                    <Octicons name="git-branch" size={20} color="white" style={{ marginRight: 10 }} />
                    <Text className="font-semibold">Change Base Branch</Text>
                </DropdownMenuItem>
                <DropdownMenuItem onPress={() => {/* Implement close merge request functionality */ }}>
                    <Ionicons name="close-circle-outline" size={20} color="red" style={{ marginRight: 10 }} />
                    <Text className="font-semibold text-danger">Close Merge Request</Text>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function headerRightMergeRequest() {
    return () => (
        <View className='flex-row items-center'>
            <Pressable onPress={() => {/* Implement share functionality */ }} className='pl-2 pr-2 m-2'>
                {({ pressed }) => (
                    <Ionicons
                        name="share-social-outline"
                        size={25}
                        color="white"
                        className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`}
                    />
                )}
            </Pressable>
            <MergeRequestOptionsMenu />
        </View>
    );
}
