import { IssueCard } from '@/components/ui/issue-card';
import { TopFilterList } from '@/components/ui/top-filter-list';
import { getData } from '@/lib/gitlab/client';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';


export default function IssuesListScreen() {
    function updateParams(filterValues: any) {
        // Update the params object based on the selected filter values
        params.query = {
            ...params.query,
            ...filterValues,
        };
    }

    const filters = [
        {
            label: "Issues",
            options: [
                { value: 'all', label: 'All Issues', filter: { owned: true, starred: true } },
                // { value: 'archived', label: 'Archived' },
                // { value: 'starred', label: 'Starred' },
                { value: 'owned', label: 'Owned', filter: { owned: true } },
                // { value: 'imported', label: 'Imported' },
                { value: 'starred', label: 'Starred', filter: { starred: true } },
            ],
            placeholder: "Select an issue...",
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
                    value: "asc", label: "Ascending", filter: { sort: "asc" },
                },
                {
                    value: "desc", label: "Descending", filter: { sort: "desc" },
                }
            ],
            placeholder: "Sort by"
        },
        {
            label:
                "Ordered By",
            options: [
                { value: 'id', label: 'Id', filter: { order_by: 'id' } },
                { value: 'name', label: 'Name', filter: { order_by: 'name' } },
                { value: 'path', label: 'Path', filter: { order_by: 'path' } },
                { value: 'created_at', label: 'Created At', filter: { order_by: 'created_at' } },
                { value: 'updated_at', label: 'Updated At', filter: { order_by: 'updated_at' } },
                { value: 'last_activity_at', label: 'Last activity', filter: { order_by: 'last_activity_at' } },
                { value: 'similarity', label: 'Similarity', filter: { order_by: 'similarity' } },
                { value: 'storage_size', label: 'Storage Size', filter: { order_by: 'storage_size' } },
                { value: 'repository_size', label: 'Repository Size', filter: { order_by: 'repository_size' } },
                { value: 'wiki_size', label: 'Wiki Size', filter: { order_by: 'wiki_size' } },
                { value: 'packages_size', label: 'Packages Size', filter: { order_by: 'packages_size' } },
            ],
            placeholder: "Ordered By..."
        }
    ];
    const params = {
        query: {
            // order_by: 'created_at',
            // sort: 'desc',
            owned: false,
            created_by_me: true,
            // starred: false,
            // imported: false,
            // membership: false,
            // with_issues_enabled: false,
            // with_merge_requests_enabled: false,
            // wiki_checksum_failed: false,
            // repository_checksum_failed: false,
            // include_hidden: false,
            // page: 1,
            // per_page: 20,
            // simple: false,
            // statistics: false,
            // with_custom_attributes: false,
        }
    }


    const [selectedFilters, setSelectedFilters] = useState({});


    const clearFilters = () => {
        setSelectedFilters({});
    };


    // loop over filters and check if selectedFilters has the same key and value
    // if it does, then add it to the params
    for (const key in selectedFilters) {
        if (selectedFilters.hasOwnProperty(key)) {
            const value = selectedFilters[key];
            // where label == Issues
            for (const filter of filters) {
                if (filter.label === key) {
                    for (const option of filter.options) {
                        if (option.value === value.value) {
                            updateParams(option.filter)
                        }
                    }
                }
            }
        }
    }

    // filter values

    const { data: issues } = getData(
        ['issues', params.query],
        `/api/v4/issues`,
        params
    )
    console.log(issues)
    console.log("params", params)
    return (
        <ScrollView className="flex-1 m-2">
            <TopFilterList
                filters={filters}
                setSelectedFilters={setSelectedFilters}
                selectedFilters={selectedFilters}
                clearFilters={clearFilters}
            />

            {issues?.map((issue, index) => (
                < IssueCard
                    key={index}
                    issue={issue}
                />
            ))}
            {/*     {/*<Link
                    href={{
                        pathname: '/workspace/issues/[projectId]',
                        params: {
                            projectId: project.id,
                            path: encodeURIComponent(project.path_with_namespace)
                            // Replace with the actual project ID
                        },
                    }}>*/}

        </ScrollView >
    );
}
