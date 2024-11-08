import { ButtonConfig, IconName } from "@/components/Buttons/ButtonConfig";
import { Href } from "expo-router";
import { LucideComponent } from "lucide-react-native";

export const landingButtons = (devModeEnabled: boolean): ButtonConfig[] => [
    {
        icon: "alert-circle-outline" as IconName,
        text: "Issues",
        screen: "/workspace/issues/list" as Href<string>,
        itemColor: "#3de63d",
    },
    {
        icon: "git-pull-request" as IconName,
        text: "Merge Requests",
        screen: "/workspace/merge-requests/list" as Href<string>,
        itemColor: "#3e64ed"
    },
    {
        icon: "folder-outline" as IconName,
        text: "Projects",
        screen: "/workspace/projects/list" as Href<string>,
        itemColor: "#A9A9A9"
    },
    {
        icon: 'lucide',
        iconNode: <LucideComponent size={24} color="white" />,
        text: "Groups",
        screen: "/workspace/groups/dashboard-list" as Href<string>,
        itemColor: "#FD8112",
    },
    {
        icon: "star-outline" as IconName,
        text: "Starred",
        screen: "/workspace/starred/list" as Href<string>,
        itemColor: "#d5e"
    },
    ...(devModeEnabled ? [
        {
            icon: "chatbubbles-outline" as IconName,
            text: "Discussions",
            screen: "/workspace/discussions/list" as Href<string>,
            itemColor: "#9370DB"
        },
        {
            icon: "folder-open-outline" as IconName,
            text: "Repositories",
            screen: "/workspace/repositories/list" as Href<string>,
            itemColor: "#696969"
        },
        {
            icon: "people-outline" as IconName,
            text: "Organizations",
            screen: "/workspace/organizations/list" as Href<string>,
            itemColor: "#FD8112"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevGitlabNotification",
            screen: "/options/profile" as Href<string>,
            itemColor: "#8FCF50"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevMember",
            screen: "/workspace/projects/59795263/members/11041577" as Href<string>,
            itemColor: "#8FCF50"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevIssue",
            screen: "/workspace/projects/59795263/issues/43" as Href<string>,
            itemColor: "#8FCF50"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevCommitList",
            screen: "/workspace/projects/59853773/commits/list" as Href<string>,
            itemColor: "#A9A9A9"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevFileDisplay",
            screen: "/tree/59853773/" as Href<string>,
            itemColor: "#8FCF50"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevFolderTree",
            screen: "/tree/59853773" as Href<string>,
            itemColor: "#8FCF50"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevMergeRequest",
            screen: "/workspace/projects/59795263/merge-requests/1" as Href<string>,
            itemColor: "#8FCF50"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevMergeRequestEdit",
            screen: "/workspace/projects/59795263/merge-requests/1/edit" as Href<string>,
            itemColor: "#8FCF50"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevProject",
            screen: "/workspace/projects/59795263" as Href<string>,
            itemColor: "#8FCF50"
        },
    ] : [])
];