import ListWithFilters from "@/components/ListWithFilters";
import { ProjectCard, ProjectCardSkeleton } from "@/components/Project/project-card";
import { GlobalUserContributedProjectsUIFilters, GlobalUserGroupsUIFilters, GlobalUserProjectUIFilters, GlobalUserStarredProjectsUIFilters } from "@/constants/UIFilters";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { extractDefaultFilters, extractDefaultUIOptions } from "@/lib/utils";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

export default function ProjectsListScreen() {
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const { userId, ...localParams } = useLocalSearchParams<Record<string, string>>();

    const pathname = "/workspace/projects/[projectId]"

    const paramsMap = {
        projectId: "id",
    }

    const getScreenTitle = () => {
        if (localParams.groups === "true") return "👥 Groups Projects";
        if (localParams.contributed === "true") return "👥 Contributed Projects";
        if (localParams.starred === "true") return "⭐ Starred Projects";
        return "📁 Personal Projects";
    };
    const selectHook = () => {
        if (localParams.groups === "true") return api.useUserGroupsProjects;
        if (localParams.contributed === "true") return api.useUserContributedProjects;
        if (localParams.starred === "true") return api.useUserStarredProjects;
        return api.useUserProjects;
    };
    const selectUIFilters = () => {
        if (localParams.groups === "true") return GlobalUserGroupsUIFilters;
        if (localParams.contributed === "true") return GlobalUserContributedProjectsUIFilters;
        if (localParams.starred === "true") return GlobalUserStarredProjectsUIFilters;
        return GlobalUserProjectUIFilters;
    }
    const UIFilters = selectUIFilters();

    const selectedHook = selectHook();
    const defaultParams = {
        ...extractDefaultFilters(UIFilters),
        ...localParams
    }

    const defaultUIFilterValues = Object.keys(localParams).length === 0
        ? extractDefaultUIOptions(UIFilters)
        : {}

    return (
        <ScrollView
            className="flex-1 p-2 bg-background"
            contentContainerStyle={{ paddingBottom: 100 }}
        >
            <Stack.Screen
                options={{
                    title: getScreenTitle(),
                }}
            />
            <ListWithFilters
                UIFilters={UIFilters}
                queryFn={selectedHook}
                itemId={userId}
                ItemComponent={ProjectCard}
                SkeletonComponent={ProjectCardSkeleton}
                pathname={pathname}
                paramsMap={paramsMap}
                defaultParams={defaultParams}
                defaultUIFilterValues={defaultUIFilterValues}
            />
        </ScrollView>
    );
}
