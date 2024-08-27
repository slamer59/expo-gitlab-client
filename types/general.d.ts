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
 export interface APIEntitiesMergeRequest {
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
   merged_by?: /* API_Entities_UserBasic model */ APIEntitiesUserBasic;
   merge_user?: /* API_Entities_UserBasic model */ APIEntitiesUserBasic;
   merged_at?: string;
   closed_by?: /* API_Entities_UserBasic model */ APIEntitiesUserBasic;
   closed_at?: string;
   title_html?: string;
   description_html?: string;
   target_branch?: string;
   source_branch?: string;
   user_notes_count?: string;
   upvotes?: string;
   downvotes?: string;
   author?: /* API_Entities_UserBasic model */ APIEntitiesUserBasic;
   assignees?: /* API_Entities_UserBasic model */ APIEntitiesUserBasic;
   assignee?: /* API_Entities_UserBasic model */ APIEntitiesUserBasic;
   reviewers?: /* API_Entities_UserBasic model */ APIEntitiesUserBasic;
   source_project_id?: string;
   target_project_id?: string;
   labels?: string;
   draft?: string;
   imported?: string;
   /**
    * example:
    * bitbucket
    */
   imported_from?: string;
   work_in_progress?: string;
   milestone?: APIEntitiesMilestone;
   merge_when_pipeline_succeeds?: string;
   merge_status?: string;
   detailed_merge_status?: string;
   sha?: string;
   merge_commit_sha?: string;
   squash_commit_sha?: string;
   discussion_locked?: string;
   should_remove_source_branch?: string;
   force_remove_source_branch?: string;
   prepared_at?: string;
   allow_collaboration?: string;
   allow_maintainer_to_push?: string;
   reference?: string;
   references?: APIEntitiesIssuableReferences;
   web_url?: string;
   time_stats?: /* API_Entities_IssuableTimeStats model */ APIEntitiesIssuableTimeStats;
   squash?: string;
   squash_on_merge?: string;
   task_completion_status?: string;
   has_conflicts?: string;
   blocking_discussions_resolved?: string;
   approvals_before_merge?: string;
   subscribed?: string;
   changes_count?: string;
   latest_build_started_at?: string;
   latest_build_finished_at?: string;
   first_deployed_to_production_at?: string;
   pipeline?: /* API_Entities_Ci_PipelineBasic model */ APIEntitiesCiPipelineBasic;
   head_pipeline?: /* API_Entities_Ci_Pipeline model */ APIEntitiesCiPipeline;
   diff_refs?: APIEntitiesDiffRefs;
   merge_error?: string;
   rebase_in_progress?: string;
   diverged_commits_count?: string;
   first_contribution?: string;
   user?: {
     can_merge?: string;
   };
 }
  export interface APIEntitiesProject {
    /**
     * example:
     * 1
     */
    id?: number; // int32
    /**
     * example:
     * desc
     */
    description?: string;
    /**
     * example:
     * project1
     */
    name?: string;
    /**
     * example:
     * John Doe / project1
     */
    name_with_namespace?: string;
    /**
     * example:
     * project1
     */
    path?: string;
    /**
     * example:
     * namespace1/project1
     */
    path_with_namespace?: string;
    /**
     * example:
     * 2020-05-07T04:27:17.016Z
     */
    created_at?: string; // date-time
    /**
     * example:
     * main
     */
    default_branch?: string;
    tag_list?: string[];
    topics?: string[];
    /**
     * example:
     * git@gitlab.example.com:gitlab/gitlab.git
     */
    ssh_url_to_repo?: string;
    /**
     * example:
     * https://gitlab.example.com/gitlab/gitlab.git
     */
    http_url_to_repo?: string;
    /**
     * example:
     * https://gitlab.example.com/gitlab/gitlab
     */
    web_url?: string;
    /**
     * example:
     * https://gitlab.example.com/gitlab/gitlab/blob/master/README.md
     */
    readme_url?: string;
    /**
     * example:
     * 1
     */
    forks_count?: number; // int32
    /**
     * example:
     * https://gitlab.example.com/gitlab/gitlab/blob/master/LICENCE
     */
    license_url?: string;
    license?: APIEntitiesLicenseBasic;
    /**
     * example:
     * http://example.com/uploads/project/avatar/3/uploads/avatar.png
     */
    avatar_url?: string;
    /**
     * example:
     * 1
     */
    star_count?: number; // int32
    /**
     * example:
     * 2013-09-30T13:46:02.000Z
     */
    last_activity_at?: string; // date-time
    namespace?: APIEntitiesNamespaceBasic;
    custom_attributes?: /* API_Entities_CustomAttribute model */ APIEntitiesCustomAttribute;
    /**
     * example:
     * default
     */
    repository_storage?: string;
    /**
     * example:
     * registry.gitlab.example.com/gitlab/gitlab-client
     */
    container_registry_image_prefix?: string;
    _links?: {
      /**
       * example:
       * https://gitlab.example.com/api/v4/projects/4
       */
      self?: string;
      /**
       * example:
       * https://gitlab.example.com/api/v4/projects/4/issues
       */
      issues?: string;
      /**
       * example:
       * https://gitlab.example.com/api/v4/projects/4/merge_requests
       */
      merge_requests?: string;
      /**
       * example:
       * https://gitlab.example.com/api/v4/projects/4/repository/branches
       */
      repo_branches?: string;
      /**
       * example:
       * https://gitlab.example.com/api/v4/projects/4/labels
       */
      labels?: string;
      /**
       * example:
       * https://gitlab.example.com/api/v4/projects/4/events
       */
      events?: string;
      /**
       * example:
       * https://gitlab.example.com/api/v4/projects/4/members
       */
      members?: string;
      /**
       * example:
       * https://gitlab.example.com/api/v4/projects/4/cluster_agents
       */
      cluster_agents?: string;
    };
    packages_enabled?: boolean;
    empty_repo?: boolean;
    archived?: boolean;
    /**
     * example:
     * public
     */
    visibility?: string;
    owner?: /* API_Entities_UserBasic model */ APIEntitiesUserBasic;
    resolve_outdated_diff_discussions?: boolean;
    container_expiration_policy?: APIEntitiesContainerExpirationPolicy;
    /**
     * example:
     * sha1
     */
    repository_object_format?: string;
    issues_enabled?: boolean;
    merge_requests_enabled?: boolean;
    wiki_enabled?: boolean;
    jobs_enabled?: boolean;
    snippets_enabled?: boolean;
    container_registry_enabled?: boolean;
    service_desk_enabled?: boolean;
    /**
     * example:
     * address@example.com
     */
    service_desk_address?: string;
    can_create_merge_request_in?: boolean;
    /**
     * example:
     * enabled
     */
    issues_access_level?: string;
    /**
     * example:
     * enabled
     */
    repository_access_level?: string;
    /**
     * example:
     * enabled
     */
    merge_requests_access_level?: string;
    /**
     * example:
     * enabled
     */
    forking_access_level?: string;
    /**
     * example:
     * enabled
     */
    wiki_access_level?: string;
    /**
     * example:
     * enabled
     */
    builds_access_level?: string;
    /**
     * example:
     * enabled
     */
    snippets_access_level?: string;
    /**
     * example:
     * enabled
     */
    pages_access_level?: string;
    /**
     * example:
     * enabled
     */
    analytics_access_level?: string;
    /**
     * example:
     * enabled
     */
    container_registry_access_level?: string;
    /**
     * example:
     * enabled
     */
    security_and_compliance_access_level?: string;
    /**
     * example:
     * enabled
     */
    releases_access_level?: string;
    /**
     * example:
     * enabled
     */
    environments_access_level?: string;
    /**
     * example:
     * enabled
     */
    feature_flags_access_level?: string;
    /**
     * example:
     * enabled
     */
    infrastructure_access_level?: string;
    /**
     * example:
     * enabled
     */
    monitor_access_level?: string;
    /**
     * example:
     * enabled
     */
    model_experiments_access_level?: string;
    /**
     * example:
     * enabled
     */
    model_registry_access_level?: string;
    emails_disabled?: boolean;
    emails_enabled?: boolean;
    shared_runners_enabled?: boolean;
    lfs_enabled?: boolean;
    /**
     * example:
     * 1
     */
    creator_id?: number; // int32
    forked_from_project?: /* API_Entities_BasicProjectDetails model */ APIEntitiesBasicProjectDetails;
    mr_default_target_self?: boolean;
    /**
     * example:
     * https://gitlab.com/gitlab/gitlab.git
     */
    import_url?: string;
    /**
     * example:
     * git
     */
    import_type?: string;
    /**
     * example:
     * none
     */
    import_status?: string;
    /**
     * example:
     * Import error
     */
    import_error?: string;
    /**
     * example:
     * 1
     */
    open_issues_count?: number; // int32
    description_html?: string;
    /**
     * example:
     * 2020-05-07T04:27:17.016Z
     */
    updated_at?: string; // date-time
    /**
     * example:
     * 20
     */
    ci_default_git_depth?: number; // int32
    ci_forward_deployment_enabled?: boolean;
    ci_forward_deployment_rollback_allowed?: boolean;
    ci_job_token_scope_enabled?: boolean;
    ci_separated_caches?: boolean;
    ci_allow_fork_pipelines_to_run_in_parent_project?: boolean;
    /**
     * example:
     * fetch
     */
    build_git_strategy?: string;
    keep_latest_artifact?: boolean;
    restrict_user_defined_variables?: boolean;
    ci_pipeline_variables_minimum_override_role?: string;
    /**
     * example:
     * b8547b1dc37721d05889db52fa2f02
     */
    runners_token?: string;
    /**
     * example:
     * 3600
     */
    runner_token_expiration_interval?: number; // int32
    group_runners_enabled?: boolean;
    /**
     * example:
     * enabled
     */
    auto_cancel_pending_pipelines?: string;
    /**
     * example:
     * 3600
     */
    build_timeout?: number; // int32
    auto_devops_enabled?: boolean;
    /**
     * example:
     * continuous
     */
    auto_devops_deploy_strategy?: string;
    /**
     * example:
     *
     */
    ci_config_path?: string;
    public_jobs?: boolean;
    shared_with_groups?: string[];
    only_allow_merge_if_pipeline_succeeds?: boolean;
    allow_merge_on_skipped_pipeline?: boolean;
    request_access_enabled?: boolean;
    only_allow_merge_if_all_discussions_are_resolved?: boolean;
    remove_source_branch_after_merge?: boolean;
    printing_merge_request_link_enabled?: boolean;
    /**
     * example:
     * merge
     */
    merge_method?: string;
    /**
     * example:
     * default_off
     */
    squash_option?: string;
    enforce_auth_checks_on_uploads?: boolean;
    /**
     * example:
     * Suggestion message
     */
    suggestion_commit_message?: string;
    /**
     * example:
     * %(title)
     */
    merge_commit_template?: string;
    /**
     * example:
     * %(source_branch)
     */
    squash_commit_template?: string;
    /**
     * example:
     * %(title)
     */
    issue_branch_template?: string;
    statistics?: APIEntitiesProjectStatistics;
    warn_about_potentially_unwanted_characters?: boolean;
    autoclose_referenced_issues?: boolean;
    approvals_before_merge?: string;
    mirror?: string;
    mirror_user_id?: string;
    mirror_trigger_builds?: string;
    only_mirror_protected_branches?: string;
    mirror_overwrites_diverged_branches?: string;
    external_authorization_classification_label?: string;
    marked_for_deletion_at?: string;
    marked_for_deletion_on?: string;
    requirements_enabled?: string;
    requirements_access_level?: string;
    security_and_compliance_enabled?: string;
    compliance_frameworks?: string;
    issues_template?: string;
    merge_requests_template?: string;
    ci_restrict_pipeline_cancellation_role?: string;
    merge_pipelines_enabled?: string;
    merge_trains_enabled?: string;
    merge_trains_skip_train_allowed?: string;
    only_allow_merge_if_all_status_checks_passed?: string;
    allow_pipeline_trigger_approve_deployment?: boolean;
    prevent_merge_without_jira_issue?: string;
  }