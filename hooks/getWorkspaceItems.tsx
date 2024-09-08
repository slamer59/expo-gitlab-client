import { IListItems } from "@/components/buttonList";

interface IProject {
    repository: {
        id: number;
        open_issues_count: number;
    };
    mergeRequest: any[];
    members: any[];
}

export function getWorkspaceItems(project: IProject, router: string[]): IListItems[] {
    return [
        {
            icon: "alert-circle-outline",
            text: "Issues",
            kpi: project?.repository?.open_issues_count || 0,
            onAction: () => router.push(`workspace/projects/${project.repository.id}/issues/list`),
            itemColor: "#3de63d",
        },
        {
            icon: "git-merge",
            text: "Merge Requests",
            kpi: project?.mergeRequest ? project?.mergeRequest.length : 0,
            onAction: () => router.push(
                `workspace/projects/${project?.repository.id}/merge-requests/list`
            ),
            itemColor: "#3e64ed",
        },
        {
            icon: "play-outline",
            text: "CI/CD",
            kpi: "",
            onAction: () => router.push(
                `workspace/projects/${project?.repository.id}/pipelines/list`
            ),
            itemColor: "#d5ea4e",
        },
        {
            icon: "people-circle-outline",
            text: "Members",
            kpi: project?.members.length || 0,
            onAction: () => router.push(`workspace/projects/${project?.repository.id}/members/list`),
        },
        {
            icon: "document-text-outline",
            text: "Licences",
            kpi: "",
            onAction: () => router.push(
                `workspace/projects/${project?.repository.id}/licences/list`
            ),
        },
        {
            icon: "star-outline",
            text: "Starred",
            kpi: project?.repository?.star_count || "",
            onAction: () => router.push(`workspace/projects/${project?.repository.id}/starred/list`),
        },
    ];
}
