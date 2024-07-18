



import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
// name={Issue.name}
// last_activity_at={Issue.last_activity_at}
// path={Issue.path}
// star_count={Issue.star_count}
// avatar_url={Issue.avatar_url}
// private={Issue.private}
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  console.log(color)
  return color;
}
// Issue {
//   "id": 149487572,
//   "iid": 14,
//   "project_id": 59853773,
//   "title": "Repositories",
//   "description": "",
//   "state": "opened",
//   "created_at": "2024-07-12T14:16:23.260Z",
//   "updated_at": "2024-07-12T14:16:23.260Z",
//   "closed_at": null,
//   "closed_by": null,
//   "labels": [
//     "enhancement"
//   ],
//   "milestone": {
//     "id": 4651253,
//     "iid": 1,
//     "project_id": 59853773,
//     "title": "Github clone",
//     "description": "Github clone pour la plupart des feature : \r\n- commit\r\n- merge request\r\n- edit file\r\n- notification",
//     "state": "active",
//     "created_at": "2024-07-12T13:49:34.304Z",
//     "updated_at": "2024-07-12T13:49:34.304Z",
//     "due_date": "2024-07-31",
//     "start_date": "2024-07-01",
//     "expired": false,
//     "web_url": "https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/milestones/1"
//   },
//   "assignees": [],
//   "author": {
//     "id": 11041577,
//     "username": "thomas.pedot1",
//     "name": "Thomas PEDOT",
//     "state": "active",
//     "locked": false,
//     "avatar_url": "https://gitlab.com/uploads/-/system/user/avatar/11041577/avatar.png",
//     "web_url": "https://gitlab.com/thomas.pedot1"
//   },
//   "type": "ISSUE",
//   "assignee": null,
//   "user_notes_count": 0,
//   "merge_requests_count": 1,
//   "upvotes": 0,
//   "downvotes": 0,
//   "due_date": null,
//   "confidential": false,
//   "discussion_locked": null,
//   "issue_type": "issue",
//   "web_url": "https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/issues/14",
//   "time_stats": {
//     "time_estimate": 0,
//     "total_time_spent": 0,
//     "human_time_estimate": null,
//     "human_total_time_spent": null
//   },
//   "task_completion_status": {
//     "count": 0,
//     "completed_count": 0
//   },
//   "blocking_issues_count": 0,
//   "has_tasks": true,
//   "task_status": "",
//   "_links": {
//     "self": "https://gitlab.com/api/v4/projects/59853773/issues/14",
//     "notes": "https://gitlab.com/api/v4/projects/59853773/issues/14/notes",
//     "award_emoji": "https://gitlab.com/api/v4/projects/59853773/issues/14/award_emoji",
//     "project": "https://gitlab.com/api/v4/projects/59853773",
//     "closed_as_duplicate_of": null
//   },
//   "references": {
//     "short": "#14",
//     "relative": "#14",
//     "full": "thomas.pedot1/expo-gitlab-client#14"
//   },
//   "severity": "UNKNOWN",
//   "moved_to_id": null,
//   "imported": false,
//   "imported_from": "none",
//   "service_desk_reply_to": null
// },
export function IssueCard({ issue }) {
  // https://gitlab.com/api/v4/issues
  return (
    <View className="flex-row items-center p-4 space-x-4">
      <View>
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
      <View className="space-y-1">
        <Text className="font-medium text-light dark:text-black">{issue.references.full}</Text>
        <Text className="font-bold">{issue.title}</Text>
        <View className="flex-row items-center m-1 space-x-2">
          <Text className="m-1 text-xs text-gray-500 justify-right">
            {/* <Ionicons name="star" size={12} color="gold" /> {star_count} stars - { } */}
            {new Date(issue.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>
      </View>
    </View >
  );
};


