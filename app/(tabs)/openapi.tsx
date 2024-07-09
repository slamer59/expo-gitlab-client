import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import { useQuery } from '@tanstack/react-query';

import axios from 'axios';

const url = 'https://gitlab.com/api/v4/projects';

const headers = {
  'accept': 'application/json',
  'private-token': process.env.EXPO_PUBLIC_GITLAB_TOKEN
};

const params = {
  'order_by': 'created_at',
  'sort': 'desc',
  'archived': 'false',
  'visibility': 'private',
  'owned': 'false',
  'starred': 'false',
  'imported': 'false',
  'membership': 'false',
  'with_issues_enabled': 'false',
  'with_merge_requests_enabled': 'false',
  'wiki_checksum_failed': 'false',
  'repository_checksum_failed': 'false',
  'include_hidden': 'false',
  'page': '1',
  'per_page': '20',
  'simple': 'false',
  'statistics': 'false',
  'with_custom_attributes': 'false'
};



const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjects(),
  });
};

async function fetchProjects() {
  console.log("fetching projects");
  const data = await axios.get(url, { headers, params })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error(error);
    });

  return data
};

export default function TabTwoScreen() {
  const { data: groups, isLoading, isError } = useProjects();

  return (
    <View className="items-center justify-center flex-1">
      <Text className="text-2xl font-bold">Tab Two</Text>
      <View className="w-4/5 h-1 my-6 bg-gray-200 dark:bg-gray-700" lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}
