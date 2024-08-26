import { IssueCard, IssueCardSkeleton } from "@/components/ui/issue-card";
import { APIEntitiesRelatedIssue } from "@/types/general";
import { Link } from "expo-router";

export function IssuesListComponent({ issues }: { issues: APIEntitiesRelatedIssue[] }) {
  return (
    <>
      {issues
        ? issues?.map((issue, index) => (
            <Link
              key={index}
              href={{
                pathname: "/workspace/projects/[projectId]/issues/[issue_iid]",
                params: {
                  projectId: issue.project_id,
                  issue_iid: issue.iid,
                },
              }}
            >
              <IssueCard key={index} issue={issue} />
            </Link>
          ))
        : Array.from({ length: 5 }).map((_, index) => (
            <IssueCardSkeleton key={index} />
          ))}
    </>
  );
}
