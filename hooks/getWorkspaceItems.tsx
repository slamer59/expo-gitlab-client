import { IListItems } from "@/components/buttonList";

interface IProject {
    repository: {
        id: number;
        open_issues_count: number;
    };
    mergeRequests: any[];
    members: any[];
}

export function getWorkspaceItems(project: IProject, router: string[]): IListItems[] {
    return [
        {
            icon: "alert-circle-outline",
            text: "Issues",
            kpi: project?.repository?.open_issues_count || 0,
            onAction: () => router.push(`workspace/projects/${project?.repository?.id}/issues/list`),
            itemColor: "bg-issues",
        },
        {
            icon: "git-merge",
            text: "Merge Requests",
            kpi: project?.mergeRequests ? project?.mergeRequests.length : 0,
            onAction: () => router.push(
                `workspace/projects/${project?.repository?.id}/merge-requests/list`
            ),
            itemColor: "bg-merge-requests",
        },
        {
            icon: "play-outline",
            text: "CI/CD",
            kpi: "",
            onAction: () => router.push(
                `workspace/projects/${project?.repository?.id}/pipelines/list`
            ),
            itemColor: "bg-cicd",
        },
        {
            icon: "people-circle-outline",
            text: "Members",
            kpi: project?.members.length || 0,
            onAction: () => router.push(`workspace/projects/${project?.repository?.id}/members/list`),
            itemColor: "bg-members",
        },
        {
            icon: "document-text-outline",
            text: "Licences",
            kpi: "",
            onAction: () => router.push(
                `workspace/projects/${project?.repository?.id}/licences/list`
            ),
            itemColor: "bg-licences",
        },
        {
            icon: "star-outline",
            text: "Starred",
            kpi: project?.repository?.star_count || "",
            onAction: () => router.push(`workspace/projects/${project?.repository?.id}/starred/list`),
            itemColor: "bg-starred",
        },
    ];
}
