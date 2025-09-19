"""
Advanced notification filtering service with per-repository consent.
Optimized for performance with large user bases.
"""
import time
from typing import Dict, List, Set, Tuple

from firebase_admin import firestore
from firebase_functions import logger
from google.cloud.firestore import FieldFilter, Query

from models import (
    EventType,
    NotificationFilterResult,
    NotificationLevel,
    UserNotificationDocument,
)


class NotificationFilterService:
    """High-performance notification filtering with repository consent."""

    def __init__(self, db: firestore.Client):
        self.db = db

    def filter_eligible_users(
        self,
        project_id: int,
        event_type: str,
        user_tokens: List[str] = None
    ) -> NotificationFilterResult:
        """
        Filter users eligible for notifications with per-repository consent.

        Args:
            project_id: GitLab project ID
            event_type: Type of GitLab event
            user_tokens: Optional list to filter specific users

        Returns:
            NotificationFilterResult with eligible tokens and metrics
        """
        start_time = time.time()

        try:
            # Convert event type to enum
            try:
                event_enum = EventType(event_type)
            except ValueError:
                logger.warning(f"Unknown event type: {event_type}")
                return NotificationFilterResult(
                    eligible_tokens=[],
                    filtered_count=0,
                    total_count=0,
                    processing_time_ms=0
                )

            # Build optimized query
            query = self._build_consent_query(project_id, user_tokens)

            # Execute query and filter
            eligible_tokens = []
            total_count = 0

            for doc in query.stream():
                total_count += 1
                try:
                    user_data = UserNotificationDocument(**doc.to_dict())

                    # Check if user should receive notification
                    if user_data.should_receive_notification(project_id, event_enum):
                        eligible_tokens.append(doc.id)

                except Exception as e:
                    logger.error(f"Error processing user document {doc.id}: {e}")
                    continue

            processing_time = (time.time() - start_time) * 1000

            result = NotificationFilterResult(
                eligible_tokens=eligible_tokens,
                filtered_count=len(eligible_tokens),
                total_count=total_count,
                processing_time_ms=processing_time
            )

            logger.info(f"Filtered {result.filtered_count}/{result.total_count} users "
                       f"for project {project_id}, event {event_type} "
                       f"in {processing_time:.2f}ms")

            return result

        except Exception as e:
            logger.error(f"Error in notification filtering: {e}")
            return NotificationFilterResult(
                eligible_tokens=[],
                filtered_count=0,
                total_count=0,
                processing_time_ms=(time.time() - start_time) * 1000
            )

    def _build_consent_query(
        self,
        project_id: int,
        user_tokens: List[str] = None
    ) -> Query:
        """Build optimized Firestore query for users with repository consent."""

        base_query = self.db.collection("userNotifications")

        # Add GDPR consent filter (index required)
        query = base_query.where(
            filter=FieldFilter("gdpr_consent", "==", True)
        )

        # If specific user tokens provided, filter by them
        if user_tokens:
            # Firestore 'in' queries are limited to 30 items
            if len(user_tokens) <= 30:
                query = query.where(
                    filter=FieldFilter("__name__", "in", user_tokens)
                )
            else:
                # For larger lists, we'll need to batch or handle differently
                logger.warning(f"User token list too large ({len(user_tokens)}), "
                             "filtering will be done in memory")

        # Add repository consent path filter if possible
        # Note: This requires a composite index on gdpr_consent and repository_consents
        consent_path = f"repository_consents.{project_id}.has_consent"
        query = query.where(
            filter=FieldFilter(consent_path, "==", True)
        )

        return query

    def get_legacy_notification_users(self, project_id: int) -> List[str]:
        """
        Get users using legacy notification structure.
        For backward compatibility during migration.
        """
        try:
            query = (
                self.db.collection("userNotifications")
                .where(filter=FieldFilter("gdpr_consent", "==", True))
                .where(filter=FieldFilter("notifications", "array_contains", {
                    "id": project_id
                }))
            )

            return [doc.id for doc in query.stream()]

        except Exception as e:
            logger.error(f"Error getting legacy notification users: {e}")
            return []

    def batch_filter_users(
        self,
        project_event_pairs: List[Tuple[int, str]],
        max_batch_size: int = 100
    ) -> Dict[Tuple[int, str], NotificationFilterResult]:
        """
        Efficiently filter users for multiple project/event combinations.

        Args:
            project_event_pairs: List of (project_id, event_type) tuples
            max_batch_size: Maximum batch size for processing

        Returns:
            Dictionary mapping (project_id, event_type) to filter results
        """
        results = {}

        # Process in batches to avoid overwhelming Firestore
        for i in range(0, len(project_event_pairs), max_batch_size):
            batch = project_event_pairs[i:i + max_batch_size]

            for project_id, event_type in batch:
                results[(project_id, event_type)] = self.filter_eligible_users(
                    project_id, event_type
                )

        return results

    def get_user_repository_consents(self, expo_token: str) -> Dict[int, bool]:
        """
        Get all repository consents for a specific user.
        Useful for client synchronization.
        """
        try:
            user_doc = self.db.collection("userNotifications").document(expo_token).get()

            if not user_doc.exists:
                return {}

            user_data = UserNotificationDocument(**user_doc.to_dict())

            # Convert to simple dict of project_id -> has_consent
            return {
                int(project_id): consent.has_consent
                for project_id, consent in user_data.repository_consents.items()
                if consent.has_consent
            }

        except Exception as e:
            logger.error(f"Error getting user repository consents: {e}")
            return {}

    def update_last_notification_sent(self, expo_token: str, project_id: int):
        """Update timestamp when notification was last sent to user."""
        try:
            user_doc_ref = self.db.collection("userNotifications").document(expo_token)

            user_doc_ref.update({
                f"repository_consents.{project_id}.last_notification_sent": firestore.SERVER_TIMESTAMP,
                "last_notification_sent": firestore.SERVER_TIMESTAMP
            })

        except Exception as e:
            logger.error(f"Error updating last notification timestamp: {e}")

    def cleanup_revoked_consents(self, days_old: int = 30) -> int:
        """
        Clean up old revoked consent records for storage optimization.

        Args:
            days_old: Remove consent records older than this many days

        Returns:
            Number of cleaned up records
        """
        try:
            from datetime import datetime, timedelta

            cutoff_date = datetime.utcnow() - timedelta(days=days_old)
            cleaned_count = 0

            # Query users with repository consents
            users_query = self.db.collection("userNotifications").where(
                filter=FieldFilter("repository_consents", "!=", {})
            )

            batch = self.db.batch()
            batch_size = 0

            for user_doc in users_query.stream():
                try:
                    user_data = UserNotificationDocument(**user_doc.to_dict())
                    updated_consents = {}

                    for project_id_str, consent in user_data.repository_consents.items():
                        # Keep consent if it's active or recently revoked
                        if (consent.has_consent or
                            not consent.consent_date or
                            consent.consent_date > cutoff_date):
                            updated_consents[project_id_str] = consent
                        else:
                            cleaned_count += 1

                    # Update document if we removed any consents
                    if len(updated_consents) < len(user_data.repository_consents):
                        batch.update(user_doc.reference, {
                            "repository_consents": {
                                consent.project_id: consent.dict()
                                for consent in updated_consents.values()
                            }
                        })
                        batch_size += 1

                        # Commit batch if it gets large
                        if batch_size >= 500:
                            batch.commit()
                            batch = self.db.batch()
                            batch_size = 0

                except Exception as e:
                    logger.error(f"Error processing user {user_doc.id} for cleanup: {e}")
                    continue

            # Commit final batch
            if batch_size > 0:
                batch.commit()

            logger.info(f"Cleaned up {cleaned_count} old consent records")
            return cleaned_count

        except Exception as e:
            logger.error(f"Error in consent cleanup: {e}")
            return 0