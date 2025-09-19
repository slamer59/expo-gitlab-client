import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

import ListWithFilters from "@/components/ListWithFilters";
import { ProjectCard, ProjectCardSkeleton } from "@/components/Project/project-card";
import { GlobalProjectsUIFilters } from "@/constants/UIFilters";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { extractDefaultFilters, extractDefaultUIOptions } from "@/lib/utils";

export default function ProjectsListScreen() {
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const localParams = useLocalSearchParams<Record<string, string>>();

    const UIFilters = GlobalProjectsUIFilters
    const defaultParams = {
        ...extractDefaultFilters(UIFilters),
        ...localParams
    }

    const defaultUIFilterValues = Object.keys(localParams).length === 0
        ? extractDefaultUIOptions(UIFilters)
        : {}

    const pathname = "/workspace/projects/[projectId]"

    const paramsMap = {
        projectId: "id",
    }

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
                paramsMap={paramsMap}
                defaultParams={defaultParams}
                defaultUIFilterValues={defaultUIFilterValues}
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
