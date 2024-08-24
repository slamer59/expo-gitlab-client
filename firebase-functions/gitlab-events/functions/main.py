import base64

import firebase_admin
import requests
from exponent_server_sdk import PushClient, PushMessage
from firebase_admin import credentials, firestore
from firebase_functions import https_fn, logger
from google.cloud.firestore import ArrayUnion

headers = {"PRIVATE-TOKEN": "GITLAB_PAT_REMOVED"}
certificate = "gitalchemy-firebase-adminsdk-fnaju-289dccb9a0.json"
firebaseProjectId = "gitalchemy"
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


def send_push_message(message):
    logger.info("Sending push message: %s", message)
    response = PushClient().publish(PushMessage(**message))
    return response


@https_fn.on_request()
def webhook_gitlab(req: https_fn.Request) -> https_fn.Response:
    title = "Gitlab Webhook"
    body = "Gitlab Webhook"
    push_token = "ExponentPushToken[8i6Z2PGCrtfL2ZchhUHdKA]"
    message = {
        "title": title,
        "body": body,
        "sound": "default",
        "to": push_token,
        "ttl": 3600,
        "expiration": 3600,
        "channel_id": "default",
        "priority": "high",
        "data": {},
        "badge": "",
        "category": "",
        "display_in_foreground": "",
        "subtitle": "",
        "mutable_content": "",
    }
    response = send_push_message(message=message)
    logger.info("Push message response: %s", response)
    return https_fn.Response(response=response.json(), mimetype="application/json")


def list_devices_with_group_id(db, group_id):

    notification_group_id = base64.b64encode(group_id.encode()).decode()

    # Get the notification group document reference
    notification_group_ref = db.collection("notificationGroups").document(
        notification_group_id
    )

    # Get the document
    notification_group_doc = notification_group_ref.get()

    # Get the devices array from the document
    devices = notification_group_doc.to_dict().get("devices", [])
    return devices


def add_device_to_notification_group(db, projects, push_token):
    # Start a new batch
    batch = db.batch()

    for group_name in projects:
        # Get the notification group document reference
        notification_group_id = base64.b64encode(group_name.encode()).decode()
        # Get the notification group document reference
        notification_group_ref = db.collection("notificationGroups").document(
            notification_group_id
        )

        # Update or create notificationsGroups document
        batch.set(
            notification_group_ref,
            {"groupName": group_name},
            merge=True,
        )

        # Add the device ID to the devices array
        batch.update(notification_group_ref, {"devices": ArrayUnion([push_token])})

    # Commit the batch
    batch.commit()
    return "Device added to notification group successfully"


@https_fn.on_request()
def add_device_to_nofitication(req: https_fn.Request) -> https_fn.Response:
    # Get the push token and projects from the request body
    data = req.get_json()
    push_token = data.get("push_token")
    projects = data.get("projects")

    try:
        if push_token and projects:
            logger.info("Push token present")
            # Make the GET request to the projects endpoint with the membership parameter set to true
            rep = add_device_to_notification_group(db, projects, push_token)
            logger.info(rep)
            return https_fn.Response(response=rep, mimetype="text/plain")
        else:
            # Return an error response if the push token is missing
            logger.warn("Missin push token")
            return https_fn.Response(
                response="Missing push token", mimetype="text/plain", status=400
            )
    except Exception as e:
        # Return an error response if an exception occurs
        logger.error(e)
        return https_fn.Response(response=str(e), mimetype="text/plain", status=500)
    # Return a success response
