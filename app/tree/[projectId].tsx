import { Text } from "@/components/Themed";
import FileItem from "@/components/ui/file-item";
import { getData } from "@/lib/gitlab/client";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function FileExplorerScreen() {

  const { path, ref, projectId } = useLocalSearchParams();

  const params = {
    path: {
      id: projectId, // Replace with your project ID
      ref: ref || 'main', // Replace with your branch name
    },
    query: {
      recursive: 'false',
      page: '1',
      per_page: '100',
      pagination: 'legacy',
      path: path || '', // Replace with your desired path
    }
  }

  const { data: files, isLoading, isError } = getData(
    ['project_repository_tree', params.query],
    "/api/v4/projects/{id}/repository/tree",
    params
  );
  const parentPath = path ? path.split('/').slice(0, -1).join('/') : ""

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error fetching data</Text>;
  }
  console.log(files)
  return (
    <ScrollView className="flex-1 p-4">
      <Stack.Screen
        options={{
          title: "Explore",
        }}
      />

      <Link
        href={{
          pathname: '/tree/[projectId]',
          params: { projectId: projectId, path: encodeURIComponent(parentPath) },
        }}>
        <View className="flex-row items-center mb-4 space-x-2">
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text className="text-lg font-bold">{path}</Text>
        </View>
      </Link>

      <View className="space-y-2">
        {files?.map((file, index) => {
          if (file.type === "tree") {
            return <FileItem
              key={index}
              type={file.type}
              name={file.name}
              href={{
                pathname: '/tree/[projectId]',
                params: { projectId: projectId, path: encodeURIComponent(file.path) },
              }} />
          } else {
            return <FileItem
              key={index}
              type={file.type}
              name={file.name}
              href={{
                pathname: '/tree/[projectId]/[fileId]',
                params: {
                  projectId: projectId,
                  path: encodeURIComponent(file.path),
                  fileId: file.id
                },
              }} />
          }

        })}
      </View>
    </ScrollView>
  );
}
