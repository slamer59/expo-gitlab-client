export const GlobalIssueUIFilters = [
    {
        label: "Issues",
        options: [
            { value: "all", label: "All Issues", filter: { all: 1 } },
            { value: "opened", label: "Opened", filter: { state: "opened" } },
            { value: "closed", label: "Closed", filter: { state: "closed" } },
        ],
        placeholder: "State",
    },
    {
        label: "Scope",
        options: [
            {
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
            { value: "issue", label: "Issue", filter: { issue_type: "issue" } },
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

export const GlobalMergeRequestUIFilters = [
    {
        label: "State",
        options: [
            {
                value: "opened",
                label: "Opened",
                filter: { state: "opened" },
            },
            { value: "all", label: "All", filter: { state: "all" } },
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
        options: [
            { value: "bug", label: "Bug", filter: { labels: "bug" } },
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