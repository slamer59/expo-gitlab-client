import json

import requests

url = "http://127.0.0.1:5001/gitalchemy/us-central1/webhook_gitlab"
# url = "https://webhook-gitlab-et4qi4c73q-uc.a.run.app/webhook_gitlab"

payload = {
    "object_kind": "issue",
    "event_type": "issue",
    "user": {
        "id": 11041577,
        "name": "Thomas PEDOT",
        "username": "thomas.pedot1",
        "avatar_url": "https://gitlab.com/uploads/-/system/user/avatar/11041577/avatar.png",
        "email": "[REDACTED]",
    },
    "project": {
        "id": 59853773,
        "name": "expo-gitlab-client",
        "description": None,
        "web_url": "https://gitlab.com/thomas.pedot1/expo-gitlab-client",
        "avatar_url": None,
        "git_ssh_url": "git@gitlab.com:thomas.pedot1/expo-gitlab-client.git",
        "git_http_url": "https://gitlab.com/thomas.pedot1/expo-gitlab-client.git",
        "namespace": "Thomas PEDOT",
        "visibility_level": 0,
        "path_with_namespace": "thomas.pedot1/expo-gitlab-client",
        "default_branch": "main",
        "ci_config_path": "",
        "homepage": "https://gitlab.com/thomas.pedot1/expo-gitlab-client",
        "url": "git@gitlab.com:thomas.pedot1/expo-gitlab-client.git",
        "ssh_url": "git@gitlab.com:thomas.pedot1/expo-gitlab-client.git",
        "http_url": "https://gitlab.com/thomas.pedot1/expo-gitlab-client.git",
    },
    "object_attributes": {
        "author_id": 11041577,
        "closed_at": None,
        "confidential": False,
        "created_at": "2024-08-26 16:45:13 UTC",
        "description": "![Screenshot_20240826_183929_Expo_Go](https://gitlab.com/thomas.pedot1/expo-gitlab-client/uploads/45cbed3c7f7151c943111014ff7d25cd/Screenshot_20240826_183929_Expo_Go.jpg)",
        "discussion_locked": None,
        "due_date": None,
        "id": 152091639,
        "iid": 23,
        "last_edited_at": None,
        "last_edited_by_id": None,
        "milestone_id": None,
        "moved_to_id": None,
        "duplicated_to_id": None,
        "project_id": 59853773,
        "relative_position": None,
        "state_id": 1,
        "time_estimate": 0,
        "title": "Small UI fix",
        "updated_at": "2024-08-26 16:45:13 UTC",
        "updated_by_id": None,
        "weight": None,
        "health_status": None,
        "type": "Issue",
        "url": "https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/issues/23",
        "total_time_spent": 0,
        "time_change": 0,
        "human_total_time_spent": None,
        "human_time_change": None,
        "human_time_estimate": None,
        "assignee_ids": [],
        "assignee_id": None,
        "labels": [],
        "state": "opened",
        "severity": "unknown",
        "customer_relations_contacts": [],
        "action": "open",
    },
    "labels": [],
    "changes": {
        "author_id": {"previous": None, "current": 11041577},
        "created_at": {"previous": None, "current": "2024-08-26 16:45:13 UTC"},
        "description": {
            "previous": None,
            "current": "![Screenshot_20240826_183929_Expo_Go](/uploads/45cbed3c7f7151c943111014ff7d25cd/Screenshot_20240826_183929_Expo_Go.jpg)",
        },
        "id": {"previous": None, "current": 152091639},
        "iid": {"previous": None, "current": 23},
        "project_id": {"previous": None, "current": 59853773},
        "time_estimate": {"previous": None, "current": 0},
        "title": {"previous": None, "current": "Small UI fix"},
        "updated_at": {"previous": None, "current": "2024-08-26 16:45:13 UTC"},
    },
    "repository": {
        "name": "expo-gitlab-client",
        "url": "git@gitlab.com:thomas.pedot1/expo-gitlab-client.git",
        "description": None,
        "homepage": "https://gitlab.com/thomas.pedot1/expo-gitlab-client",
    },
}

headers = {"Content-Type": "application/json"}

response = requests.post(url, data=json.dumps(payload), headers=headers)

print(response.status_code)
print(response.text)
