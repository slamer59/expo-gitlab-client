import json

import requests

url = "http://127.0.0.1:5001/gitalchemy/us-central1/webhook_gitlab"
# url = "https://webhook-gitlab-et4qi4c73q-uc.a.run.app/webhook_gitlab"

payload = {
    "object_kind": "feature_flag",
    "project": {
        "id": 59853773,
        "name": "Gitlab Test",
        "description": "Aut reprehenderit ut est.",
        "web_url": "http://example.com/gitlabhq/gitlab-test",
        "avatar_url": None,
        "git_ssh_url": "git@example.com:gitlabhq/gitlab-test.git",
        "git_http_url": "http://example.com/gitlabhq/gitlab-test.git",
        "namespace": "GitlabHQ",
        "visibility_level": 20,
        "path_with_namespace": "gitlabhq/gitlab-test",
        "default_branch": "master",
        "ci_config_path": None,
        "homepage": "http://example.com/gitlabhq/gitlab-test",
        "url": "http://example.com/gitlabhq/gitlab-test.git",
        "ssh_url": "git@example.com:gitlabhq/gitlab-test.git",
        "http_url": "http://example.com/gitlabhq/gitlab-test.git",
    },
    "user": {
        "id": 1,
        "name": "Administrator",
        "username": "root",
        "avatar_url": "https://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon",
        "email": "admin@example.com",
    },
    "user_url": "http://example.com/root",
    "object_attributes": {
        "id": 6,
        "name": "test-feature-flag",
        "description": "test-feature-flag-description",
        "active": True,
    },
}

headers = {"Content-Type": "application/json"}

response = requests.post(url, data=json.dumps(payload), headers=headers)

print(response.status_code)
print(response.text)
