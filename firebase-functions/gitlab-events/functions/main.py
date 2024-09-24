import firebase_admin
import requests
from firebase_admin import credentials, firestore
from firebase_functions import https_fn, logger
from gitlab_webhook_handlers import get_project_id, handle_event
from notifications import (
    add_device_to_notification_group,
    list_devices_with_group_id,
    send_push_message,
)

certificate = "gitalchemy-firebase-adminsdk-fnaju-289dccb9a0.json"
firebaseProjectId = "gitalchemy"
private_token = "GITLAB_PAT_REMOVED"

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


@https_fn.on_request()
def webhook_gitlab(req: https_fn.Request) -> https_fn.Response:
    data = req.get_json()
    project_id = get_project_id(data)
    logger.info(f"Project ID: {project_id}")
    push_tokens = get_push_tokens(db, project_id)

    event_type = data.get("object_kind")
    event_messages = handle_gitlab_event(data, event_type)

    messages = []
    for token in push_tokens:
        message = {
            "to": token,
            "sound": "default",
            "title": event_messages["title"],
            "body": event_messages["body"],
            "data": {"type": event_type, "url": event_messages.get("url", "")},
            "icon": event_messages.get("icon", "📢"),
        }
        messages.append(message)

    response = send_push_message({"messages": messages})
    return https_fn.Response(response=response, mimetype="application/json")


def handle_gitlab_event(data: Dict[str, Any], event_type: str) -> Dict[str, str]:
    if event_type == "pipeline":
        return handle_pipeline_event(data)
    elif event_type == "merge_request":
        return handle_merge_request_event(data)
    elif event_type == "issue":
        return handle_issue_event(data)
    elif event_type == "push":
        return handle_push_event(data)
    elif event_type == "wiki_page":
        return handle_wiki_page_event(data)
    elif event_type == "deployment":
        return handle_deployment_event(data)
    elif event_type == "release":
        return handle_release_event(data)
    else:
        return {
            "title": "GitLab Event",
            "body": f"A {event_type} event occurred.",
            "icon": "📢",
        }


def handle_pipeline_event(data: Dict[str, Any]) -> Dict[str, str]:
    pipeline = data.get("object_attributes", {})
    status = pipeline.get("status")
    pipeline_id = pipeline.get("id")
    project_name = data.get("project", {}).get("name")

    if status == "failed":
        return {
            "title": f"🚫 Pipeline #{pipeline_id} has failed",
            "body": f"Pipeline in project {project_name} has failed. Please check the details.",
            "icon": "🏗️",
            "url": pipeline.get("url", ""),
        }
    elif status == "success":
        return {
            "title": f"✅ Pipeline #{pipeline_id} has succeeded",
            "body": f"Pipeline in project {project_name} has completed successfully.",
            "icon": "🏗️",
            "url": pipeline.get("url", ""),
        }
    else:
        return {
            "title": f"📊 Pipeline #{pipeline_id} status update",
            "body": f"Pipeline in project {project_name} status: {status}",
            "icon": "🏗️",
            "url": pipeline.get("url", ""),
        }


# Implement similar functions for other event types
def handle_merge_request_event(data: Dict[str, Any]) -> Dict[str, str]:
    # Implementation for merge request events
    pass


def handle_issue_event(data: Dict[str, Any]) -> Dict[str, str]:
    # Implementation for issue events
    pass


def handle_push_event(data: Dict[str, Any]) -> Dict[str, str]:
    # Implementation for push events
    pass


def handle_wiki_page_event(data: Dict[str, Any]) -> Dict[str, str]:
    # Implementation for wiki page events
    pass


def handle_deployment_event(data: Dict[str, Any]) -> Dict[str, str]:
    # Implementation for deployment events
    pass


def handle_release_event(data: Dict[str, Any]) -> Dict[str, str]:
    # Implementation for release events
    pass


# Implement these functions if they're not already defined
def get_project_id(data):
    # Implementation to extract project ID from data
    pass


def get_push_tokens(db, project_id):
    # Implementation to retrieve push tokens from database
    pass


def send_push_message(messages):
    # Implementation to send push messages
    pass


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
