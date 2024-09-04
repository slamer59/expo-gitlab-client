import { IssueCard, IssueCardSkeleton } from '@/components/ui/issue-card';
import { APIEntitiesRelatedIssue } from '@/types/general';
import { useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

export function IssuesListComponent({ issues }: { issues: APIEntitiesRelatedIssue[] }) {
  const router = useRouter();
  // curl --header "PRIVATE-TOKEN: <your_access_token>" "https://gitlab.example.com/api/v4/projects/1/labels?with_counts=true"
  return (
    <>
      {issues
        ? issues?.map((issue, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              router.push({
                pathname: "/workspace/projects/[projectId]/issues/[issue_iid]",
                params: {
                  projectId: issue.project_id,
                  issue_iid: issue.iid,
                },
              });
            }}
          >
            <IssueCard key={index} issue={issue} />
            <View className="my-2 border-b border-gray-300" />
          </TouchableOpacity>
        ))
        : Array.from({ length: 5 }).map((_, index) => (
          <>
            <IssueCardSkeleton key={index} />
            <View className="my-2 border-b border-gray-300" />
          </>
        ))
      }
    </>
  );
}
