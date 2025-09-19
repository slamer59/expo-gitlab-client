import firebase_admin
import requests
from firebase_admin import credentials, firestore
from firebase_functions import https_fn, logger
from gitlab_webhook_handlers import get_project_id, handle_event
from models import (
    RepositoryConsentSyncRequest,
    UserNotificationDocument,
    WebhookManagementRequest,
)
from notification_filter_service import NotificationFilterService
from notifications import (
    add_device_to_notification_group,
    list_devices_with_group_id,
    send_push_message,
    users_from_project_id,
)
from pydantic import ValidationError
from repository_consent_service import RepositoryConsentService

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

# Initialize services
WEBHOOK_BASE_URL = "https://us-central1-gitalchemy.cloudfunctions.net"  # Configure this
notification_filter_service = NotificationFilterService(db)
repository_consent_service = RepositoryConsentService(
    db, private_token, WEBHOOK_BASE_URL
)


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


# NEW REPOSITORY CONSENT ENDPOINTS

@https_fn.on_request()
def sync_repository_consents(req: https_fn.Request) -> https_fn.Response:
    """
    Sync repository consent from client-side Zustand store to Firebase.
    Handles webhook creation/deletion automatically.
    """
    if req.method != "POST":
        return https_fn.Response(
            response={"error": "Method not allowed"},
            status=405,
            mimetype="application/json"
        )

    try:
        data = req.get_json()

        # Validate request using Pydantic
        sync_request = RepositoryConsentSyncRequest(**data)

        # Perform sync using service
        result = repository_consent_service.sync_repository_consents(sync_request)

        return https_fn.Response(
            response=result,
            mimetype="application/json"
        )

    except ValidationError as e:
        logger.error(f"Validation error in sync_repository_consents: {e}")
        return https_fn.Response(
            response={"error": "Invalid request data", "details": str(e)},
            status=400,
            mimetype="application/json"
        )
    except Exception as e:
        logger.error(f"Error in sync_repository_consents: {e}")
        return https_fn.Response(
            response={"error": str(e)},
            status=500,
            mimetype="application/json"
        )


@https_fn.on_request()
def bulk_repository_consent(req: https_fn.Request) -> https_fn.Response:
    """
    Bulk update consent for multiple repositories.
    """
    if req.method != "POST":
        return https_fn.Response(
            response={"error": "Method not allowed"},
            status=405,
            mimetype="application/json"
        )

    try:
        data = req.get_json()
        expo_token = data.get("expo_token")
        project_ids = data.get("project_ids", [])
        has_consent = data.get("has_consent", False)

        if not expo_token or not project_ids:
            return https_fn.Response(
                response={"error": "Missing expo_token or project_ids"},
                status=400,
                mimetype="application/json"
            )

        result = repository_consent_service.bulk_consent_update(
            expo_token, project_ids, has_consent
        )

        return https_fn.Response(
            response=result,
            mimetype="application/json"
        )

    except Exception as e:
        logger.error(f"Error in bulk_repository_consent: {e}")
        return https_fn.Response(
            response={"error": str(e)},
            status=500,
            mimetype="application/json"
        )


@https_fn.on_request()
def get_repository_consents(req: https_fn.Request) -> https_fn.Response:
    """
    Get all repository consents for a user.
    """
    if req.method != "GET":
        return https_fn.Response(
            response={"error": "Method not allowed"},
            status=405,
            mimetype="application/json"
        )

    try:
        expo_token = req.args.get("expo_token")

        if not expo_token:
            return https_fn.Response(
                response={"error": "Missing expo_token parameter"},
                status=400,
                mimetype="application/json"
            )

        consents = repository_consent_service.get_consented_repositories(expo_token)

        # Convert to serializable format
        consent_data = [consent.dict() for consent in consents]

        return https_fn.Response(
            response={
                "success": True,
                "consents": consent_data,
                "count": len(consent_data)
            },
            mimetype="application/json"
        )

    except Exception as e:
        logger.error(f"Error in get_repository_consents: {e}")
        return https_fn.Response(
            response={"error": str(e)},
            status=500,
            mimetype="application/json"
        )


@https_fn.on_request()
def webhook_gitlab_enhanced(req: https_fn.Request) -> https_fn.Response:
    """
    Enhanced webhook handler with per-repository consent filtering.
    """
    try:
        data = req.get_json()
        project_id = get_project_id(data)
        event_type = data.get("object_kind")

        logger.info(f"Processing enhanced webhook for project {project_id}, event {event_type}")

        # Use new filtering service for per-repository consent
        filter_result = notification_filter_service.filter_eligible_users(
            project_id, event_type
        )

        eligible_tokens = filter_result.eligible_tokens
        logger.info(f"Filtered {filter_result.filtered_count}/{filter_result.total_count} "
                   f"users in {filter_result.processing_time_ms:.2f}ms")

        if not eligible_tokens:
            logger.info("No eligible users for notification")
            return https_fn.Response(
                response={"message": "No eligible users", "filtered_count": 0},
                mimetype="application/json"
            )

        # Handle the event and generate messages
        event_messages = handle_event(data, eligible_tokens)

        # Send push notifications
        response = send_push_message(event_messages.model_dump(mode="json")["messages"])

        return https_fn.Response(
            response={
                "status": "success",
                "push_response": response,
                "filtered_count": filter_result.filtered_count,
                "processing_time_ms": filter_result.processing_time_ms
            },
            mimetype="application/json"
        )

    except Exception as e:
        logger.error(f"Error in webhook_gitlab_enhanced: {e}")
        return https_fn.Response(
            response={"error": str(e)},
            mimetype="application/json",
            status=500
        )


@https_fn.on_request()
def migrate_user_to_repository_consent(req: https_fn.Request) -> https_fn.Response:
    """
    Migration endpoint to convert legacy notification structure to repository consent.
    """
    if req.method != "POST":
        return https_fn.Response(
            response={"error": "Method not allowed"},
            status=405,
            mimetype="application/json"
        )

    try:
        data = req.get_json()
        expo_token = data.get("expo_token")

        if not expo_token:
            return https_fn.Response(
                response={"error": "Missing expo_token"},
                status=400,
                mimetype="application/json"
            )

        # Get user document
        user_doc_ref = db.collection("userNotifications").document(expo_token)
        user_doc = user_doc_ref.get()

        if not user_doc.exists:
            return https_fn.Response(
                response={"error": "User document not found"},
                status=404,
                mimetype="application/json"
            )

        user_data = user_doc.to_dict()
        migrated_count = 0

        # Convert legacy notifications to repository consents
        if "notifications" in user_data and user_data["notifications"]:
            repository_consents = user_data.get("repository_consents", {})

            for notification in user_data["notifications"]:
                project_id = notification.get("id")
                if project_id and str(project_id) not in repository_consents:
                    # Create new repository consent from legacy notification
                    from models import RepositoryConsent
                    from datetime import datetime

                    new_consent = RepositoryConsent(
                        project_id=project_id,
                        project_name=notification.get("name", f"Project {project_id}"),
                        web_url=f"https://gitlab.com/project/{project_id}",  # Fallback URL
                        has_consent=True,
                        consent_date=datetime.utcnow(),
                        notification_level=notification.get("notification_level", "global")
                    )

                    repository_consents[str(project_id)] = new_consent.dict()
                    migrated_count += 1

            # Update document with migrated consents
            if migrated_count > 0:
                user_doc_ref.update({
                    "repository_consents": repository_consents,
                    "migration_completed": True,
                    "migration_date": firestore.SERVER_TIMESTAMP
                })

        return https_fn.Response(
            response={
                "success": True,
                "migrated_count": migrated_count,
                "message": f"Migrated {migrated_count} repository consents"
            },
            mimetype="application/json"
        )

    except Exception as e:
        logger.error(f"Error in migrate_user_to_repository_consent: {e}")
        return https_fn.Response(
            response={"error": str(e)},
            status=500,
            mimetype="application/json"
        )
