import base64

from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError,
    PushTicketError,
)
from firebase_functions import logger
from google.cloud.firestore import ArrayUnion, FieldFilter
from requests.exceptions import ConnectionError, HTTPError


def send_push_message(messages):
    logger.info("Sending push message")
    try:
        responses = PushClient().publish_multiple(
            [PushMessage(**msg) for msg in messages]
        )

    except PushServerError as exc:
        logger.info(messages)
        logger.info(exc.errors)
        logger.info(exc.response_data)
        return "Error occurred while sending push message"

    except (ConnectionError, HTTPError) as exc:
        logger.info("Could not connect to push server: %s", exc)
        return "Connection occurred while sending push message"

    try:
        # We got a response back, but we don't know whether it's an error yet.
        # This call raises errors so we can handle them with normal exception
        # flows.
        for response in responses:
            response.validate_response()
        logger.info("Push message sent successfully")
        return "Push message sent successfully"

    except DeviceNotRegisteredError as exc:
        logger.info("Device not registered: %s", exc)
        return "Device not registered"
    except PushTicketError as exc:
        # Encountered some other per-notification error.
        logger.error(
            "Error occurred",
            exc_info=True,
            extra={
                "message": messages,
                "push_response": vars(exc.push_response),
            },
        )
        return "PushTicketError occurred while sending push message"
    except Exception as exc:
        logger.error(
            "Error occurred",
            exc_info=True,
            extra={
                "message": messages,
            },
        )
        return f"Error occurred while sending push message: {exc}"


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


def users_from_project_id(db, project_id):
    users_ref = db.collection("userNotifications")

    # Query to get users where the 'notification' field is not None
    matching_users = users_ref.stream()

    filtered_users = []
    for user_doc in matching_users:
        user_data = user_doc.to_dict()

        # Check if the 'notifications' field exists and iterate through it
        if "notifications" in user_data:
            for notification in user_data["notifications"]:
                # Check if the notification id matches the project_id
                if notification.get("id") == project_id:
                    # logger.info("notification", notification)
                    # Append user data with the document ID as expoToken
                    filtered_users.append(
                        {
                            "expoToken": user_doc.id,  # Assuming the document ID is the expoToken
                            **notification,
                        }
                    )
                    break  # No need to check other notifications for this user
    logger.info("Matching users:", filtered_users)
    return filtered_users


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
