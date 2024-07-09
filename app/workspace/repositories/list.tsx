import { GroupCard } from "@/components/ui/group-card";
import { RepositoryCard } from "@/components/ui/repository-card";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollView, View } from "react-native";
const baseUrl = "https://gitlab.com/api/v4"

const fetchProjects = async (groupId: string) => {
  const encodedGroupId = encodeURIComponent(groupId);

  const response = await fetch(`${baseUrl}/groups/${encodedGroupId}/projects`, {
    headers: {
      'PRIVATE-TOKEN': process.env.EXPO_PUBLIC_GITLAB_TOKEN
    }
  })
  const data = await response.json();
  return data
};

const fetchSubProjects = async (groupId: string) => {
  const encodedGroupId = encodeURIComponent(groupId);
  const response = await fetch(`${baseUrl}/groups/${encodedGroupId}/subgroups`, {
    headers: {
      'PRIVATE-TOKEN': process.env.EXPO_PUBLIC_GITLAB_TOKEN
    }
  })
  const data = await response.json();
  return data
};

const useProjects = (rootGroupId: string) => {
  return useQuery({
    queryKey: ['projects', rootGroupId],
    queryFn: () => fetchProjects(rootGroupId),
  });
};

export default function ModalScreen() {

  // Queries
  const rootGroupId = "jokosun"
  const { data, isLoading, isError } = useProjects(rootGroupId)
  const { data: subprojects } = useQuery({ queryKey: ['subprojects', rootGroupId], queryFn: () => fetchSubProjects(rootGroupId) })



  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error fetching data</Text>;
  }

  const repositories = data.filter((repo: { archived: boolean }) => !repo.archived)
    .map((repo: { id: any; name: any; description: any; avatar_url: any; }) => {
      return {
        id: repo.id,
        name: repo.name,
        description: repo.description,
        icon: repo.avatar_url,
      }
    })
  // console.log(subdata)
  const subrepositories = subprojects.filter((repo: { archived: boolean }) => !repo.archived)

  return (
    <ScrollView className="p-4 m-4 bg-white border border-gray-500 rounded-lg">
      {subrepositories.map((subrepo, index) =>
        <View key={index}>
          <View className='w-full p-4' >
            <GroupCard {...subrepo} handlePress={
              async () => {
                const data = await fetchProjects((subrepo.full_path))
                const filteredData = data.filter((repo: { archived: boolean }) => !repo.archived)
                  .map((repo: { id: any; name: any; description: any; avatar_url: any; }) => {
                    return {
                      id: repo.id,
                      name: repo.name,
                      description: repo.description,
                      icon: repo.avatar_url,

                    }
                  })

                return filteredData
              }
            } />
          </View>
        </View>
      )}
      <View className='w-full p-4 ' >
        {repositories.map((repo: React.JSX.IntrinsicAttributes & { id: string; name: string; description: string; icon: any; }, index: React.Key | null | undefined) =>
          <RepositoryCard key={index} {...repo} />
        )}
      </View>
    </ScrollView>
  );
}
