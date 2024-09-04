import { ButtonList, IListItems } from "@/components/buttonList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { getData } from "@/lib/gitlab/hooks";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

const ProjectDetailsScreen = () => {
  const { projectId } = useLocalSearchParams();

  const router = useRouter();
  const params = {
    path: {
      id: projectId,
    },
    query: {
      statistics: false,
      with_custom_attributes: false,
      license: false,
    },
  };
  const {
    data: repository,
    isLoading,
    isError,
  } = getData(["projects_id", params.query], "/api/v4/projects/{id}", params);
  // console.log(repository);

  // KPI => _links
  const listItems: IListItems[] = [
    {
      icon: "alert-circle-outline",
      text: "Issues",
      kpi: repository?.open_issues_count || "",
      onAction: () => {
        router.push(`workspace/projects/${repository.id}/issues/list`);
      },
      itemColor: "#3de63d",
    },
    {
      icon: "git-merge",
      text: "Merge Requests",
      kpi: "",
      itemColor: "#3e64ed",
    },
    { icon: "play-outline", text: "CI/CD", kpi: "", itemColor: "#d5ea4e" },
    // { icon: 'chatbubbles-outline', text: 'Discussions', kpi: ""},
    { icon: "eye-outline", text: "Watchers", kpi: "" },
    // { icon: 'folder-open-outline', text: 'Repositories', screen: 'workspace/repositories', kpi: "" },
    { icon: "people-circle-outline", text: "Contributors", kpi: "" },
    { icon: "document-text-outline", text: "Licences", kpi: "" },
    {
      icon: "star-outline",
      text: "Starred",
      kpi: repository?.star_count || "",
    },
  ];
  const listItemsSecond = [
    {
      icon: "git-branch-outline",
      text: "Code",
      kpi: repository?.open_issues_count || "",
    },
    { icon: "document-text-outline", text: "Commits", kpi: "" },
  ];

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error fetching data</Text>;
  }
  // console.log(repository);
  return (
    <ScrollView className="flex-1">
      <Stack.Screen
        options={{
          title: "Project Details",
        }}
      />
      <View className="p-4 m-2">
        <View className="flex-row items-center">
          <Avatar alt={`${repository?.owner?.name}'s Avatar`}>
            <AvatarImage
              source={{ uri: repository?.owner?.avatar_url || repository?.namespace?.avatar_url || "https://example.com/default-avatar.jpg" }}
            />
            <AvatarFallback>
              <Ionicons name="folder-outline" size={28} color="gray" />
            </AvatarFallback>
          </Avatar>
          <Text className="ml-2 text-lg font-bold text-light dark:text-slate-500">
            {repository?.owner?.name || repository?.namespace?.name || "Default name"}
          </Text>
        </View>
        <Text className="mb-4 text-2xl font-bold">
          {repository.name_with_namespace}
        </Text>
        <Text className="mb-4 text-base">{repository.description}</Text>

        <View className="flex-row items-center">
          <Ionicons name="lock-closed-outline" size={16} color="black" />
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
          <View className="flex-row items-center mr-4">
            <Ionicons name="star" size={16} color="gold" />
            <Text className="ml-2 text-lg font-bold text-light dark:text-black">
              {repository.star_count || 0} stars
            </Text>
          </View>
          <View className="flex-row items-center mr-4">
            <Ionicons name="git-network" size={16} color="red" />
            <Text className="ml-2 text-lg font-bold text-light dark:text-black">
              {repository.forks_count} forks
            </Text>
          </View>
        </View>
        <Text>{repository.language}</Text>
      </View>
      <View className="p-4 m-2 bg-gray-200 rounded-lg">
        <Text className="text-lg font-[600]">WorkSpace</Text>
        <ButtonList isSimple={false} listItems={listItems} />
      </View>
      <View className="p-4 m-2 bg-gray-200 rounded-lg">
        <TouchableOpacity
          className="flex-row items-center justify-between py-2"
          onPress={() => { }}
        >
          <View className="flex flex-row items-center">
            <Ionicons name="git-branch-outline" size={24} color="gray" />
            <Text className="ml-2 text-base text-gray-950 ">
              {repository.default_branch}
            </Text>
          </View>
          <Text className="ml-2 font-bold text-right text-blue-500">
            CHANGE BRANCH
          </Text>
        </TouchableOpacity>
        <ButtonList listItems={listItemsSecond} />
      </View>
    </ScrollView>
  );
};

export default ProjectDetailsScreen;
