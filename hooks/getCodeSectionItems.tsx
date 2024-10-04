import { IListItems } from "@/components/buttonList";
import { Router } from "expo-router";

export function getCodeSectionItems(
  project: { id: string },
  router: Router,
  branch_ref?: string,
): IListItems[] {

  return [
    {
      icon: "code-slash-outline",
      text: "Code",
      kpi: "",
      onAction: () =>
        router.push(`tree/${project.id}?ref=${branch_ref}`),
      itemColor: "bg-merge-requests",
    },
    {
      icon: "document-text-outline",
      text: "Commits",
      kpi: "",
      onAction: () =>
        router.push(`workspace/projects/${project.id}/commits/list`),
      itemColor: "bg-commits",
    },
  ];
}
