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
        return f"{project_data["web_url"]}.git"
    else:
        return None


import base64


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
    # Get list of push tokens
    project_id = get_project_id(data)
    logger.info(f"Project ID: {project_id}")
    push_tokens = get_push_tokens(db, project_id)
    # logger.info(f"Push tokens: {push_tokens}")
    # push_tokens = ["ExponentPushToken[8i6Z2PGCrtfL2ZchhUHdKA]"]

    # Handle the event based on its type
    event_messages = handle_event(data, push_tokens)
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
            logger.warn("Missing push token")
            return https_fn.Response(
                response="Missing push token", mimetype="text/plain", status=400
            )
    except Exception as e:
        # Return an error response if an exception occurs
        logger.error(e)
        return https_fn.Response(response=str(e), mimetype="text/plain", status=500)
    # Return a success response
