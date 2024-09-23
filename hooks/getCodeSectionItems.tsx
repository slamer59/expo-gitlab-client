import { IListItems } from "@/components/buttonList";
import { Router } from "expo-router";

export function getCodeSectionItems(
  project: { id: string },
  router: Router,
): IListItems[] {

  return [
    {
      icon: "code-slash-outline",
      text: "Code",
      kpi: "",
      onAction: () =>
        router.push(`workspace/projects/${project.id}/code/list`),
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
