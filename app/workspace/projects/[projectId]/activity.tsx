import { formatDistanceToNow } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from "@/components/ui/text";
import { useGetData } from '@/lib/gitlab/hooks';
// Assume these components are defined in separate files

const ProjectActivityScreen = () => {
  const { projectId } = useLocalSearchParams();

  const params = {
    path: {
      id: projectId,
    },
    query: {
      // https://docs.gitlab.com/ee/api/events.html#list-a-projects-visible-events
      // action: "pushed",
      // target_type: "merge_request", 
      // before: "2024-01-01",
      // after: "2017-01-31",
      // sort: "asc",
    },
  };
  const { data: events, isLoading, isError } = useGetData(
    ["project_id_events", params.query],
    "/api/v4/projects/{id}/events",
    params
  );
  const onItemPressed = (item) => {
    // TODO: Implement navigation or action when an item is pressed
    console.log('Item pressed:', item);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onItemPressed(item)} className="px-4 py-2">
      <View className="flex-row">
        <Avatar alt={`${item.author.name}'s Avatar`}>
          <AvatarImage source={{ uri: item.author.avatar_url }} />
          <AvatarFallback>
            <Text>{`${item.author.name.substring(0, 2).toUpperCase()}`}</Text>
          </AvatarFallback>
        </Avatar>

        <View className="flex-1 ml-3">
          <Text className="font-semibold">
            {item.author.name}{' '}
            <Text className="text-sm font-normal">@{item.author.username}</Text>
          </Text>
          <Text className="text-sm text-gray-500">
            {item.action_name} {item.target_type}
            {item.target_type === 'merge_request' && (
              <Text>
                #{item.target_id} {item.target_title}
              </Text>
            )
            }
          </Text>
          <Text className="text-sm text-gray-500">
            {formatDistanceToNow(item.created_at, { addSuffix: true })}
          </Text>
        </View>
      </View>
      <View className="h-px mt-2 bg-gray-200" />
    </TouchableOpacity >
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      // refreshControl={
      //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      // }
      />
    </View>
  );
};

export default ProjectActivityScreen;
