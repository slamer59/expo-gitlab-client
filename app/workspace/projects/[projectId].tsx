import { ButtonList, IListItems } from "@/components/buttonList";
import { ChooseBranches } from "@/components/ChooseBranche";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { useSession } from "@/lib/session/SessionProvider";
import { Ionicons } from "@expo/vector-icons";
import { useQueries } from "@tanstack/react-query";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

const fetchUrl = async (url, token) => {
  try {
    const response = await fetch(url, {
      headers: {
        "PRIVATE-TOKEN": token,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
};

const ProjectDetailsScreen = () => {
  const { session } = useSession();
  const [selectedBranch, setSelectedBranch] = useState("");
  const { projectId } = useLocalSearchParams();
  const router = useRouter();

  const urls = {
    // "issues": `https://gitlab.com/api/v4/projects/${projectId}/issues`,
    // "labels": `https://gitlab.com/api/v4/projects/${projectId}/labels`,
    members: `https://gitlab.com/api/v4/projects/${projectId}/members`,
    merge_requests: `https://gitlab.com/api/v4/projects/${projectId}/merge_requests?state=opened`,
    repo_branches: `https://gitlab.com/api/v4/projects/${projectId}/repository/branches`,
    self: `https://gitlab.com/api/v4/projects/${projectId}?statistics=false&with_custom_attributes=false&license=false`,
  };

  const queries = useQueries({
    queries: Object.entries(urls).map(([key, url]) => ({
      queryKey: [key, url],
      queryFn: () => fetchUrl(url, session.token),
      retry: false,
      onError: (error) => {
        console.error(`Error fetching ${key} from ${url}:`, error);
      },
    })),
  });
  let index = 0;

  const urlData = queries.reduce((acc, query) => {
    const key = Object.keys(urls)[index];
    if (query.data) {
      acc[key] = query.data;
    }
    index++;
    return acc;
  }, {});
  const isLoading = queries.some((query) => query.isLoading);

  // Repository
  let repository = {};
  let mergeRequest = {};
  let repoBranches = {};
  let members = {};

  let listItems: IListItems[];
  let listItemsSecond;
  let repoBranchesName;
  if (!isLoading) {
    repository = urlData["self"];
    // Merge Request
    mergeRequest = urlData["merge_requests"];
    // Repo Branches
    repoBranches = urlData["repo_branches"];
    repoBranchesName = repoBranches.map((branch) => branch.name);
    defaultBranchName = (repoBranches.find(branch => branch.default) || {}).name || repoBranches[0]?.name;


    // Members
    members = urlData["members"];

    // KPI => _links
    listItems = [
      {
        icon: "alert-circle-outline",
        text: "Issues",
        kpi: repository?.open_issues_count || 0,
        onAction: () => {
          router.push(
            `workspace/projects/${repository.id}/issues/list`,
          );
        },
        itemColor: "#3de63d",
      },
      {
        icon: "git-merge",
        text: "Merge Requests",
        kpi: mergeRequest.length || 0,
        onAction: () => {
          router.push(
            `workspace/projects/${repository.id}/merge-requests/list`,
          );
        },
        itemColor: "#3e64ed",
      },
      {
        icon: "play-outline",
        text: "CI/CD",
        kpi: "",
        onAction: () => {
          router.push(
            `workspace/projects/${repository.id}/pipelines/list`,
          );
        },
        itemColor: "#d5ea4e",
      },
      // { icon: 'chatbubbles-outline', text: 'Discussions', kpi: ""},
      // { icon: "eye-outline", text: "Watchers", kpi: "" },
      // { icon: 'folder-open-outline', text: 'Repositories', screen: 'workspace/repositories', kpi: "" },
      {
        icon: "people-circle-outline",
        text: "Members",
        kpi: members.length || 0,
        onAction: () => {
          router.push(
            `workspace/projects/${repository.id}/members/list`,
          );
        },
        // itemColor: "#sdq",
      },
      {
        icon: "document-text-outline", text: "Licences", kpi: "",
        onAction: () => {
          router.push(
            `workspace/projects/${repository.id}/licences/list`,
          );
        },
        // itemColor: "#ed3e3e",
      },
      {
        icon: "star-outline",
        text: "Starred",
        kpi: repository?.star_count || "",
        onAction: () => {
          router.push(
            `workspace/projects/${repository.id}/starred/list`,
          );
        },
        // itemColor: "#fff",
      },
    ];
    listItemsSecond = [
      {
        icon: "git-branch-outline",
        text: "Code",
        kpi: "",
        onAction: () => {
          router.push(
            `workspace/projects/${repository.id}/code/list`,
          );
        },
        // itemColor: "#3de63d",
      },
      {
        icon: "document-text-outline", text: "Commits", kpi: "",
        onAction: () => {
          router.push(
            `workspace/projects/${repository.id}/commits/list`,
          );
        },
        itemColor: "#A9A9A9",
      },
    ];
  }
  const handleValueChange = (value) => {
    setSelectedBranch(value);
  };

  return (
    <ScrollView className="flex-1">
      <Stack.Screen
        options={{
          title: "Project Details",
        }}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <View className="p-2 m-4">
            <View className="flex-row items-center">
              <Avatar alt={`${repository?.owner?.name}'s Avatar`}>
                <AvatarImage
                  source={{
                    uri:
                      repository?.owner?.avatar_url ||
                      repository?.namespace?.avatar_url ||
                      "https://example.com/default-avatar.jpg",
                  }}
                />
                <AvatarFallback>
                  <Ionicons
                    name="folder-outline"
                    size={28}
                    color="gray"
                  />
                </AvatarFallback>
              </Avatar>
              <Text className="ml-2 text-lg font-bold text-light dark:text-slate-500">
                {repository?.owner?.name ||
                  repository?.namespace?.name ||
                  "Default name"}
              </Text>
            </View>
            <Text className="text-2xl font-bold">
              {repository.name_with_namespace}
            </Text>
            <Text className="text-base ">
              {repository.description}
            </Text>

            <View className="flex-row items-center">
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color="black"
              />
              <Text className="ml-4 text-lg font-bold text-light dark:text-black">
                {repository.visibility || "Default vis"}
              </Text>
            </View>
            <Link
              className="flex w-full overflow-hidden"
              asChild
              href={repository.web_url}
            >
              <TouchableOpacity className="flex-row items-center mr-4">
                <Ionicons name="link" size={16} color="black" />
                <Text
                  numberOfLines={1}
                  className="ml-4 text-lg font-bold break-normal text-ellipsis text-light dark:text-black"
                >
                  {repository.web_url}
                </Text>
              </TouchableOpacity>
            </Link>

            <View className="flex-row">
              <View className="flex-row items-center mr-4 text-lg font-bold text-light dark:text-black">
                <Ionicons name="star" size={16} color="gold" />
                <Text className="ml-1 font-bold">
                  {repository.star_count || 0}
                </Text>
                <Text> stars</Text>
              </View>
              <View className="flex-row items-center mr-4 text-lg font-bold text-light dark:text-black">
                <Ionicons
                  name="git-network"
                  size={16}
                  color="red"
                />
                <Text className="ml-1 font-bold">
                  {repository.forks_count}
                </Text>
                <Text> forks</Text>
              </View>
            </View>
            <Text>{repository.language}</Text>
          </View>
          <View className="p-4 m-2 bg-gray-200 rounded-lg">
            <Text className="text-lg font-[600]">Workspace</Text>
            <ButtonList isSimple={false} listItems={listItems} />
          </View>
          <View className="p-4 m-2 bg-gray-200 rounded-lg">
            <TouchableOpacity
              className="flex-row items-center justify-between py-2"
              onPress={() => { }}
            >
              <View className="flex flex-row items-center">
                <Ionicons
                  name="code-slash-outline"
                  size={24}
                  color="black"
                />
                <Text className="ml-2 font-bold text-gray-950 ">
                  {selectedBranch?.label || defaultBranchName}
                </Text>
              </View>
              <ChooseBranches
                branches={repoBranchesName}
                defaultValue={{ value: defaultBranchName, label: defaultBranchName }}
                handleValueChange={handleValueChange}
              />
            </TouchableOpacity>
            <ButtonList listItems={listItemsSecond} />
          </View>
        </>
      )
      }
      {/* {isError && <Error error={error} />} */}
    </ScrollView >
  );
};

export default ProjectDetailsScreen;
