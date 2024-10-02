import firebase_admin
import requests
from firebase_admin import credentials, db, firestore
from firebase_functions import https_fn, logger

firebaseProjectId = "gitalchemy"
# Use a service account
cred = credentials.Certificate("gitalchemy-firebase-adminsdk-fnaju-4944a7c401.json")
app = firebase_admin.initialize_app(
    cred,
    {
        "projectId": firebaseProjectId,
    },
)

db = firestore.client(app)
logger.info("Firestore client initialized")

# Write data
doc_ref = db.collection("users").document("user1")
doc_ref.set({"name": "John Doe", "email": "john@example.com"})

# Read data
users_ref = db.collection("users")
docs = users_ref.stream()
for doc in docs:
    print(f"{doc.id} => {doc.to_dict()}")

# Update data
doc_ref = db.collection("users").document("user1")
doc_ref.update({"age": 30})

# Read specific data
doc = db.collection("users").document("user1").get()
if doc.exists:
    print(f"Document data: {doc.to_dict()}")
else:
    print("No such document!")

# Add new data
new_user_ref = db.collection("users").add(
    {"name": "Jane Smith", "email": "jane@example.com"}
)
print(f"Added document with ID: {new_user_ref[1].id}")

# Query data
users_over_25 = db.collection("users").where("age", ">=", 25).stream()
for user in users_over_25:
    print(f"{user.id} => {user.to_dict()}")
