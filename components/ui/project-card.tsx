


import { formatDate } from '@/lib/utils';

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Skeleton } from './skeleton';
// name={project.name}
// last_activity_at={project.last_activity_at}
// path={project.path}
// star_count={project.star_count}
// avatar_url={project.avatar_url}
// private={project.private}
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
    <View className="flex-row items-center p-4 space-x-4">
      <Skeleton className="w-12 h-12 m-2 space-x-4 bg-gray-300 rounded-full animate-pulse" />
      <View className="flex-1 space-y-2">
        <Skeleton className="w-full h-4 mb-2 bg-gray-500 animate-pulse" />
        <Skeleton className="w-3/4 h-4 bg-gray-300 animate-pulse" />
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


export function ProjectCard({ project }) {
  const [projectPath, setImagePath] = useState(null);
  useEffect(() => {
    async function fetchImage() {
      if (project.avatar_url) {
        try {
          const response = await fetch(project.avatar_url);
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
  }, [project.avatar_url]);


  // console.log(projectPath)
  return (
    <View className="flex-row items-start m-4">
      <View className='flex-row items-center m-2'>
        {/* {IssueStatusIcon(issue, false)} */}
        <Avatar alt={`${project.name}'s Avatar`}>
          <AvatarImage
            source={{ uri: projectPath }}
          />
          <AvatarFallback>
            <Ionicons name="folder-outline" size={28} color="gray" />
          </AvatarFallback>
        </Avatar>
      </View>
      <View className="space-y-1 flex-2">
        <Text className="text-light dark:text-dark">{project.namespace.name}</Text>
        <Text className="text-lg font-bold">{project.name}</Text>
        {/*{issue?.labels.length > 0 && (
          <View className='flex-row flex-wrap'>
            {issue?.labels.map((label) => (
              <Text
                key={label}
                className='mr-2 text-sm font-bold text-gray-700 bg-gray-200 rounded-md'
              >
                {label}
              </Text>
            ))}
          </View>
        )} */}
      </View>
      <View className="items-end flex-1">
        <Text className="text-xs text-light dark:text-dark">
          {formatDate(project.last_activity_at)}
        </Text>
      </View>
    </View>
    // <View className="flex-row items-start m-4">
    //   <View className='flex-row items-center m-2'>
    //     <Avatar alt={`${project.name}'s Avatar`}>
    //       <AvatarImage
    //         source={{ uri: project.avatar_url }}
    //       />
    //       <AvatarFallback>
    //         <Text className="text-lg font-medium text-gray-800">{project.name.charAt(0).toUpperCase()}</Text>
    //       </AvatarFallback>
    //     </Avatar>
    //   </View>
    //   <View className="space-y-1 flex-2">
    //     <Text className="text-sm font-medium text-gray-800">{project.name_with_namespace}</Text>
    //     <View className="flex-row items-center mt-1 space-x-2">
    //       {project.owner?.locked && <Ionicons name="lock-closed" size={12} color={`#${getRandomColor()}`} />}
    //       <Text className="text-xs text-gray-500">{project.owner?.name}</Text>
    //     </View>
    //     <View className="items-end flex-1">
    //       <Text className="text-xs text-light dark:text-dark">
    //         {formatDate(project.last_activity_at)}
    //       </Text>
    //     </View>
    //     <View className="flex-row items-center m-1 space-x-2">
    //       <Text className="justify-center m-1 text-xs text-gray-500">
    //         <Ionicons name="star" size={12} color="gold" /> {project.star_count} stars - { }
    //         {/* {formatDate(project.last_activity_at)} */}
    //       </Text>

    //     </View>
    //   </View>
    // </View >
  );
};


