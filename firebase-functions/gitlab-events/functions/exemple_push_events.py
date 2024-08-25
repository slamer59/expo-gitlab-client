import json

import requests

url = "http://127.0.0.1:5001/gitalchemy/us-central1/webhook_gitlab"
# url = "https://webhook-gitlab-et4qi4c73q-uc.a.run.app/webhook_gitlab"

payload = {
    "object_kind": "push",
    "event_name": "push",
    "before": "95790bf891e76fee5e1747ab589903a6a1f80f22",
    "after": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
    "ref": "refs/heads/master",
    "ref_protected": True,
    "checkout_sha": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
    "user_id": 4,
    "user_name": "John Smith",
    "user_username": "jsmith",
    "user_email": "john@example.com",
    "user_avatar": "https://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=8://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=80",
    "project_id": 59853773,
    "project": {
        "id": 59853773,
        "name": "Diaspora",
        "description": "",
        "web_url": "http://example.com/mike/diaspora",
        "avatar_url": None,
        "git_ssh_url": "git@example.com:mike/diaspora.git",
        "git_http_url": "http://example.com/mike/diaspora.git",
        "namespace": "Mike",
        "visibility_level": 0,
        "path_with_namespace": "mike/diaspora",
        "default_branch": "master",
        "homepage": "http://example.com/mike/diaspora",
        "url": "git@example.com:mike/diaspora.git",
        "ssh_url": "git@example.com:mike/diaspora.git",
        "http_url": "http://example.com/mike/diaspora.git",
    },
    "repository": {
        "name": "Diaspora",
        "url": "git@example.com:mike/diaspora.git",
        "description": "",
        "homepage": "http://example.com/mike/diaspora",
        "git_http_url": "http://example.com/mike/diaspora.git",
        "git_ssh_url": "git@example.com:mike/diaspora.git",
        "visibility_level": 0,
    },
    "commits": [
        {
            "id": "b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
            "message": "Update Catalan translation to e38cb41.\n\nSee https://gitlab.com/gitlab-org/gitlab for more information",
            "title": "Update Catalan translation to e38cb41.",
            "timestamp": "2011-12-12T14:27:31+02:00",
            "url": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
            "author": {"name": "Jordi Mallach", "email": "jordi@softcatala.org"},
            "added": ["CHANGELOG"],
            "modified": ["app/controller/application.rb"],
            "removed": [],
        },
        {
            "id": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
            "message": "fixed readme",
            "title": "fixed readme",
            "timestamp": "2012-01-03T23:36:29+02:00",
            "url": "http://example.com/mike/diaspora/commit/da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
            "author": {"name": "GitLab dev user", "email": "gitlabdev@dv6700.(none)"},
            "added": ["CHANGELOG"],
            "modified": ["app/controller/application.rb"],
            "removed": [],
        },
    ],
    "total_commits_count": 4,
}


payload = {
    "object_kind": "push",
    "event_name": "push",
    "before": "2edb935f6fa185faebb0ff1c1fd99b6f45d53f65",
    "after": "8b1ea1fdecdd74f9f629d1ac219583997fbb3154",
    "ref": "refs/heads/main",
    "ref_protected": True,
    "checkout_sha": "8b1ea1fdecdd74f9f629d1ac219583997fbb3154",
    "message": None,
    "user_id": 11041577,
    "user_name": "Thomas PEDOT",
    "user_username": "thomas.pedot1",
    "user_email": "",
    "user_avatar": "https://gitlab.com/uploads/-/system/user/avatar/11041577/avatar.png",
    "project_id": 59853773,
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
    "commits": [
        {
            "id": "8b1ea1fdecdd74f9f629d1ac219583997fbb3154",
            "message": "feat: Batch messages\n",
            "title": "feat: Batch messages",
            "timestamp": "2024-08-25T21:31:00+02:00",
            "url": "https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/commit/8b1ea1fdecdd74f9f629d1ac219583997fbb3154",
            "author": {"name": "Thomas PEDOT", "email": "[REDACTED]"},
            "added": [],
            "modified": [
                "firebase-functions/gitlab-events/functions/exemple_push_events.py",
                "firebase-functions/gitlab-events/functions/main.py",
                "firebase-functions/gitlab-events/functions/notifications.py",
            ],
            "removed": [],
        },
        {
            "id": "96307c42fef8513bd8d89fff94ec09e1f239132b",
            "message": "feat: multiple devices\n",
            "title": "feat: multiple devices",
            "timestamp": "2024-08-25T21:10:05+02:00",
            "url": "https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/commit/96307c42fef8513bd8d89fff94ec09e1f239132b",
            "author": {"name": "Thomas PEDOT", "email": "[REDACTED]"},
            "added": [
                "firebase-functions/gitlab-events/functions/exemple_create_webhook.py"
            ],
            "modified": [
                "firebase-functions/gitlab-events/functions/exemple_push_events.py",
                "firebase-functions/gitlab-events/functions/gitlab_webhook_handlers.py",
                "firebase-functions/gitlab-events/functions/main.py",
                "firebase-functions/gitlab-events/functions/notifications.py",
                "firebase-functions/gitlab-events/functions/requirements.txt",
            ],
            "removed": [],
        },
        {
            "id": "2edb935f6fa185faebb0ff1c1fd99b6f45d53f65",
            "message": "fix: push_event tested locally\n",
            "title": "fix: push_event tested locally",
            "timestamp": "2024-08-25T18:12:46+02:00",
            "url": "https://gitlab.com/thomas.pedot1/expo-gitlab-client/-/commit/2edb935f6fa185faebb0ff1c1fd99b6f45d53f65",
            "author": {"name": "Thomas PEDOT", "email": "[REDACTED]"},
            "added": [],
            "modified": [
                "firebase-functions/gitlab-events/functions/gitlab_webhook_handlers.py"
            ],
            "removed": [],
        },
    ],
    "total_commits_count": 3,
    "push_options": {},
    "repository": {
        "name": "expo-gitlab-client",
        "url": "git@gitlab.com:thomas.pedot1/expo-gitlab-client.git",
        "description": None,
        "homepage": "https://gitlab.com/thomas.pedot1/expo-gitlab-client",
        "git_http_url": "https://gitlab.com/thomas.pedot1/expo-gitlab-client.git",
        "git_ssh_url": "git@gitlab.com:thomas.pedot1/expo-gitlab-client.git",
        "visibility_level": 0,
    },
}

headers = {"Content-Type": "application/json"}

response = requests.post(url, data=json.dumps(payload), headers=headers)

print(response.status_code)
print(response.text)
