
import ListWithFilters from "@/components/ListWithFilters";
import { MergeRequestCard, MergeRequestCardSkeleton } from "@/components/MergeRequest/mr-card";
import { GlobalMergeRequestUIFilters } from "@/constants/UIFilters";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
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

    const defaultParamsMergeRequests = {
        // created_by_me: true,
        state: "all",
        // milestone: "release",
        // labels: "bug",
        // author_id: 5,
        // my_reaction_emoji: "star",
        // scope: "assigned_to_me",
        // search: 'foo',
        // in: 'title',
    };

    const UIFilters = GlobalMergeRequestUIFilters
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
                defaultParams={defaultParamsMergeRequests}
            />
        </ScrollView>
    );
}
