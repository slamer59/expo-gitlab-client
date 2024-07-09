import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
    namespace Schemas {
        /**
         * API_Entities_AccessRequester model
         */
        export interface APIEntitiesAccessRequester {
            /**
             * example:
             * 1
             */
            id?: number; // int32
            /**
             * example:
             * admin
             */
            username?: string;
            /**
             * example:
             * Administrator
             */
            name?: string;
            /**
             * example:
             * active
             */
            state?: string;
            /**
             * example:
             * https://gravatar.com/avatar/1
             */
            avatar_url?: string;
            /**
             * example:
             * /user/avatar/28/The-Big-Lebowski-400-400.png
             */
            avatar_path?: string;
            custom_attributes?: APIEntitiesCustomAttribute[];
            /**
             * example:
             * https://gitlab.example.com/root
             */
            web_url?: string;
            email?: string;
            requested_at?: string;
        }
        /**
         * API_Entities_Appearance model
         */
        export interface APIEntitiesAppearance {
            title?: string;
            description?: string;
            pwa_name?: string;
            pwa_short_name?: string;
            pwa_description?: string;
            logo?: string;
            pwa_icon?: string;
            header_logo?: string;
            favicon?: string;
            new_project_guidelines?: string;
            profile_image_guidelines?: string;
            header_message?: string;
            footer_message?: string;
            message_background_color?: string;
            message_font_color?: string;
            email_header_and_footer_enabled?: string;
        }
        /**
         * API_Entities_Application model
         */
        export interface APIEntitiesApplication {
            id?: string;
            /**
             * example:
             * 5832fc6e14300a0d962240a8144466eef4ee93ef0d218477e55f11cf12fc3737
             */
            application_id?: string;
            /**
             * example:
             * MyApplication
             */
            application_name?: string;
            /**
             * example:
             * https://redirect.uri
             */
            callback_url?: string;
            /**
             * example:
             * true
             */
            confidential?: boolean;
        }
        /**
         * API_Entities_ApplicationWithSecret model
         */
        export interface APIEntitiesApplicationWithSecret {
            id?: string;
            /**
             * example:
             * 5832fc6e14300a0d962240a8144466eef4ee93ef0d218477e55f11cf12fc3737
             */
            application_id?: string;
            /**
             * example:
             * MyApplication
             */
            application_name?: string;
            /**
             * example:
             * https://redirect.uri
             */
            callback_url?: string;
            /**
             * example:
             * true
             */
            confidential?: boolean;
            /**
             * example:
             * ee1dd64b6adc89cf7e2c23099301ccc2c61b441064e9324d963c46902a85ec34
             */
            secret?: string;
        }
        /**
         * API_Entities_Avatar model
         */
        export interface APIEntitiesAvatar {
            avatar_url?: string;
        }
        /**
         * API_Entities_Badge model
         */
        export interface APIEntitiesBadge {
            name?: string;
            link_url?: string;
            image_url?: string;
            rendered_link_url?: string;
            rendered_image_url?: string;
            id?: string;
            kind?: string;
        }
        /**
         * API_Entities_BasicBadgeDetails model
         */
        export interface APIEntitiesBasicBadgeDetails {
            name?: string;
            link_url?: string;
            image_url?: string;
            rendered_link_url?: string;
            rendered_image_url?: string;
        }
        /**
         * API_Entities_BatchedBackgroundMigration model
         */
        export interface APIEntitiesBatchedBackgroundMigration {
            /**
             * example:
             * 1234
             */
            id?: string;
            /**
             * example:
             * CopyColumnUsingBackgroundMigrationJob
             */
            job_class_name?: string;
            /**
             * example:
             * events
             */
            table_name?: string;
            /**
             * example:
             * active
             */
            status?: string;
            /**
             * example:
             * 50
             */
            progress?: number; // float
            /**
             * example:
             * 2022-11-28T14:26:39.000Z
             */
            created_at?: string; // date-time
        }
        /**
         * API_Entities_Branch model
         */
        export interface APIEntitiesBranch {
            /**
             * example:
             * master
             */
            name?: string;
            commit?: APIEntitiesCommit;
            /**
             * example:
             * true
             */
            merged?: boolean;
            /**
             * example:
             * true
             */
            protected?: boolean;
            /**
             * example:
             * true
             */
            developers_can_push?: boolean;
            /**
             * example:
             * true
             */
            developers_can_merge?: boolean;
            /**
             * example:
             * true
             */
            can_push?: boolean;
            /**
             * example:
             * true
             */
            default?: boolean;
            /**
             * example:
             * https://gitlab.example.com/Commit921/the-dude/-/tree/master
             */
            web_url?: string;
        }
        /**
         * API_Entities_BroadcastMessage model
         */
        export interface APIEntitiesBroadcastMessage {
            id?: string;
            message?: string;
            starts_at?: string;
            ends_at?: string;
            color?: string;
            font?: string;
            target_access_levels?: string;
            target_path?: string;
            broadcast_type?: string;
            dismissable?: string;
            active?: string;
        }
        /**
         * API_Entities_BulkImport model
         */
        export interface APIEntitiesBulkImport {
            /**
             * example:
             * 1
             */
            id?: number; // int32
            /**
             * example:
             * finished
             */
            status?: "created" | "started" | "finished" | "timeout" | "failed";
            /**
             * example:
             * gitlab
             */
            source_type?: string;
            /**
             * example:
             * 2012-05-28T11:42:42.000Z
             */
            created_at?: string; // date-time
            /**
             * example:
             * 2012-05-28T11:42:42.000Z
             */
            updated_at?: string; // date-time
        }
        /**
         * API_Entities_BulkImports model
         */
        export interface APIEntitiesBulkImports {
            /**
             * example:
             * 1
             */
            id?: number; // int32
            /**
             * example:
             * 1
             */
            bulk_import_id?: number; // int32
            /**
             * example:
             * created
             */
            status?: "created" | "started" | "finished" | "timeout" | "failed";
            entity_type?: "group" | "project";
            /**
             * example:
             * source_group
             */
            source_full_path?: string;
            /**
             * example:
             * some_group/source_project
             */
            destination_full_path?: string;
            /**
             * example:
             * destination_slug
             */
            destination_name?: string;
            /**
             * example:
             * destination_slug
             */
            destination_slug?: string;
            /**
             * example:
             * destination_path
             */
            destination_namespace?: string;
            /**
             * example:
             * 1
             */
            parent_id?: number; // int32
            /**
             * example:
             * 1
             */
            namespace_id?: number; // int32
            /**
             * example:
             * 1
             */
            project_id?: number; // int32
            /**
             * example:
             * 2012-05-28T11:42:42.000Z
             */
            created_at?: string; // date-time
            /**
             * example:
             * 2012-05-28T11:42:42.000Z
             */
            updated_at?: string; // date-time
            failures?: APIEntitiesBulkImportsEntityFailure[];
            /**
             * example:
             * true
             */
            migrate_projects?: boolean;
        }
        export interface APIEntitiesBulkImportsEntityFailure {
            /**
             * example:
             * group
             */
            relation?: string;
            /**
             * example:
             * extractor
             */
            step?: string;
            /**
             * example:
             * error message
             */
            exception_message?: string;
            /**
             * example:
             * Exception
             */
            exception_class?: string;
            /**
             * example:
             * dfcf583058ed4508e4c7c617bd7f0edd
             */
            correlation_id_value?: string;
            /**
             * example:
             * 2012-05-28T11:42:42.000Z
             */
            created_at?: string; // date-time
            /**
             * example:
             * BulkImports::Groups::Pipelines::GroupPipeline
             */
            pipeline_class?: string;
            /**
             * example:
             * extractor
             */
            pipeline_step?: string;
        }
        /**
         * API_Entities_Ci_Variable model
         */
        export interface APIEntitiesCiVariable {
            /**
             * example:
             * env_var
             */
            variable_type?: string;
            /**
             * example:
             * TEST_VARIABLE_1
             */
            key?: string;
            /**
             * example:
             * TEST_1
             */
            value?: string;
            protected?: boolean;
            masked?: boolean;
            raw?: boolean;
            /**
             * example:
             * *
             */
            environment_scope?: string;
        }
        /**
         * API_Entities_Cluster model
         */
        export interface APIEntitiesCluster {
            id?: string;
            name?: string;
            created_at?: string;
            domain?: string;
            enabled?: string;
            managed?: string;
            provider_type?: string;
            platform_type?: string;
            environment_scope?: string;
            cluster_type?: string;
            namespace_per_environment?: string;
            user?: APIEntitiesUserBasic;
            platform_kubernetes?: APIEntitiesPlatformKubernetes;
            provider_gcp?: APIEntitiesProviderGcp;
            management_project?: APIEntitiesProjectIdentity;
        }
        export interface APIEntitiesCommit {
            /**
             * example:
             * 2695effb5807a22ff3d138d593fd856244e155e7
             */
            id?: string;
            /**
             * example:
             * 2695effb
             */
            short_id?: string;
            /**
             * example:
             * 2017-07-26T09:08:53.000Z
             */
            created_at?: string; // date-time
            parent_ids?: string[];
            /**
             * example:
             * Initial commit
             */
            title?: string;
            /**
             * example:
             * Initial commit
             */
            message?: string;
            /**
             * example:
             * John Smith
             */
            author_name?: string;
            /**
             * example:
             * john@example.com
             */
            author_email?: string;
            /**
             * example:
             * 2012-05-28T11:42:42.000Z
             */
            authored_date?: string; // date-time
            /**
             * example:
             * Jack Smith
             */
            committer_name?: string;
            /**
             * example:
             * jack@example.com
             */
            committer_email?: string;
            /**
             * example:
             * 2012-05-28T11:42:42.000Z
             */
            committed_date?: string; // date-time
            /**
             * example:
             * { "Merged-By": "Jane Doe janedoe@gitlab.com" }
             */
            trailers?: {
                [key: string]: any;
            };
            /**
             * example:
             * https://gitlab.example.com/janedoe/gitlab-foss/-/commit/ed899a2f4b50b4370feeea94676502b42383c746
             */
            web_url?: string;
        }
        export interface APIEntitiesCustomAttribute {
            /**
             * example:
             * foo
             */
            key?: string;
            /**
             * example:
             * bar
             */
            value?: string;
        }
        /**
         * API_Entities_Dictionary_Table model
         */
        export interface APIEntitiesDictionaryTable {
            /**
             * example:
             * users
             */
            table_name?: string;
            feature_categories?: string[];
        }
        /**
         * API_Entities_Job model
         */
        export interface APIEntitiesJob {
            /**
             * The ID of the job
             */
            id?: number;
            /**
             * The name of the job
             */
            name?: string;
            /**
             * The current status of the job
             */
            status?: string;
            /**
             * The stage of the job in the CI/CD pipeline
             */
            stage?: string;
            /**
             * The creation time of the job
             * example:
             * 2016-01-11T10:13:33.506Z
             */
            created_at?: string; // date-time
            /**
             * The start time of the job
             * example:
             * 2016-01-11T10:13:33.506Z
             */
            started_at?: string; // date-time
            /**
             * The finish time of the job
             * example:
             * 2016-01-11T10:13:33.506Z
             */
            finished_at?: string; // date-time
            commit?: APIEntitiesCommit;
            /**
             * Indicates if the job is archived
             */
            archived?: boolean;
            /**
             * Indicates if the job is allowed to fail
             */
            allow_failure?: boolean;
            /**
             * The time when the job was erased, if applicable
             * example:
             * 2016-01-11T10:13:33.506Z
             */
            erased_at?: string; // date-time
            /**
             * The duration of the job in seconds
             */
            duration?: number;
            /**
             * The duration the job was queued before execution, in seconds
             */
            queued_duration?: number;
            /**
             * The reference for the job
             */
            ref?: string;
            /**
             * The artifacts produced by the job
             */
            artifacts?: any[];
            /**
             * Indicates if the job is tagged
             */
            tag?: boolean;
            /**
             * The URL for accessing the job in the web interface
             */
            web_url?: string;
            project?: {
                /**
                 * Indicates if the CI/CD job token scope setting is enabled for the project
                 */
                ci_job_token_scope_enabled?: boolean;
            };
            /**
             * The user that started the job
             */
            user?: APIEntitiesUserBasic;
        }
        /**
         * API_Entities_Metadata model
         */
        export interface APIEntitiesMetadata {
            /**
             * example:
             * 15.2-pre
             */
            version?: string;
            /**
             * example:
             * c401a659d0c
             */
            revision?: string;
            kas?: {
                enabled?: boolean;
                /**
                 * example:
                 * grpc://gitlab.example.com:8150
                 */
                externalUrl?: string;
                /**
                 * example:
                 * 15.0.0
                 */
                version?: string;
            };
            enterprise?: boolean;
        }
        /**
         * API_Entities_MetricImage model
         */
        export interface APIEntitiesMetricImage {
            /**
             * example:
             * 23
             */
            id?: number; // int32
            /**
             * example:
             * 2020-11-13T00:06:18.084Z
             */
            created_at?: string; // date-time
            /**
             * example:
             * file.png
             */
            filename?: string;
            /**
             * example:
             * /uploads/-/system/alert_metric_image/file/23/file.png
             */
            file_path?: string;
            /**
             * example:
             * https://example.com/metric
             */
            url?: string;
            /**
             * example:
             * An example metric
             */
            url_text?: string;
        }
        /**
         * API_Entities_PlanLimit model
         */
        export interface APIEntitiesPlanLimit {
            /**
             * example:
             * 0
             */
            ci_pipeline_size?: number; // int32
            /**
             * example:
             * 0
             */
            ci_active_jobs?: number; // int32
            /**
             * example:
             * 2
             */
            ci_project_subscriptions?: number; // int32
            /**
             * example:
             * 10
             */
            ci_pipeline_schedules?: number; // int32
            /**
             * example:
             * 50
             */
            ci_needs_size_limit?: number; // int32
            /**
             * example:
             * 1000
             */
            ci_registered_group_runners?: number; // int32
            /**
             * example:
             * 1000
             */
            ci_registered_project_runners?: number; // int32
            /**
             * example:
             * 3221225472
             */
            conan_max_file_size?: number; // int32
            /**
             * example:
             * 15000
             */
            enforcement_limit?: number; // int32
            /**
             * example:
             * 5368709120
             */
            generic_packages_max_file_size?: number; // int32
            /**
             * example:
             * 5242880
             */
            helm_max_file_size?: number; // int32
            /**
             * example:
             * {"enforcement_limit"=>[{"timestamp"=>1686909124, "user_id"=>1, "username"=>"x", "value"=>5}],
             *                    "notification_limit"=>[{"timestamp"=>1686909124, "user_id"=>2, "username"=>"y", "value"=>7}]}
             */
            limits_history?: {
                [key: string]: any;
            };
            /**
             * example:
             * 3221225472
             */
            maven_max_file_size?: number; // int32
            /**
             * example:
             * 15000
             */
            notification_limit?: number; // int32
            /**
             * example:
             * 524288000
             */
            npm_max_file_size?: number; // int32
            /**
             * example:
             * 524288000
             */
            nuget_max_file_size?: number; // int32
            /**
             * example:
             * 1000
             */
            pipeline_hierarchy_size?: number; // int32
            /**
             * example:
             * 3221225472
             */
            pypi_max_file_size?: number; // int32
            /**
             * example:
             * 1073741824
             */
            terraform_module_max_file_size?: number; // int32
            /**
             * example:
             * 15000
             */
            storage_size_limit?: number; // int32
        }
        export interface APIEntitiesPlatformKubernetes {
            api_url?: string;
            namespace?: string;
            authorization_type?: string;
            ca_cert?: string;
        }
        export interface APIEntitiesProjectIdentity {
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
        }
        export interface APIEntitiesProviderGcp {
            cluster_id?: string;
            status_name?: string;
            gcp_project_id?: string;
            zone?: string;
            machine_type?: string;
            num_nodes?: string;
            endpoint?: string;
        }
        export interface APIEntitiesUserBasic {
            /**
             * example:
             * 1
             */
            id?: number; // int32
            /**
             * example:
             * admin
             */
            username?: string;
            /**
             * example:
             * Administrator
             */
            name?: string;
            /**
             * example:
             * active
             */
            state?: string;
            /**
             * example:
             * https://gravatar.com/avatar/1
             */
            avatar_url?: string;
            /**
             * example:
             * /user/avatar/28/The-Big-Lebowski-400-400.png
             */
            avatar_path?: string;
            custom_attributes?: APIEntitiesCustomAttribute[];
            /**
             * example:
             * https://gitlab.example.com/root
             */
            web_url?: string;
            email?: string;
        }
    }
}
declare namespace Paths {
    namespace DeleteApiV4AdminCiVariablesKey {
        namespace Parameters {
            export type Key = string;
        }
        export interface PathParameters {
            key: Parameters.Key;
        }
        namespace Responses {
            export type $204 = /* API_Entities_Ci_Variable model */ Components.Schemas.APIEntitiesCiVariable;
        }
    }
    namespace DeleteApiV4AdminClustersClusterId {
        namespace Parameters {
            export type ClusterId = number; // int32
        }
        export interface PathParameters {
            cluster_id: Parameters.ClusterId /* int32 */;
        }
        namespace Responses {
            export type $204 = /* API_Entities_Cluster model */ Components.Schemas.APIEntitiesCluster;
        }
    }
    namespace DeleteApiV4ApplicationsId {
        namespace Parameters {
            export type Id = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id /* int32 */;
        }
    }
    namespace DeleteApiV4BroadcastMessagesId {
        namespace Parameters {
            export type Id = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id /* int32 */;
        }
        namespace Responses {
            export type $200 = /* API_Entities_BroadcastMessage model */ Components.Schemas.APIEntitiesBroadcastMessage;
        }
    }
    namespace DeleteApiV4GroupsIdAccessRequestsUserId {
        namespace Parameters {
            export type Id = string;
            export type UserId = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id;
            user_id: Parameters.UserId /* int32 */;
        }
    }
    namespace DeleteApiV4GroupsIdBadgesBadgeId {
        namespace Parameters {
            export type BadgeId = number; // int32
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            badge_id: Parameters.BadgeId /* int32 */;
        }
    }
    namespace DeleteApiV4ProjectsIdAccessRequestsUserId {
        namespace Parameters {
            export type Id = string;
            export type UserId = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id;
            user_id: Parameters.UserId /* int32 */;
        }
    }
    namespace DeleteApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId {
        namespace Parameters {
            export type AlertIid = number; // int32
            export type Id = string;
            export type MetricImageId = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id;
            alert_iid: Parameters.AlertIid /* int32 */;
            metric_image_id: Parameters.MetricImageId /* int32 */;
        }
        namespace Responses {
            export type $204 = /* API_Entities_MetricImage model */ Components.Schemas.APIEntitiesMetricImage;
        }
    }
    namespace DeleteApiV4ProjectsIdBadgesBadgeId {
        namespace Parameters {
            export type BadgeId = number; // int32
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            badge_id: Parameters.BadgeId /* int32 */;
        }
    }
    namespace DeleteApiV4ProjectsIdRepositoryBranchesBranch {
        namespace Parameters {
            export type Branch = string;
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            branch: Parameters.Branch;
        }
    }
    namespace DeleteApiV4ProjectsIdRepositoryMergedBranches {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
    }
    namespace GetApiV4AdminBatchedBackgroundMigrations {
        namespace Parameters {
            export type Database = "main" | "ci" | "embedding" | "main_clusterwide" | "geo";
        }
        export interface QueryParameters {
            database?: Parameters.Database;
        }
        namespace Responses {
            export type $200 = /* API_Entities_BatchedBackgroundMigration model */ Components.Schemas.APIEntitiesBatchedBackgroundMigration[];
        }
    }
    namespace GetApiV4AdminBatchedBackgroundMigrationsId {
        namespace Parameters {
            export type Database = "main" | "ci" | "embedding" | "main_clusterwide" | "geo";
            export type Id = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id /* int32 */;
        }
        export interface QueryParameters {
            database?: Parameters.Database;
        }
        namespace Responses {
            export type $200 = /* API_Entities_BatchedBackgroundMigration model */ Components.Schemas.APIEntitiesBatchedBackgroundMigration;
        }
    }
    namespace GetApiV4AdminCiVariables {
        namespace Parameters {
            export type Page = number; // int32
            export type PerPage = number; // int32
        }
        export interface QueryParameters {
            page?: Parameters.Page /* int32 */;
            per_page?: Parameters.PerPage /* int32 */;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Ci_Variable model */ Components.Schemas.APIEntitiesCiVariable;
        }
    }
    namespace GetApiV4AdminCiVariablesKey {
        namespace Parameters {
            export type Key = string;
        }
        export interface PathParameters {
            key: Parameters.Key;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Ci_Variable model */ Components.Schemas.APIEntitiesCiVariable;
        }
    }
    namespace GetApiV4AdminClusters {
        namespace Responses {
            export type $200 = /* API_Entities_Cluster model */ Components.Schemas.APIEntitiesCluster[];
        }
    }
    namespace GetApiV4AdminClustersClusterId {
        namespace Parameters {
            export type ClusterId = number; // int32
        }
        export interface PathParameters {
            cluster_id: Parameters.ClusterId /* int32 */;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Cluster model */ Components.Schemas.APIEntitiesCluster;
        }
    }
    namespace GetApiV4AdminDatabasesDatabaseNameDictionaryTablesTableName {
        namespace Parameters {
            export type DatabaseName = "main" | "ci";
            export type TableName = string;
        }
        export interface PathParameters {
            database_name: Parameters.DatabaseName;
            table_name: Parameters.TableName;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Dictionary_Table model */ Components.Schemas.APIEntitiesDictionaryTable;
        }
    }
    namespace GetApiV4ApplicationAppearance {
        namespace Responses {
            export type $200 = /* API_Entities_Appearance model */ Components.Schemas.APIEntitiesAppearance;
        }
    }
    namespace GetApiV4ApplicationPlanLimits {
        namespace Parameters {
            export type PlanName = "default" | "free" | "bronze" | "silver" | "premium" | "gold" | "ultimate" | "ultimate_trial" | "premium_trial" | "opensource";
        }
        export interface QueryParameters {
            plan_name?: Parameters.PlanName;
        }
        namespace Responses {
            export type $200 = /* API_Entities_PlanLimit model */ Components.Schemas.APIEntitiesPlanLimit;
        }
    }
    namespace GetApiV4Applications {
        namespace Responses {
            export type $200 = /* API_Entities_Application model */ Components.Schemas.APIEntitiesApplication[];
        }
    }
    namespace GetApiV4Avatar {
        namespace Parameters {
            export type Email = string;
            export type Size = number; // int32
        }
        export interface QueryParameters {
            email: Parameters.Email;
            size?: Parameters.Size /* int32 */;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Avatar model */ Components.Schemas.APIEntitiesAvatar;
        }
    }
    namespace GetApiV4BroadcastMessages {
        namespace Parameters {
            export type Page = number; // int32
            export type PerPage = number; // int32
        }
        export interface QueryParameters {
            page?: Parameters.Page /* int32 */;
            per_page?: Parameters.PerPage /* int32 */;
        }
        namespace Responses {
            export type $200 = /* API_Entities_BroadcastMessage model */ Components.Schemas.APIEntitiesBroadcastMessage;
        }
    }
    namespace GetApiV4BroadcastMessagesId {
        namespace Parameters {
            export type Id = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id /* int32 */;
        }
        namespace Responses {
            export type $200 = /* API_Entities_BroadcastMessage model */ Components.Schemas.APIEntitiesBroadcastMessage;
        }
    }
    namespace GetApiV4BulkImports {
        namespace Parameters {
            export type Page = number; // int32
            export type PerPage = number; // int32
            export type Sort = "asc" | "desc";
            export type Status = "created" | "started" | "finished" | "timeout" | "failed";
        }
        export interface QueryParameters {
            page?: Parameters.Page /* int32 */;
            per_page?: Parameters.PerPage /* int32 */;
            sort?: Parameters.Sort;
            status?: Parameters.Status;
        }
        namespace Responses {
            export type $200 = /* API_Entities_BulkImport model */ Components.Schemas.APIEntitiesBulkImport[];
        }
    }
    namespace GetApiV4BulkImportsEntities {
        namespace Parameters {
            export type Page = number; // int32
            export type PerPage = number; // int32
            export type Sort = "asc" | "desc";
            export type Status = "created" | "started" | "finished" | "timeout" | "failed";
        }
        export interface QueryParameters {
            page?: Parameters.Page /* int32 */;
            per_page?: Parameters.PerPage /* int32 */;
            sort?: Parameters.Sort;
            status?: Parameters.Status;
        }
        namespace Responses {
            export type $200 = /* API_Entities_BulkImports model */ Components.Schemas.APIEntitiesBulkImports[];
        }
    }
    namespace GetApiV4BulkImportsImportId {
        namespace Parameters {
            export type ImportId = number; // int32
        }
        export interface PathParameters {
            import_id: Parameters.ImportId /* int32 */;
        }
        namespace Responses {
            export type $200 = /* API_Entities_BulkImport model */ Components.Schemas.APIEntitiesBulkImport;
        }
    }
    namespace GetApiV4BulkImportsImportIdEntities {
        namespace Parameters {
            export type ImportId = number; // int32
            export type Page = number; // int32
            export type PerPage = number; // int32
            export type Status = "created" | "started" | "finished" | "timeout" | "failed";
        }
        export interface PathParameters {
            import_id: Parameters.ImportId /* int32 */;
        }
        export interface QueryParameters {
            status?: Parameters.Status;
            page?: Parameters.Page /* int32 */;
            per_page?: Parameters.PerPage /* int32 */;
        }
        namespace Responses {
            export type $200 = /* API_Entities_BulkImports model */ Components.Schemas.APIEntitiesBulkImports[];
        }
    }
    namespace GetApiV4BulkImportsImportIdEntitiesEntityId {
        namespace Parameters {
            export type EntityId = number; // int32
            export type ImportId = number; // int32
        }
        export interface PathParameters {
            import_id: Parameters.ImportId /* int32 */;
            entity_id: Parameters.EntityId /* int32 */;
        }
        namespace Responses {
            export type $200 = /* API_Entities_BulkImports model */ Components.Schemas.APIEntitiesBulkImports;
        }
    }
    namespace GetApiV4GroupsIdAccessRequests {
        namespace Parameters {
            export type Id = string;
            export type Page = number; // int32
            export type PerPage = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            page?: Parameters.Page /* int32 */;
            per_page?: Parameters.PerPage /* int32 */;
        }
        namespace Responses {
            export type $200 = /* API_Entities_AccessRequester model */ Components.Schemas.APIEntitiesAccessRequester;
        }
    }
    namespace GetApiV4GroupsIdBadges {
        namespace Parameters {
            export type Id = string;
            export type Name = string;
            export type Page = number; // int32
            export type PerPage = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            page?: Parameters.Page /* int32 */;
            per_page?: Parameters.PerPage /* int32 */;
            name?: Parameters.Name;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Badge model */ Components.Schemas.APIEntitiesBadge[];
        }
    }
    namespace GetApiV4GroupsIdBadgesBadgeId {
        namespace Parameters {
            export type BadgeId = number; // int32
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            badge_id: Parameters.BadgeId /* int32 */;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Badge model */ Components.Schemas.APIEntitiesBadge;
        }
    }
    namespace GetApiV4GroupsIdBadgesRender {
        namespace Parameters {
            export type Id = string;
            export type ImageUrl = string;
            export type LinkUrl = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            link_url: Parameters.LinkUrl;
            image_url: Parameters.ImageUrl;
        }
        namespace Responses {
            export type $200 = /* API_Entities_BasicBadgeDetails model */ Components.Schemas.APIEntitiesBasicBadgeDetails;
        }
    }
    namespace GetApiV4Metadata {
        namespace Responses {
            export type $200 = /* API_Entities_Metadata model */ Components.Schemas.APIEntitiesMetadata;
        }
    }
    namespace GetApiV4ProjectsIdAccessRequests {
        namespace Parameters {
            export type Id = string;
            export type Page = number; // int32
            export type PerPage = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            page?: Parameters.Page /* int32 */;
            per_page?: Parameters.PerPage /* int32 */;
        }
        namespace Responses {
            export type $200 = /* API_Entities_AccessRequester model */ Components.Schemas.APIEntitiesAccessRequester;
        }
    }
    namespace GetApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages {
        namespace Parameters {
            export type AlertIid = number; // int32
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            alert_iid: Parameters.AlertIid /* int32 */;
        }
        namespace Responses {
            export type $200 = /* API_Entities_MetricImage model */ Components.Schemas.APIEntitiesMetricImage[];
        }
    }
    namespace GetApiV4ProjectsIdBadges {
        namespace Parameters {
            export type Id = string;
            export type Name = string;
            export type Page = number; // int32
            export type PerPage = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            page?: Parameters.Page /* int32 */;
            per_page?: Parameters.PerPage /* int32 */;
            name?: Parameters.Name;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Badge model */ Components.Schemas.APIEntitiesBadge[];
        }
    }
    namespace GetApiV4ProjectsIdBadgesBadgeId {
        namespace Parameters {
            export type BadgeId = number; // int32
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            badge_id: Parameters.BadgeId /* int32 */;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Badge model */ Components.Schemas.APIEntitiesBadge;
        }
    }
    namespace GetApiV4ProjectsIdBadgesRender {
        namespace Parameters {
            export type Id = string;
            export type ImageUrl = string;
            export type LinkUrl = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            link_url: Parameters.LinkUrl;
            image_url: Parameters.ImageUrl;
        }
        namespace Responses {
            export type $200 = /* API_Entities_BasicBadgeDetails model */ Components.Schemas.APIEntitiesBasicBadgeDetails;
        }
    }
    namespace GetApiV4ProjectsIdRepositoryBranches {
        namespace Parameters {
            export type Id = string;
            export type Page = number; // int32
            export type PageToken = string;
            export type PerPage = number; // int32
            export type Regex = string;
            export type Search = string;
            export type Sort = "name_asc" | "updated_asc" | "updated_desc";
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            page?: Parameters.Page /* int32 */;
            per_page?: Parameters.PerPage /* int32 */;
            search?: Parameters.Search;
            regex?: Parameters.Regex;
            sort?: Parameters.Sort;
            page_token?: Parameters.PageToken;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Branch model */ Components.Schemas.APIEntitiesBranch[];
        }
    }
    namespace GetApiV4ProjectsIdRepositoryBranchesBranch {
        namespace Parameters {
            export type Branch = number; // int32
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            branch: Parameters.Branch /* int32 */;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Branch model */ Components.Schemas.APIEntitiesBranch;
        }
    }
    namespace GetApiV4Version {
        namespace Responses {
            export type $200 = /* API_Entities_Metadata model */ Components.Schemas.APIEntitiesMetadata;
        }
    }
    namespace GetSingleJob {
        namespace Parameters {
            export type Id = number;
            export type JobId = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
            job_id: Parameters.JobId;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Job model */ Components.Schemas.APIEntitiesJob;
        }
    }
    namespace HeadApiV4ProjectsIdRepositoryBranchesBranch {
        namespace Parameters {
            export type Branch = string;
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            branch: Parameters.Branch;
        }
    }
    namespace ListProjectJobs {
        namespace Parameters {
            export type Id = number;
            export type Scope = string[];
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            scope?: Parameters.Scope;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Job model */ Components.Schemas.APIEntitiesJob[];
        }
    }
    namespace PostApiV4AdminCiVariables {
        export interface RequestBody {
            /**
             * The key of the variable. Max 255 characters
             */
            key: string;
            /**
             * The value of a variable
             */
            value: string;
            /**
             * Whether the variable is protected
             */
            protected?: boolean;
            /**
             * Whether the variable is masked
             */
            masked?: boolean;
            /**
             * Whether the variable will be expanded
             */
            raw?: boolean;
            /**
             * The type of a variable. Available types are: env_var (default) and file
             */
            variable_type?: "env_var" | "file";
        }
        namespace Responses {
            export type $201 = /* API_Entities_Ci_Variable model */ Components.Schemas.APIEntitiesCiVariable;
        }
    }
    namespace PostApiV4AdminClustersAdd {
        export interface RequestBody {
            /**
             * Cluster name
             */
            name: string;
            /**
             * Determines if cluster is active or not, defaults to true
             */
            enabled?: boolean;
            /**
             * The associated environment to the cluster
             */
            environment_scope?: string;
            /**
             * Deploy each environment to a separate Kubernetes namespace
             */
            namespace_per_environment?: boolean;
            /**
             * Cluster base domain
             */
            domain?: string;
            /**
             * The ID of the management project
             */
            management_project_id?: number; // int32
            /**
             * Determines if GitLab will manage namespaces and service accounts for this cluster, defaults to true
             */
            managed?: boolean;
            /**
             * URL to access the Kubernetes API
             */
            "platform_kubernetes_attributes[api_url]": string;
            /**
             * Token to authenticate against Kubernetes
             */
            "platform_kubernetes_attributes[token]": string;
            /**
             * TLS certificate (needed if API is using a self-signed TLS certificate)
             */
            "platform_kubernetes_attributes[ca_cert]"?: string;
            /**
             * Unique namespace related to Project
             */
            "platform_kubernetes_attributes[namespace]"?: string;
            /**
             * Cluster authorization type, defaults to RBAC
             */
            "platform_kubernetes_attributes[authorization_type]"?: "unknown_authorization" | "rbac" | "abac";
        }
        namespace Responses {
            export type $201 = /* API_Entities_Cluster model */ Components.Schemas.APIEntitiesCluster;
        }
    }
    namespace PostApiV4AdminMigrationsTimestampMark {
        namespace Parameters {
            export type Timestamp = number; // int32
        }
        export interface PathParameters {
            timestamp: Parameters.Timestamp /* int32 */;
        }
        export interface RequestBody {
            /**
             * The name of the database
             */
            database?: "main" | "ci" | "embedding" | "main_clusterwide" | "geo";
        }
    }
    namespace PostApiV4Applications {
        export interface RequestBody {
            /**
             * Name of the application.
             */
            name: string;
            /**
             * Redirect URI of the application.
             */
            redirect_uri: string;
            /**
             * Scopes of the application. You can specify multiple scopes by separating\
             *                                  each scope using a space
             */
            scopes: string;
            /**
             * The application is used where the client secret can be kept confidential. Native mobile apps \
             *                         and Single Page Apps are considered non-confidential. Defaults to true if not supplied
             */
            confidential?: boolean;
        }
        namespace Responses {
            export type $200 = /* API_Entities_ApplicationWithSecret model */ Components.Schemas.APIEntitiesApplicationWithSecret;
        }
    }
    namespace PostApiV4BroadcastMessages {
        export interface RequestBody {
            /**
             * Message to display
             */
            message: string;
            /**
             * Starting time
             */
            starts_at?: string; // date-time
            /**
             * Ending time
             */
            ends_at?: string; // date-time
            /**
             * Background color
             */
            color?: string;
            /**
             * Foreground color
             */
            font?: string;
            /**
             * Target user roles
             */
            target_access_levels?: (10 | 20 | 30 | 40 | 50) /* int32 */[];
            /**
             * Target path
             */
            target_path?: string;
            /**
             * Broadcast type. Defaults to banner
             */
            broadcast_type?: "banner" | "notification";
            /**
             * Is dismissable
             */
            dismissable?: boolean;
        }
        namespace Responses {
            export type $201 = /* API_Entities_BroadcastMessage model */ Components.Schemas.APIEntitiesBroadcastMessage;
        }
    }
    namespace PostApiV4BulkImports {
        export interface RequestBody {
            /**
             * Source GitLab instance URL
             */
            "configuration[url]": string;
            /**
             * Access token to the source GitLab instance
             */
            "configuration[access_token]": string;
            /**
             * Source entity type
             */
            "entities[source_type]": ("group_entity" | "project_entity")[];
            /**
             * Relative path of the source entity to import
             */
            "entities[source_full_path]": string[];
            /**
             * Destination namespace for the entity
             */
            "entities[destination_namespace]": string[];
            /**
             * Destination slug for the entity
             */
            "entities[destination_slug]"?: string[];
            /**
             * Deprecated: Use :destination_slug instead. Destination slug for the entity
             */
            "entities[destination_name]"?: string[];
            /**
             * Indicates group migration should include nested projects
             */
            "entities[migrate_projects]"?: boolean[];
        }
        namespace Responses {
            export type $200 = /* API_Entities_BulkImport model */ Components.Schemas.APIEntitiesBulkImport;
        }
    }
    namespace PostApiV4GroupsIdAccessRequests {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = /* API_Entities_AccessRequester model */ Components.Schemas.APIEntitiesAccessRequester;
        }
    }
    namespace PostApiV4GroupsIdBadges {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            /**
             * URL of the badge link
             */
            link_url: string;
            /**
             * URL of the badge image
             */
            image_url: string;
            /**
             * Name for the badge
             */
            name?: string;
        }
        namespace Responses {
            export type $201 = /* API_Entities_Badge model */ Components.Schemas.APIEntitiesBadge;
        }
    }
    namespace PostApiV4ProjectsIdAccessRequests {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = /* API_Entities_AccessRequester model */ Components.Schemas.APIEntitiesAccessRequester;
        }
    }
    namespace PostApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages {
        namespace Parameters {
            export type AlertIid = number; // int32
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            alert_iid: Parameters.AlertIid /* int32 */;
        }
        export interface RequestBody {
            /**
             * The image file to be uploaded
             */
            file: string; // binary
            /**
             * The url to view more metric info
             */
            url?: string;
            /**
             * A description of the image or URL
             */
            url_text?: string;
        }
        namespace Responses {
            export type $200 = /* API_Entities_MetricImage model */ Components.Schemas.APIEntitiesMetricImage;
        }
    }
    namespace PostApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesAuthorize {
        namespace Parameters {
            export type AlertIid = number; // int32
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            alert_iid: Parameters.AlertIid /* int32 */;
        }
    }
    namespace PostApiV4ProjectsIdBadges {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            /**
             * URL of the badge link
             */
            link_url: string;
            /**
             * URL of the badge image
             */
            image_url: string;
            /**
             * Name for the badge
             */
            name?: string;
        }
        namespace Responses {
            export type $201 = /* API_Entities_Badge model */ Components.Schemas.APIEntitiesBadge;
        }
    }
    namespace PostApiV4ProjectsIdRepositoryBranches {
        namespace Parameters {
            export type Branch = string;
            export type Id = string;
            export type Ref = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            branch: Parameters.Branch;
            ref: Parameters.Ref;
        }
        namespace Responses {
            export type $201 = /* API_Entities_Branch model */ Components.Schemas.APIEntitiesBranch;
        }
    }
    namespace PutApiV4AdminBatchedBackgroundMigrationsIdPause {
        namespace Parameters {
            export type Id = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id /* int32 */;
        }
        export interface RequestBody {
            /**
             * The name of the database
             */
            database?: "main" | "ci" | "embedding" | "main_clusterwide" | "geo";
        }
        namespace Responses {
            export type $200 = /* API_Entities_BatchedBackgroundMigration model */ Components.Schemas.APIEntitiesBatchedBackgroundMigration;
        }
    }
    namespace PutApiV4AdminBatchedBackgroundMigrationsIdResume {
        namespace Parameters {
            export type Id = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id /* int32 */;
        }
        export interface RequestBody {
            /**
             * The name of the database
             */
            database?: "main" | "ci" | "embedding" | "main_clusterwide" | "geo";
        }
        namespace Responses {
            export type $200 = /* API_Entities_BatchedBackgroundMigration model */ Components.Schemas.APIEntitiesBatchedBackgroundMigration;
        }
    }
    namespace PutApiV4AdminCiVariablesKey {
        namespace Parameters {
            export type Key = string;
        }
        export interface PathParameters {
            key: Parameters.Key;
        }
        export interface RequestBody {
            /**
             * The value of a variable
             */
            value?: string;
            /**
             * Whether the variable is protected
             */
            protected?: boolean;
            /**
             * Whether the variable is masked
             */
            masked?: boolean;
            /**
             * Whether the variable will be expanded
             */
            raw?: boolean;
            /**
             * The type of a variable. Available types are: env_var (default) and file
             */
            variable_type?: "env_var" | "file";
        }
        namespace Responses {
            export type $200 = /* API_Entities_Ci_Variable model */ Components.Schemas.APIEntitiesCiVariable;
        }
    }
    namespace PutApiV4AdminClustersClusterId {
        namespace Parameters {
            export type ClusterId = number; // int32
        }
        export interface PathParameters {
            cluster_id: Parameters.ClusterId /* int32 */;
        }
        export interface RequestBody {
            /**
             * Cluster name
             */
            name?: string;
            /**
             * Enable or disable Gitlab's connection to your Kubernetes cluster
             */
            enabled?: boolean;
            /**
             * The associated environment to the cluster
             */
            environment_scope?: string;
            /**
             * Deploy each environment to a separate Kubernetes namespace
             */
            namespace_per_environment?: boolean;
            /**
             * Cluster base domain
             */
            domain?: string;
            /**
             * The ID of the management project
             */
            management_project_id?: number; // int32
            /**
             * Determines if GitLab will manage namespaces and service accounts for this cluster
             */
            managed?: boolean;
            /**
             * URL to access the Kubernetes API
             */
            "platform_kubernetes_attributes[api_url]"?: string;
            /**
             * Token to authenticate against Kubernetes
             */
            "platform_kubernetes_attributes[token]"?: string;
            /**
             * TLS certificate (needed if API is using a self-signed TLS certificate)
             */
            "platform_kubernetes_attributes[ca_cert]"?: string;
            /**
             * Unique namespace related to Project
             */
            "platform_kubernetes_attributes[namespace]"?: string;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Cluster model */ Components.Schemas.APIEntitiesCluster;
        }
    }
    namespace PutApiV4ApplicationAppearance {
        export interface RequestBody {
            /**
             * Instance title on the sign in / sign up page
             */
            title?: string;
            /**
             * Markdown text shown on the sign in / sign up page
             */
            description?: string;
            /**
             * Name of the Progressive Web App
             */
            pwa_name?: string;
            /**
             * Optional, short name for Progressive Web App
             */
            pwa_short_name?: string;
            /**
             * An explanation of what the Progressive Web App does
             */
            pwa_description?: string;
            /**
             * Instance image used on the sign in / sign up page
             */
            logo?: string; // binary
            /**
             * Icon used for Progressive Web App
             */
            pwa_icon?: string; // binary
            /**
             * Instance image used for the main navigation bar
             */
            header_logo?: string; // binary
            /**
             * Instance favicon in .ico/.png format
             */
            favicon?: string; // binary
            /**
             * Markdown text shown on the new project page
             */
            new_project_guidelines?: string;
            /**
             * Markdown text shown on the profile page below Public Avatar
             */
            profile_image_guidelines?: string;
            /**
             * Message within the system header bar
             */
            header_message?: string;
            /**
             * Message within the system footer bar
             */
            footer_message?: string;
            /**
             * Background color for the system header / footer bar
             */
            message_background_color?: string;
            /**
             * Font color for the system header / footer bar
             */
            message_font_color?: string;
            /**
             * Add header and footer to all outgoing emails if enabled
             */
            email_header_and_footer_enabled?: boolean;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Appearance model */ Components.Schemas.APIEntitiesAppearance;
        }
    }
    namespace PutApiV4ApplicationPlanLimits {
        export interface RequestBody {
            /**
             * Name of the plan to update
             */
            plan_name: "default" | "free" | "bronze" | "silver" | "premium" | "gold" | "ultimate" | "ultimate_trial" | "premium_trial" | "opensource";
            /**
             * Maximum number of jobs in a single pipeline
             */
            ci_pipeline_size?: number; // int32
            /**
             * Total number of jobs in currently active pipelines
             */
            ci_active_jobs?: number; // int32
            /**
             * Maximum number of pipeline subscriptions to and from a project
             */
            ci_project_subscriptions?: number; // int32
            /**
             * Maximum number of pipeline schedules
             */
            ci_pipeline_schedules?: number; // int32
            /**
             * Maximum number of DAG dependencies that a job can have
             */
            ci_needs_size_limit?: number; // int32
            /**
             * Maximum number of runners registered per group
             */
            ci_registered_group_runners?: number; // int32
            /**
             * Maximum number of runners registered per project
             */
            ci_registered_project_runners?: number; // int32
            /**
             * Maximum Conan package file size in bytes
             */
            conan_max_file_size?: number; // int32
            /**
             * Maximum storage size for the root namespace enforcement in MiB
             */
            enforcement_limit?: number; // int32
            /**
             * Maximum generic package file size in bytes
             */
            generic_packages_max_file_size?: number; // int32
            /**
             * Maximum Helm chart file size in bytes
             */
            helm_max_file_size?: number; // int32
            /**
             * Maximum Maven package file size in bytes
             */
            maven_max_file_size?: number; // int32
            /**
             * Maximum storage size for the root namespace notifications in MiB
             */
            notification_limit?: number; // int32
            /**
             * Maximum NPM package file size in bytes
             */
            npm_max_file_size?: number; // int32
            /**
             * Maximum NuGet package file size in bytes
             */
            nuget_max_file_size?: number; // int32
            /**
             * Maximum PyPI package file size in bytes
             */
            pypi_max_file_size?: number; // int32
            /**
             * Maximum Terraform Module package file size in bytes
             */
            terraform_module_max_file_size?: number; // int32
            /**
             * Maximum storage size for the root namespace in MiB
             */
            storage_size_limit?: number; // int32
            /**
             * Maximum number of downstream pipelines in a pipeline's hierarchy tree
             */
            pipeline_hierarchy_size?: number; // int32
        }
        namespace Responses {
            export type $200 = /* API_Entities_PlanLimit model */ Components.Schemas.APIEntitiesPlanLimit;
        }
    }
    namespace PutApiV4BroadcastMessagesId {
        namespace Parameters {
            export type Id = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id /* int32 */;
        }
        export interface RequestBody {
            /**
             * Message to display
             */
            message?: string;
            /**
             * Starting time
             */
            starts_at?: string; // date-time
            /**
             * Ending time
             */
            ends_at?: string; // date-time
            /**
             * Background color
             */
            color?: string;
            /**
             * Foreground color
             */
            font?: string;
            /**
             * Target user roles
             */
            target_access_levels?: (10 | 20 | 30 | 40 | 50) /* int32 */[];
            /**
             * Target path
             */
            target_path?: string;
            /**
             * Broadcast Type
             */
            broadcast_type?: "banner" | "notification";
            /**
             * Is dismissable
             */
            dismissable?: boolean;
        }
        namespace Responses {
            export type $200 = /* API_Entities_BroadcastMessage model */ Components.Schemas.APIEntitiesBroadcastMessage;
        }
    }
    namespace PutApiV4GroupsIdAccessRequestsUserIdApprove {
        namespace Parameters {
            export type Id = string;
            export type UserId = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id;
            user_id: Parameters.UserId /* int32 */;
        }
        export interface RequestBody {
            /**
             * A valid access level (defaults: `30`, the Developer role)
             */
            access_level?: number; // int32
        }
        namespace Responses {
            export type $200 = /* API_Entities_AccessRequester model */ Components.Schemas.APIEntitiesAccessRequester;
        }
    }
    namespace PutApiV4GroupsIdBadgesBadgeId {
        namespace Parameters {
            export type BadgeId = number; // int32
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            badge_id: Parameters.BadgeId /* int32 */;
        }
        export interface RequestBody {
            /**
             * URL of the badge link
             */
            link_url?: string;
            /**
             * URL of the badge image
             */
            image_url?: string;
            /**
             * Name for the badge
             */
            name?: string;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Badge model */ Components.Schemas.APIEntitiesBadge;
        }
    }
    namespace PutApiV4ProjectsIdAccessRequestsUserIdApprove {
        namespace Parameters {
            export type Id = string;
            export type UserId = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id;
            user_id: Parameters.UserId /* int32 */;
        }
        export interface RequestBody {
            /**
             * A valid access level (defaults: `30`, the Developer role)
             */
            access_level?: number; // int32
        }
        namespace Responses {
            export type $200 = /* API_Entities_AccessRequester model */ Components.Schemas.APIEntitiesAccessRequester;
        }
    }
    namespace PutApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId {
        namespace Parameters {
            export type AlertIid = number; // int32
            export type Id = string;
            export type MetricImageId = number; // int32
        }
        export interface PathParameters {
            id: Parameters.Id;
            alert_iid: Parameters.AlertIid /* int32 */;
            metric_image_id: Parameters.MetricImageId /* int32 */;
        }
        export interface RequestBody {
            /**
             * The url to view more metric info
             */
            url?: string;
            /**
             * A description of the image or URL
             */
            url_text?: string;
        }
        namespace Responses {
            export type $200 = /* API_Entities_MetricImage model */ Components.Schemas.APIEntitiesMetricImage;
        }
    }
    namespace PutApiV4ProjectsIdBadgesBadgeId {
        namespace Parameters {
            export type BadgeId = number; // int32
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            badge_id: Parameters.BadgeId /* int32 */;
        }
        export interface RequestBody {
            /**
             * URL of the badge link
             */
            link_url?: string;
            /**
             * URL of the badge image
             */
            image_url?: string;
            /**
             * Name for the badge
             */
            name?: string;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Badge model */ Components.Schemas.APIEntitiesBadge;
        }
    }
    namespace PutApiV4ProjectsIdRepositoryBranchesBranchProtect {
        namespace Parameters {
            export type Branch = string;
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            branch: Parameters.Branch;
        }
        export interface RequestBody {
            /**
             * Flag if developers can push to that branch
             */
            developers_can_push?: boolean;
            /**
             * Flag if developers can merge to that branch
             */
            developers_can_merge?: boolean;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Branch model */ Components.Schemas.APIEntitiesBranch;
        }
    }
    namespace PutApiV4ProjectsIdRepositoryBranchesBranchUnprotect {
        namespace Parameters {
            export type Branch = string;
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
            branch: Parameters.Branch;
        }
        namespace Responses {
            export type $200 = /* API_Entities_Branch model */ Components.Schemas.APIEntitiesBranch;
        }
    }
    namespace TriggerManualJob {
        namespace Parameters {
            export type Id = number;
            export type JobId = number;
            export type JobVariablesAttributes = string[];
        }
        export interface PathParameters {
            id: Parameters.Id;
            job_id: Parameters.JobId;
        }
        export interface QueryParameters {
            job_variables_attributes?: Parameters.JobVariablesAttributes;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
}

export interface OperationMethods {
  /**
   * getApiV4GroupsIdBadgesBadgeId - Gets a badge of a group.
   * 
   * This feature was introduced in GitLab 10.6.
   */
  'getApiV4GroupsIdBadgesBadgeId'(
    parameters?: Parameters<Paths.GetApiV4GroupsIdBadgesBadgeId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4GroupsIdBadgesBadgeId.Responses.$200>
  /**
   * putApiV4GroupsIdBadgesBadgeId - Updates a badge of a group.
   * 
   * This feature was introduced in GitLab 10.6.
   */
  'putApiV4GroupsIdBadgesBadgeId'(
    parameters?: Parameters<Paths.PutApiV4GroupsIdBadgesBadgeId.PathParameters> | null,
    data?: Paths.PutApiV4GroupsIdBadgesBadgeId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutApiV4GroupsIdBadgesBadgeId.Responses.$200>
  /**
   * deleteApiV4GroupsIdBadgesBadgeId - Removes a badge from the group.
   * 
   * This feature was introduced in GitLab 10.6.
   */
  'deleteApiV4GroupsIdBadgesBadgeId'(
    parameters?: Parameters<Paths.DeleteApiV4GroupsIdBadgesBadgeId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getApiV4GroupsIdBadges - Gets a list of group badges viewable by the authenticated user.
   * 
   * This feature was introduced in GitLab 10.6.
   */
  'getApiV4GroupsIdBadges'(
    parameters?: Parameters<Paths.GetApiV4GroupsIdBadges.QueryParameters & Paths.GetApiV4GroupsIdBadges.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4GroupsIdBadges.Responses.$200>
  /**
   * postApiV4GroupsIdBadges - Adds a badge to a group.
   * 
   * This feature was introduced in GitLab 10.6.
   */
  'postApiV4GroupsIdBadges'(
    parameters?: Parameters<Paths.PostApiV4GroupsIdBadges.PathParameters> | null,
    data?: Paths.PostApiV4GroupsIdBadges.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV4GroupsIdBadges.Responses.$201>
  /**
   * getApiV4GroupsIdBadgesRender - Preview a badge from a group.
   * 
   * This feature was introduced in GitLab 10.6.
   */
  'getApiV4GroupsIdBadgesRender'(
    parameters?: Parameters<Paths.GetApiV4GroupsIdBadgesRender.QueryParameters & Paths.GetApiV4GroupsIdBadgesRender.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4GroupsIdBadgesRender.Responses.$200>
  /**
   * deleteApiV4GroupsIdAccessRequestsUserId - Denies an access request for the given user.
   * 
   * This feature was introduced in GitLab 8.11.
   */
  'deleteApiV4GroupsIdAccessRequestsUserId'(
    parameters?: Parameters<Paths.DeleteApiV4GroupsIdAccessRequestsUserId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * putApiV4GroupsIdAccessRequestsUserIdApprove - Approves an access request for the given user.
   * 
   * This feature was introduced in GitLab 8.11.
   */
  'putApiV4GroupsIdAccessRequestsUserIdApprove'(
    parameters?: Parameters<Paths.PutApiV4GroupsIdAccessRequestsUserIdApprove.PathParameters> | null,
    data?: Paths.PutApiV4GroupsIdAccessRequestsUserIdApprove.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutApiV4GroupsIdAccessRequestsUserIdApprove.Responses.$200>
  /**
   * getApiV4GroupsIdAccessRequests - Gets a list of access requests for a group.
   * 
   * This feature was introduced in GitLab 8.11.
   */
  'getApiV4GroupsIdAccessRequests'(
    parameters?: Parameters<Paths.GetApiV4GroupsIdAccessRequests.QueryParameters & Paths.GetApiV4GroupsIdAccessRequests.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4GroupsIdAccessRequests.Responses.$200>
  /**
   * postApiV4GroupsIdAccessRequests - Requests access for the authenticated user to a group.
   * 
   * This feature was introduced in GitLab 8.11.
   */
  'postApiV4GroupsIdAccessRequests'(
    parameters?: Parameters<Paths.PostApiV4GroupsIdAccessRequests.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV4GroupsIdAccessRequests.Responses.$200>
  /**
   * deleteApiV4ProjectsIdRepositoryMergedBranches - Delete all merged branches
   */
  'deleteApiV4ProjectsIdRepositoryMergedBranches'(
    parameters?: Parameters<Paths.DeleteApiV4ProjectsIdRepositoryMergedBranches.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getApiV4ProjectsIdRepositoryBranchesBranch - Get a single repository branch
   */
  'getApiV4ProjectsIdRepositoryBranchesBranch'(
    parameters?: Parameters<Paths.GetApiV4ProjectsIdRepositoryBranchesBranch.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4ProjectsIdRepositoryBranchesBranch.Responses.$200>
  /**
   * deleteApiV4ProjectsIdRepositoryBranchesBranch - Delete a branch
   */
  'deleteApiV4ProjectsIdRepositoryBranchesBranch'(
    parameters?: Parameters<Paths.DeleteApiV4ProjectsIdRepositoryBranchesBranch.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * headApiV4ProjectsIdRepositoryBranchesBranch - Check if a branch exists
   */
  'headApiV4ProjectsIdRepositoryBranchesBranch'(
    parameters?: Parameters<Paths.HeadApiV4ProjectsIdRepositoryBranchesBranch.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getApiV4ProjectsIdRepositoryBranches - Get a project repository branches
   */
  'getApiV4ProjectsIdRepositoryBranches'(
    parameters?: Parameters<Paths.GetApiV4ProjectsIdRepositoryBranches.QueryParameters & Paths.GetApiV4ProjectsIdRepositoryBranches.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4ProjectsIdRepositoryBranches.Responses.$200>
  /**
   * postApiV4ProjectsIdRepositoryBranches - Create branch
   */
  'postApiV4ProjectsIdRepositoryBranches'(
    parameters?: Parameters<Paths.PostApiV4ProjectsIdRepositoryBranches.QueryParameters & Paths.PostApiV4ProjectsIdRepositoryBranches.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV4ProjectsIdRepositoryBranches.Responses.$201>
  /**
   * putApiV4ProjectsIdRepositoryBranchesBranchUnprotect - Unprotect a single branch
   */
  'putApiV4ProjectsIdRepositoryBranchesBranchUnprotect'(
    parameters?: Parameters<Paths.PutApiV4ProjectsIdRepositoryBranchesBranchUnprotect.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutApiV4ProjectsIdRepositoryBranchesBranchUnprotect.Responses.$200>
  /**
   * putApiV4ProjectsIdRepositoryBranchesBranchProtect - Protect a single branch
   */
  'putApiV4ProjectsIdRepositoryBranchesBranchProtect'(
    parameters?: Parameters<Paths.PutApiV4ProjectsIdRepositoryBranchesBranchProtect.PathParameters> | null,
    data?: Paths.PutApiV4ProjectsIdRepositoryBranchesBranchProtect.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutApiV4ProjectsIdRepositoryBranchesBranchProtect.Responses.$200>
  /**
   * getApiV4ProjectsIdBadgesBadgeId - Gets a badge of a project.
   * 
   * This feature was introduced in GitLab 10.6.
   */
  'getApiV4ProjectsIdBadgesBadgeId'(
    parameters?: Parameters<Paths.GetApiV4ProjectsIdBadgesBadgeId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4ProjectsIdBadgesBadgeId.Responses.$200>
  /**
   * putApiV4ProjectsIdBadgesBadgeId - Updates a badge of a project.
   * 
   * This feature was introduced in GitLab 10.6.
   */
  'putApiV4ProjectsIdBadgesBadgeId'(
    parameters?: Parameters<Paths.PutApiV4ProjectsIdBadgesBadgeId.PathParameters> | null,
    data?: Paths.PutApiV4ProjectsIdBadgesBadgeId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutApiV4ProjectsIdBadgesBadgeId.Responses.$200>
  /**
   * deleteApiV4ProjectsIdBadgesBadgeId - Removes a badge from the project.
   * 
   * This feature was introduced in GitLab 10.6.
   */
  'deleteApiV4ProjectsIdBadgesBadgeId'(
    parameters?: Parameters<Paths.DeleteApiV4ProjectsIdBadgesBadgeId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getApiV4ProjectsIdBadges - Gets a list of project badges viewable by the authenticated user.
   * 
   * This feature was introduced in GitLab 10.6.
   */
  'getApiV4ProjectsIdBadges'(
    parameters?: Parameters<Paths.GetApiV4ProjectsIdBadges.QueryParameters & Paths.GetApiV4ProjectsIdBadges.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4ProjectsIdBadges.Responses.$200>
  /**
   * postApiV4ProjectsIdBadges - Adds a badge to a project.
   * 
   * This feature was introduced in GitLab 10.6.
   */
  'postApiV4ProjectsIdBadges'(
    parameters?: Parameters<Paths.PostApiV4ProjectsIdBadges.PathParameters> | null,
    data?: Paths.PostApiV4ProjectsIdBadges.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV4ProjectsIdBadges.Responses.$201>
  /**
   * getApiV4ProjectsIdBadgesRender - Preview a badge from a project.
   * 
   * This feature was introduced in GitLab 10.6.
   */
  'getApiV4ProjectsIdBadgesRender'(
    parameters?: Parameters<Paths.GetApiV4ProjectsIdBadgesRender.QueryParameters & Paths.GetApiV4ProjectsIdBadgesRender.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4ProjectsIdBadgesRender.Responses.$200>
  /**
   * deleteApiV4ProjectsIdAccessRequestsUserId - Denies an access request for the given user.
   * 
   * This feature was introduced in GitLab 8.11.
   */
  'deleteApiV4ProjectsIdAccessRequestsUserId'(
    parameters?: Parameters<Paths.DeleteApiV4ProjectsIdAccessRequestsUserId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * putApiV4ProjectsIdAccessRequestsUserIdApprove - Approves an access request for the given user.
   * 
   * This feature was introduced in GitLab 8.11.
   */
  'putApiV4ProjectsIdAccessRequestsUserIdApprove'(
    parameters?: Parameters<Paths.PutApiV4ProjectsIdAccessRequestsUserIdApprove.PathParameters> | null,
    data?: Paths.PutApiV4ProjectsIdAccessRequestsUserIdApprove.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutApiV4ProjectsIdAccessRequestsUserIdApprove.Responses.$200>
  /**
   * getApiV4ProjectsIdAccessRequests - Gets a list of access requests for a project.
   * 
   * This feature was introduced in GitLab 8.11.
   */
  'getApiV4ProjectsIdAccessRequests'(
    parameters?: Parameters<Paths.GetApiV4ProjectsIdAccessRequests.QueryParameters & Paths.GetApiV4ProjectsIdAccessRequests.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4ProjectsIdAccessRequests.Responses.$200>
  /**
   * postApiV4ProjectsIdAccessRequests - Requests access for the authenticated user to a project.
   * 
   * This feature was introduced in GitLab 8.11.
   */
  'postApiV4ProjectsIdAccessRequests'(
    parameters?: Parameters<Paths.PostApiV4ProjectsIdAccessRequests.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV4ProjectsIdAccessRequests.Responses.$200>
  /**
   * putApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId - Update a metric image for an alert
   */
  'putApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId'(
    parameters?: Parameters<Paths.PutApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId.PathParameters> | null,
    data?: Paths.PutApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId.Responses.$200>
  /**
   * deleteApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId - Remove a metric image for an alert
   */
  'deleteApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId'(
    parameters?: Parameters<Paths.DeleteApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId.Responses.$204>
  /**
   * getApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages - Metric Images for alert
   */
  'getApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages'(
    parameters?: Parameters<Paths.GetApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages.Responses.$200>
  /**
   * postApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages - Upload a metric image for an alert
   */
  'postApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages'(
    parameters?: Parameters<Paths.PostApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages.PathParameters> | null,
    data?: Paths.PostApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages.Responses.$200>
  /**
   * postApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesAuthorize - Workhorse authorize metric image file upload
   */
  'postApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesAuthorize'(
    parameters?: Parameters<Paths.PostApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesAuthorize.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getApiV4AdminBatchedBackgroundMigrationsId - Retrieve a batched background migration
   */
  'getApiV4AdminBatchedBackgroundMigrationsId'(
    parameters?: Parameters<Paths.GetApiV4AdminBatchedBackgroundMigrationsId.QueryParameters & Paths.GetApiV4AdminBatchedBackgroundMigrationsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4AdminBatchedBackgroundMigrationsId.Responses.$200>
  /**
   * getApiV4AdminBatchedBackgroundMigrations - Get the list of batched background migrations
   */
  'getApiV4AdminBatchedBackgroundMigrations'(
    parameters?: Parameters<Paths.GetApiV4AdminBatchedBackgroundMigrations.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4AdminBatchedBackgroundMigrations.Responses.$200>
  /**
   * putApiV4AdminBatchedBackgroundMigrationsIdResume - Resume a batched background migration
   */
  'putApiV4AdminBatchedBackgroundMigrationsIdResume'(
    parameters?: Parameters<Paths.PutApiV4AdminBatchedBackgroundMigrationsIdResume.PathParameters> | null,
    data?: Paths.PutApiV4AdminBatchedBackgroundMigrationsIdResume.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutApiV4AdminBatchedBackgroundMigrationsIdResume.Responses.$200>
  /**
   * putApiV4AdminBatchedBackgroundMigrationsIdPause - Pause a batched background migration
   */
  'putApiV4AdminBatchedBackgroundMigrationsIdPause'(
    parameters?: Parameters<Paths.PutApiV4AdminBatchedBackgroundMigrationsIdPause.PathParameters> | null,
    data?: Paths.PutApiV4AdminBatchedBackgroundMigrationsIdPause.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutApiV4AdminBatchedBackgroundMigrationsIdPause.Responses.$200>
  /**
   * getApiV4AdminCiVariablesKey - Get the details of a specific instance-level variable
   */
  'getApiV4AdminCiVariablesKey'(
    parameters?: Parameters<Paths.GetApiV4AdminCiVariablesKey.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4AdminCiVariablesKey.Responses.$200>
  /**
   * putApiV4AdminCiVariablesKey - Update an instance-level variable
   */
  'putApiV4AdminCiVariablesKey'(
    parameters?: Parameters<Paths.PutApiV4AdminCiVariablesKey.PathParameters> | null,
    data?: Paths.PutApiV4AdminCiVariablesKey.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutApiV4AdminCiVariablesKey.Responses.$200>
  /**
   * deleteApiV4AdminCiVariablesKey - Delete an existing instance-level variable
   */
  'deleteApiV4AdminCiVariablesKey'(
    parameters?: Parameters<Paths.DeleteApiV4AdminCiVariablesKey.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV4AdminCiVariablesKey.Responses.$204>
  /**
   * getApiV4AdminCiVariables - List all instance-level variables
   */
  'getApiV4AdminCiVariables'(
    parameters?: Parameters<Paths.GetApiV4AdminCiVariables.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4AdminCiVariables.Responses.$200>
  /**
   * postApiV4AdminCiVariables - Create a new instance-level variable
   */
  'postApiV4AdminCiVariables'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV4AdminCiVariables.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV4AdminCiVariables.Responses.$201>
  /**
   * getApiV4AdminDatabasesDatabaseNameDictionaryTablesTableName - Retrieve dictionary details
   */
  'getApiV4AdminDatabasesDatabaseNameDictionaryTablesTableName'(
    parameters?: Parameters<Paths.GetApiV4AdminDatabasesDatabaseNameDictionaryTablesTableName.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4AdminDatabasesDatabaseNameDictionaryTablesTableName.Responses.$200>
  /**
   * getApiV4AdminClustersClusterId - Get a single instance cluster
   * 
   * This feature was introduced in GitLab 13.2. Returns a single instance cluster.
   */
  'getApiV4AdminClustersClusterId'(
    parameters?: Parameters<Paths.GetApiV4AdminClustersClusterId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4AdminClustersClusterId.Responses.$200>
  /**
   * putApiV4AdminClustersClusterId - Edit instance cluster
   * 
   * This feature was introduced in GitLab 13.2. Updates an existing instance cluster.
   */
  'putApiV4AdminClustersClusterId'(
    parameters?: Parameters<Paths.PutApiV4AdminClustersClusterId.PathParameters> | null,
    data?: Paths.PutApiV4AdminClustersClusterId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutApiV4AdminClustersClusterId.Responses.$200>
  /**
   * deleteApiV4AdminClustersClusterId - Delete instance cluster
   * 
   * This feature was introduced in GitLab 13.2. Deletes an existing instance cluster. Does not remove existing resources within the connected Kubernetes cluster.
   */
  'deleteApiV4AdminClustersClusterId'(
    parameters?: Parameters<Paths.DeleteApiV4AdminClustersClusterId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV4AdminClustersClusterId.Responses.$204>
  /**
   * postApiV4AdminClustersAdd - Add existing instance cluster
   * 
   * This feature was introduced in GitLab 13.2. Adds an existing Kubernetes instance cluster.
   */
  'postApiV4AdminClustersAdd'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV4AdminClustersAdd.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV4AdminClustersAdd.Responses.$201>
  /**
   * getApiV4AdminClusters - List instance clusters
   * 
   * This feature was introduced in GitLab 13.2. Returns a list of instance clusters.
   */
  'getApiV4AdminClusters'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4AdminClusters.Responses.$200>
  /**
   * postApiV4AdminMigrationsTimestampMark - Mark the migration as successfully executed
   */
  'postApiV4AdminMigrationsTimestampMark'(
    parameters?: Parameters<Paths.PostApiV4AdminMigrationsTimestampMark.PathParameters> | null,
    data?: Paths.PostApiV4AdminMigrationsTimestampMark.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * deleteApiV4ApplicationsId - Delete an application
   * 
   * Delete a specific application
   */
  'deleteApiV4ApplicationsId'(
    parameters?: Parameters<Paths.DeleteApiV4ApplicationsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getApiV4Applications - Get applications
   * 
   * List all registered applications
   */
  'getApiV4Applications'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4Applications.Responses.$200>
  /**
   * postApiV4Applications - Create a new application
   * 
   * This feature was introduced in GitLab 10.5
   */
  'postApiV4Applications'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV4Applications.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV4Applications.Responses.$200>
  /**
   * getApiV4Avatar - Return avatar url for a user
   */
  'getApiV4Avatar'(
    parameters?: Parameters<Paths.GetApiV4Avatar.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4Avatar.Responses.$200>
  /**
   * getApiV4BroadcastMessagesId - Get a specific broadcast message
   * 
   * This feature was introduced in GitLab 8.12.
   */
  'getApiV4BroadcastMessagesId'(
    parameters?: Parameters<Paths.GetApiV4BroadcastMessagesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4BroadcastMessagesId.Responses.$200>
  /**
   * putApiV4BroadcastMessagesId - Update a broadcast message
   * 
   * This feature was introduced in GitLab 8.12.
   */
  'putApiV4BroadcastMessagesId'(
    parameters?: Parameters<Paths.PutApiV4BroadcastMessagesId.PathParameters> | null,
    data?: Paths.PutApiV4BroadcastMessagesId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutApiV4BroadcastMessagesId.Responses.$200>
  /**
   * deleteApiV4BroadcastMessagesId - Delete a broadcast message
   * 
   * This feature was introduced in GitLab 8.12.
   */
  'deleteApiV4BroadcastMessagesId'(
    parameters?: Parameters<Paths.DeleteApiV4BroadcastMessagesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV4BroadcastMessagesId.Responses.$200>
  /**
   * getApiV4BroadcastMessages - Get all broadcast messages
   * 
   * This feature was introduced in GitLab 8.12.
   */
  'getApiV4BroadcastMessages'(
    parameters?: Parameters<Paths.GetApiV4BroadcastMessages.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4BroadcastMessages.Responses.$200>
  /**
   * postApiV4BroadcastMessages - Create a broadcast message
   * 
   * This feature was introduced in GitLab 8.12.
   */
  'postApiV4BroadcastMessages'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV4BroadcastMessages.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV4BroadcastMessages.Responses.$201>
  /**
   * getApiV4BulkImportsImportIdEntitiesEntityId - Get GitLab Migration entity details
   * 
   * This feature was introduced in GitLab 14.1.
   */
  'getApiV4BulkImportsImportIdEntitiesEntityId'(
    parameters?: Parameters<Paths.GetApiV4BulkImportsImportIdEntitiesEntityId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4BulkImportsImportIdEntitiesEntityId.Responses.$200>
  /**
   * getApiV4BulkImportsImportIdEntities - List GitLab Migration entities
   * 
   * This feature was introduced in GitLab 14.1.
   */
  'getApiV4BulkImportsImportIdEntities'(
    parameters?: Parameters<Paths.GetApiV4BulkImportsImportIdEntities.QueryParameters & Paths.GetApiV4BulkImportsImportIdEntities.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4BulkImportsImportIdEntities.Responses.$200>
  /**
   * getApiV4BulkImportsImportId - Get GitLab Migration details
   * 
   * This feature was introduced in GitLab 14.1.
   */
  'getApiV4BulkImportsImportId'(
    parameters?: Parameters<Paths.GetApiV4BulkImportsImportId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4BulkImportsImportId.Responses.$200>
  /**
   * getApiV4BulkImportsEntities - List all GitLab Migrations' entities
   * 
   * This feature was introduced in GitLab 14.1.
   */
  'getApiV4BulkImportsEntities'(
    parameters?: Parameters<Paths.GetApiV4BulkImportsEntities.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4BulkImportsEntities.Responses.$200>
  /**
   * getApiV4BulkImports - List all GitLab Migrations
   * 
   * This feature was introduced in GitLab 14.1.
   */
  'getApiV4BulkImports'(
    parameters?: Parameters<Paths.GetApiV4BulkImports.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4BulkImports.Responses.$200>
  /**
   * postApiV4BulkImports - Start a new GitLab Migration
   * 
   * This feature was introduced in GitLab 14.2.
   */
  'postApiV4BulkImports'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV4BulkImports.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV4BulkImports.Responses.$200>
  /**
   * getApiV4ApplicationAppearance - Get the current appearance
   */
  'getApiV4ApplicationAppearance'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4ApplicationAppearance.Responses.$200>
  /**
   * putApiV4ApplicationAppearance - Modify appearance
   */
  'putApiV4ApplicationAppearance'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PutApiV4ApplicationAppearance.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutApiV4ApplicationAppearance.Responses.$200>
  /**
   * getApiV4ApplicationPlanLimits - Get current plan limits
   * 
   * List the current limits of a plan on the GitLab instance.
   */
  'getApiV4ApplicationPlanLimits'(
    parameters?: Parameters<Paths.GetApiV4ApplicationPlanLimits.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4ApplicationPlanLimits.Responses.$200>
  /**
   * putApiV4ApplicationPlanLimits - Change plan limits
   * 
   * Modify the limits of a plan on the GitLab instance.
   */
  'putApiV4ApplicationPlanLimits'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PutApiV4ApplicationPlanLimits.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutApiV4ApplicationPlanLimits.Responses.$200>
  /**
   * getApiV4Metadata - Retrieve metadata information for this GitLab instance
   * 
   * This feature was introduced in GitLab 15.2.
   */
  'getApiV4Metadata'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4Metadata.Responses.$200>
  /**
   * getApiV4Version - Retrieves version information for the GitLab instance
   * 
   * This feature was introduced in GitLab 8.13 and deprecated in 15.5. We recommend you instead use the Metadata API.
   */
  'getApiV4Version'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV4Version.Responses.$200>
  /**
   * listProjectJobs - List jobs for a project
   */
  'listProjectJobs'(
    parameters?: Parameters<Paths.ListProjectJobs.QueryParameters & Paths.ListProjectJobs.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ListProjectJobs.Responses.$200>
  /**
   * getSingleJob - Get a single job by ID
   */
  'getSingleJob'(
    parameters?: Parameters<Paths.GetSingleJob.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetSingleJob.Responses.$200>
  /**
   * triggerManualJob - Run a manual job
   */
  'triggerManualJob'(
    parameters?: Parameters<Paths.TriggerManualJob.QueryParameters & Paths.TriggerManualJob.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.TriggerManualJob.Responses.$200>
}

export interface PathsDictionary {
  ['/groups/{id}/badges/{badge_id}']: {
    /**
     * getApiV4GroupsIdBadgesBadgeId - Gets a badge of a group.
     * 
     * This feature was introduced in GitLab 10.6.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4GroupsIdBadgesBadgeId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4GroupsIdBadgesBadgeId.Responses.$200>
    /**
     * putApiV4GroupsIdBadgesBadgeId - Updates a badge of a group.
     * 
     * This feature was introduced in GitLab 10.6.
     */
    'put'(
      parameters?: Parameters<Paths.PutApiV4GroupsIdBadgesBadgeId.PathParameters> | null,
      data?: Paths.PutApiV4GroupsIdBadgesBadgeId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutApiV4GroupsIdBadgesBadgeId.Responses.$200>
    /**
     * deleteApiV4GroupsIdBadgesBadgeId - Removes a badge from the group.
     * 
     * This feature was introduced in GitLab 10.6.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV4GroupsIdBadgesBadgeId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/groups/{id}/badges']: {
    /**
     * getApiV4GroupsIdBadges - Gets a list of group badges viewable by the authenticated user.
     * 
     * This feature was introduced in GitLab 10.6.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4GroupsIdBadges.QueryParameters & Paths.GetApiV4GroupsIdBadges.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4GroupsIdBadges.Responses.$200>
    /**
     * postApiV4GroupsIdBadges - Adds a badge to a group.
     * 
     * This feature was introduced in GitLab 10.6.
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV4GroupsIdBadges.PathParameters> | null,
      data?: Paths.PostApiV4GroupsIdBadges.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV4GroupsIdBadges.Responses.$201>
  }
  ['/groups/{id}/badges/render']: {
    /**
     * getApiV4GroupsIdBadgesRender - Preview a badge from a group.
     * 
     * This feature was introduced in GitLab 10.6.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4GroupsIdBadgesRender.QueryParameters & Paths.GetApiV4GroupsIdBadgesRender.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4GroupsIdBadgesRender.Responses.$200>
  }
  ['/groups/{id}/access_requests/{user_id}']: {
    /**
     * deleteApiV4GroupsIdAccessRequestsUserId - Denies an access request for the given user.
     * 
     * This feature was introduced in GitLab 8.11.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV4GroupsIdAccessRequestsUserId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/groups/{id}/access_requests/{user_id}/approve']: {
    /**
     * putApiV4GroupsIdAccessRequestsUserIdApprove - Approves an access request for the given user.
     * 
     * This feature was introduced in GitLab 8.11.
     */
    'put'(
      parameters?: Parameters<Paths.PutApiV4GroupsIdAccessRequestsUserIdApprove.PathParameters> | null,
      data?: Paths.PutApiV4GroupsIdAccessRequestsUserIdApprove.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutApiV4GroupsIdAccessRequestsUserIdApprove.Responses.$200>
  }
  ['/groups/{id}/access_requests']: {
    /**
     * getApiV4GroupsIdAccessRequests - Gets a list of access requests for a group.
     * 
     * This feature was introduced in GitLab 8.11.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4GroupsIdAccessRequests.QueryParameters & Paths.GetApiV4GroupsIdAccessRequests.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4GroupsIdAccessRequests.Responses.$200>
    /**
     * postApiV4GroupsIdAccessRequests - Requests access for the authenticated user to a group.
     * 
     * This feature was introduced in GitLab 8.11.
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV4GroupsIdAccessRequests.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV4GroupsIdAccessRequests.Responses.$200>
  }
  ['/projects/{id}/repository/merged_branches']: {
    /**
     * deleteApiV4ProjectsIdRepositoryMergedBranches - Delete all merged branches
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV4ProjectsIdRepositoryMergedBranches.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/projects/{id}/repository/branches/{branch}']: {
    /**
     * getApiV4ProjectsIdRepositoryBranchesBranch - Get a single repository branch
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4ProjectsIdRepositoryBranchesBranch.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4ProjectsIdRepositoryBranchesBranch.Responses.$200>
    /**
     * deleteApiV4ProjectsIdRepositoryBranchesBranch - Delete a branch
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV4ProjectsIdRepositoryBranchesBranch.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * headApiV4ProjectsIdRepositoryBranchesBranch - Check if a branch exists
     */
    'head'(
      parameters?: Parameters<Paths.HeadApiV4ProjectsIdRepositoryBranchesBranch.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/projects/{id}/repository/branches']: {
    /**
     * getApiV4ProjectsIdRepositoryBranches - Get a project repository branches
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4ProjectsIdRepositoryBranches.QueryParameters & Paths.GetApiV4ProjectsIdRepositoryBranches.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4ProjectsIdRepositoryBranches.Responses.$200>
    /**
     * postApiV4ProjectsIdRepositoryBranches - Create branch
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV4ProjectsIdRepositoryBranches.QueryParameters & Paths.PostApiV4ProjectsIdRepositoryBranches.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV4ProjectsIdRepositoryBranches.Responses.$201>
  }
  ['/projects/{id}/repository/branches/{branch}/unprotect']: {
    /**
     * putApiV4ProjectsIdRepositoryBranchesBranchUnprotect - Unprotect a single branch
     */
    'put'(
      parameters?: Parameters<Paths.PutApiV4ProjectsIdRepositoryBranchesBranchUnprotect.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutApiV4ProjectsIdRepositoryBranchesBranchUnprotect.Responses.$200>
  }
  ['/projects/{id}/repository/branches/{branch}/protect']: {
    /**
     * putApiV4ProjectsIdRepositoryBranchesBranchProtect - Protect a single branch
     */
    'put'(
      parameters?: Parameters<Paths.PutApiV4ProjectsIdRepositoryBranchesBranchProtect.PathParameters> | null,
      data?: Paths.PutApiV4ProjectsIdRepositoryBranchesBranchProtect.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutApiV4ProjectsIdRepositoryBranchesBranchProtect.Responses.$200>
  }
  ['/projects/{id}/badges/{badge_id}']: {
    /**
     * getApiV4ProjectsIdBadgesBadgeId - Gets a badge of a project.
     * 
     * This feature was introduced in GitLab 10.6.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4ProjectsIdBadgesBadgeId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4ProjectsIdBadgesBadgeId.Responses.$200>
    /**
     * putApiV4ProjectsIdBadgesBadgeId - Updates a badge of a project.
     * 
     * This feature was introduced in GitLab 10.6.
     */
    'put'(
      parameters?: Parameters<Paths.PutApiV4ProjectsIdBadgesBadgeId.PathParameters> | null,
      data?: Paths.PutApiV4ProjectsIdBadgesBadgeId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutApiV4ProjectsIdBadgesBadgeId.Responses.$200>
    /**
     * deleteApiV4ProjectsIdBadgesBadgeId - Removes a badge from the project.
     * 
     * This feature was introduced in GitLab 10.6.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV4ProjectsIdBadgesBadgeId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/projects/{id}/badges']: {
    /**
     * getApiV4ProjectsIdBadges - Gets a list of project badges viewable by the authenticated user.
     * 
     * This feature was introduced in GitLab 10.6.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4ProjectsIdBadges.QueryParameters & Paths.GetApiV4ProjectsIdBadges.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4ProjectsIdBadges.Responses.$200>
    /**
     * postApiV4ProjectsIdBadges - Adds a badge to a project.
     * 
     * This feature was introduced in GitLab 10.6.
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV4ProjectsIdBadges.PathParameters> | null,
      data?: Paths.PostApiV4ProjectsIdBadges.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV4ProjectsIdBadges.Responses.$201>
  }
  ['/projects/{id}/badges/render']: {
    /**
     * getApiV4ProjectsIdBadgesRender - Preview a badge from a project.
     * 
     * This feature was introduced in GitLab 10.6.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4ProjectsIdBadgesRender.QueryParameters & Paths.GetApiV4ProjectsIdBadgesRender.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4ProjectsIdBadgesRender.Responses.$200>
  }
  ['/projects/{id}/access_requests/{user_id}']: {
    /**
     * deleteApiV4ProjectsIdAccessRequestsUserId - Denies an access request for the given user.
     * 
     * This feature was introduced in GitLab 8.11.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV4ProjectsIdAccessRequestsUserId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/projects/{id}/access_requests/{user_id}/approve']: {
    /**
     * putApiV4ProjectsIdAccessRequestsUserIdApprove - Approves an access request for the given user.
     * 
     * This feature was introduced in GitLab 8.11.
     */
    'put'(
      parameters?: Parameters<Paths.PutApiV4ProjectsIdAccessRequestsUserIdApprove.PathParameters> | null,
      data?: Paths.PutApiV4ProjectsIdAccessRequestsUserIdApprove.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutApiV4ProjectsIdAccessRequestsUserIdApprove.Responses.$200>
  }
  ['/projects/{id}/access_requests']: {
    /**
     * getApiV4ProjectsIdAccessRequests - Gets a list of access requests for a project.
     * 
     * This feature was introduced in GitLab 8.11.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4ProjectsIdAccessRequests.QueryParameters & Paths.GetApiV4ProjectsIdAccessRequests.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4ProjectsIdAccessRequests.Responses.$200>
    /**
     * postApiV4ProjectsIdAccessRequests - Requests access for the authenticated user to a project.
     * 
     * This feature was introduced in GitLab 8.11.
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV4ProjectsIdAccessRequests.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV4ProjectsIdAccessRequests.Responses.$200>
  }
  ['/projects/{id}/alert_management_alerts/{alert_iid}/metric_images/{metric_image_id}']: {
    /**
     * putApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId - Update a metric image for an alert
     */
    'put'(
      parameters?: Parameters<Paths.PutApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId.PathParameters> | null,
      data?: Paths.PutApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId.Responses.$200>
    /**
     * deleteApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId - Remove a metric image for an alert
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesMetricImageId.Responses.$204>
  }
  ['/projects/{id}/alert_management_alerts/{alert_iid}/metric_images']: {
    /**
     * getApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages - Metric Images for alert
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages.Responses.$200>
    /**
     * postApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages - Upload a metric image for an alert
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages.PathParameters> | null,
      data?: Paths.PostApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImages.Responses.$200>
  }
  ['/projects/{id}/alert_management_alerts/{alert_iid}/metric_images/authorize']: {
    /**
     * postApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesAuthorize - Workhorse authorize metric image file upload
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV4ProjectsIdAlertManagementAlertsAlertIidMetricImagesAuthorize.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/admin/batched_background_migrations/{id}']: {
    /**
     * getApiV4AdminBatchedBackgroundMigrationsId - Retrieve a batched background migration
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4AdminBatchedBackgroundMigrationsId.QueryParameters & Paths.GetApiV4AdminBatchedBackgroundMigrationsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4AdminBatchedBackgroundMigrationsId.Responses.$200>
  }
  ['/admin/batched_background_migrations']: {
    /**
     * getApiV4AdminBatchedBackgroundMigrations - Get the list of batched background migrations
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4AdminBatchedBackgroundMigrations.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4AdminBatchedBackgroundMigrations.Responses.$200>
  }
  ['/admin/batched_background_migrations/{id}/resume']: {
    /**
     * putApiV4AdminBatchedBackgroundMigrationsIdResume - Resume a batched background migration
     */
    'put'(
      parameters?: Parameters<Paths.PutApiV4AdminBatchedBackgroundMigrationsIdResume.PathParameters> | null,
      data?: Paths.PutApiV4AdminBatchedBackgroundMigrationsIdResume.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutApiV4AdminBatchedBackgroundMigrationsIdResume.Responses.$200>
  }
  ['/admin/batched_background_migrations/{id}/pause']: {
    /**
     * putApiV4AdminBatchedBackgroundMigrationsIdPause - Pause a batched background migration
     */
    'put'(
      parameters?: Parameters<Paths.PutApiV4AdminBatchedBackgroundMigrationsIdPause.PathParameters> | null,
      data?: Paths.PutApiV4AdminBatchedBackgroundMigrationsIdPause.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutApiV4AdminBatchedBackgroundMigrationsIdPause.Responses.$200>
  }
  ['/admin/ci/variables/{key}']: {
    /**
     * getApiV4AdminCiVariablesKey - Get the details of a specific instance-level variable
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4AdminCiVariablesKey.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4AdminCiVariablesKey.Responses.$200>
    /**
     * putApiV4AdminCiVariablesKey - Update an instance-level variable
     */
    'put'(
      parameters?: Parameters<Paths.PutApiV4AdminCiVariablesKey.PathParameters> | null,
      data?: Paths.PutApiV4AdminCiVariablesKey.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutApiV4AdminCiVariablesKey.Responses.$200>
    /**
     * deleteApiV4AdminCiVariablesKey - Delete an existing instance-level variable
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV4AdminCiVariablesKey.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV4AdminCiVariablesKey.Responses.$204>
  }
  ['/admin/ci/variables']: {
    /**
     * getApiV4AdminCiVariables - List all instance-level variables
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4AdminCiVariables.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4AdminCiVariables.Responses.$200>
    /**
     * postApiV4AdminCiVariables - Create a new instance-level variable
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV4AdminCiVariables.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV4AdminCiVariables.Responses.$201>
  }
  ['/admin/databases/{database_name}/dictionary/tables/{table_name}']: {
    /**
     * getApiV4AdminDatabasesDatabaseNameDictionaryTablesTableName - Retrieve dictionary details
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4AdminDatabasesDatabaseNameDictionaryTablesTableName.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4AdminDatabasesDatabaseNameDictionaryTablesTableName.Responses.$200>
  }
  ['/admin/clusters/{cluster_id}']: {
    /**
     * getApiV4AdminClustersClusterId - Get a single instance cluster
     * 
     * This feature was introduced in GitLab 13.2. Returns a single instance cluster.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4AdminClustersClusterId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4AdminClustersClusterId.Responses.$200>
    /**
     * putApiV4AdminClustersClusterId - Edit instance cluster
     * 
     * This feature was introduced in GitLab 13.2. Updates an existing instance cluster.
     */
    'put'(
      parameters?: Parameters<Paths.PutApiV4AdminClustersClusterId.PathParameters> | null,
      data?: Paths.PutApiV4AdminClustersClusterId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutApiV4AdminClustersClusterId.Responses.$200>
    /**
     * deleteApiV4AdminClustersClusterId - Delete instance cluster
     * 
     * This feature was introduced in GitLab 13.2. Deletes an existing instance cluster. Does not remove existing resources within the connected Kubernetes cluster.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV4AdminClustersClusterId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV4AdminClustersClusterId.Responses.$204>
  }
  ['/admin/clusters/add']: {
    /**
     * postApiV4AdminClustersAdd - Add existing instance cluster
     * 
     * This feature was introduced in GitLab 13.2. Adds an existing Kubernetes instance cluster.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV4AdminClustersAdd.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV4AdminClustersAdd.Responses.$201>
  }
  ['/admin/clusters']: {
    /**
     * getApiV4AdminClusters - List instance clusters
     * 
     * This feature was introduced in GitLab 13.2. Returns a list of instance clusters.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4AdminClusters.Responses.$200>
  }
  ['/admin/migrations/{timestamp}/mark']: {
    /**
     * postApiV4AdminMigrationsTimestampMark - Mark the migration as successfully executed
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV4AdminMigrationsTimestampMark.PathParameters> | null,
      data?: Paths.PostApiV4AdminMigrationsTimestampMark.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/applications/{id}']: {
    /**
     * deleteApiV4ApplicationsId - Delete an application
     * 
     * Delete a specific application
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV4ApplicationsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/applications']: {
    /**
     * getApiV4Applications - Get applications
     * 
     * List all registered applications
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4Applications.Responses.$200>
    /**
     * postApiV4Applications - Create a new application
     * 
     * This feature was introduced in GitLab 10.5
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV4Applications.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV4Applications.Responses.$200>
  }
  ['/avatar']: {
    /**
     * getApiV4Avatar - Return avatar url for a user
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4Avatar.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4Avatar.Responses.$200>
  }
  ['/broadcast_messages/{id}']: {
    /**
     * getApiV4BroadcastMessagesId - Get a specific broadcast message
     * 
     * This feature was introduced in GitLab 8.12.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4BroadcastMessagesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4BroadcastMessagesId.Responses.$200>
    /**
     * putApiV4BroadcastMessagesId - Update a broadcast message
     * 
     * This feature was introduced in GitLab 8.12.
     */
    'put'(
      parameters?: Parameters<Paths.PutApiV4BroadcastMessagesId.PathParameters> | null,
      data?: Paths.PutApiV4BroadcastMessagesId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutApiV4BroadcastMessagesId.Responses.$200>
    /**
     * deleteApiV4BroadcastMessagesId - Delete a broadcast message
     * 
     * This feature was introduced in GitLab 8.12.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV4BroadcastMessagesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV4BroadcastMessagesId.Responses.$200>
  }
  ['/broadcast_messages']: {
    /**
     * getApiV4BroadcastMessages - Get all broadcast messages
     * 
     * This feature was introduced in GitLab 8.12.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4BroadcastMessages.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4BroadcastMessages.Responses.$200>
    /**
     * postApiV4BroadcastMessages - Create a broadcast message
     * 
     * This feature was introduced in GitLab 8.12.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV4BroadcastMessages.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV4BroadcastMessages.Responses.$201>
  }
  ['/bulk_imports/{import_id}/entities/{entity_id}']: {
    /**
     * getApiV4BulkImportsImportIdEntitiesEntityId - Get GitLab Migration entity details
     * 
     * This feature was introduced in GitLab 14.1.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4BulkImportsImportIdEntitiesEntityId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4BulkImportsImportIdEntitiesEntityId.Responses.$200>
  }
  ['/bulk_imports/{import_id}/entities']: {
    /**
     * getApiV4BulkImportsImportIdEntities - List GitLab Migration entities
     * 
     * This feature was introduced in GitLab 14.1.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4BulkImportsImportIdEntities.QueryParameters & Paths.GetApiV4BulkImportsImportIdEntities.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4BulkImportsImportIdEntities.Responses.$200>
  }
  ['/bulk_imports/{import_id}']: {
    /**
     * getApiV4BulkImportsImportId - Get GitLab Migration details
     * 
     * This feature was introduced in GitLab 14.1.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4BulkImportsImportId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4BulkImportsImportId.Responses.$200>
  }
  ['/bulk_imports/entities']: {
    /**
     * getApiV4BulkImportsEntities - List all GitLab Migrations' entities
     * 
     * This feature was introduced in GitLab 14.1.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4BulkImportsEntities.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4BulkImportsEntities.Responses.$200>
  }
  ['/bulk_imports']: {
    /**
     * getApiV4BulkImports - List all GitLab Migrations
     * 
     * This feature was introduced in GitLab 14.1.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4BulkImports.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4BulkImports.Responses.$200>
    /**
     * postApiV4BulkImports - Start a new GitLab Migration
     * 
     * This feature was introduced in GitLab 14.2.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV4BulkImports.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV4BulkImports.Responses.$200>
  }
  ['/application/appearance']: {
    /**
     * getApiV4ApplicationAppearance - Get the current appearance
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4ApplicationAppearance.Responses.$200>
    /**
     * putApiV4ApplicationAppearance - Modify appearance
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PutApiV4ApplicationAppearance.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutApiV4ApplicationAppearance.Responses.$200>
  }
  ['/application/plan_limits']: {
    /**
     * getApiV4ApplicationPlanLimits - Get current plan limits
     * 
     * List the current limits of a plan on the GitLab instance.
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV4ApplicationPlanLimits.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4ApplicationPlanLimits.Responses.$200>
    /**
     * putApiV4ApplicationPlanLimits - Change plan limits
     * 
     * Modify the limits of a plan on the GitLab instance.
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PutApiV4ApplicationPlanLimits.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutApiV4ApplicationPlanLimits.Responses.$200>
  }
  ['/metadata']: {
    /**
     * getApiV4Metadata - Retrieve metadata information for this GitLab instance
     * 
     * This feature was introduced in GitLab 15.2.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4Metadata.Responses.$200>
  }
  ['/version']: {
    /**
     * getApiV4Version - Retrieves version information for the GitLab instance
     * 
     * This feature was introduced in GitLab 8.13 and deprecated in 15.5. We recommend you instead use the Metadata API.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV4Version.Responses.$200>
  }
  ['/projects/{id}/jobs']: {
    /**
     * listProjectJobs - List jobs for a project
     */
    'get'(
      parameters?: Parameters<Paths.ListProjectJobs.QueryParameters & Paths.ListProjectJobs.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ListProjectJobs.Responses.$200>
  }
  ['/projects/{id}/jobs/{job_id}']: {
    /**
     * getSingleJob - Get a single job by ID
     */
    'get'(
      parameters?: Parameters<Paths.GetSingleJob.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetSingleJob.Responses.$200>
  }
  ['/projects/{id}/jobs/{job_id}/play']: {
    /**
     * triggerManualJob - Run a manual job
     */
    'post'(
      parameters?: Parameters<Paths.TriggerManualJob.QueryParameters & Paths.TriggerManualJob.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.TriggerManualJob.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>

