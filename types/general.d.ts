export interface APIEntitiesRelatedIssue {
  /**
   * example:
   * 84
   */
  id?: number; // int32
  /**
   * example:
   * 14
   */
  iid?: number; // int32
  /**
   * example:
   * 4
   */
  project_id?: number; // int32
  /**
   * example:
   * Impedit et ut et dolores vero provident ullam est
   */
  title?: string;
  /**
   * example:
   * Repellendus impedit et vel velit dignissimos.
   */
  description?: string;
  /**
   * example:
   * closed
   */
  state?: string;
  /**
   * example:
   * 2022-08-17T12:46:35.053Z
   */
  created_at?: string; // date-time
  /**
   * example:
   * 2022-11-14T17:22:01.470Z
   */
  updated_at?: string; // date-time
  /**
   * example:
   * 2022-11-15T08:30:55.232Z
   */
  closed_at?: string; // date-time
  closed_by?: /* API_Entities_UserBasic model */ APIEntitiesUserBasic;
  labels?: string[];
  milestone?: APIEntitiesMilestone;
  assignees?: /* API_Entities_UserBasic model */ APIEntitiesUserBasic;
  author?: /* API_Entities_UserBasic model */ APIEntitiesUserBasic;
  /**
   * One of ["ISSUE", "INCIDENT", "TEST_CASE", "REQUIREMENT", "TASK"]
   * example:
   * ISSUE
   */
  type?: string;
  assignee?: /* API_Entities_UserBasic model */ APIEntitiesUserBasic;
  user_notes_count?: string;
  merge_requests_count?: string;
  upvotes?: string;
  downvotes?: string;
  /**
   * example:
   * 2022-11-20T00:00:00.000Z
   */
  due_date?: string; // date
  confidential?: boolean;
  discussion_locked?: boolean;
  /**
   * example:
   * issue
   */
  issue_type?: string;
  /**
   * example:
   * http://example.com/example/example/issues/14
   */
  web_url?: string;
  time_stats?: /* API_Entities_IssuableTimeStats model */ APIEntitiesIssuableTimeStats;
  task_completion_status?: string;
  weight?: string;
  blocking_issues_count?: string;
  has_tasks?: string;
  task_status?: string;
  _links?: {
    self?: string;
    notes?: string;
    award_emoji?: string;
    project?: string;
    closed_as_duplicate_of?: string;
  };
  references?: APIEntitiesIssuableReferences;
  /**
   * One of ["UNKNOWN", "LOW", "MEDIUM", "HIGH", "CRITICAL"]
   */
  severity?: string;
  subscribed?: string;
  moved_to_id?: string;
  imported?: string;
  /**
   * example:
   * github
   */
  imported_from?: string;
  service_desk_reply_to?: string;
  epic_iid?: string;
  epic?: EpicBaseEntity;
  iteration?: APIEntitiesIteration;
  health_status?: string;
  issue_link_id?: string;
  link_type?: string;
  link_created_at?: string;
  link_updated_at?: string;
}
