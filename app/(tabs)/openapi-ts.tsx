import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import { useQuery } from '@tanstack/react-query';

import type { paths } from "@/lib/gitlab/api";

import createClient from "openapi-fetch";
const baseUrl = 'https://gitlab.com';

const client = createClient<paths>({ baseUrl: baseUrl });


const headers = {
  accept: 'application/json',
  'private-token': process.env.EXPO_PUBLIC_GITLAB_TOKEN
}
const query = {
  order_by: 'created_at',
  sort: 'desc',
  archived: false,
  visibility: 'private',
  owned: false,
  starred: false,
  imported: false,
  membership: false,
  with_issues_enabled: false,
  with_merge_requests_enabled: false,
  wiki_checksum_failed: false,
  repository_checksum_failed: false,
  include_hidden: false,
  page: 1,
  per_page: 20,
  simple: false,
  statistics: false,
  with_custom_attributes: false,
}



const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjects(),
  });
};

async function fetchProjects() {
  const { data, error } = await client.GET('/api/v4/projects', {
    params: {
      query: query,
    },
    headers: headers
  }).catch((error) => {
    console.log(error);
  });
  
  return data
};

export default function TabTwoScreen() {
  const { data: groups, isLoading, isError } = useProjects();
  const descriptions = groups?.map((group) => group.name).join("\n");
  
  return (
    <View className="items-center justify-center flex-1">
      {groups?.map((group) => {
        return  <Text>{group.name}</Text>
      })
    }

      <Text className="text-2xl font-bold">Tab Two</Text>
      <View className="w-4/5 h-1 my-6 bg-gray-200 dark:bg-gray-700" lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}
