import firebase_admin
import requests
from firebase_admin import credentials, firestore
from firebase_functions import https_fn, logger
from gitlab_webhook_handlers import get_project_id, handle_event
from notifications import (
    add_device_to_notification_group,
    list_devices_with_group_id,
    send_push_message,
    users_from_project_id,
)

certificate = "gitalchemy-firebase-adminsdk-fnaju-289dccb9a0.json"
firebaseProjectId = "gitalchemy"
private_token = "REDACTED"

# Use a service account
cred = credentials.Certificate(certificate)
app = firebase_admin.initialize_app(
    cred,
    {
        "projectId": firebaseProjectId,
    },
)

db = firestore.client(app)
logger.info("Firestore client initialized")


def get_url_from_project_id(project_id):
    # Get project info usin GitLab API
    headers = {"PRIVATE-TOKEN": private_token, "Content-Type": "application/json"}
    response = requests.get(
        f"https://gitlab.com/api/v4/projects/{project_id}", headers=headers
    )

    if response.status_code == 200:
        project_data = response.json()
        return f"{project_data['web_url']}.git"
    else:
        return None


def get_push_tokens(db, project_id):
    users = users_from_project_id(db, project_id)
    print("users)", users)
    print("🚀 ~ project_id:", project_id)
    # Query the Firestore collection for the project ID
    notification_group_id = get_url_from_project_id(project_id)
    # logger.info(f"Project URL: {project_url}")
    # notification_group_id = base64.b64encode(project_url.encode()).decode()

    return list_devices_with_group_id(db, notification_group_id)
    # project_ref = db.collection("notificationsGroups").document(notification_group_id)
    # # Get the project document from Firestore
    # logger.info(f"Project ref: {project_ref}")
    # project_doc = project_ref.get()
    # logger.info(f"Project doc: {project_doc}")
    # # Check if the project document exists
    # if not project_doc.exists:
    #     logger.error(f"Project document not found for ID: {notification_group_id}")
    #     return []


class NotificationSetting:
    class Level:
        GLOBAL = "global"
        WATCH = "watch"
        PARTICIPATING = "participating"
        ON_MENTION = "mention"
        DISABLED = "disabled"
        CUSTOM = "custom"

    # email_events = [
    #     "new_note",
    #     "new_issue",
    #     "reopen_issue",
    #     "close_issue",
    #     "reassign_issue",
    #     "issue_due",
    #     "new_merge_request",
    #     "push_to_merge_request",
    #     "reopen_merge_request",
    #     "close_merge_request",
    #     "reassign_merge_request",
    #     "merge_merge_request",
    #     "failed_pipeline",
    #     "fixed_pipeline",
    #     "success_pipeline",
    #     "moved_project",
    #     "merge_when_pipeline_succeeds",
    #     "new_epic",
    # ]

    notification_matrix = {
        "push": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "tag_push": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: False,
            Level.ON_MENTION: False,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "issue": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "note": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "merge_request": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "wiki_page": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: False,
            Level.ON_MENTION: False,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "pipeline": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: False,
            Level.ON_MENTION: False,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "build": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: False,
            Level.ON_MENTION: False,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "deployment": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: False,
            Level.ON_MENTION: False,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "feature_flag": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: False,
            Level.ON_MENTION: False,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "release": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: False,
            Level.ON_MENTION: False,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "emoji": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: False,
            Level.ON_MENTION: False,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "access_token": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: False,
            Level.ON_MENTION: False,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "new_note": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "new_issue": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "reopen_issue": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "close_issue": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "reassign_issue": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "issue_due": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "new_merge_request": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "push_to_merge_request": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "reopen_merge_request": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "close_merge_request": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "reassign_merge_request": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "merge_merge_request": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "failed_pipeline": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: False,
            Level.ON_MENTION: False,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "fixed_pipeline": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: False,
            Level.ON_MENTION: False,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "success_pipeline": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: False,
            Level.ON_MENTION: False,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "moved_project": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: False,
            Level.ON_MENTION: False,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "merge_when_pipeline_succeeds": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: False,
            Level.ON_MENTION: False,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
        "new_epic": {
            Level.GLOBAL: True,
            Level.WATCH: True,
            Level.PARTICIPATING: True,
            Level.ON_MENTION: True,
            Level.DISABLED: False,
            Level.CUSTOM: True,
        },
    }

    @staticmethod
    def should_notify(user_settings, event):
        level = user_settings.get(
            "notification_level", NotificationSetting.Level.DISABLED
        )
        if level == NotificationSetting.Level.CUSTOM:
            custom_events = user_settings.get("custom_events", [])
            return event in custom_events
        return NotificationSetting.notification_matrix.get(event, {}).get(level, False)


@https_fn.on_request()
def webhook_gitlab(req: https_fn.Request) -> https_fn.Response:

    data = req.get_json()
    # Get list of push tokens
    project_id = get_project_id(data)
    logger.info(f"Project ID: {project_id}")
    users_settings = users_from_project_id(db, project_id)

    # logger.info("user_settings ", users_settings)

    # Filter push_tokens based on user settings
    event_type = data.get("object_kind")
    # logger.info("event_type ", event_type)
    filtered_push_tokens = [
        user["expoToken"]
        for user in users_settings
        if NotificationSetting.should_notify(user, event_type)
    ]
    logger.info("filtered_push_tokens ", filtered_push_tokens)

    # push_tokens = get_push_tokens(db, project_id)
    # Handle the event based on its type
    # logger.info("push_tokens", push_tokens)
    event_messages = handle_event(data, filtered_push_tokens)
    # Send the push notification to the device
    # logger.info(event_messages.model_dump(mode="json")["messages"])
    response = send_push_message(event_messages.model_dump(mode="json")["messages"])
    # Return a success response
    return https_fn.Response(response=response, mimetype="application/json")


@https_fn.on_request()
def notifications(req: https_fn.Request) -> https_fn.Response:

    data = req.get_json()
    # Get list of push tokens
    project_id = get_project_id(data)
    logger.info(f"Project ID: {project_id}")
    users_settings = users_from_project_id(db, project_id)

    # logger.info("user_settings ", users_settings)

    # Filter push_tokens based on user settings
    event_type = data.get("object_kind")
    # logger.info("event_type ", event_type)
    filtered_push_tokens = [
        user["expoToken"]
        for user in users_settings
        if NotificationSetting.should_notify(user, event_type)
    ]
    logger.info("filtered_push_tokens ", filtered_push_tokens)

    # push_tokens = get_push_tokens(db, project_id)
    # Handle the event based on its type
    # logger.info("push_tokens", push_tokens)
    event_messages = handle_event(data, filtered_push_tokens)
    # Send the push notification to the device
    # logger.info(event_messages.model_dump(mode="json")["messages"])
    response = send_push_message(event_messages.model_dump(mode="json")["messages"])
    # Return a success response
    return https_fn.Response(response=response, mimetype="application/json")


@https_fn.on_request()
def add_device_to_nofitication(req: https_fn.Request) -> https_fn.Response:
    # Get the push token and projects from the request body
    data = req.get_json()
    push_token = data.get("push_token")
    projects = data.get("projects")

    try:
        if push_token and projects:
            logger.info("Push token present")
            # Make the GET request to the projects endpoint with the membership parameter set to True
            rep = add_device_to_notification_group(db, projects, push_token)
            logger.info(rep)
            return https_fn.Response(response=rep, mimetype="text/plain")
        else:
            # Return an error response if the push token is missing
            logger.warn("Missing push token or projects is wrong")
            return https_fn.Response(
                response="Missing push token or projects is wrong",
                mimetype="text/plain",
                status=400,
            )
    except Exception as e:
        # Return an error response if an exception occurs
        logger.error(e)
        return https_fn.Response(response=str(e), mimetype="text/plain", status=500)
    # Return a success response
