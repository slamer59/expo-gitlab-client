import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import Error from "@/components/Error";
import { HeaderRight } from "@/components/HeaderRight";
import Loading from "@/components/Loading";
import { Text } from "@/components/Themed";
import FileItem from "@/components/ui/file-item";
import { useGetData } from "@/lib/gitlab/hooks";

export default function FileExplorerScreen() {
  const [error, setError] = useState<string | null>(null);
  const { path, ref, projectId } = useLocalSearchParams();
  const isRoot = !path || path === "";

  const params = {
    path: {
      id: projectId,
      ref: ref || "main",
    },
    query: {
      recursive: "false",
      page: "1",
      per_page: "100",
      pagination: "legacy",
      path: path || "",
    },
  };

  const { data: files, isLoading, isError } = useGetData(
    ["project_repository_tree", params.query, path],
    "/api/v4/projects/{id}/repository/tree",
    params
  );

  const parentPath = path ? path.split("/").slice(0, -1).join("/") : "";

  if (isError) {
    setError({
      message: "Error fetching data",
      digest: `Params: ${JSON.stringify(params)}`,
    });
  }

  return (
    <ScrollView
      className="flex-1 p-2 bg-background"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Stack.Screen
        options={{
          // title: "Explore",
          headerLeft: () => (
            <ParentLink
              projectId={projectId}
              parentPath={parentPath}
              path={path}
              isRoot={isRoot}
            />
          ),
          headerTitleStyle: {
            color: 'white',
          },
          headerRight: () => (
            <HeaderRight dropdownLabel="Project Options" />
          ),
        }}
      />

      {isError && <Error error={error} />}
      {isLoading ? (
        <Loading />
      ) : (
        <FileList files={files} projectId={projectId} branch_ref={ref || "main"} />
      )}
    </ScrollView>
  );
}

function ParentLink({ projectId, parentPath, path, isRoot }) {
  const router = useRouter();

  const handlePress = () => {
    if (isRoot) {
      // Go to the project page if we're at the root
      router.push({
        pathname: "/workspace/projects/[projectId]",
        params: {
          projectId: projectId,
        },
      });
    } else if (parentPath === "") {
      // Go to the root if the parent path is empty
      router.push({
        pathname: "/tree/[projectId]",
        params: {
          projectId: projectId,
        },
      });
    } else {
      // Navigate to the parent directory
      router.push({
        pathname: "/tree/[projectId]",
        params: {
          projectId: projectId,
          path: encodeURIComponent(parentPath),
        },
      });
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} className="flex-row items-center">
      <Ionicons name="arrow-back" size={24} color="white" />
      <Text className="ml-2 text-lg font-bold text-white">
        {isRoot ? "Project" : path}
      </Text>
    </TouchableOpacity>
  );
}

function FileList({ files, projectId, branch_ref }) {
  return (
    <View className="p-4 bg-card ">
      {files?.map((file, index) => (
        <FileItem
          key={index}
          type={file.type}
          name={file.name}
          href={
            file.type === "tree"
              ? {
                pathname: "/tree/[projectId]",
                params: {
                  projectId: projectId,
                  path: encodeURIComponent(file.path),
                  ref: branch_ref
                },
              }
              : {
                pathname: "/tree/[projectId]/[fileId]",
                params: {
                  projectId: projectId,
                  path: encodeURIComponent(file.path),
                  fileId: file.id,
                  ref: branch_ref
                },
              }
          }
        />
      ))}
    </View>
  );
}
