import { IssueCard, IssueCardSkeleton } from "@/components/Issue/issue-card";
import ListWithFilters from "@/components/ListWithFilters";
import issues from "@/screens-examples/projects/issues/issues";
import React from "react";
import { ScrollView } from "react-native";

export default function IssuesListScreen() {
  const params = {
    query: {
      // scope: "all",
      // state: "opened",
      // order_by: "created_at",
      created_by_me: false,
      // assigned_to_me: false,
      // issue_type: "issue",
    },
  };
  // const {
  //   data: issues,
  //   isLoading,
  //   isError,
  //   error,
  // } = useGetData(["issues", params?.query, params?.path], "/api/v4/issues", params);

  const UIFilters = [
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


  return (
    <ScrollView className="flex-1 m-2">
      <ListWithFilters
        title="Issues"
        items={issues}
        ItemComponent={IssueCard}
        SkeletonComponent={IssueCardSkeleton}
        pathname="/workspace/projects/[projectId]/issues/[issue_iid]"
        endpoint="/api/v4/issues"
        params={params}
        cache_name="issues"
        paramsMap={{
          "projectId": "project_id", "issue_iid": "iid"
        }}
        UIFilters={UIFilters}

      />
    </ScrollView>
  );
}
