import { formatDate } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

export function IssueCard({ issue }) {
  // console.log(issue);
  return (
    <View className="flex-row items-start p-4 space-x-4">
      <View className="flex-1">
        {issue.state === 'opened' ? (
          <Ionicons name="checkmark-circle" size={24} color="green" />
        ) : issue.state === 'closed' ? (
          <Ionicons name="close-circle" size={24} color="red" />
        ) : issue.state === 'locked' ? (
          <Ionicons name="lock-closed" size={24} color="orange" />
        ) : issue.state === 'merged' ? (
          <Ionicons name="git-branch" size={24} color="purple" />
        ) : (
          <Ionicons name="help-circle" size={24} color="blue" />
        )}
      </View>
      <View className="space-y-1 flex-2">
        <Text className="text-lg font-bold">{issue.title}</Text>
        <Text className="text-light dark:text-dark">{issue.references.full}</Text>
        {issue?.labels.length > 0 && (
          <View className='flex-row flex-wrap mb-4'>
            {issue?.labels.map((label) => (
              <Text
                key={label}
                className='px-2 py-1 mb-2 mr-2 text-sm font-bold text-gray-700 bg-gray-200 rounded-md'
              >
                {label}
              </Text>
            ))}
          </View>
        )}
      </View>
      <View className="items-end flex-1">
        <Text className="text-xs text-light dark:text-dark">
          {formatDate(issue.updated_at)}
        </Text>
      </View>
    </View>
  );
};
