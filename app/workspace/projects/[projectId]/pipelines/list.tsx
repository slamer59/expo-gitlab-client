import ListWithFilters from "@/components/ListWithFilters";
import { PipelineCard, PipelineCardSkeleton } from "@/components/Pipeline/pipeline-card";
import { GlobalMergeRequestUIFilters } from "@/constants/UIFilters";

import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

export default function ProjectMergeRequestsList() {
    const { projectId } = useLocalSearchParams();
    const defaultParamsProjectPR = {
        path: {
            id: projectId,
        },
        query: {
            // ... (previous query options remain unchanged)
        }
    };
    const UIFilters = GlobalMergeRequestUIFilters
    const query_cache_name = `project_id_pipelines_${projectId}`
    const pathname = "/workspace/projects/[projectId]/pipelines/[iid]"

    const endpoint = "/api/v4/projects/{id}/pipelines"
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
                ItemComponent={PipelineCard}
                SkeletonComponent={PipelineCardSkeleton}
                pathname={pathname}
                endpoint={endpoint}
                query_cache_name={query_cache_name}
                paramsMap={paramsMap}
                defaultParams={defaultParamsProjectPR}
            />
        </ScrollView>
    );
}
