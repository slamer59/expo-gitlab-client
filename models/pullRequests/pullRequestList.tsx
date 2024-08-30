import { IssueCard, IssueCardSkeleton } from "@/components/ui/issue-card";
import {
  APIEntitiesMergeRequest,
  APIEntitiesRelatedIssue,
} from "@/types/general";

import { PullRequestCard } from "./pullRequestCard";
import { View } from "react-native";
import { useNavigation, useRouter } from "expo-router";

export function PullRequestListComponent({
  pullRequests,
}: {
  pullRequests: APIEntitiesMergeRequest[];
}) {
 
  return (
    <View className="w-full flex-1 flex justify-between">
      {pullRequests
        ? pullRequests?.map((pullRequestItem, index) => (
            <PullRequestCard
             
              key={index}
              pullRequestItem={pullRequestItem}
            />
          ))
        : Array.from({ length: 5 }).map((_, index) => (
            <IssueCardSkeleton key={index} />
          ))}
    </View>
  );
}
