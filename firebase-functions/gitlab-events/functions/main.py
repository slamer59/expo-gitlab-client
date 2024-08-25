import firebase_admin
from firebase_admin import credentials, firestore
from firebase_functions import https_fn, logger
from gitlab_webhook_handlers import handle_event
from notifications import add_device_to_notification_group, send_push_message

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


@https_fn.on_request()
def webhook_gitlab(req: https_fn.Request) -> https_fn.Response:

    push_token = "ExponentPushToken[8i6Z2PGCrtfL2ZchhUHdKA]"

    data = req.get_json()
    event_type = data.get("object_kind")

    logger.info("Event type: %s", event_type)
    # Handle the event based on its type
    event_message = handle_event(event_type, push_token, data)
    # Send the push notification to the device
    response = send_push_message(message=event_message.model_dump(mode="json"))
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
            # Make the GET request to the projects endpoint with the membership parameter set to true
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
