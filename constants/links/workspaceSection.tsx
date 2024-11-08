import { IListItems } from "@/components/Buttons/buttonList";
import { Router } from "expo-router";

interface IProject {
    project: {
        id: number;
        open_issues_count: number;
    };
    mergeRequests: any[];
    members: any[];
    pipelines: any[];
}

export function getWorkspaceItems(projectDetails: IProject, router: Router, selectedBranch?: string): IListItems[] {

    return [
        {
            icon: "alert-circle-outline",
            text: "Issues",
            kpi: projectDetails?.project.open_issues_count || 0,
            onAction: () => router.push(`workspace/projects/${projectDetails?.project?.id}/issues/list`),
            itemColor: "#3de63d",
        },
        {
            icon: "git-pull-request",
            text: "Merge Requests",
            kpi: projectDetails?.mergeRequests.length >= 20 ? '20+' : projectDetails?.mergeRequests.length,
            onAction: () => router.push(
                `workspace/projects/${projectDetails?.project?.id}/merge-requests/list`
            ),
            itemColor: "#3e64ed",
        },
        {
            icon: "play-outline",
            text: "CI/CD",
            kpi: projectDetails?.pipelines?.length >= 20 ? '20+' : projectDetails?.pipelines.length,
            onAction: () => router.push(
                `workspace/projects/${projectDetails?.project?.id}/pipelines/list`
            ),
            itemColor: "#d5ea4e",
        },
        {
            icon: "people-circle-outline",
            text: "Members",
            kpi: projectDetails?.members.length || 0,
            onAction: () => router.push(`workspace/projects/${projectDetails?.project?.id}/members/list`),
            itemColor: "#33bfff",
        },
        ...(projectDetails?.project?.license_url
            ? [
                {
                    icon: "document-text-outline",
                    text: "Licences",
                    kpi: "",
                    onAction: () => router.push({
                        pathname: "/tree/[projectId]/[fileId]",
                        params: {
                            projectId: projectDetails?.project?.id,
                            path: encodeURIComponent(projectDetails?.project?.license_url),
                            fileId: encodeURIComponent(projectDetails?.project?.license_url),
                            ref: selectedBranch || projectDetails?.project?.default_branch,
                        }
                    }
                    ),
                    itemColor: "#3e64ed",
                },
            ]
            : []),
        ...(projectDetails?.project?.readme_url
            ? [
                {
                    icon: "document-text",
                    text: "README",
                    kpi: "",
                    onAction: () => router.push({
                        pathname: "/tree/[projectId]/[fileId]",
                        params: {
                            projectId: projectDetails?.project?.id,
                            path: "README.md",//encodeURIComponent(projectDetails?.project?.readme_url),
                            fileId: "README.md",
                            ref: selectedBranch || projectDetails?.project?.default_branch,
                        }
                    }),
                    itemColor: "#3e64ed",
                },
            ]
            : []),
        {
            icon: "star-outline",
            text: "Starred",
            kpi: projectDetails?.project?.star_count || "",
            onAction: () => router.push(`workspace/projects/${projectDetails?.project?.id}/starred/list`),
            itemColor: "#d5e",
        },
    ];
}
