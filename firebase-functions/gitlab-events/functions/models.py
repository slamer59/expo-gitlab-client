"""
Pydantic models for Firebase document structure and validation.
Modern Python approach using type hints and runtime validation.
"""
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Union

from pydantic import BaseModel, Field, validator


class NotificationLevel(str, Enum):
    """Notification levels following GitLab standards."""
    GLOBAL = "global"
    WATCH = "watch"
    PARTICIPATING = "participating"
    MENTION = "mention"
    DISABLED = "disabled"
    CUSTOM = "custom"


class EventType(str, Enum):
    """GitLab webhook event types."""
    PUSH = "push"
    TAG_PUSH = "tag_push"
    ISSUE = "issue"
    NOTE = "note"
    MERGE_REQUEST = "merge_request"
    WIKI_PAGE = "wiki_page"
    PIPELINE = "pipeline"
    BUILD = "build"
    DEPLOYMENT = "deployment"
    FEATURE_FLAG = "feature_flag"
    RELEASE = "release"


class GlobalNotificationSettings(BaseModel):
    """Global notification preferences."""
    notification_level: NotificationLevel = NotificationLevel.PARTICIPATING
    custom_events: List[EventType] = Field(default_factory=list)
    notification_email: Optional[str] = None


class RepositoryConsent(BaseModel):
    """Repository-specific consent and notification settings."""
    project_id: int
    project_name: str
    web_url: str
    has_consent: bool = False
    consent_date: Optional[datetime] = None
    notification_level: NotificationLevel = NotificationLevel.GLOBAL
    custom_events: List[EventType] = Field(default_factory=list)
    webhook_id: Optional[int] = None  # GitLab webhook ID for this repository
    webhook_created_at: Optional[datetime] = None

    @validator('consent_date', pre=True, always=True)
    def set_consent_date(cls, v, values):
        """Auto-set consent date when consent is given."""
        if values.get('has_consent') and v is None:
            return datetime.utcnow()
        elif not values.get('has_consent'):
            return None
        return v


class ProjectNotification(BaseModel):
    """Legacy project notification structure (for backward compatibility)."""
    id: int
    name: str
    notification_level: NotificationLevel = NotificationLevel.GLOBAL
    custom_events: List[EventType] = Field(default_factory=list)


class UserNotificationDocument(BaseModel):
    """Enhanced user notification document structure."""
    # User identification
    expo_token: str = Field(..., description="Expo push token (document ID)")

    # Timestamps
    created_date: datetime = Field(default_factory=datetime.utcnow)
    changed_date: datetime = Field(default_factory=datetime.utcnow)
    last_sync_date: Optional[datetime] = None

    # GDPR Consent
    gdpr_consent: bool = False
    gdpr_consent_date: Optional[datetime] = None

    # Global settings
    global_notification: GlobalNotificationSettings = Field(default_factory=GlobalNotificationSettings)

    # Per-repository consent (new structure)
    repository_consents: Dict[str, RepositoryConsent] = Field(default_factory=dict)

    # Legacy notifications (for backward compatibility)
    notifications: List[ProjectNotification] = Field(default_factory=list)

    # Repository detection metadata
    last_repository_scan: Optional[datetime] = None
    detected_repositories_count: int = 0

    class Config:
        """Pydantic configuration."""
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

    @validator('changed_date', pre=True, always=True)
    def update_changed_date(cls, v):
        """Auto-update changed date on any modification."""
        return datetime.utcnow()

    def get_repository_consent(self, project_id: int) -> Optional[RepositoryConsent]:
        """Get consent for a specific repository."""
        return self.repository_consents.get(str(project_id))

    def has_repository_consent(self, project_id: int) -> bool:
        """Check if user has given consent for a repository."""
        consent = self.get_repository_consent(project_id)
        return consent.has_consent if consent else False

    def get_effective_notification_level(self, project_id: int) -> NotificationLevel:
        """Get effective notification level for a repository."""
        consent = self.get_repository_consent(project_id)
        if not consent or not consent.has_consent:
            return NotificationLevel.DISABLED

        if consent.notification_level == NotificationLevel.GLOBAL:
            return self.global_notification.notification_level
        return consent.notification_level

    def should_receive_notification(self, project_id: int, event_type: EventType) -> bool:
        """Determine if user should receive notification for an event."""
        if not self.gdpr_consent:
            return False

        consent = self.get_repository_consent(project_id)
        if not consent or not consent.has_consent:
            return False

        level = self.get_effective_notification_level(project_id)

        if level == NotificationLevel.DISABLED:
            return False
        elif level == NotificationLevel.CUSTOM:
            # Check repository-specific custom events first
            if consent.custom_events:
                return event_type in consent.custom_events
            # Fall back to global custom events
            return event_type in self.global_notification.custom_events

        # Use notification matrix from main.py
        from main import NotificationSetting
        return NotificationSetting.notification_matrix.get(event_type.value, {}).get(level.value, False)


class WebhookManagementRequest(BaseModel):
    """Request model for webhook management operations."""
    expo_token: str
    project_id: int
    action: str = Field(..., pattern="^(create|delete|update)$")
    webhook_url: Optional[str] = None
    events: Optional[List[EventType]] = None


class RepositoryConsentSyncRequest(BaseModel):
    """Request model for syncing repository consent from client."""
    expo_token: str
    repository_consents: List[RepositoryConsent]
    force_update: bool = False


class BatchNotificationQuery(BaseModel):
    """Optimized query structure for batch notification filtering."""
    project_id: int
    event_type: EventType
    user_tokens: List[str] = Field(max_items=1000)  # Limit for performance


class NotificationFilterResult(BaseModel):
    """Result of notification filtering operation."""
    eligible_tokens: List[str]
    filtered_count: int
    total_count: int
    processing_time_ms: float