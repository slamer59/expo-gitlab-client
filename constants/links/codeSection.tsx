import { Router } from "expo-router";

import { IListItems } from "@/components/Buttons/buttonList";

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
      itemColor: "#B00020",
    },
    {
      icon: "document-text-outline",
      text: "Commits",
      kpi: "",
      onAction: () =>
        router.push(`workspace/projects/${project.id}/commits/list`),
      itemColor: "#A9A9A9",
    },
  ];
}
