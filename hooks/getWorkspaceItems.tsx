import { IListItems } from "@/components/buttonList";
import { Router } from "expo-router";

interface IProject {
    project: {
        id: number;
        open_issues_count: number;
    };
    mergeRequests: any[];
    members: any[];
}

export function getWorkspaceItems(projectDetails: IProject, router: Router): IListItems[] {
    return [
        {
            icon: "alert-circle-outline",
            text: "Issues",
            kpi: projectDetails?.projectDetails?.open_issues_count || 0,
            onAction: () => router.push(`workspace/projects/${projectDetails?.project?.id}/issues/list`),
            itemColor: "bg-issues",
        },
        {
            icon: "git-merge",
            text: "Merge Requests",
            kpi: projectDetails?.mergeRequests ? projectDetails?.mergeRequests.length : 0,
            onAction: () => router.push(
                `workspace/projects/${projectDetails?.project?.id}/merge-requests/list`
            ),
            itemColor: "bg-merge-requests",
        },
        {
            icon: "play-outline",
            text: "CI/CD",
            kpi: "",
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
        {
            icon: "document-text-outline",
            text: "Licences",
            kpi: "",
            onAction: () => router.push(
                `workspace/projects/${projectDetails?.project?.id}/licences/list`
            ),
            itemColor: "bg-licences",
        },
        {
            icon: "star-outline",
            text: "Starred",
            kpi: projectDetails?.project?.star_count || "",
            onAction: () => router.push(`workspace/projects/${projectDetails?.project?.id}/starred/list`),
            itemColor: "bg-starred",
        },
    ];
}
