"""
Repository consent synchronization service.
Handles sync between client-side Zustand store and Firebase.
"""

import asyncio
import time
from datetime import datetime
from typing import Dict, List, Optional, Set

import requests
from firebase_admin import firestore
from firebase_functions import logger
from google.cloud.firestore import DocumentReference, Transaction
from models import (
    NotificationLevel,
    RepositoryConsent,
    RepositoryConsentSyncRequest,
    UserNotificationDocument,
    WebhookManagementRequest,
)
from pydantic import ValidationError


class RepositoryConsentService:
    """Service for managing repository consent and webhook integration."""

    def __init__(self, db: firestore.Client, gitlab_token: str, webhook_base_url: str):
        self.db = db
        self.gitlab_token = gitlab_token
        self.webhook_base_url = webhook_base_url
        self.gitlab_headers = {
            "PRIVATE-TOKEN": gitlab_token,
            "Content-Type": "application/json",
        }

    async def sync_repository_consents(
        self, request: RepositoryConsentSyncRequest
    ) -> Dict[str, any]:
        """
        Sync repository consents from client to Firebase.
        Handles webhook creation/deletion based on consent changes.
        """
        start_time = time.time()

        try:
            # Validate request
            if not request.repository_consents:
                return {"success": False, "error": "No consents provided"}

            # Get current user document
            user_doc_ref = self.db.collection("userNotifications").document(
                request.expo_token
            )

            # Use transaction for atomicity
            result = await self._sync_consents_transaction(
                user_doc_ref, request.repository_consents, request.force_update
            )

            processing_time = (time.time() - start_time) * 1000

            logger.info(f"Repository consent sync completed in {processing_time:.2f}ms")

            return {
                "success": True,
                "synced_count": result["synced_count"],
                "webhook_changes": result["webhook_changes"],
                "processing_time_ms": processing_time,
            }

        except ValidationError as e:
            logger.error(f"Validation error in consent sync: {e}")
            return {"success": False, "error": f"Validation error: {str(e)}"}
        except Exception as e:
            logger.error(f"Error syncing repository consents: {e}")
            return {"success": False, "error": str(e)}

    @firestore.transactional
    async def _sync_consents_transaction(
        self,
        transaction: Transaction,
        user_doc_ref: DocumentReference,
        new_consents: List[RepositoryConsent],
        force_update: bool,
    ) -> Dict[str, any]:
        """Transactional consent sync operation."""

        # Get current document
        current_doc = user_doc_ref.get(transaction=transaction)

        if current_doc.exists:
            current_data = UserNotificationDocument(**current_doc.to_dict())
        else:
            current_data = UserNotificationDocument(expo_token=user_doc_ref.id)

        # Track changes for webhook management
        webhook_changes = {"created": [], "deleted": [], "updated": []}

        synced_count = 0

        # Process each consent
        for new_consent in new_consents:
            project_id_str = str(new_consent.project_id)
            current_consent = current_data.repository_consents.get(project_id_str)

            # Determine if we need to update
            should_update = (
                force_update
                or not current_consent
                or current_consent.has_consent != new_consent.has_consent
                or current_consent.notification_level != new_consent.notification_level
            )

            if should_update:
                # Handle webhook changes
                if new_consent.has_consent and (
                    not current_consent or not current_consent.has_consent
                ):
                    # Need to create webhook
                    webhook_result = await self._create_repository_webhook(
                        new_consent.project_id
                    )
                    if webhook_result["success"]:
                        new_consent.webhook_id = webhook_result["webhook_id"]
                        new_consent.webhook_created_at = datetime.utcnow()
                        webhook_changes["created"].append(new_consent.project_id)

                elif (
                    not new_consent.has_consent
                    and current_consent
                    and current_consent.has_consent
                ):
                    # Need to delete webhook
                    if current_consent.webhook_id:
                        webhook_result = await self._delete_repository_webhook(
                            new_consent.project_id, current_consent.webhook_id
                        )
                        if webhook_result["success"]:
                            webhook_changes["deleted"].append(new_consent.project_id)

                # Update consent in document
                current_data.repository_consents[project_id_str] = new_consent
                synced_count += 1

        # Update document in transaction
        transaction.set(user_doc_ref, current_data.dict(), merge=True)

        return {"synced_count": synced_count, "webhook_changes": webhook_changes}

    async def _create_repository_webhook(self, project_id: int) -> Dict[str, any]:
        """Create GitLab webhook for a repository."""
        try:
            webhook_url = f"{self.webhook_base_url}/webhook_gitlab"

            webhook_data = {
                "url": webhook_url,
                "push_events": True,
                "issues_events": True,
                "merge_requests_events": True,
                "wiki_page_events": True,
                "pipeline_events": True,
                "job_events": True,
                "note_events": True,
                "tag_push_events": True,
                "deployment_events": True,
                "releases_events": True,
                "enable_ssl_verification": True,
                "token": "webhook-secret-token",  # Should be configured via environment
            }

            response = requests.post(
                f"https://gitlab.com/api/v4/projects/{project_id}/hooks",
                headers=self.gitlab_headers,
                json=webhook_data,
                timeout=30,
            )

            if response.status_code == 201:
                webhook_data = response.json()
                logger.info(
                    f"Created webhook {webhook_data['id']} for project {project_id}"
                )
                return {"success": True, "webhook_id": webhook_data["id"]}
            else:
                logger.error(
                    f"Failed to create webhook for project {project_id}: {response.text}"
                )
                return {
                    "success": False,
                    "error": f"GitLab API error: {response.status_code}",
                }

        except Exception as e:
            logger.error(f"Exception creating webhook for project {project_id}: {e}")
            return {"success": False, "error": str(e)}

    async def _delete_repository_webhook(
        self, project_id: int, webhook_id: int
    ) -> Dict[str, any]:
        """Delete GitLab webhook for a repository."""
        try:
            response = requests.delete(
                f"https://gitlab.com/api/v4/projects/{project_id}/hooks/{webhook_id}",
                headers=self.gitlab_headers,
                timeout=30,
            )

            if response.status_code == 204:
                logger.info(f"Deleted webhook {webhook_id} for project {project_id}")
                return {"success": True}
            else:
                logger.error(
                    f"Failed to delete webhook {webhook_id} for project {project_id}: {response.text}"
                )
                return {
                    "success": False,
                    "error": f"GitLab API error: {response.status_code}",
                }

        except Exception as e:
            logger.error(
                f"Exception deleting webhook {webhook_id} for project {project_id}: {e}"
            )
            return {"success": False, "error": str(e)}

    def get_consented_repositories(self, expo_token: str) -> List[RepositoryConsent]:
        """Get all repositories that user has consented to."""
        try:
            user_doc = (
                self.db.collection("userNotifications").document(expo_token).get()
            )

            if not user_doc.exists:
                return []

            user_data = UserNotificationDocument(**user_doc.to_dict())

            return [
                consent
                for consent in user_data.repository_consents.values()
                if consent.has_consent
            ]

        except Exception as e:
            logger.error(f"Error getting consented repositories for {expo_token}: {e}")
            return []

    async def bulk_consent_update(
        self, expo_token: str, project_ids: List[int], has_consent: bool
    ) -> Dict[str, any]:
        """Bulk update consent for multiple repositories."""
        try:
            user_doc_ref = self.db.collection("userNotifications").document(expo_token)
            user_doc = user_doc_ref.get()

            if not user_doc.exists:
                return {"success": False, "error": "User document not found"}

            user_data = UserNotificationDocument(**user_doc.to_dict())
            updated_count = 0
            webhook_changes = {"created": [], "deleted": []}

            for project_id in project_ids:
                project_id_str = str(project_id)
                current_consent = user_data.repository_consents.get(project_id_str)

                if not current_consent:
                    # Create new consent entry
                    project_info = await self._get_project_info(project_id)
                    if not project_info:
                        continue

                    new_consent = RepositoryConsent(
                        project_id=project_id,
                        project_name=project_info["name"],
                        web_url=project_info["web_url"],
                        has_consent=has_consent,
                    )

                    if has_consent:
                        webhook_result = await self._create_repository_webhook(
                            project_id
                        )
                        if webhook_result["success"]:
                            new_consent.webhook_id = webhook_result["webhook_id"]
                            webhook_changes["created"].append(project_id)

                    user_data.repository_consents[project_id_str] = new_consent
                    updated_count += 1

                elif current_consent.has_consent != has_consent:
                    # Update existing consent
                    current_consent.has_consent = has_consent
                    current_consent.consent_date = (
                        datetime.utcnow() if has_consent else None
                    )

                    if has_consent and not current_consent.webhook_id:
                        webhook_result = await self._create_repository_webhook(
                            project_id
                        )
                        if webhook_result["success"]:
                            current_consent.webhook_id = webhook_result["webhook_id"]
                            webhook_changes["created"].append(project_id)
                    elif not has_consent and current_consent.webhook_id:
                        webhook_result = await self._delete_repository_webhook(
                            project_id, current_consent.webhook_id
                        )
                        if webhook_result["success"]:
                            current_consent.webhook_id = None
                            webhook_changes["deleted"].append(project_id)

                    updated_count += 1

            # Save updated document
            user_doc_ref.set(user_data.dict(), merge=True)

            return {
                "success": True,
                "updated_count": updated_count,
                "webhook_changes": webhook_changes,
            }

        except Exception as e:
            logger.error(f"Error in bulk consent update: {e}")
            return {"success": False, "error": str(e)}

    async def _get_project_info(self, project_id: int) -> Optional[Dict[str, str]]:
        """Get project information from GitLab API."""
        try:
            response = requests.get(
                f"https://gitlab.com/api/v4/projects/{project_id}",
                headers=self.gitlab_headers,
                timeout=30,
            )

            if response.status_code == 200:
                project_data = response.json()
                return {
                    "name": project_data.get(
                        "path_with_namespace", project_data.get("name", "")
                    ),
                    "web_url": project_data.get("web_url", ""),
                }
            else:
                logger.error(
                    f"Failed to get project info for {project_id}: {response.status_code}"
                )
                return None

        except Exception as e:
            logger.error(f"Exception getting project info for {project_id}: {e}")
            return None
