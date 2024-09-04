import { ProjectCard, ProjectCardSkeleton } from '@/components/ui/project-card';
import { TopFilterList } from '@/components/ui/top-filter-list';
import { getData } from '@/lib/gitlab/hooks';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';



export default function ProjectsListScreen() {
    const { owned, starred } = useLocalSearchParams()
    const router = useRouter()

    function updateParams(filterValues: any) {
        // Update the params object based on the selected filter values
        params.query = {
            ...params.query,
            ...filterValues,
        };
    }

    const filters = [
        {
            label: "Projects",
            options: [
                { value: 'all', label: 'All Projects', filter: { owned: true, starred: true } },
                // { value: 'archived', label: 'Archived' },
                // { value: 'starred', label: 'Starred' },
                { value: 'owned', label: 'Owned', filter: { owned: true } },
                // { value: 'imported', label: 'Imported' },
                { value: 'starred', label: 'Starred', filter: { starred: true } },
            ],
            placeholder: "Select a project..."
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
    // https://gitlab.com/api/v4/projects?order_by=created_at&sort=desc&owned=false&starred=false&imported=false&membership=false&with_issues_enabled=false&with_merge_requests_enabled=false&wiki_checksum_failed=false&repository_checksum_failed=false&include_hidden=false&page=1&per_page=20&simple=false&statistics=false&with_custom_attributes=false
    const params = {
        query: {
            // order_by: 'created_at',
            // sort: 'desc',
            owned: owned || "true",
            starred: starred || "false",
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

    const defaultFilters = {
        "Projects": {
            "label": owned !== undefined ? (owned ? "Owned" : "Not Owned") : (starred !== undefined ? (starred ? "Starred" : "Not Starred") : "Owned"),
            "value": owned !== undefined ? (owned ? "owned" : "not_owned") : (starred !== undefined ? (starred ? "starred" : "not_starred") : "owned")
        }
    }

    const [selectedFilters, setSelectedFilters] = useState(defaultFilters);
    const clearFilters = () => {
        setSelectedFilters(defaultFilters);
    };


    // loop over filters and check if selectedFilters has the same key and value
    // if it does, then add it to the params
    for (const key in selectedFilters) {
        if (selectedFilters.hasOwnProperty(key)) {
            const value = selectedFilters[key];
            // where label == projects
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

    const { data: projects } = getData(
        ['projects', params.query],
        `/api/v4/projects`,
        params
    )
    // console.log("params", params)
    // console.log("projects", projects)
    // console.log("selectedFilters", selectedFilters)
    return (
        <ScrollView className="flex-1 m-2">
            <Stack.Screen
                options={{
                    title: "Projects"
                }}
            />
            <TopFilterList
                filters={filters}
                setSelectedFilters={setSelectedFilters}
                selectedFilters={selectedFilters}
                clearFilters={clearFilters}
            />

            {projects ? (
                projects?.map((project, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            router.push({
                                pathname: "/workspace/projects/[projectId]",
                                params: {
                                    projectId: project.id,
                                    path: encodeURIComponent(project.path_with_namespace)
                                },
                            });
                        }}
                    >
                        <ProjectCard
                            key={index}
                            project={project}
                        // name={project.name}
                        // name_with_namespace={project.name_with_namespace}
                        // last_activity_at={project.last_activity_at}
                        // // path_with_namespace={project.path_with_namespace}
                        // star_count={project.star_count}
                        // avatar_url={project.avatar_url}
                        // owner={project.owner}
                        // description={project.description}
                        // archived={project.archived}
                        // creator_id= {project.creator_id}
                        />
                        <View className="my-2 border-b border-gray-300" />
                    </TouchableOpacity>
                ))
            ) : (
                Array.from({ length: 5 }).map((_, index) => (
                    <>
                        <ProjectCardSkeleton key={index} />
                        <View className="my-2 border-b border-gray-300" />
                    </>
                ))

            )}

        </ScrollView>
    );
}
