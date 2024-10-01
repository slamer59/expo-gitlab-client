import { IssueCard, IssueCardSkeleton } from "@/components/Issue/issue-card";
import ListWithFilters from "@/components/ListWithFilters";
import { GlobalIssueUIFilters } from "@/constants/UIFilters";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";


export default function IssuesListScreen() {
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const defaultParamsIssues = {
        // scope: "all",
        // state: "opened",
        // order_by: "created_at",
        created_by_me: false,
        // assigned_to_me: false,
        // issue_type: "issue",
    };

    const UIFilters = GlobalIssueUIFilters;
    const pathname = "/workspace/projects/[projectId]/issues/[issue_iid]"
    const paramsMap = {
        "projectId": "project_id", "issue_iid": "iid"
    }

    return (
        <ScrollView
            className="flex-1 p-2 bg-background"
            contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
        >
            <Stack.Screen
                options={{
                    headerTitle: "Issues",
                }}
            />

            <ListWithFilters
                UIFilters={UIFilters}
                queryFn={api.useIssues}
                ItemComponent={IssueCard}
                SkeletonComponent={IssueCardSkeleton}
                pathname={pathname}
                paramsMap={paramsMap}
                defaultParams={defaultParamsIssues}
            />
        </ScrollView>
    );
}
