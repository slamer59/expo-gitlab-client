import json

import requests

url = "http://127.0.0.1:5001/gitalchemy/us-central1/webhook_gitlab"
# url = "https://webhook-gitlab-et4qi4c73q-uc.a.run.app/webhook_gitlab"

payload = {
    "object_kind": "access_token",
    "project": {
        "id": 59853773,
        "name": "Flight",
        "description": "Eum dolore maxime atque reprehenderit voluptatem.",
        "web_url": "https://example.com/flightjs/Flight",
        "avatar_url": None,
        "git_ssh_url": "ssh://git@example.com/flightjs/Flight.git",
        "git_http_url": "https://example.com/flightjs/Flight.git",
        "namespace": "Flightjs",
        "visibility_level": 0,
        "path_with_namespace": "flightjs/Flight",
        "default_branch": "master",
        "ci_config_path": None,
        "homepage": "https://example.com/flightjs/Flight",
        "url": "ssh://git@example.com/flightjs/Flight.git",
        "ssh_url": "ssh://git@example.com/flightjs/Flight.git",
        "http_url": "https://example.com/flightjs/Flight.git",
    },
    "object_attributes": {
        "user_id": 90,
        "created_at": "2024-01-24 16:27:40 UTC",
        "id": 25,
        "name": "acd",
        "expires_at": "2024-01-26",
    },
    "event_name": "expiring_access_token",
}

headers = {"Content-Type": "application/json"}

response = requests.post(url, data=json.dumps(payload), headers=headers)

print(response.status_code)
print(response.text)
