import functools
import inspect
import logging
from typing import List, Optional

from firebase_functions import logger
from pydantic import BaseModel
from tqdm import tqdm


def log_event_function(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        logger.info(f"{func.__name__}: trigged")
        result = func(*args, **kwargs)
        logger.info(f"{func.__name__}: {len(result.messages)} messages created.")
        return result

    return wrapper


class EventMessage(BaseModel):
    """
    A class used to represent an event message.

    """

    title: Optional[str] = None
    body: Optional[str] = None
    sound: Optional[str] = "default"
    to: Optional[str] = None
    ttl: int = 3600
    expiration: int = 3600
    channel_id: Optional[str] = "default"
    priority: Optional[str] = "high"
    data: dict = {}
    badge: Optional[str] = None
    category: Optional[str] = None
    display_in_foreground: Optional[bool] = None
    subtitle: Optional[str] = None
    mutable_content: Optional[bool] = None


class EventMessageList(BaseModel):
    messages: List[EventMessage]


class Author(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None


class Commit(BaseModel):
    id: int | str
    message: Optional[str] = None
    title: Optional[str] = None
    timestamp: Optional[str] = None
    url: Optional[str] = None
    # author: Author
    added: Optional[List[str]] = []
    modified: Optional[List[str]] = []
    removed: Optional[List[str]] = []


class Project(BaseModel):
    id: int
    name: Optional[str] = None
    description: Optional[str] = None
    web_url: Optional[str] = None
    avatar_url: Optional[str] = None
    git_ssh_url: Optional[str] = None
    git_http_url: Optional[str] = None
    namespace: Optional[str] = None
    visibility_level: int
    path_with_namespace: Optional[str] = None
    default_branch: Optional[str] = None
    homepage: Optional[str] = None
    url: Optional[str] = None
    ssh_url: Optional[str] = None
    http_url: Optional[str] = None


class Repository(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    description: Optional[str] = None
    homepage: Optional[str] = None
    git_http_url: Optional[str] = None
    git_ssh_url: Optional[str] = None
    visibility_level: Optional[int] = None


class PushEventData(BaseModel):
    object_kind: Optional[str] = None
    before: Optional[str] = None
    after: Optional[str] = None
    ref: Optional[str] = None
    checkout_sha: Optional[str] = None
    user_id: int
    user_name: Optional[str] = None
    user_username: Optional[str] = None
    user_email: Optional[str] = None
    user_avatar: Optional[str] = None
    project_id: int
    project: Project
    repository: Repository
    commits: List[Commit]
    total_commits_count: int


class Assignee(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    avatar_url: Optional[str] = None


class TagEventData(BaseModel):
    object_kind: Optional[str] = None
    before: Optional[str] = None
    after: Optional[str] = None
    ref: Optional[str] = None
    checkout_sha: Optional[str] = None
    user_id: int
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None
    project_id: int
    project: Project
    repository: Repository
    commits: List[Commit]
    total_commits_count: int


class DeploymentEventData(BaseModel):
    object_kind: Optional[str] = None
    status: Optional[str] = None
    status_changed_at: Optional[str] = None
    deployment_id: int
    deployable_id: int
    deployable_url: Optional[str] = None
    environment: Optional[str] = None
    environment_tier: Optional[str] = None
    environment_slug: Optional[str] = None
    environment_external_url: Optional[str] = None
    project: Project
    short_sha: Optional[str] = None
    user: Author
    user_url: Optional[str] = None
    commit_url: Optional[str] = None
    commit_title: Optional[str] = None


class IssueEventData(BaseModel):
    object_kind: Optional[str] = None
    user: Author
    project: Project
    repository: Repository
    object_attributes: dict
    assignee: Optional[Author] = None
    assignees: Optional[List[Author]] = []
    labels: List[dict]
    changes: dict


class MergeRequestEventData(BaseModel):
    object_kind: Optional[str] = None
    user: Author
    project: Project
    repository: Repository
    object_attributes: dict
    assignee: Optional[Author] = None
    assignees: Optional[List[Author]] = []
    labels: List[dict]
    changes: dict


class Wiki(BaseModel):
    web_url: Optional[str] = None
    git_ssh_url: Optional[str] = None
    git_http_url: Optional[str] = None
    path_with_namespace: Optional[str] = None
    default_branch: Optional[str] = None


class WikiPageObejctAttributes(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    format: Optional[str] = None
    message: Optional[str] = None
    slug: Optional[str] = None
    url: Optional[str] = None
    action: Optional[str] = None
    diff_url: Optional[str] = None
    version_id: Optional[str] = None


class WikiPageEventData(BaseModel):
    object_kind: Optional[str] = None
    user: Author
    project: Project
    wiki: Wiki
    object_attributes: WikiPageObejctAttributes


class PipelineEventData(BaseModel):
    object_kind: Optional[str] = None
    object_attributes: dict
    merge_request: Optional[dict] = None
    user: Author
    project: Project
    commit: Commit
    builds: List[dict]


class User(BaseModel):
    id: int
    name: Optional[str] = None
    email: Optional[str] = None
    avatar_url: Optional[str] = None


class SourcePipelineProject(BaseModel):
    id: int
    web_url: Optional[str] = None
    path_with_namespace: Optional[str] = None


class SourcePipeline(BaseModel):
    project: SourcePipelineProject
    pipeline_id: int
    job_id: int


class Runner(BaseModel):
    active: bool
    runner_type: Optional[str] = None
    is_shared: bool
    id: int
    description: Optional[str] = None
    tags: list[str]


class JobEventData(BaseModel):
    object_kind: Optional[str] = None
    ref: Optional[str] = None
    tag: bool
    before_sha: Optional[str] = None
    sha: Optional[str] = None
    build_id: int
    build_name: Optional[str] = None
    build_stage: Optional[str] = None
    build_status: Optional[str] = None
    build_created_at: Optional[str] = None
    build_started_at: Optional[str]
    build_finished_at: Optional[str]
    build_duration: Optional[int]
    build_queued_duration: float
    build_allow_failure: bool
    build_failure_reason: Optional[str] = None
    retries_count: int
    pipeline_id: int
    project_id: int
    project_name: Optional[str] = None
    user: Optional[User] = None
    commit: Commit
    repository: Repository
    project: Project
    runner: Runner
    environment: Optional[str]
    source_pipeline: Optional[SourcePipeline]


class GroupEventData(BaseModel):
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    group_name: Optional[str] = None
    group_path: Optional[str] = None
    group_id: int
    user_username: Optional[str] = None
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    user_id: int
    group_access: Optional[str] = None
    group_plan: Optional[str]
    expires_at: Optional[str] = None
    event_name: Optional[str] = None


class SubgroupEventData(BaseModel):
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    event_name: Optional[str] = None
    name: Optional[str] = None
    path: Optional[str] = None
    full_path: Optional[str] = None
    group_id: int
    parent_group_id: int
    parent_name: Optional[str] = None
    parent_path: Optional[str] = None
    parent_full_path: Optional[str] = None


class FeatureFlagAttributes(BaseModel):
    id: int
    name: Optional[str] = None
    description: Optional[str] = None
    active: bool


class FeatureFlagEventData(BaseModel):
    object_kind: Optional[str] = None
    project: Project
    user: Optional[User]
    user_url: Optional[str] = None
    object_attributes: FeatureFlagAttributes


class Link(BaseModel):
    id: int
    external: bool
    link_type: Optional[str] = None
    name: Optional[str] = None
    url: Optional[str] = None


class Source(BaseModel):
    format: Optional[str] = None
    url: Optional[str] = None


class Assets(BaseModel):
    count: int
    links: List[Link]
    sources: List[Source]


class ReleaseEventData(BaseModel):
    id: int
    created_at: Optional[str] = None
    description: Optional[str] = None
    name: Optional[str] = None
    released_at: Optional[str] = None
    tag: Optional[str] = None
    project: Project
    url: Optional[str] = None
    action: Optional[str] = None
    assets: Assets
    commit: Commit
    # Add other fields as needed


class EmojiEventData(BaseModel):
    object_kind: Optional[str] = None
    user: Optional[User]
    project: Project
    emoji: Optional[str] = None
    name: Optional[str] = None
    url: Optional[str] = None
    created_at: Optional[str] = None


class AccessTokenEventData(BaseModel):
    object_kind: Optional[str] = None
    object_attributes: dict
    user: Optional[User] = None
    project: Project


@log_event_function
@log_event_function
def push_event(data, push_tokens):

    messages = [
        {
            "title": f"New push to {data['project']['name']} by {data['user_name']}",
            "body": f"{data['total_commits_count']} new commits added.",
            "to": push_token,
            "data": {
                "project_name": data["project"]["name"],
                "user_name": data["user_name"],
                "total_commits_count": data["total_commits_count"],
                "url": f"/workspace/projects/{data['project']['id']}",
            },
        }
        for push_token in push_tokens
    ]

    event_message = EventMessageList(messages=messages)
    return event_message


@log_event_function
def tag_push_event(data, push_tokens):
    messages = [
        {
            "title": f"New tag push to {data['project']['name']} by {data['user_name']}",
            "body": f"Tag {data['ref']} pushed.",
            "to": push_token,
            "data": {
                "project_name": data["project"]["name"],
                "user_name": data["user_name"],
                "tag": data["ref"],
                "url": f"/workspace/projects/{data['project']['id']}",
            },
        }
        for push_token in push_tokens
    ]

    event_message = EventMessageList(messages=messages)
    return event_message


@log_event_function
def issue_event(data, push_tokens):
    messages = [
        {
            "title": f"Issue {data['object_attributes']['title']} in {data['project']['name']}",
            "body": f"{data['user']['name']} {data['object_attributes']['action']} issue.",
            "to": push_token,
            "data": {
                "project_name": data["project"]["name"],
                "user_name": data["user"]["name"],
                "issue_title": data["object_attributes"]["title"],
                "action": data["object_attributes"]["action"],
                "url": f"/workspace/projects/{data['project']['id']}/issues/{data['object_attributes']['id']}",
            },
        }
        for push_token in push_tokens
    ]

    event_message = EventMessageList(messages=messages)
    return event_message


@log_event_function
def comment_event(data, push_tokens):
    messages = [
        {
            "title": f"New comment in {data['project']['name']}",
            "body": f"{data['user']['name']} commented.",
            "to": push_token,
            "data": {
                "project_name": data["project"]["name"],
                "user_name": data["user"]["name"],
                "url": f"/workspace/projects/{data['id']}/",
            },
        }
        for push_token in push_tokens
    ]

    event_message = EventMessageList(messages=messages)
    return event_message


@log_event_function
def merge_request_event(data, push_tokens):
    messages = [
        {
            "title": f"Merge request {data['object_attributes']['title']} in {data['project']['name']}",
            "body": f"{data['user']['name']} {data['object_attributes']['action']} merge request.",
            "to": push_token,
            "data": {
                "project_name": data["project"]["name"],
                "user_name": data["user"]["name"],
                "merge_request_title": data["object_attributes"]["title"],
                "action": data["object_attributes"]["action"],
                "url": f"/workspace/projects/{data['project']['id']}/merge-requests/{data['object_attributes']['id']}",
            },
        }
        for push_token in push_tokens
    ]

    event_message = EventMessageList(messages=messages)
    return event_message


@log_event_function
def wiki_page_event(data, push_tokens):
    messages = [
        {
            "title": f"Wiki page {data['object_attributes']['title']} in {data['project']['name']}",
            "body": f"{data['user']['name']} {data['object_attributes']['action']} wiki page.",
            "to": push_token,
            "data": {
                "project_name": data["project"]["name"],
                "user_name": data["user"]["name"],
                "wiki_page_title": data["object_attributes"]["title"],
                "action": data["object_attributes"]["action"],
                "url": f"/workspace/projects/{data['project']['id']}/wikis/{data['object_attributes']['slug']}",
            },
        }
        for push_token in push_tokens
    ]

    event_message = EventMessageList(messages=messages)
    return event_message


@log_event_function
def pipeline_event(data, push_tokens):
    messages = [
        {
            "title": f"Pipeline {data['object_attributes']['status']} in {data['project']['name']}",
            "body": f"Pipeline {data['object_attributes']['status']} by {data['user']['name']}.",
            "to": push_token,
            "data": {
                "project_name": data["project"]["name"],
                "user_name": data["user"]["name"],
                "pipeline_status": data["object_attributes"]["status"],
                "url": f"/workspace/projects/{data['project']['id']}/pipelines/{data['object_attributes']['id']}",
            },
        }
        for push_token in push_tokens
    ]

    event_message = EventMessageList(messages=messages)
    return event_message


@log_event_function
def job_event(data, push_tokens):
    messages = [
        {
            "title": f"Job {data['build_status']} in {data['project_name']}",
            "body": f"Job {data['build_status']} by {data['user']['name']}.",
            "to": push_token,
            "data": {
                "project_name": data["project_name"],
                "user_name": data["user"]["name"],
                "job_status": data["build_status"],
                "url": f"/workspace/projects/{data['project_id']}/pipelines/{data['pipeline_id']}/jobs/{data['build_id']}",
            },
        }
        for push_token in push_tokens
    ]

    event_message = EventMessageList(messages=messages)
    return event_message


@log_event_function
def deployment_event(data, push_tokens):
    messages = [
        {
            "title": "Deployment event",
            "body": "A deployment event occurred.",
            "to": push_token,
            "data": {
                "project_name": data["project"]["name"],
                "user_name": data["user"]["name"],
                "deployment_status": data["status"],
                "url": f"/workspace/projects/{data['project']['id']}/deployments/{data['id']}",
            },
        }
        for push_token in push_tokens
    ]

    event_message = EventMessageList(messages=messages)
    return event_message


@log_event_function
def feature_flag_event(data, push_tokens):
    messages = [
        {
            "title": "Feature flag event",
            "body": "A feature flag event occurred.",
            "to": push_token,
            "data": {
                "project_name": data["project"]["name"],
                "user_name": data["user"]["name"],
                "feature_flag_name": data["object_attributes"]["name"],
                "url": f"/workspace/projects/{data['project']['id']}/feature_flags/{data['object_attributes']['id']}",
            },
        }
        for push_token in push_tokens
    ]

    event_message = EventMessageList(messages=messages)
    return event_message


@log_event_function
def release_event(data, push_tokens):
    messages = [
        {
            "title": "Release event",
            "body": "A release event occurred.",
            "to": push_token,
            "data": {
                "project_name": data["project"]["name"],
                # "release_tag": data['object_attributes']["tag"],
                # "action": data['object_attributes']["action"],
                "url": f"/workspace/projects/{data['project']['id']}/releases/{data['object_attributes']['id']}",
            },
        }
        for push_token in push_tokens
    ]

    event_message = EventMessageList(messages=messages)
    return event_message


@log_event_function
def emoji_event(data, push_tokens):
    messages = [
        {
            "title": "Emoji event",
            "body": "An emoji event occurred.",
            "to": push_token,
            "data": {
                "project_name": data["project"]["name"],
                "user_name": data["user"]["name"],
                "emoji_name": data["object_attributes"]["name"],
                "url": f"/workspace/projects/{data['project']['id']}/issues/{data['object_attributes']['issue_id']}",
            },
        }
        for push_token in push_tokens
    ]

    event_message = EventMessageList(messages=messages)
    return event_message


@log_event_function
def access_token_event(data, push_tokens):
    messages = [
        {
            "title": "Access token event",
            "body": f"An access token event occurred in project {data['project']['name']}.",
            "to": push_token,
            "data": {
                "project_name": data["project"]["name"],
                "url": f"/workspace/projects/{data['project']['id']}/settings/access_tokens",
            },
        }
        for push_token in push_tokens
    ]

    event_message = EventMessageList(messages=messages)
    return event_message


class MergeRequest(BaseModel):
    id: int


class CommentOjectAttributes(BaseModel):
    note: Optional[str] = None
    author_id: int
    created_at: Optional[str] = None
    url: Optional[str] = None
    project_id: int
    commit_id: Optional[str] = None
    noteable_id: Optional[int] = None
    noteable_type: Optional[str] = None
    system: bool
    updated_at: Optional[str] = None
    noteable_iid: int
    author: User
    attachment: Optional[str]
    line_code: Optional[str]
    commit_url: Optional[str]
    st_diff: Optional[str]


class CommentEventData(BaseModel):
    object_kind: Optional[str] = None
    user: User
    project_id: int
    repository: Repository
    # object_attributes: Optional[CommentOjectAttributes]
    merge_request: MergeRequest


def get_project_id(data):
    """
    Extracts the project_id from the data dictionary.

    Args:
    data (dict): The data dictionary containing the project_id and object_kind.

    Returns:
    int: The project_id.
    """

    project_id = data.get("project_id")
    event_type = data.get("object_kind")
    if event_type == "push":
        return PushEventData(**data).project_id
    if event_type == "tag_push":
        return TagEventData(**data).project_id
    if event_type == "issue":
        return IssueEventData(**data).project.id
    if event_type == "note":
        return CommentEventData(**data).project_id
    if event_type == "merge_request":
        return MergeRequestEventData(**data).project.id
    if event_type == "wiki_page":
        return WikiPageEventData(**data).project.id
    if event_type == "pipeline":
        return PipelineEventData(**data).project.id
    if event_type == "build":
        return JobEventData(**data).project_id
    if event_type == "deployment":
        return DeploymentEventData(**data).project.id
    if event_type == "feature_flag":
        return FeatureFlagEventData(**data).project.id
    if event_type == "release":
        return ReleaseEventData(**data).project.id
    if event_type == "emoji":
        return EmojiEventData(**data).project.id
    if event_type == "access_token":
        return AccessTokenEventData(**data).project.id
    return project_id


def handle_event(data, push_tokens):
    event_type = data.get("object_kind")
    logger.info(f"Sending {len([push_tokens])} messages with event {event_type}.")

    if event_type == "push":
        return push_event(data, push_tokens)
    if event_type == "tag_push":
        return tag_push_event(data, push_tokens)
    if event_type == "issue":
        return issue_event(data, push_tokens)
    if event_type == "note":
        return comment_event(data, push_tokens)
    if event_type == "merge_request":
        return merge_request_event(data, push_tokens)
    if event_type == "wiki_page":
        return wiki_page_event(data, push_tokens)
    if event_type == "pipeline":
        return pipeline_event(data, push_tokens)
    if event_type == "build":
        return job_event(data, push_tokens)
    if event_type == "deployment":
        return deployment_event(data, push_tokens)
    if event_type == "feature_flag":
        return feature_flag_event(data, push_tokens)
    if event_type == "release":
        return release_event(data, push_tokens)
    if event_type == "emoji":
        return emoji_event(data, push_tokens)
    if event_type == "access_token":
        return access_token_event(data, push_tokens)

    return "Unknown event type"


def main():
    event_type = "push"
    push_token = "ExponentPushToken[YOUR_EXPO_PUSH_TOKEN]"
    # Replace with the actual data received from the GitLab webhook
    push_event_data = {
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
        "project_id": 15,
        "project": {
            "id": 15,
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
                "author": {
                    "name": "GitLab dev user",
                    "email": "gitlabdev@dv6700.(none)",
                },
                "added": ["CHANGELOG"],
                "modified": ["app/controller/application.rb"],
                "removed": [],
            },
        ],
        "total_commits_count": 4,
    }

    p = PushEventData(**push_event_data)

    tag_event_data = {
        "object_kind": "tag_push",
        "event_name": "tag_push",
        "before": "0000000000000000000000000000000000000000",
        "after": "82b3d5ae55f7080f1e6022629cdb57bfae7cccc7",
        "ref": "refs/tags/v1.0.0",
        "ref_protected": True,
        "checkout_sha": "82b3d5ae55f7080f1e6022629cdb57bfae7cccc7",
        "user_id": 1,
        "user_name": "John Smith",
        "user_avatar": "https://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=8://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=80",
        "project_id": 1,
        "project": {
            "id": 1,
            "name": "Example",
            "description": "",
            "web_url": "http://example.com/jsmith/example",
            "avatar_url": None,
            "git_ssh_url": "git@example.com:jsmith/example.git",
            "git_http_url": "http://example.com/jsmith/example.git",
            "namespace": "Jsmith",
            "visibility_level": 0,
            "path_with_namespace": "jsmith/example",
            "default_branch": "master",
            "homepage": "http://example.com/jsmith/example",
            "url": "git@example.com:jsmith/example.git",
            "ssh_url": "git@example.com:jsmith/example.git",
            "http_url": "http://example.com/jsmith/example.git",
        },
        "repository": {
            "name": "Example",
            "url": "ssh://git@example.com/jsmith/example.git",
            "description": "",
            "homepage": "http://example.com/jsmith/example",
            "git_http_url": "http://example.com/jsmith/example.git",
            "git_ssh_url": "git@example.com:jsmith/example.git",
            "visibility_level": 0,
        },
        "commits": [],
        "total_commits_count": 0,
    }

    t = TagEventData(**tag_event_data)

    issue_event_data = {
        "object_kind": "issue",
        "event_type": "issue",
        "user": {
            "id": 1,
            "name": "Administrator",
            "username": "root",
            "avatar_url": "http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=40\u0026d=identicon",
            "email": "admin@example.com",
        },
        "project": {
            "id": 1,
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
        "object_attributes": {
            "id": 301,
            "title": "New API: create/update/delete file",
            "assignee_ids": [51],
            "assignee_id": 51,
            "author_id": 51,
            "project_id": 14,
            "created_at": "2013-12-03T17:15:43Z",
            "updated_at": "2013-12-03T17:15:43Z",
            "updated_by_id": 1,
            "last_edited_at": None,
            "last_edited_by_id": None,
            "relative_position": 0,
            "description": "Create new API for manipulations with repository",
            "milestone_id": None,
            "state_id": 1,
            "confidential": False,
            "discussion_locked": True,
            "due_date": None,
            "moved_to_id": None,
            "duplicated_to_id": None,
            "time_estimate": 0,
            "total_time_spent": 0,
            "time_change": 0,
            "human_total_time_spent": None,
            "human_time_estimate": None,
            "human_time_change": None,
            "weight": None,
            "health_status": "at_risk",
            "type": "Issue",
            "iid": 23,
            "url": "http://example.com/diaspora/issues/23",
            "state": "opened",
            "action": "open",
            "severity": "high",
            "escalation_status": "triggered",
            "escalation_policy": {"id": 18, "name": "Engineering On-call"},
            "labels": [
                {
                    "id": 206,
                    "title": "API",
                    "color": "#ffffff",
                    "project_id": 14,
                    "created_at": "2013-12-03T17:15:43Z",
                    "updated_at": "2013-12-03T17:15:43Z",
                    "template": False,
                    "description": "API related issues",
                    "type": "ProjectLabel",
                    "group_id": 41,
                }
            ],
        },
        "repository": {
            "name": "Gitlab Test",
            "url": "http://example.com/gitlabhq/gitlab-test.git",
            "description": "Aut reprehenderit ut est.",
            "homepage": "http://example.com/gitlabhq/gitlab-test",
        },
        "assignees": [
            {
                "name": "User1",
                "username": "user1",
                "avatar_url": "http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=40\u0026d=identicon",
            }
        ],
        "assignee": {
            "name": "User1",
            "username": "user1",
            "avatar_url": "http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=40\u0026d=identicon",
        },
        "labels": [
            {
                "id": 206,
                "title": "API",
                "color": "#ffffff",
                "project_id": 14,
                "created_at": "2013-12-03T17:15:43Z",
                "updated_at": "2013-12-03T17:15:43Z",
                "template": False,
                "description": "API related issues",
                "type": "ProjectLabel",
                "group_id": 41,
            }
        ],
        "changes": {
            "updated_by_id": {"previous": None, "current": 1},
            "updated_at": {
                "previous": "2017-09-15 16:50:55 UTC",
                "current": "2017-09-15 16:52:00 UTC",
            },
            "labels": {
                "previous": [
                    {
                        "id": 206,
                        "title": "API",
                        "color": "#ffffff",
                        "project_id": 14,
                        "created_at": "2013-12-03T17:15:43Z",
                        "updated_at": "2013-12-03T17:15:43Z",
                        "template": False,
                        "description": "API related issues",
                        "type": "ProjectLabel",
                        "group_id": 41,
                    }
                ],
                "current": [
                    {
                        "id": 205,
                        "title": "Platform",
                        "color": "#123123",
                        "project_id": 14,
                        "created_at": "2013-12-03T17:15:43Z",
                        "updated_at": "2013-12-03T17:15:43Z",
                        "template": False,
                        "description": "Platform related issues",
                        "type": "ProjectLabel",
                        "group_id": 41,
                    }
                ],
            },
        },
    }

    i = IssueEventData(**issue_event_data)

    merge_request_event_data = {
        "object_kind": "merge_request",
        "event_type": "merge_request",
        "user": {
            "id": 1,
            "name": "Administrator",
            "username": "root",
            "avatar_url": "http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=40\u0026d=identicon",
            "email": "admin@example.com",
        },
        "project": {
            "id": 1,
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
            "ci_config_path": "",
            "homepage": "http://example.com/gitlabhq/gitlab-test",
            "url": "http://example.com/gitlabhq/gitlab-test.git",
            "ssh_url": "git@example.com:gitlabhq/gitlab-test.git",
            "http_url": "http://example.com/gitlabhq/gitlab-test.git",
        },
        "repository": {
            "name": "Gitlab Test",
            "url": "http://example.com/gitlabhq/gitlab-test.git",
            "description": "Aut reprehenderit ut est.",
            "homepage": "http://example.com/gitlabhq/gitlab-test",
        },
        "object_attributes": {
            "id": 99,
            "iid": 1,
            "target_branch": "master",
            "source_branch": "ms-viewport",
            "source_project_id": 14,
            "author_id": 51,
            "assignee_ids": [6],
            "assignee_id": 6,
            "reviewer_ids": [6],
            "title": "MS-Viewport",
            "created_at": "2013-12-03T17:23:34Z",
            "updated_at": "2013-12-03T17:23:34Z",
            "last_edited_at": "2013-12-03T17:23:34Z",
            "last_edited_by_id": 1,
            "milestone_id": None,
            "state_id": 1,
            "state": "opened",
            "blocking_discussions_resolved": True,
            "work_in_progress": False,
            "draft": False,
            "first_contribution": True,
            "merge_status": "unchecked",
            "target_project_id": 14,
            "description": "",
            "prepared_at": "2013-12-03T19:23:34Z",
            "total_time_spent": 1800,
            "time_change": 30,
            "human_total_time_spent": "30m",
            "human_time_change": "30s",
            "human_time_estimate": "30m",
            "url": "http://example.com/diaspora/merge_requests/1",
            "source": {
                "name": "Awesome Project",
                "description": "Aut reprehenderit ut est.",
                "web_url": "http://example.com/awesome_space/awesome_project",
                "avatar_url": None,
                "git_ssh_url": "git@example.com:awesome_space/awesome_project.git",
                "git_http_url": "http://example.com/awesome_space/awesome_project.git",
                "namespace": "Awesome Space",
                "visibility_level": 20,
                "path_with_namespace": "awesome_space/awesome_project",
                "default_branch": "master",
                "homepage": "http://example.com/awesome_space/awesome_project",
                "url": "http://example.com/awesome_space/awesome_project.git",
                "ssh_url": "git@example.com:awesome_space/awesome_project.git",
                "http_url": "http://example.com/awesome_space/awesome_project.git",
            },
            "target": {
                "name": "Awesome Project",
                "description": "Aut reprehenderit ut est.",
                "web_url": "http://example.com/awesome_space/awesome_project",
                "avatar_url": None,
                "git_ssh_url": "git@example.com:awesome_space/awesome_project.git",
                "git_http_url": "http://example.com/awesome_space/awesome_project.git",
                "namespace": "Awesome Space",
                "visibility_level": 20,
                "path_with_namespace": "awesome_space/awesome_project",
                "default_branch": "master",
                "homepage": "http://example.com/awesome_space/awesome_project",
                "url": "http://example.com/awesome_space/awesome_project.git",
                "ssh_url": "git@example.com:awesome_space/awesome_project.git",
                "http_url": "http://example.com/awesome_space/awesome_project.git",
            },
            "last_commit": {
                "id": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
                "message": "fixed readme",
                "title": "Update file README.md",
                "timestamp": "2012-01-03T23:36:29+02:00",
                "url": "http://example.com/awesome_space/awesome_project/commits/da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
                "author": {
                    "name": "GitLab dev user",
                    "email": "gitlabdev@dv6700.(none)",
                },
            },
            "labels": [
                {
                    "id": 206,
                    "title": "API",
                    "color": "#ffffff",
                    "project_id": 14,
                    "created_at": "2013-12-03T17:15:43Z",
                    "updated_at": "2013-12-03T17:15:43Z",
                    "template": False,
                    "description": "API related issues",
                    "type": "ProjectLabel",
                    "group_id": 41,
                }
            ],
            "action": "open",
            "detailed_merge_status": "mergeable",
        },
        "labels": [
            {
                "id": 206,
                "title": "API",
                "color": "#ffffff",
                "project_id": 14,
                "created_at": "2013-12-03T17:15:43Z",
                "updated_at": "2013-12-03T17:15:43Z",
                "template": False,
                "description": "API related issues",
                "type": "ProjectLabel",
                "group_id": 41,
            }
        ],
        "changes": {
            "updated_by_id": {"previous": None, "current": 1},
            "draft": {"previous": True, "current": False},
            "updated_at": {
                "previous": "2017-09-15 16:50:55 UTC",
                "current": "2017-09-15 16:52:00 UTC",
            },
            "labels": {
                "previous": [
                    {
                        "id": 206,
                        "title": "API",
                        "color": "#ffffff",
                        "project_id": 14,
                        "created_at": "2013-12-03T17:15:43Z",
                        "updated_at": "2013-12-03T17:15:43Z",
                        "template": False,
                        "description": "API related issues",
                        "type": "ProjectLabel",
                        "group_id": 41,
                    }
                ],
                "current": [
                    {
                        "id": 205,
                        "title": "Platform",
                        "color": "#123123",
                        "project_id": 14,
                        "created_at": "2013-12-03T17:15:43Z",
                        "updated_at": "2013-12-03T17:15:43Z",
                        "template": False,
                        "description": "Platform related issues",
                        "type": "ProjectLabel",
                        "group_id": 41,
                    }
                ],
            },
            "last_edited_at": {"previous": None, "current": "2023-03-15 00:00:10 UTC"},
            "last_edited_by_id": {"previous": None, "current": 3278533},
        },
        "assignees": [
            {
                "id": 6,
                "name": "User1",
                "username": "user1",
                "avatar_url": "http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=40\u0026d=identicon",
            }
        ],
        "reviewers": [
            {
                "id": 6,
                "name": "User1",
                "username": "user1",
                "avatar_url": "http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=40\u0026d=identicon",
            }
        ],
    }
    mr = MergeRequestEventData(**merge_request_event_data)
    pipeline_event_data = {
        "object_kind": "pipeline",
        "object_attributes": {
            "id": 31,
            "iid": 3,
            "name": "Pipeline for branch: master",
            "ref": "master",
            "tag": False,
            "sha": "bcbb5ec396a2c0f828686f14fac9b80b780504f2",
            "before_sha": "bcbb5ec396a2c0f828686f14fac9b80b780504f2",
            "source": "merge_request_event",
            "status": "success",
            "stages": ["build", "test", "deploy"],
            "created_at": "2016-08-12 15:23:28 UTC",
            "finished_at": "2016-08-12 15:26:29 UTC",
            "duration": 63,
            "variables": [{"key": "NESTOR_PROD_ENVIRONMENT", "value": "us-west-1"}],
            "url": "http://example.com/gitlab-org/gitlab-test/-/pipelines/31",
        },
        "merge_request": {
            "id": 1,
            "iid": 1,
            "title": "Test",
            "source_branch": "test",
            "source_project_id": 1,
            "target_branch": "master",
            "target_project_id": 1,
            "state": "opened",
            "merge_status": "can_be_merged",
            "detailed_merge_status": "mergeable",
            "url": "http://192.168.64.1:3005/gitlab-org/gitlab-test/merge_requests/1",
        },
        "user": {
            "id": 1,
            "name": "Administrator",
            "username": "root",
            "avatar_url": "http://www.gravatar.com/avatar/e32bd13e2add097461cb96824b7a829c?s=80\u0026d=identicon",
            "email": "user_email@gitlab.com",
        },
        "project": {
            "id": 1,
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
        "commit": {
            "id": "bcbb5ec396a2c0f828686f14fac9b80b780504f2",
            "message": "test\n",
            "timestamp": "2016-08-12T17:23:21+02:00",
            "url": "http://example.com/gitlab-org/gitlab-test/commit/bcbb5ec396a2c0f828686f14fac9b80b780504f2",
            "author": {"name": "User", "email": "user@gitlab.com"},
        },
        "source_pipeline": {
            "project": {
                "id": 41,
                "web_url": "https://gitlab.example.com/gitlab-org/upstream-project",
                "path_with_namespace": "gitlab-org/upstream-project",
            },
            "pipeline_id": 30,
            "job_id": 3401,
        },
        "builds": [
            {
                "id": 380,
                "stage": "deploy",
                "name": "production",
                "status": "skipped",
                "created_at": "2016-08-12 15:23:28 UTC",
                "started_at": None,
                "finished_at": None,
                "duration": None,
                "queued_duration": None,
                "failure_reason": None,
                "when": "manual",
                "manual": True,
                "allow_failure": False,
                "user": {
                    "id": 1,
                    "name": "Administrator",
                    "username": "root",
                    "avatar_url": "http://www.gravatar.com/avatar/e32bd13e2add097461cb96824b7a829c?s=80\u0026d=identicon",
                    "email": "admin@example.com",
                },
                "runner": None,
                "artifacts_file": {"filename": None, "size": None},
                "environment": {
                    "name": "production",
                    "action": "start",
                    "deployment_tier": "production",
                },
            },
            {
                "id": 377,
                "stage": "test",
                "name": "test-image",
                "status": "success",
                "created_at": "2016-08-12 15:23:28 UTC",
                "started_at": "2016-08-12 15:26:12 UTC",
                "finished_at": "2016-08-12 15:26:29 UTC",
                "duration": 17.0,
                "queued_duration": 196.0,
                "failure_reason": None,
                "when": "on_success",
                "manual": False,
                "allow_failure": False,
                "user": {
                    "id": 1,
                    "name": "Administrator",
                    "username": "root",
                    "avatar_url": "http://www.gravatar.com/avatar/e32bd13e2add097461cb96824b7a829c?s=80\u0026d=identicon",
                    "email": "admin@example.com",
                },
                "runner": {
                    "id": 380987,
                    "description": "shared-runners-manager-6.gitlab.com",
                    "active": True,
                    "runner_type": "instance_type",
                    "is_shared": True,
                    "tags": ["linux", "docker", "shared-runner"],
                },
                "artifacts_file": {"filename": None, "size": None},
                "environment": None,
            },
            {
                "id": 378,
                "stage": "test",
                "name": "test-build",
                "status": "failed",
                "created_at": "2016-08-12 15:23:28 UTC",
                "started_at": "2016-08-12 15:26:12 UTC",
                "finished_at": "2016-08-12 15:26:29 UTC",
                "duration": 17.0,
                "queued_duration": 196.0,
                "failure_reason": "script_failure",
                "when": "on_success",
                "manual": False,
                "allow_failure": False,
                "user": {
                    "id": 1,
                    "name": "Administrator",
                    "username": "root",
                    "avatar_url": "http://www.gravatar.com/avatar/e32bd13e2add097461cb96824b7a829c?s=80\u0026d=identicon",
                    "email": "admin@example.com",
                },
                "runner": {
                    "id": 380987,
                    "description": "shared-runners-manager-6.gitlab.com",
                    "active": True,
                    "runner_type": "instance_type",
                    "is_shared": True,
                    "tags": ["linux", "docker"],
                },
                "artifacts_file": {"filename": None, "size": None},
                "environment": None,
            },
            {
                "id": 376,
                "stage": "build",
                "name": "build-image",
                "status": "success",
                "created_at": "2016-08-12 15:23:28 UTC",
                "started_at": "2016-08-12 15:24:56 UTC",
                "finished_at": "2016-08-12 15:25:26 UTC",
                "duration": 17.0,
                "queued_duration": 196.0,
                "failure_reason": None,
                "when": "on_success",
                "manual": False,
                "allow_failure": False,
                "user": {
                    "id": 1,
                    "name": "Administrator",
                    "username": "root",
                    "avatar_url": "http://www.gravatar.com/avatar/e32bd13e2add097461cb96824b7a829c?s=80\u0026d=identicon",
                    "email": "admin@example.com",
                },
                "runner": {
                    "id": 380987,
                    "description": "shared-runners-manager-6.gitlab.com",
                    "active": True,
                    "runner_type": "instance_type",
                    "is_shared": True,
                    "tags": ["linux", "docker"],
                },
                "artifacts_file": {"filename": None, "size": None},
                "environment": None,
            },
            {
                "id": 379,
                "stage": "deploy",
                "name": "staging",
                "status": "created",
                "created_at": "2016-08-12 15:23:28 UTC",
                "started_at": None,
                "finished_at": None,
                "duration": None,
                "queued_duration": None,
                "failure_reason": None,
                "when": "on_success",
                "manual": False,
                "allow_failure": False,
                "user": {
                    "id": 1,
                    "name": "Administrator",
                    "username": "root",
                    "avatar_url": "http://www.gravatar.com/avatar/e32bd13e2add097461cb96824b7a829c?s=80\u0026d=identicon",
                    "email": "admin@example.com",
                },
                "runner": None,
                "artifacts_file": {"filename": None, "size": None},
                "environment": {
                    "name": "staging",
                    "action": "start",
                    "deployment_tier": "staging",
                },
            },
        ],
    }

    pl = PipelineEventData(**pipeline_event_data)

    job_event_data = {
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
        "project_id": 380,
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
            "id": 380,
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
    deployment_event_data = {
        "object_kind": "deployment",
        "status": "success",
        "status_changed_at": "2021-04-28 21:50:00 +0200",
        "deployment_id": 15,
        "deployable_id": 796,
        "deployable_url": "http://10.126.0.2:3000/root/test-deployment-webhooks/-/jobs/796",
        "environment": "staging",
        "environment_tier": "staging",
        "environment_slug": "staging",
        "environment_external_url": "https://staging.example.com",
        "project": {
            "id": 30,
            "name": "test-deployment-webhooks",
            "description": "",
            "web_url": "http://10.126.0.2:3000/root/test-deployment-webhooks",
            "avatar_url": None,
            "git_ssh_url": "ssh://vlad@10.126.0.2:2222/root/test-deployment-webhooks.git",
            "git_http_url": "http://10.126.0.2:3000/root/test-deployment-webhooks.git",
            "namespace": "Administrator",
            "visibility_level": 0,
            "path_with_namespace": "root/test-deployment-webhooks",
            "default_branch": "master",
            "ci_config_path": "",
            "homepage": "http://10.126.0.2:3000/root/test-deployment-webhooks",
            "url": "ssh://vlad@10.126.0.2:2222/root/test-deployment-webhooks.git",
            "ssh_url": "ssh://vlad@10.126.0.2:2222/root/test-deployment-webhooks.git",
            "http_url": "http://10.126.0.2:3000/root/test-deployment-webhooks.git",
        },
        "short_sha": "279484c0",
        "user": {
            "id": 1,
            "name": "Administrator",
            "username": "root",
            "avatar_url": "https://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon",
            "email": "admin@example.com",
        },
        "user_url": "http://10.126.0.2:3000/root",
        "commit_url": "http://10.126.0.2:3000/root/test-deployment-webhooks/-/commit/279484c09fbe69ededfced8c1bb6e6d24616b468",
        "commit_title": "Add new file",
    }
    depl = DeploymentEventData(**deployment_event_data)

    job = JobEventData(**job_event_data)

    group_event_data = {
        "created_at": "2020-12-11T04:57:22Z",
        "updated_at": "2020-12-11T04:57:22Z",
        "group_name": "webhook-test",
        "group_path": "webhook-test",
        "group_id": 100,
        "user_username": "test_user",
        "user_name": "Test User",
        "user_email": "testuser@webhooktest.com",
        "user_id": 64,
        "group_access": "Guest",
        "group_plan": None,
        "expires_at": "2020-12-14T00:00:00Z",
        "event_name": "user_add_to_group",
    }

    group = GroupEventData(**group_event_data)

    subgroup_event_data = {
        "created_at": "2021-01-20T09:40:12Z",
        "updated_at": "2021-01-20T09:40:12Z",
        "event_name": "subgroup_create",
        "name": "subgroup1",
        "path": "subgroup1",
        "full_path": "group1/subgroup1",
        "group_id": 10,
        "parent_group_id": 7,
        "parent_name": "group1",
        "parent_path": "group1",
        "parent_full_path": "group1",
    }

    subgroup_event = SubgroupEventData(**subgroup_event_data)

    feature_flag_event_data = {
        "object_kind": "feature_flag",
        "project": {
            "id": 1,
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
    fflag = FeatureFlagEventData(**feature_flag_event_data)
    release_event_data = {
        "id": 1,
        "created_at": "2020-11-02 12:55:12 UTC",
        "description": "v1.1 has been released",
        "name": "v1.1",
        "released_at": "2020-11-02 12:55:12 UTC",
        "tag": "v1.1",
        "object_kind": "release",
        "project": {
            "id": 2,
            "name": "release-webhook-example",
            "description": "",
            "web_url": "https://example.com/gitlab-org/release-webhook-example",
            "avatar_url": None,
            "git_ssh_url": "ssh://git@example.com/gitlab-org/release-webhook-example.git",
            "git_http_url": "https://example.com/gitlab-org/release-webhook-example.git",
            "namespace": "Gitlab",
            "visibility_level": 0,
            "path_with_namespace": "gitlab-org/release-webhook-example",
            "default_branch": "master",
            "ci_config_path": None,
            "homepage": "https://example.com/gitlab-org/release-webhook-example",
            "url": "ssh://git@example.com/gitlab-org/release-webhook-example.git",
            "ssh_url": "ssh://git@example.com/gitlab-org/release-webhook-example.git",
            "http_url": "https://example.com/gitlab-org/release-webhook-example.git",
        },
        "url": "https://example.com/gitlab-org/release-webhook-example/-/releases/v1.1",
        "action": "create",
        "assets": {
            "count": 5,
            "links": [
                {
                    "id": 1,
                    "external": True,
                    "link_type": "other",
                    "name": "Changelog",
                    "url": "https://example.net/changelog",
                }
            ],
            "sources": [
                {
                    "format": "zip",
                    "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.zip",
                },
                {
                    "format": "tar.gz",
                    "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.tar.gz",
                },
                {
                    "format": "tar.bz2",
                    "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.tar.bz2",
                },
                {
                    "format": "tar",
                    "url": "https://example.com/gitlab-org/release-webhook-example/-/archive/v1.1/release-webhook-example-v1.1.tar",
                },
            ],
        },
        "commit": {
            "id": "ee0a3fb31ac16e11b9dbb596ad16d4af654d08f8",
            "message": "Release v1.1",
            "title": "Release v1.1",
            "timestamp": "2020-10-31T14:58:32+11:00",
            "url": "https://example.com/gitlab-org/release-webhook-example/-/commit/ee0a3fb31ac16e11b9dbb596ad16d4af654d08f8",
            "author": {"name": "Example User", "email": "user@example.com"},
        },
    }
    project_group_access_event_data = {
        "object_kind": "access_token",
        "project": {
            "id": 7,
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
    release = ReleaseEventData(**release_event_data)


if __name__ == "__main__":
    main()
