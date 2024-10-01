import ListWithFilters from "@/components/ListWithFilters";
import { PipelineCard, PipelineCardSkeleton } from "@/components/Pipeline/pipeline-card";
import { GlobalMergeRequestUIFilters } from "@/constants/UIFilters";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";

import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

export default function ProjectMergeRequestsList() {
    const { session } = useSession();
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const { projectId } = useLocalSearchParams();
    const defaultParamsProjectPR = {
    };
    const UIFilters = GlobalMergeRequestUIFilters
    const pathname = "/workspace/projects/[projectId]/pipelines/[iid]"
    const paramsMap = {
        "projectId": "project_id", "iid": "id"
    }
    return (
        <ScrollView
            className="flex-1 p-2 bg-background"
            contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
        >
            <Stack.Screen
                options={{
                    headerTitle: `Pipeline for Project`,
                }}
            />
            <ListWithFilters
                UIFilters={UIFilters}
                queryFn={api.useProjectPipelines}
                projectId={projectId}
                ItemComponent={PipelineCard}
                SkeletonComponent={PipelineCardSkeleton}
                pathname={pathname}
                paramsMap={paramsMap}
                defaultParams={defaultParamsProjectPR}
            />
        </ScrollView>
    );
}
