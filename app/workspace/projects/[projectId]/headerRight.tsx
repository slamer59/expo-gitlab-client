import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";

function ProjectOptionsMenu() {
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
                <Link href="edit/project" asChild>
                    <DropdownMenuItem>
                        <Ionicons name="pencil" size={20} color="white" style={{ marginRight: 10 }} />
                        <Text className="font-semibold">Edit Project</Text>
                    </DropdownMenuItem>
                </Link>
                <Link href="create/merge-request" asChild>
                    <DropdownMenuItem>
                        <Octicons name="git-merge" size={20} color="white" style={{ marginRight: 10 }} />
                        <Text className="font-semibold">Create Merge Request</Text>
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function headerRightProject() {
    return () => (
        <View className='flex-row items-center'>
            <Link href="create/issue" className='pl-2 pr-2 m-2'>
                <Pressable>
                    {({ pressed }) => (
                        <Ionicons
                            name="add"
                            size={25}
                            color="white"
                            className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`}
                        />
                    )}
                </Pressable>
            </Link>
            <ProjectOptionsMenu />
        </View>
    );
}
