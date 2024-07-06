import { Accordion } from "@/components/ui/accordion";
import { GroupCard } from "@/components/ui/group-card";
import { RepositoryCard } from "@/components/ui/repository-card";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";
const baseUrl = "https://gitlab.com/api/v4"
// const projectId = "react-storefront"
// const userId = "thomas.pedot1"
const groupId = "jokosun"

const fetchProjects = async () => {
  const response = await fetch(`${baseUrl}/groups/${groupId}/projects`, {
    headers: {
      'PRIVATE-TOKEN': process.env.EXPO_PUBLIC_GITLAB_TOKEN
    }
  })
  const data = await response.json();
  return data
};

const fetchSubprojects = async () => {
  const response = await fetch(`${baseUrl}/groups/${groupId}/subgroups`, {
    headers: {
      'PRIVATE-TOKEN': process.env.EXPO_PUBLIC_GITLAB_TOKEN
    }
  })
  const data = await response.json();
  return data
};

export default function ModalScreen() {

  // Queries
  const { data, isLoading, isError } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects })
  const { data: subdata } = useQuery({ queryKey: ['subprojects'], queryFn: fetchSubprojects })
  console.log(subdata)
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error fetching data</Text>;
  }

  const repositories = data.filter((repo: { archived: boolean }) => !repo.archived)
    .map((repo: { name: any; description: any; avatar_url: any; }) => {
      return {
        name: repo.name,
        description: repo.description,
        icon: repo.avatar_url,
      }
    })
  console.log(subdata)
  const subrepositories = subdata.filter((repo: { archived: boolean }) => !repo.archived)

  return (
    <View>
      {subrepositories.map((notificationStatus, index) =>
        <View key={index}>
          <View
            className='w-full p-4 bg-white rounded-lg shadow-md' >
            <Accordion
              type='multiple'
              collapsible
              defaultValue={['item-1']}
              className='w-full max-w-sm native:max-w-md'
            >

              <GroupCard {...notificationStatus} />
            </Accordion>
          </View>
        </View>
      )}
      {repositories.map((notificationStatus, index) =>
        <View key={index}>
          <RepositoryCard {...notificationStatus} />
        </View>
      )}
    </View >
  );
}
