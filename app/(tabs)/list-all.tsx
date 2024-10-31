import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';


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
    const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
    const [subgroups, setSubgroups] = useState<SubgroupWithDetails[]>([]);
    const [subgroupProjects, setSubgroupProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const groupId = 'jokosun';

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

    const renderGroupInfo = () => {
        if (!groupInfo) return null;

        return (
            <View className="p-4 m-4 bg-white rounded-lg shadow-md">
                <Text className="mb-1 text-2xl font-bold">{groupInfo.name}</Text>
                <Text className="mb-1 text-base text-gray-600">Path: {groupInfo.full_path}</Text>
                <Text className="mb-2 text-base">
                    {groupInfo.description || 'No description available'}
                </Text>
                {groupInfo.statistics && (
                    <View className="flex-row justify-between pt-2 border-t border-gray-200">
                        <Text>Subgroups: {groupInfo.statistics.subgroup_count}</Text>
                        <Text>Members: {groupInfo.statistics.member_count}</Text>
                    </View>
                )}
            </View>
        );
    };

    const renderProject = ({ item }: { item: Project }) => (
        <View className="bg-gray-50 p-3 my-1.5 rounded-lg border-l-4 border-green-500">
            <Text className="mb-1 text-lg font-bold">{item.name}</Text>
            <Text className="mb-2 text-sm">
                {item.description || 'No description available'}
            </Text>
            <View className="flex-row justify-between pt-2 mt-2 border-t border-gray-200">
                <Text>Stars: {item.star_count}</Text>
                <Text>Forks: {item.forks_count}</Text>
                <Text>Last activity: {new Date(item.last_activity_at).toLocaleDateString()}</Text>
            </View>
        </View>
    );

    const renderNestedSubgroup = ({ item }: { item: SubgroupWithDetails }) => (
        <View className="bg-gray-50 p-3 my-1.5 rounded-lg border-l-4 border-blue-500">
            <Text className="mb-1 text-lg font-bold">{item.name}</Text>
            <Text className="mb-1 text-sm text-gray-600">{item.full_path}</Text>
            <Text className="text-sm">
                {item.description || 'No description available'}
            </Text>
        </View>
    );

    const renderSubgroup = ({ item }: { item: SubgroupWithDetails }) => {
        if (!item) return null;

        return (
            <View className="mx-4 my-2 bg-white rounded-lg shadow">
                <TouchableOpacity
                    className="p-4"
                    onPress={() => toggleSubgroup(item.id)}
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                            <Text className="mb-1 text-lg font-bold">{item.name}</Text>
                            <Text className="mb-1 text-sm text-gray-600">{item.full_path}</Text>
                            <Text className="text-sm">
                                {item.description || 'No description available'}
                            </Text>
                        </View>
                        <Ionicons
                            name={item.expanded ? 'chevron-up' : 'chevron-down'}
                            size={24}
                            color="#666"
                        />
                    </View>
                </TouchableOpacity>

                {item.expanded && (
                    <View className="p-4 border-t border-gray-200">
                        {item.loading ? (
                            <ActivityIndicator className="py-5" />
                        ) : (
                            <>
                                {item.subgroups && item.subgroups.length > 0 && (
                                    <View className="mt-2.5">
                                        <Text className="mb-2 text-base font-bold text-gray-600">
                                            Subgroups ({item.subgroups.length})
                                        </Text>
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
                                        <Text className="mb-2 text-base font-bold text-gray-600">
                                            Projects ({item.projects.length})
                                        </Text>
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
            </View>
        );
    };

    const renderListItem = ({ item }: { item: SubgroupWithDetails | Project }) => {
        if ('full_path' in item) {
            return renderSubgroup({ item: item as SubgroupWithDetails });
        } else {
            return renderProject({ item: item as Project });
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" className="items-center justify-center flex-1" />;
    }

    if (error) {
        return (
            <View className="items-center justify-center flex-1">
                <Text className="text-base text-red-500">Error: {error}</Text>
            </View>
        );
    }

    if (!groupInfo) {
        return (
            <View className="items-center justify-center flex-1">
                <Text className="text-base text-red-500">Group not found</Text>
            </View>
        );
    }

    const combinedData = [...subgroups, ...subgroupProjects];

    return (
        <FlatList
            ListHeaderComponent={renderGroupInfo()}
            data={combinedData}
            renderItem={renderListItem}
            keyExtractor={item => item.id.toString()}
            className="flex-1 bg-gray-100"
            ListEmptyComponent={
                <View className="items-center p-4">
                    <Text className="text-base text-gray-600">No subgroups or projects found</Text>
                </View>
            }
        />
    );
};

export default GroupDetails;
