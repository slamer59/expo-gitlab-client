import { IListItems } from "@/components/buttonList";
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

export function getWorkspaceItems(projectDetails: IProject, router: Router): IListItems[] {
    return [
        {
            icon: "alert-circle-outline",
            text: "Issues",
            kpi: projectDetails?.project.open_issues_count || 0,
            onAction: () => router.push(`workspace/projects/${projectDetails?.project?.id}/issues/list`),
            itemColor: "bg-issues",
        },
        {
            icon: "git-pull-request",
            text: "Merge Requests",
            kpi: projectDetails?.mergeRequests.length >= 20 ? '20+' : projectDetails?.mergeRequests.length,
            onAction: () => router.push(
                `workspace/projects/${projectDetails?.project?.id}/merge-requests/list`
            ),
            itemColor: "bg-merge-requests",
        },
        {
            icon: "play-outline",
            text: "CI/CD",
            kpi: projectDetails?.pipelines?.length >= 20 ? '20+' : projectDetails?.pipelines.length,
            onAction: () => router.push(
                `workspace/projects/${projectDetails?.project?.id}/pipelines/list`
            ),
            itemColor: "bg-cicd",
        },
        {
            icon: "people-circle-outline",
            text: "Members",
            kpi: projectDetails?.members.length || 0,
            onAction: () => router.push(`workspace/projects/${projectDetails?.project?.id}/members/list`),
            itemColor: "bg-members",
        },
        ...(projectDetails?.project?.license_url
            ? [
                {
                    icon: "document-text-outline",
                    text: "Licences",
                    kpi: "",
                    onAction: () => router.push(
                        `workspace/projects/${projectDetails?.project?.id}/licence`
                    ),
                    itemColor: "bg-licences",
                },
            ]
            : []),
        ...(projectDetails?.project?.readme_url
            ? [
                {
                    icon: "document-text",
                    text: "README",
                    kpi: "",
                    onAction: () => router.push(
                        `workspace/projects/${projectDetails?.project?.id}/readme`
                    ),
                    itemColor: "bg-licences",
                },
            ]
            : []),
        {
            icon: "star-outline",
            text: "Starred",
            kpi: projectDetails?.project?.star_count || "",
            onAction: () => router.push(`workspace/projects/${projectDetails?.project?.id}/starred/list`),
            itemColor: "bg-starred",
        },
    ];
}
