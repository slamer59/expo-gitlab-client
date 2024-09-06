import { useSession } from "@/lib/session/SessionProvider";
import { fetchUrl } from "@/lib/utils";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

export const useProjectDetails = () => {
    const { session } = useSession();
    const { projectId } = useLocalSearchParams();

    const selfQuery = useQuery({
        queryKey: ["self"],
        queryFn: () => fetchUrl(`https://gitlab.com/api/v4/projects/${projectId}`, session.token),
        retry: false,
    });

    const urls = selfQuery.data?._links || {};
    const otherQueries = useQueries({
        queries: Object.entries(urls).map(([key, url]) => ({
            queryKey: [key, url],
            queryFn: () => fetchUrl(url, session.token),
            retry: false,
            enabled: !!selfQuery.data,
        })),
    });

    const isLoading = selfQuery.isLoading || otherQueries.some((query) => query.isLoading);
    const error = selfQuery.error || otherQueries.find((query) => query.error)?.error;

    if (isLoading || error) {
        return { isLoading, error };
    }

    const urlData = otherQueries.reduce((acc, query, index) => {
        const key = Object.keys(urls)[index];
        if (query.data) {
            acc[key] = query.data;
        }
        return acc;
    }, {});

    return {
        projectData: {
            repository: urlData["self"],
            mergeRequest: urlData["merge_requests"],
            repoBranches: urlData["repo_branches"],
            members: urlData["members"],
        },
        isLoading,
        error,
    };
};
