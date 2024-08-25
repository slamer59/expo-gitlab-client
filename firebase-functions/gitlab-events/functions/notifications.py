import base64

from exponent_server_sdk import PushClient, PushMessage
from firebase_functions import logger
from google.cloud.firestore import ArrayUnion


def send_push_message(message):
    logger.info("Sending push message: %s", message)
    response = PushClient().publish(PushMessage(**message))
    return response


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
