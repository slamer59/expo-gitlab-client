import { Ionicons } from "@expo/vector-icons";
import { Href } from "expo-router";
import { LucideComponent } from "lucide-react-native";
type IconName = keyof typeof Ionicons.glyphMap;

interface ButtonConfig {
    icon: IconName | 'lucide';
    iconNode?: React.ReactNode;
    text: string;
    screen: Href<string>;
    itemColor: string;
}

export const landingButtons = (devModeEnabled: boolean): ButtonConfig[] => [
    {
        icon: "alert-circle-outline" as IconName,
        text: "Issues",
        screen: "/workspace/issues/list" as Href<string>,
        itemColor: "bg-issues"
    },
    {
        icon: "git-pull-request" as IconName,
        text: "Merge Requests",
        screen: "/workspace/merge-requests/list" as Href<string>,
        itemColor: "bg-merge-requests"
    },
    {
        icon: "folder-outline" as IconName,
        text: "Projects",
        screen: "/workspace/projects/list" as Href<string>,
        itemColor: "bg-projects"
    },
    {
        icon: 'lucide',
        iconNode: <LucideComponent size={24} color="white" />,
        text: "Groups",
        screen: "/workspace/groups/dashboard-list" as Href<string>,
        itemColor: "bg-groups",
    },
    {
        icon: "star-outline" as IconName,
        text: "Starred",
        screen: "/workspace/starred/list" as Href<string>,
        itemColor: "bg-starred"
    },
    ...(devModeEnabled ? [
        {
            icon: "chatbubbles-outline" as IconName,
            text: "Discussions",
            screen: "/workspace/discussions/list" as Href<string>,
            itemColor: "bg-discussions"
        },
        {
            icon: "folder-open-outline" as IconName,
            text: "Repositories",
            screen: "/workspace/repositories/list" as Href<string>,
            itemColor: "bg-repositories"
        },
        {
            icon: "people-outline" as IconName,
            text: "Organizations",
            screen: "/workspace/organizations/list" as Href<string>,
            itemColor: "bg-organizations"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevGitlabNotification",
            screen: "/options/profile" as Href<string>,
            itemColor: "bg-green"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevMember",
            screen: "/workspace/projects/59795263/members/11041577" as Href<string>,
            itemColor: "bg-green"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevIssue",
            screen: "/workspace/projects/59795263/issues/43" as Href<string>,
            itemColor: "bg-green"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevCommitList",
            screen: "/workspace/projects/59853773/commits/list" as Href<string>,
            itemColor: "bg-green"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevFileDisplay",
            screen: "/tree/59853773/" as Href<string>,
            itemColor: "bg-tree"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevFolderTree",
            screen: "/tree/59853773" as Href<string>,
            itemColor: "bg-tree"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevMergeRequest",
            screen: "/workspace/projects/59795263/merge-requests/1" as Href<string>,
            itemColor: "bg-green"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevMergeRequestEdit",
            screen: "/workspace/projects/59795263/merge-requests/1/edit" as Href<string>,
            itemColor: "bg-green"
        },
        {
            icon: "arrow-forward" as IconName,
            text: "DevProject",
            screen: "/workspace/projects/59795263" as Href<string>,
            itemColor: "bg-green"
        },
    ] : [])
];