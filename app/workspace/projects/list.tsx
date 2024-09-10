import ListWithFilters from "@/components/ListWithFilters";
import { ProjectCard, ProjectCardSkeleton } from "@/components/Project/project-card";

import { GlobalProjectsUIFilters } from "@/constants/UIFilters";
import { defaultOptionsHeader } from "@/lib/constants";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

export default function ProjectsListScreen() {
    const defaultParamsProjects = {
        query: {
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
        },
    };
    const UIFilters = GlobalProjectsUIFilters
    const query_cache_name = "projects"
    const pathname = "/workspace/projects/[projectId]"
    const endpoint = "/api/v4/projects"

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

    return (
        <ScrollView className="flex-1 p-2 bg-background">
            <Stack.Screen
                options={{
                    title: "Projects",
                    ...defaultOptionsHeader
                }}
            />
            <ListWithFilters
                ItemComponent={ProjectCard}
                SkeletonComponent={ProjectCardSkeleton}
                endpoint={endpoint}
                query_cache_name={query_cache_name}
                pathname={pathname}
                defaultParams={defaultParamsProjects}
                paramsMap={paramsMap}
                UIFilters={UIFilters}
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
