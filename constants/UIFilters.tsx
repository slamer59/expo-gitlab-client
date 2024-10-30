export const GlobalIssueUIFilters = [
    {
        label: "Issues",
        options: [
            { value: "all", label: "All Issues", filter: { all: 1 }, default: true },
            { value: "opened", label: "Opened", filter: { state: "opened" } },
            { value: "closed", label: "Closed", filter: { state: "closed" } },
        ],
        placeholder: "State",
    },
    {
        label: "Scope",
        options: [
            {
                default: true,
                value: "created_by_me",
                label: "Created By Me",
                filter: { created_by_me: true },
            },
            {
                value: "assigned_to_me",
                label: "Assigned To Me",
                filter: { assigned_to_me: true },
            },
            { value: "all", label: "All", filter: { all: true } },
        ],
        placeholder: "Scope",
    },
    {
        label: "Type",
        options: [
            {
                value: "incident",
                label: "Incident",
                filter: { issue_type: "incident" },
            },
            {
                value: "issue",
                label: "Issue",
                filter: { issue_type: "issue" },
                default: true
            },
            {
                value: "test_case",
                label: "Test Case",
                filter: { issue_type: "test_case" },
            },
        ],
        placeholder: "Type",
    },
    {
        label: "Ordered By",
        options: [
            {
                value: "create_at",
                label: "Created At",
                filter: { order_by: "created_at" },
                default: true,
            },
            {
                value: "due_date",
                label: "Due Date",
                filter: { order_by: "due_date" },
            },
            {
                value: "label_priority",
                label: "Label Priority",
                filter: { order_by: "label_priority" },
            },
            {
                value: "milestone_due",
                label: "Milestone Due",
                filter: { order_by: "milestone_due" },
            },
            {
                value: "popularity",
                label: "Popularity",
                filter: { order_by: "popularity" },
            },
            {
                value: "priority",
                label: "Priority",
                filter: { order_by: "priority" },
            },
            {
                value: "relative_position",
                label: "Relative Position",
                filter: { order_by: "relative_position" },
            },
            { value: "title", label: "Title", filter: { order_by: "title" } },
            {
                value: "updated_at",
                label: "Updated At",
                filter: { order_by: "updated_at" },
            },
            { value: "weight", label: "Weight", filter: { order_by: "weight" } },
        ],
        placeholder: "Ordered By",
    },
];

export const GlobalCommitUIFilters = [
    {
        label: 'Branch',
        placeholder: 'Select Branch',
        options: [
            { label: 'All Branches', value: '' },
            { label: 'Main', value: 'main' },
            { label: 'Develop', value: 'develop' },
            // Add more branches as needed
        ],
    },
];
export const GlobalMergeRequestUIFilters = [
    {
        label: "State",
        options: [
            { value: "all", label: "All", filter: { state: "all" } },
            {
                value: "opened",
                label: "Opened",
                filter: { state: "opened" },
                default: true,
            },
            {
                value: "closed",
                label: "Closed",
                filter: { state: "closed" },
            },
            {
                value: "merged",
                label: "Merged",
                filter: { state: "merged" },
            }
        ],
        placeholder: "State",
    },
    {
        label: "Milestone",
        options: [
            {
                value: "release",
                label: "Release",
                filter: { milestone: "release" },
            },
        ],
        placeholder: "Milestone",
    },
    {
        label: "Labels",
        // Returns merge requests matching a comma-separated list of labels. None lists all merge requests with no labels. Any lists all merge requests with at least one label. Predefined names are case-insensitive.
        options: [
            {
                value: "none",
                label: "None",
                filter: { labels: "none" },
                // default: true,
            },
            {
                value: "any",
                label: "Any",
                filter: { labels: "any" },
            },
            {
                value: "bug",
                label: "Bug",
                filter: { labels: "bug" },
            },
            {
                value: "reproduced",
                label: "Reproduced",
                filter: { labels: "reproduced" },
            },
        ],
        placeholder: "Labels",
    },
    {
        label: "Author",
        options: [
            {
                value: "author_id",
                label: "Author ID",
                filter: { author_id: 5 },
            },
            {
                value: "author_username",
                label: "Author Username",
                filter: { author_username: "gitlab-bot" },
            },
        ],
        placeholder: "Author",
    },
    {
        label: "My Reaction Emoji",
        options: [
            {
                value: "star",
                label: "Star",
                filter: { my_reaction_emoji: "star" },
            },
        ],
        placeholder: "Reaction",
    },
    {
        label: "Scope",
        options: [
            {
                value: "assigned_to_me",
                label: "Assigned to Me",
                filter: { scope: "assigned_to_me" },
            },
        ],
        placeholder: "Scope",
    },
    // {
    //   label: 'Search',
    //   options: [
    //     { value: 'title', label: 'Title', filter: { search: '', in: 'title' } },
    //     { value: 'description', label: 'Description', filter: { search: '', in: 'description' } },
    //   ],
    //   placeholder: 'Keyword',
    // },
];

export const GlobalProjectsUIFilters = [
    {
        label: "Projects",
        options: [
            {
                value: "all",
                label: "All Projects",
                filter: { owned: false, starred: false },
                default: true,
            },
            // { value: 'archived', label: 'Archived' },
            // { value: 'starred', label: 'Starred' },
            { value: "owned", label: "Owned", filter: { owned: true } },
            // { value: 'imported', label: 'Imported' },
            {
                value: "starred",
                label: "Starred",
                filter: { starred: true },
            },
        ],
        placeholder: "Select a project...",
    },
    // membership
    {
        label: "Membership",
        options: [
            {
                value: "membership",
                label: "Member", filter: { membership: true }
            },
            {
                value: "membership",
                label: "Not Member", filter: { membership: false },
                default: true,
            },
        ],
        placeholder: "Select a membership...",
    },
    // {
    //     label: "Visibility",
    //     options: [
    //         { value: 'private', label: 'Private' },
    //         { value: 'internal', label: 'Internal' },
    //         { value: 'public', label: 'Public' },
    //     ],
    //     placeholder: "Select a visibility..."
    // },
    // {
    //     label: "Repository",
    //     options: [
    //         { value: 'public', label: 'Public' },
    //         { value: 'private', label: 'Private' },
    //         { value: 'forked', label: 'Forked' },
    //     ],
    //     placeholder: "Select a repository..."
    // },
    // {
    //     label: "Features",
    //     options: [
    //         { value: 'with_issues_enabled', label: 'With Issues' },
    //         { value: 'with_merge_requests_enabled', label: 'With Merge Requests' },
    //     ],
    //     placeholder: "Select a feature..."
    // },
    // {
    //     label: "Updated After",
    //     options: [
    //         { value: 'last_week', label: 'Last Week' },
    //         { value: 'last_month', label: 'Last Month' },
    //         { value: 'last_year', label: 'Last Year' },
    //     ],
    //     placeholder: "Time period."
    // },
    // {
    //     label: "Programming Language",
    //     options: [
    //         { value: 'javascript', label: 'JavaScript' },
    //         { value: 'python', label: 'Python' },
    //         { value: 'java', label: 'Java' },
    //     ],
    //     placeholder: "Select a programming language..."
    // },
    // {
    //     label: "Topic",
    //     options: [
    //         { value: 'machine-learning', label: 'Machine Learning' },
    //         { value: 'web-development', label: 'Web Development' },
    //         { value: 'mobile-development', label: 'Mobile Development' },
    //     ],
    //     placeholder: "Select a topic..."
    // },
    {
        label: "Sorted By",
        options: [
            {
                value: "asc",
                label: "Ascending",
                filter: { sort: "asc" },
            },
            {
                value: "desc",
                label: "Descending",
                filter: { sort: "desc" },
                default: true,
            },
        ],
        placeholder: "Sort by",
    },
    {
        label: "Ordered By",
        options: [
            { value: "id", label: "Id", filter: { order_by: "id" } },
            { value: "name", label: "Name", filter: { order_by: "name" } },
            { value: "path", label: "Path", filter: { order_by: "path" } },
            {
                value: "created_at",
                label: "Created At",
                filter: { order_by: "created_at" },
                default: true,
            },
            {
                value: "updated_at",
                label: "Updated At",
                filter: { order_by: "updated_at" },
            },
            {
                value: "last_activity_at",
                label: "Last activity",
                filter: { order_by: "last_activity_at" },
            },
            {
                value: "similarity",
                label: "Similarity",
                filter: { order_by: "similarity" },
            },
            {
                value: "storage_size",
                label: "Storage Size",
                filter: { order_by: "storage_size" },
            },
            {
                value: "repository_size",
                label: "Repository Size",
                filter: { order_by: "repository_size" },
            },
            {
                value: "wiki_size",
                label: "Wiki Size",
                filter: { order_by: "wiki_size" },
            },
            {
                value: "packages_size",
                label: "Packages Size",
                filter: { order_by: "packages_size" },
            },
        ],
        placeholder: "Ordered By...",
    },
];

// User profile filters 
export const GlobalUserProjectUIFilters = [
    {
        label: "User ID",
        options: [
            { value: "current_user", label: "Current User", filter: { user_id: "current_user" } },
        ],
        placeholder: "Enter user ID or username...",
    },
    {
        label: "Archived",
        options: [
            { value: true, label: "Archived", filter: { archived: true } },
            { value: false, label: "Not Archived", filter: { archived: false }, default: true },
        ],
        placeholder: "Select archived status...",
    },
    {
        label: "ID Range",
        options: [
            { value: "after", label: "After ID", filter: { id_after: null } },
            { value: "before", label: "Before ID", filter: { id_before: null } },
        ],
        placeholder: "Enter ID...",
    },
    {
        label: "Membership",
        options: [
            { value: true, label: "Member", filter: { membership: true } },
            { value: false, label: "Not Member", filter: { membership: false }, default: true },
        ],
        placeholder: "Select membership status...",
    },
    {
        label: "Min Access Level",
        options: [
            { value: 10, label: "Guest", filter: { min_access_level: 10 } },
            { value: 20, label: "Reporter", filter: { min_access_level: 20 } },
            { value: 30, label: "Developer", filter: { min_access_level: 30 } },
            { value: 40, label: "Maintainer", filter: { min_access_level: 40 } },
            { value: 50, label: "Owner", filter: { min_access_level: 50 } },
        ],
        placeholder: "Select minimum access level...",
    },
    {
        label: "Owned",
        options: [
            { value: true, label: "Owned", filter: { owned: true } },
            { value: false, label: "Not Owned", filter: { owned: false }, default: true },
        ],
        placeholder: "Select ownership status...",
    },
    {
        label: "Search",
        options: [],
        placeholder: "Enter search criteria...",
    },
    {
        label: "Simple",
        options: [
            { value: true, label: "Simple", filter: { simple: true } },
            { value: false, label: "Detailed", filter: { simple: false }, default: true },
        ],
        placeholder: "Select detail level...",
    },
    {
        label: "Starred",
        options: [
            { value: true, label: "Starred", filter: { starred: true } },
            { value: false, label: "Not Starred", filter: { starred: false }, default: true },
        ],
        placeholder: "Select starred status...",
    },
    {
        label: "Statistics",
        options: [
            { value: true, label: "Include Statistics", filter: { statistics: true } },
            { value: false, label: "Exclude Statistics", filter: { statistics: false }, default: true },
        ],
        placeholder: "Select statistics inclusion...",
    },
    {
        label: "Updated",
        options: [
            { value: "after", label: "After Date", filter: { updated_after: null } },
            { value: "before", label: "Before Date", filter: { updated_before: null } },
        ],
        placeholder: "Enter date (YYYY-MM-DDTHH:MM:SSZ)...",
    },
    {
        label: "Visibility",
        options: [
            { value: "public", label: "Public", filter: { visibility: "public" } },
            { value: "internal", label: "Internal", filter: { visibility: "internal" } },
            { value: "private", label: "Private", filter: { visibility: "private" } },
        ],
        placeholder: "Select visibility...",
    },
    {
        label: "Custom Attributes",
        options: [
            { value: true, label: "Include", filter: { with_custom_attributes: true } },
            { value: false, label: "Exclude", filter: { with_custom_attributes: false }, default: true },
        ],
        placeholder: "Select custom attributes inclusion...",
    },
    {
        label: "Features",
        options: [
            { value: "issues", label: "With Issues", filter: { with_issues_enabled: true } },
            { value: "merge_requests", label: "With Merge Requests", filter: { with_merge_requests_enabled: true } },
        ],
        placeholder: "Select features...",
    },
    {
        label: "Programming Language",
        options: [],
        placeholder: "Enter programming language...",
    },
];
export const GlobalUserGroupsUIFilters = []
export const GlobalUserContributedProjectsUIFilters = [
    {
        label: "User ID",
        options: [
            { value: "current_user", label: "Current User", filter: { user_id: "current_user" } },
        ],
        placeholder: "Enter user ID or username...",
    },
    {
        label: "Ordered By",
        options: [
            { value: "id", label: "Id", filter: { order_by: "id" } },
            { value: "name", label: "Name", filter: { order_by: "name" } },
            { value: "path", label: "Path", filter: { order_by: "path" } },
            { value: "created_at", label: "Created At", filter: { order_by: "created_at" }, default: true },
            { value: "updated_at", label: "Updated At", filter: { order_by: "updated_at" } },
            { value: "star_count", label: "Star Count", filter: { order_by: "star_count" } },
            { value: "last_activity_at", label: "Last Activity", filter: { order_by: "last_activity_at" } },
        ],
        placeholder: "Select ordering...",
    },
    {
        label: "Simple",
        options: [
            { value: true, label: "Simple", filter: { simple: true } },
            { value: false, label: "Detailed", filter: { simple: false }, default: true },
        ],
        placeholder: "Select detail level...",
    },
    {
        label: "Sort",
        options: [
            { value: "asc", label: "Ascending", filter: { sort: "asc" } },
            { value: "desc", label: "Descending", filter: { sort: "desc" }, default: true },
        ],
        placeholder: "Select sort order...",
    },
];


export const GlobalUserStarredProjectsUIFilters = []


export const GlobalPipelinesUIFilters = []

export const GlobalGroupUIFilters = [
    // Return projects ordered by id, name, path, created_at, updated_at, similarity 1, star_count or last_activity_at fields.
    {
        label:
            'Sort',
        options: [
            { label: 'Created At', value: 'created_at' },
            { label: 'Updated At', value: 'updated_at' },
        ],
        placeholder: 'Sort by',
    },
]


export const GlobalProjectGroupUIFilters = [
    // Return projects ordered by id, name, path, created_at, updated_at, star_count or last_activity_at fields. Default is created_at
    {
        label: 'Sort',
        placeholder: 'Sort by',
        options: [
            { label: 'Id', value: 'id' },
            { label: 'Name', value: 'name' },
            { label: 'Path', value: 'path' },
            { label: 'Created At', value: 'created_at' },
            { label: 'Updated At', value: 'updated_at' },
            { label: 'Star Count', value: 'star_count' },
            { label: 'Last Activity', value: 'last_activity_at' }
        ]
    },
    {
        label: 'Simple',
        placeholder: 'Select detail level',
        options: [
            { label: 'Simple', value: 'true' },
            { label: 'Detailed', value: 'false' }
        ]
    },
    {
        label: 'Sort',
        placeholder: 'Select sort order',
        options: [
            { label: 'Ascending', value: 'asc' },
            { label: 'Descending', value: 'desc' }
        ]
    }
];

