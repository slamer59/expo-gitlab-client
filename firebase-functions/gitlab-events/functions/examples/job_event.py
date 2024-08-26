import json

import requests

url = "http://127.0.0.1:5001/gitalchemy/us-central1/webhook_gitlab"
# url = "https://webhook-gitlab-et4qi4c73q-uc.a.run.app/webhook_gitlab"

payload = {
    "object_kind": "build",
    "ref": "gitlab-script-trigger",
    "tag": False,
    "before_sha": "2293ada6b400935a1378653304eaf6221e0fdb8f",
    "sha": "2293ada6b400935a1378653304eaf6221e0fdb8f",
    "build_id": 1977,
    "build_name": "test",
    "build_stage": "test",
    "build_status": "created",
    "build_created_at": "2021-02-23T02:41:37.886Z",
    "build_started_at": None,
    "build_finished_at": None,
    "build_duration": None,
    "build_queued_duration": 1095.588715,
    "build_allow_failure": False,
    "build_failure_reason": "script_failure",
    "retries_count": 2,
    "pipeline_id": 2366,
    "project_id": 59853773,
    "project_name": "gitlab-org/gitlab-test",
    "user": {
        "id": 3,
        "name": "User",
        "email": "user@gitlab.com",
        "avatar_url": "http://www.gravatar.com/avatar/e32bd13e2add097461cb96824b7a829c?s=80\u0026d=identicon",
    },
    "commit": {
        "id": 2366,
        "name": "Build pipeline",
        "sha": "2293ada6b400935a1378653304eaf6221e0fdb8f",
        "message": "test\n",
        "author_name": "User",
        "author_email": "user@gitlab.com",
        "status": "created",
        "duration": None,
        "started_at": None,
        "finished_at": None,
    },
    "repository": {
        "name": "gitlab_test",
        "description": "Atque in sunt eos similique dolores voluptatem.",
        "homepage": "http://192.168.64.1:3005/gitlab-org/gitlab-test",
        "git_ssh_url": "git@192.168.64.1:gitlab-org/gitlab-test.git",
        "git_http_url": "http://192.168.64.1:3005/gitlab-org/gitlab-test.git",
        "visibility_level": 20,
    },
    "project": {
        "id": 59853773,
        "name": "Gitlab Test",
        "description": "Atque in sunt eos similique dolores voluptatem.",
        "web_url": "http://192.168.64.1:3005/gitlab-org/gitlab-test",
        "avatar_url": None,
        "git_ssh_url": "git@192.168.64.1:gitlab-org/gitlab-test.git",
        "git_http_url": "http://192.168.64.1:3005/gitlab-org/gitlab-test.git",
        "namespace": "Gitlab Org",
        "visibility_level": 20,
        "path_with_namespace": "gitlab-org/gitlab-test",
        "default_branch": "master",
    },
    "runner": {
        "active": True,
        "runner_type": "project_type",
        "is_shared": False,
        "id": 380987,
        "description": "shared-runners-manager-6.gitlab.com",
        "tags": ["linux", "docker"],
    },
    "environment": None,
    "source_pipeline": {
        "project": {
            "id": 41,
            "web_url": "https://gitlab.example.com/gitlab-org/upstream-project",
            "path_with_namespace": "gitlab-org/upstream-project",
        },
        "pipeline_id": 30,
        "job_id": 3401,
    },
}

headers = {"Content-Type": "application/json"}

response = requests.post(url, data=json.dumps(payload), headers=headers)

print(response.status_code)
print(response.text)
