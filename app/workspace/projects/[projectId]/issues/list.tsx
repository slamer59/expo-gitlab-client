import { getData } from "@/lib/gitlab/client";
import { getToken } from "@/lib/utils";
import { Text } from "@rn-primitives/slot";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function IssuesList() {
  const { projectId } = useLocalSearchParams();
  const toekn  = getToken();

  const params = {
    query: { scope: "all" },
  };

  const { data: issues } = getData(["issues", params.query], `/issues`, params);
  console.log(toekn, 9999999);
  return <View></View>;
}
