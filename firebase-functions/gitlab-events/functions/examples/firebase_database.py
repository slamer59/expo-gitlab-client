import base64
from typing import List

import firebase_admin
import requests
from firebase_admin import credentials, firestore
from google.cloud.firestore import ArrayUnion
from google.cloud.firestore_v1.base_query import FieldFilter

# Use a service account
cred = credentials.Certificate("gitalchemy-firebase-adminsdk-fnaju-289dccb9a0.json")

app = firebase_admin.initialize_app(
    cred,
    {
        "projectId": "gitalchemy",
    },
)

db = firestore.client(app)


def list_devices_with_group_id(group_id):

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


# Set the GitLab API endpoint and your private token
url = "https://gitlab.com/api/v4/projects"
headers = {"PRIVATE-TOKEN": "REDACTED"}
push_token = "ExponentPushToken[8i6Z2PGCrtfL2ZchhUHdKA]"

# Make the GET request to the projects endpoint with the membership parameter set to True
response = requests.get(url, headers=headers, params={"membership": "True"})

# Parse the JSON response
projects = response.json()

# Start a new batch
batch = db.batch()

for project in projects:
    # Get the notification group document reference
    group_name = project["http_url_to_repo"]
    notification_group_id = base64.b64encode(group_name.encode()).decode()
    # Get the notification group document reference
    notification_group_ref = db.collection("notificationGroups").document(
        notification_group_id
    )

    # Update or create notificationsGroups document
    batch.set(
        notification_group_ref, {"groupName": project["http_url_to_repo"]}, merge=True
    )

    # Add the device ID to the devices array
    batch.update(notification_group_ref, {"devices": ArrayUnion([push_token])})

# Commit the batch
batch.commit()


group_id = projects[0]["http_url_to_repo"]
documents = list_devices_with_group_id(group_id)
print(documents)
