
import ListWithFilters from "@/components/ListWithFilters";
import { MergeRequestCard, MergeRequestCardSkeleton } from "@/components/MergeRequest/mr-card";
import { GlobalMergeRequestUIFilters } from "@/constants/UIFilters";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { extractDefaultFilters, extractDefaultUIOptions } from "@/lib/utils";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

export default function MergeRequestsListScreen() {
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const UIFilters = GlobalMergeRequestUIFilters
    const defaultParams = extractDefaultFilters(UIFilters);
    const defaultUIFilterValues = extractDefaultUIOptions(UIFilters);
    const pathname = "/workspace/projects/[projectId]/merge-requests/[mr_iid]"

    const paramsMap = {
        projectId: "project_id",
        mr_iid: "iid",
    }

    return (
        <ScrollView
            className="flex-1 p-2 bg-background"
            contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
        >
            <Stack.Screen
                options={{
                    title: "Merge Requests",
                    // ...defaultOptionsHeader
                }}
            />
            <ListWithFilters
                UIFilters={UIFilters}
                queryFn={api.useMergeRequests}
                ItemComponent={MergeRequestCard}
                SkeletonComponent={MergeRequestCardSkeleton}
                pathname={pathname}
                paramsMap={paramsMap}
                defaultParams={defaultParams}
                defaultUIFilterValues={defaultUIFilterValues}
            />
        </ScrollView>
    );
}
