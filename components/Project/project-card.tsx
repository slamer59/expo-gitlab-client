


import { formatDate } from '@/lib/utils';

import { Octicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Pills } from '../Pills';
import { Skeleton } from '../ui/skeleton';
// name={project?.name}
// last_activity_at={project?.last_activity_at}
// path={project?.path}
// star_count={project?.star_count}
// avatar_url={project?.avatar_url}
// private={project?.private}
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  console.log(color)
  return color;
}

export function ProjectCardSkeleton() {

  return (
    <View className="flex-row items-center p-4 my-2 space-x-4 rounded-lg bg-card">
      <Skeleton className="w-12 h-12 m-2 space-x-4 rounded-full bg-muted" />
      <View className="flex-1 space-y-2">
        <Skeleton className="w-full h-4 mb-2 bg-muted" />
        <Skeleton className="w-3/4 h-4 bg-muted" />
      </View>
    </View>
  );
}

async function downloadImage(uri) {
  const filename = uri.split('/').pop();
  const path = FileSystem.documentDirectory + filename;

  const result = await FileSystem.downloadAsync(uri, path);

  if (result.status === 200) {
    console.log('Image downloaded to', path);
    return path;
  } else {
    console.error('Failed to download image');
    return null;
  }
}


export function ProjectCard({ item }) {

  const [projectPath, setImagePath] = useState(null);
  useEffect(() => {
    async function fetchImage() {
      if (item?.avatar_url) {
        try {
          const response = await fetch(item?.avatar_url);
          const blob = await response.blob();
          const reader = new FileReader();

          reader.onloadend = () => {
            const base64data = reader.result;
            setImagePath(base64data);
          };

          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Failed to download image:', error);
        }
      }
    }

    fetchImage();
  }, [item?.avatar_url]);


  return (
    <View className="flex-row p-3 mt-2 mb-2 rounded-lg bg-card">
      <View className="mr-2">
        {/* {IssueStatusIcon(issue, false)} */}
        {/* <Avatar alt={`${item?.name}'s Avatar`}>
           <AvatarImage
            source={{ uri: projectPath }}
          /> 
          <AvatarFallback>
            <Ionicons name="folder-outline" size={28} color="gray" />
          </AvatarFallback>
        </Avatar> */}
        <Octicons name="project" size={24} color="white" />
      </View>
      <View className="flex-1 mt-1">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-sm text-muted">{item?.namespace.name}</Text>
          <Text className="text-sm text-muted">{formatDate(item?.last_activity_at)}</Text>
        </View>
        <Text className="mb-2 text-lg font-bold text-white" testID={`project-card`}>{item?.name}</Text>
        <View className="flex-row items-center space-x-2">
          {item?.labels?.length > 0 && (
            <View className="flex-row flex-wrap">
              {item?.labels.map((label, index) => (
                <Pills
                  key={index}
                  label={label}
                  variant="purple"
                />
              ))}
            </View>
          )}
          {/* Comments */}
          {/* <View className="flex-row items-center">
              {IssueStatusIcon(item, false)}
              <Text className="ml-1 text-sm text-gray-400">2</Text>
            </View> */}
        </View>
      </View>
    </View>
  );
};


