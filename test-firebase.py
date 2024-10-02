import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("gitalchemy-firebase-adminsdk-fnaju-4944a7c401.json")
firebase_admin.initialize_app(cred)
