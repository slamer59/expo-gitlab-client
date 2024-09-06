import { IListItems } from "@/components/buttonList";

export function getCodeSectionItems(
  repository: { id: any },
  router: string[],
): IListItems[] {
  return [
    {
      icon: "git-branch-outline",
      text: "Code",
      kpi: "",
      onAction: () =>
        router.push(`workspace/projects/${repository.id}/code/list`),
    },
    {
      icon: "document-text-outline",
      text: "Commits",
      kpi: "",
      onAction: () =>
        router.push(`workspace/projects/${repository.id}/commits/list`),
      itemColor: "#A9A9A9",
    },
  ];
}
