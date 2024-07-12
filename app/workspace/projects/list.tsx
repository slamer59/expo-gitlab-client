import { ProjectCard } from '@/components/ui/project-card';
import { TopFilterList } from '@/components/ui/top-filter-list';
import { getData } from '@/lib/gitlab/client';
import { Link } from "expo-router";
import React from 'react';
import { ScrollView } from 'react-native';



export default function ProjectsListScreen() {

    const filters = [
        {
            label: "Projects",
            options: [
                { value: 'all', label: 'All Projects' },
                // { value: 'archived', label: 'Archived' },
                // { value: 'starred', label: 'Starred' },
                { value: 'owned', label: 'Owned' },
                // { value: 'imported', label: 'Imported' },
                { value: 'membership', label: 'Member of' },
            ],
            placeholder: "Select a project..."
        },
        {
            label: "Visibility",
            options: [
                { value: 'private', label: 'Private' },
                { value: 'internal', label: 'Internal' },
                { value: 'public', label: 'Public' },
            ],
            placeholder: "Select a visibility..."
        },
        {
            label: "Repository",
            options: [
                { value: 'public', label: 'Public' },
                { value: 'private', label: 'Private' },
                { value: 'forked', label: 'Forked' },
            ],
            placeholder: "Select a repository..."
        },
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
                    value: "asc", label: "Ascending"
                },
                {
                    value: "desc", label: "Descending"
                }
            ],
            placeholder: "Sort by"
        },
        {
            label:
                "Ordered By",
            options: [
                { value: 'id', label: 'Id' },
                { value: 'name', label: 'Name' },
                { value: 'path', label: 'Path' },
                { value: 'created_at', label: 'Created At' },
                { value: 'updated_at', label: 'Updated At' },
                { value: 'last_activity_at', label: 'Last activity' },
                { value: 'similarity', label: 'Similarity' },
                { value: 'storage_size', label: 'Storage Size' },
                { value: 'repository_size', label: 'Repository Size' },
                { value: 'wiki_size', label: 'Wiki Size' },
                { value: 'packages_size', label: 'Packages Size' },
            ],
            placeholder: "Ordered By..."
        }
    ];
    // https://gitlab.com/api/v4/projects?order_by=created_at&sort=desc&owned=false&starred=false&imported=false&membership=false&with_issues_enabled=false&with_merge_requests_enabled=false&wiki_checksum_failed=false&repository_checksum_failed=false&include_hidden=false&page=1&per_page=20&simple=false&statistics=false&with_custom_attributes=false
    const params = {
        query: {
            order_by: 'created_at',
            sort: 'desc',
            owned: false,
            starred: false,
            imported: false,
            membership: false,
            with_issues_enabled: false,
            with_merge_requests_enabled: false,
            wiki_checksum_failed: false,
            repository_checksum_failed: false,
            include_hidden: false,
            page: 1,
            per_page: 20,
            simple: false,
            statistics: false,
            with_custom_attributes: false,
        }
    }
    const { data: projects } = getData(
        ['projects', params.query],
        `/api/v4/projects`,
        params
    )

    return (
        <ScrollView className="flex-1 m-2">
            <TopFilterList
                filters={filters}
            />

            {projects?.map((project, index) => (
                <Link
                    href={{
                        pathname: '/workspace/projects/[projectId]',
                        params: {
                            projectId: project.id,
                            path: encodeURIComponent(project.path_with_namespace)
                        },
                    }}>
                    <ProjectCard
                        key={index}
                        name={project.name}
                        name_with_namespace={project.name_with_namespace}
                        last_activity_at={project.last_activity_at}
                        // path_with_namespace={project.path_with_namespace}
                        star_count={project.star_count}
                        avatar_url={project.avatar_url}
                        owner={project.owner}
                    // description={project.description}
                    // archived={project.archived}
                    // creator_id= {project.creator_id}
                    />
                </Link>
            ))}

        </ScrollView>
    );
}
