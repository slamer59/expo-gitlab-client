import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { getData } from '@/lib/gitlab/client';
const params = {
  query:
  {
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
}


export default function TabTwoScreen() {
  const { data: groups, isLoading, isError } = getData(['projects'], "/api/v4/projects", params);
  const descriptions = groups?.map((group) => group.name).join("\n");
  console.log(groups);
  return (
    <View className="items-center justify-center flex-1">
      {groups?.map((group) => {
        return <Text>{group.name}</Text>
      })
      }

      <Text className="text-2xl font-bold">Tab Two</Text>
      <View className="w-4/5 h-1 my-6 bg-gray-200 dark:bg-gray-700" lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}
