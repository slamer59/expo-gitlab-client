import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { shareView } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Pressable, View } from "react-native";


function ProjectOptionsMenu({ projectId }) {
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
            <DropdownMenuContent className='w-64 native:w-72'>
                {/* <DropdownMenuLabel>This directory</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons color="white" name="document-outline" size={20} style={{ marginRight: 10 }} />
                            <Text>New file</Text>
                        </View>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons color="white" name="cloud-upload-outline" size={20} style={{ marginRight: 10 }} />
                            <Text>Upload file</Text>
                        </View>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons color="white" name="folder-outline" size={20} style={{ marginRight: 10 }} />
                            <Text>New directory</Text>
                        </View>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator /> */}
                <DropdownMenuLabel>This repository</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {/* <DropdownMenuItem>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons color="white" name="git-branch-outline" size={20} style={{ marginRight: 10 }} />
                            <Text>New branch</Text>
                        </View>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons color="white" name="pricetag-outline" size={20} style={{ marginRight: 10 }} />
                            <Text>New tag</Text>
                        </View>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onPress={() => router.push(`/workspace/projects/${projectId}/edit`)} testID="project-edit-option">
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons color="white" name="pencil" size={20} style={{ marginRight: 10 }} />
                            <Text>Edit Project</Text>
                        </View>
                    </DropdownMenuItem>
                    <DropdownMenuItem onPress={() => router.push(`/workspace/projects/${projectId}/merge-requests/create`)} testID="project-edit-option">
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons color="white" name="git-merge-outline" size={20} style={{ marginRight: 10 }} />
                            <Text>Create Merge Request</Text>
                        </View>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function headerRightProject(
    project

) {
    console.log("project", project?.id);
    return () => (
        <View className='flex-row items-center'>
            <Pressable
                onPress={async () => {
                    await shareView(project?.web_url);
                }}
                className='pl-2 pr-2 m-2'
                testID="mr-share-button"
            >
                {({ pressed }) => (
                    <Ionicons color="white"
                        name="share-social-outline"
                        size={25}
                        color="white"
                        className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`}
                    />
                )}
            </Pressable>
            <Link
                href={`/workspace/projects/${project?.id}/issues/create`}
                asChild
            >
                <Pressable className='pl-2 pr-2 m-2'>
                    {({ pressed }) => (
                        <Ionicons color="white"
                            name="add"
                            size={25}
                            color="white"
                            className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`}
                        />
                    )}
                </Pressable>
            </Link>
            <ProjectOptionsMenu projectId={project?.id} />
        </View>
    );
}
