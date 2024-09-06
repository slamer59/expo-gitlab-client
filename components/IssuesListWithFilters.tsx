import { ListComponent } from "@/components/ListCards";
import { ListWithFilters } from "@/components/listWithFilters";
import { IssueCard, IssueCardSkeleton } from "@/components/ui/issue-card";
import React, { useState } from "react";
import { ScrollView } from "react-native";


interface IssuesListWithFiltersProps {
  data: any[];
  isLoading: boolean;
  isError: boolean;
  error: any;

}
export default function IssuesListWithFilters({ data: issues, isLoading, isError, error }: IssuesListWithFiltersProps) {

  const filters = [
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

  function updateParams(filterValues: any) {
    // Update the params object based on the selected filter values
    params.query = {
      ...params.query,
      ...filterValues,
    };
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
              updateParams(option.filter);
            }
          }
        }
      }
    }
  }

  // filter values



  return (
    <ScrollView className="flex-1 m-2">
      <ListWithFilters
        title="Issues"
        filters={filters}
        setSelectedFilters={setSelectedFilters}
        selectedFilters={selectedFilters}
        clearFilters={clearFilters}
        isLoading={isLoading}
        isError={isError}
        error={error}
      // isError={isError1}
      // error={error1}
      >
        {issues &&
          <ListComponent
            items={issues}
            ItemComponent={IssueCard}
            SkeletonComponent={IssueCardSkeleton}
            pathname="/workspace/projects/[projectId]/issues/[issue_iid]"
            paramsMap={{
              "projectId": "project_id", "issue_iid": "iid"
            }}
          />
        }
      </ListWithFilters>

    </ScrollView>
  );
}
