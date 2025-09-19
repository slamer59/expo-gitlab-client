import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { ProjectCard } from '@/components/Project/project-card';
import { GroupCardSkeleton, GroupWithSubgroupsVariant } from 'components/Group/group-card';
import GitLabClient from 'lib/gitlab/gitlab-api-wrapper';
import { useSession } from 'lib/session/SessionProvider';



interface GroupStatistics {
    subgroup_count: number;
    member_count: number;
}

interface GroupInfo {
    id: number;
    name: string;
    full_path: string;
    description: string | null;
    statistics: GroupStatistics;
}

interface Project {
    id: number;
    name: string;
    description: string | null;
    last_activity_at: string;
    star_count: number;
    forks_count: number;
}

interface SubgroupWithDetails {
    id: number;
    name: string;
    full_path: string;
    description: string | null;
    subgroups?: SubgroupWithDetails[];
    projects?: Project[];
    loading?: boolean;
    expanded?: boolean;
    detailsFetched?: boolean;
}

const GroupDetails = () => {
    const router = useRouter();
    const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
    const [subgroups, setSubgroups] = useState<SubgroupWithDetails[]>([]);
    const [subgroupProjects, setSubgroupProjects] = useState<Project[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const { groupId } = useLocalSearchParams<{ groupId: string }>();

    const fetchSubgroupDetails = async (subgroupId: number) => {
        try {
            const [subgroupsResponse, projectsResponse] = await Promise.all([
                client.Groups.subgroups(subgroupId),
                client.Groups.projects(subgroupId)
            ]);

            setSubgroups(currentSubgroups =>
                currentSubgroups.map(sg =>
                    sg.id === subgroupId ? {
                        ...sg,
                        subgroups: subgroupsResponse.map((subgroup: SubgroupWithDetails) => ({
                            ...subgroup,
                            expanded: false,
                            detailsFetched: false
                        })),
                        projects: projectsResponse,
                        loading: false,
                        detailsFetched: true
                    } : sg
                )
            );
        } catch (err) {
            console.error(`Error fetching details for subgroup ${subgroupId}:`, err);
            setSubgroups(currentSubgroups =>
                currentSubgroups.map(sg =>
                    sg.id === subgroupId ? {
                        ...sg,
                        subgroups: [],
                        projects: [],
                        loading: false,
                        detailsFetched: true
                    } : sg
                )
            );
        }
    };

    const toggleSubgroup = async (subgroupId: number) => {
        setSubgroups(currentSubgroups =>
            currentSubgroups.map(sg =>
                sg.id === subgroupId ? {
                    ...sg,
                    expanded: !sg.expanded,
                    loading: !sg.detailsFetched
                } : sg
            )
        );

        const subgroup = subgroups.find(sg => sg.id === subgroupId);
        if (subgroup && !subgroup.detailsFetched) {
            await fetchSubgroupDetails(subgroupId);
        }
    };

    const fetchGroupData = async () => {
        try {
            setLoading(true);
            const [groupResponse, subgroupsResponse, subgroupProjectsResponse] = await Promise.all([
                client.Groups.show(groupId),
                client.Groups.subgroups(groupId),
                client.Groups.projects(groupId)
            ]);

            setGroupInfo(groupResponse);
            setSubgroups(subgroupsResponse.map((sg: SubgroupWithDetails) => ({
                ...sg,
                expanded: false,
                detailsFetched: false
            })));
            setSubgroupProjects(subgroupProjectsResponse);

        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupData();
    }, []);

    const handleProjectPress = (projectId: number) => {
        router.push(`/workspace/projects/${projectId}`);
    };

    // const renderGroupInfo = () => {
    //     if (!groupInfo) return null;

    //     return (
    //         <View className="p-4 m-4 bg-white rounded-lg shadow-md">
    //             <Text className="mb-1 text-2xl font-bold">{groupInfo.name}</Text>
    //             <Text className="mb-1 text-base text-gray-600">Path: {groupInfo.full_path}</Text>
    //             <Text className="mb-2 text-base">
    //                 {groupInfo.description || 'No description available'}
    //             </Text>
    //             {groupInfo.statistics && (
    //                 <View className="flex-row justify-between pt-2 border-t border-gray-200">
    //                     <Text>Subgroups: {groupInfo.statistics.subgroup_count}</Text>
    //                     <Text>Members: {groupInfo.statistics.member_count}</Text>
    //                 </View>
    //             )}
    //         </View>
    //     );
    // };
    const renderProject = ({ item }: { item: Project }) => {
        return (
            <TouchableOpacity onPress={() => handleProjectPress(item.id)}>
                <ProjectCard item={item} variant='project_in_group' />
            </TouchableOpacity>
        );
    };

    const renderNestedSubgroup = ({ item }: { item: SubgroupWithDetails }) => (
        <View className="bg-muted p-3 my-1.5 rounded-lg border-l-4 border-primary">
            <Text className="mb-1 text-lg font-bold">{item.name}</Text>
            <Text className="mb-1 text-sm text-muted-600">{item.full_path}</Text>
            <Text className="text-sm">
                {item.description || 'No description available'}
            </Text>
        </View>
    );

    const renderSubgroup = ({ item }: { item: SubgroupWithDetails }) => {
        if (!item) return null;

        return (
            <TouchableOpacity
                onPress={() => toggleSubgroup(item.id)}
            >
                <GroupWithSubgroupsVariant item={item}>
                    {item.expanded && (
                        <View className="p-4 border-t border-muted">
                            {item.loading ? (
                                <GroupCardSkeleton />
                            ) : (
                                <>
                                    {item.subgroups && item.subgroups.length > 0 && (
                                        <View className="mt-2.5">
                                            <FlatList
                                                data={item.subgroups}
                                                renderItem={renderNestedSubgroup}
                                                keyExtractor={sg => sg.id.toString()}
                                                scrollEnabled={false}
                                            />
                                        </View>
                                    )}

                                    {item.projects && item.projects.length > 0 && (
                                        <View className="mt-2.5">
                                            <FlatList
                                                data={item.projects}
                                                renderItem={renderProject}
                                                keyExtractor={p => p.id.toString()}
                                                scrollEnabled={false}
                                            />
                                        </View>
                                    )}

                                    {(!item.subgroups?.length && !item.projects?.length) && (
                                        <Text className="text-base text-gray-600 mt-2.5">No subgroups or projects found</Text>
                                    )}
                                </>
                            )}
                        </View>
                    )}
                </GroupWithSubgroupsVariant>
            </TouchableOpacity>
        );
    };

    const renderListItem = ({ item }: { item: SubgroupWithDetails | Project }) => {
        if ('full_path' in item) {
            return renderSubgroup({ item: item as SubgroupWithDetails });
        } else {
            return (
                <TouchableOpacity onPress={() => handleProjectPress(item.id)}>
                    <ProjectCard item={item as Project} />
                </TouchableOpacity>
            );
        }
    };

    if (error) {
        return (
            <View className="items-center justify-center flex-1">
                <Text className="text-base text-red-500">Error: {error}</Text>
            </View>
        );
    }

    const combinedData = [...subgroups, ...subgroupProjects];

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen
                options={{
                    headerTitle: groupInfo?.name || '',
                }}
            />

            {
                isLoading ? (
                    <View className="items-center">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <GroupCardSkeleton key={index} />
                        ))}
                    </View>
                ) : (
                    <FlatList
                        data={combinedData}
                        renderItem={renderListItem}
                        keyExtractor={item => item.id.toString()}
                        className="flex-1"
                        ListEmptyComponent={
                            <View className="flex-row items-center p-4 m-2 space-x-4 rounded-lg bg-card">
                                <View className="items-center justify-center w-full m-2 ">
                                    <View className="p-4 m-6">
                                        <Ionicons name="search" size={32} color="red" />
                                    </View>
                                    <Text className="mb-2 text-2xl font-bold text-center text-white rounded-4xl">
                                        No items Found
                                    </Text>
                                    <Text className="mb-6 text-center text-muted">
                                        There are currently no items to display.
                                    </Text>
                                </View>
                            </View>
                        }
                    />
                )
            }
        </View>
    );
};

export default GroupDetails;
