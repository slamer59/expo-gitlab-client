
import ListWithFilters from "@/components/ListWithFilters";
import { ProjectCard, ProjectCardSkeleton } from "@/components/Project/project-card";
import { GlobalUserStarredProjectsUIFilters } from "@/constants/UIFilters";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { extractDefaultFilters, extractDefaultUIOptions } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

export default function StarredListScreen() {
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });
    const api = useGitLab(client);

    const { data: currentUser, isLoading: isLoadingUser, error: errorUser } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => client.Users.current(),
    });


    const UIFilters = GlobalUserStarredProjectsUIFilters
    const defaultParams = extractDefaultFilters(UIFilters);
    const defaultUIFilterValues = extractDefaultUIOptions(UIFilters);
    const pathname = "/workspace/projects/[projectId]"

    const paramsMap = {
        projectId: "id",
    }

    return (
        <ScrollView
            className="flex-1 p-2 bg-background"
            contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
        >
            <Stack.Screen
                options={{
                    title: "Starred Projects",
                    // ...defaultOptionsHeader
                }}
            />
            {!isLoadingUser && <ListWithFilters
                UIFilters={UIFilters}
                itemId={currentUser?.id}
                queryFn={api.useUserStarredProjects}
                ItemComponent={ProjectCard}
                SkeletonComponent={ProjectCardSkeleton}
                pathname={pathname}
                paramsMap={paramsMap}
                defaultParams={defaultParams}
                defaultUIFilterValues={defaultUIFilterValues}
            />}
        </ScrollView>
    );
}
