import { GroupCard } from "@/components/ui/group-card";
import { RepositoryCard } from "@/components/ui/repository-card";
import { Text } from "@/components/ui/text";
import { getData } from "@/lib/gitlab/hooks";
import { T } from "@rn-primitives/tooltip/dist/types-opYTmxP0";
import React from "react";
import { ScrollView, View } from "react-native";

import { fetchData } from "@/lib/gitlab/hooks";
const baseUrl = "https://gitlab.com/api/v4"

export default function ModalScreen() {

  // Queries
  const rootGroupId = "thomas.pedot2"

  const params1 = { path: { id: rootGroupId } }
  const { data: projects, } = getData(
    ['projects', params1.path],
    "/api/v4/projects",
    params1
  );
  console.log(projects)
  const params = { path: { id: rootGroupId } }
  const { data, isLoading, isError } = getData(
    ['projects', params.path],
    "/api/v4/groups/{id}/projects",
    params
  );

  const { data: subprojects } = getData(
    ['subprojects', params.path],
    `/api/v4/groups/{id}/subgroups`,
    params
  )

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
  const subrepositories = subprojects?.filter((repo: { archived: boolean }) => !repo.archived)

  return (
    <ScrollView className="flex-1 p-4 px-4 m-4 bg-white border border-gray-500 rounded-lg">
      {subrepositories?.map((subrepo, index) =>
        <View key={index}>
          <View className='w-full p-4' >
            <GroupCard {...subrepo} handlePress={
              async () => {
                const paramSub = { path: { id: subrepo.full_path } }
                const data = await fetchData<T>("/api/v4/groups/{id}/projects", 'GET', paramSub)
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
    </ScrollView >
  );
}
