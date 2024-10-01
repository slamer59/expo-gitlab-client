import ListWithFilters from "@/components/ListWithFilters";
import { ProjectCard, ProjectCardSkeleton } from "@/components/Project/project-card";

import { GlobalProjectsUIFilters } from "@/constants/UIFilters";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

export default function ProjectsListScreen() {
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const localParams = useLocalSearchParams<Record<string, string>>();

    const defaultParamsProjects = {
        // order_by: 'created_at',
        // sort: 'desc',
        owned: "false",
        starred: "false",
        // imported: false,
        // membership: false,
        // with_issues_enabled: false,
        // with_merge_requests_enabled: false,
        // wiki_checksum_failed: false,
        // repository_checksum_failed: false,
        // include_hidden: false,
        // page: 1,
        // per_page: 20,
        // simple: false,
        // statistics: false,
        // with_custom_attributes: false,
        ...localParams, // This will include all other passed parameters
    };
    const UIFilters = GlobalProjectsUIFilters
    const pathname = "/workspace/projects/[projectId]"

    const paramsMap = {
        projectId: "id",
    }
    // https://gitlab.com/api/v4/projects?order_by=created_at&sort=desc&owned=false&starred=false&imported=false&membership=false&with_issues_enabled=false&with_merge_requests_enabled=false&wiki_checksum_failed=false&repository_checksum_failed=false&include_hidden=false&page=1&per_page=20&simple=false&statistics=false&with_custom_attributes=false


    // const defaultFilters = {
    //     Projects: {
    //         label:
    //             owned !== undefined
    //                 ? owned
    //                     ? "Owned"
    //                     : "Not Owned"
    //                 : starred !== undefined
    //                     ? starred
    //                         ? "Starred"
    //                         : "Not Starred"
    //                     : "Owned",
    //         value:
    //             owned !== undefined
    //                 ? owned
    //                     ? "owned"
    //                     : "not_owned"
    //                 : starred !== undefined
    //                     ? starred
    //                         ? "starred"
    //                         : "not_starred"
    //                     : "owned",
    //     },
    // };

    const getScreenTitle = () => {
        if (localParams.owned === "true") return "🏠 My Projects";
        if (localParams.starred === "true") return "⭐ Starred Projects";
        return "📁 Projects";
    };
    console.log("localParams", localParams);

    return (
        <ScrollView
            className="flex-1 p-2 bg-background"
            contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
        >
            <Stack.Screen
                options={{
                    title: getScreenTitle(),
                    // ...defaultOptionsHeader
                }}
            />
            <ListWithFilters
                UIFilters={UIFilters}
                queryFn={api.useProjects}
                ItemComponent={ProjectCard}
                SkeletonComponent={ProjectCardSkeleton}
                pathname={pathname}
                defaultParams={defaultParamsProjects}
                paramsMap={paramsMap}
            />
            {/* <TopFilterList
                UIFilters={UIFilters}
                setSelectedFilters={setSelectedFilters}
                selectedFilters={selectedFilters}
                clearFilters={clearFilters}
            />

            {isLoading && <Loading />}

            {projects
                ? projects?.map((project, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            router.push({
                                pathname: "/workspace/projects/[project_id]",
                                params: {
                                    project_id: project.id,
                                    path: encodeURIComponent(
                                        project.path_with_namespace,
                                    ),
                                },
                            });
                        }}
                    >
                        <ProjectCard
                            project={project}
                        />
                        <View className="my-2 border-b border-gray-300" />
                    </TouchableOpacity>
                ))
                : null} */}
        </ScrollView>
    );
}
