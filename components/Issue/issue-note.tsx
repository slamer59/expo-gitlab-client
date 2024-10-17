import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import RenderHtml from 'react-native-render-html';

import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Skeleton } from "../ui/skeleton";
import IssueComment from "./issue-comment";
type LabelMap = { [key: string]: string };

function determineLabel(body: string, labelMap: LabelMap): string {
    // Convert the body to lowercase for case-insensitive matching
    const lowerBody = body.toLowerCase();

    // Iterate through the labelMap
    for (const [key, value] of Object.entries(labelMap)) {
        // If the key is found in the body, return the corresponding label
        if (lowerBody.includes(key.toLowerCase())) {
            return value;
        }
    }

    // If no match is found, return a default label or the original body
    return body;
}

// Example usage:
const myLabelMap: LabelMap = {
    "bug": "Bug Report",
    "feature": "Feature Request",
    "question": "User Question",
    "documentation": "Documentation",
    "marked": "marked",
    "added": "added",
    "removed": "removed",
    "mentioned": "mentioned",
    "changed": "changed",
    "created-branch": "created",
    "assigned": "assigned",
    "confidential": "confidential",
    "visible": "visible",
    "branch": "branch",
    "unlocked": "unlocked",
    "locked": "locked",
    "requested": "review-request",
    "merge": "merged",
};


const iconMap = {
    label: "pricetag",
    comment: "chatbubble",
    review: "checkbox",
    commit: "git-commit",
    issue: "alert-circle",
    "pull-request": "git-pull-request",
    release: "cube",
    discussion: "chatbubbles",
    project: "folder",
    milestone: "flag",
    assigned: "person",
    "review-request": "eye",
    visible: "eye",
    confidential: "lock-closed",
    mention: "at",
    delete: "trash",
    pushed: "push",
    opened: "add-circle",
    added: "add-circle",
    removed: "remove-circle",
    mentioned: "at",
    changed: "calendar",
    branch: "git-branch",
    marked: "bookmark",
    unlocked: "lock-open",
    locked: "lock-closed",
    requested: "eye",
    merged: "git-merge",
};


const getEventIcon = (eventType: string) => {
    const iconName = iconMap[eventType];
    return iconName ? (
        <Ionicons
            name={iconName}
            size={16}
            color="#8b949e"
            className="mr-2"
        />
    ) : null;
};

export const IssueNote = ({ note }) => {
    const { width } = useWindowDimensions();
    const { session } = useSession()

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);
    const { data: htmlContent, isLoading: isConverting, error: convertError } = api.useConvertMarkdownToHtml(note.body)

    const tagsStyles = {
        body: {
            color: 'white',
            fontSize: 14,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
        },
        strong: {
            fontWeight: 'bold',
            color: '#A1A1A1', // Lighter color for the author name
            marginRight: 4,
        },
        code: {
            backgroundColor: '#1C2B38',
            padding: 2,
            borderRadius: 4,
        },
    };

    const label = note?.type !== "DiscussionNote" ? determineLabel(note.body, myLabelMap) : "discussion"
    return (
        <View className="flex-row items-center mb-4">

            {/* <Ionicons name="git-commit" size={16} color="#A1A1A1" style={{ marginRight: 8 }} /> */}
            {getEventIcon(label)}
            {isConverting ?
                <Skeleton className="w-full h-4 mb-2 bg-muted" /> :
                <RenderHtml
                    contentWidth={width - 24} // Adjust based on your layout
                    source={{ html: `<strong>${note.author.name}</strong> ${htmlContent.replace(/<p/g, '<span').replace(/<\/p>/g, '</span>').trim()}` }}
                    tagsStyles={tagsStyles}
                />
            }
        </View>
    );
};

const IssueNotes = ({ notes }) => {
    return (
        <>
            {notes && notes.length > 0 ? <View className="p-4 mb-2">
                {notes.map((note) => (
                    note.system ? (
                        <IssueNote key={note.id} note={note} />
                    ) :
                        <IssueComment key={note.id} issue={note}
                        // commentId={note.noteable_iid}
                        />
                ))
                }
            </View> : <Text className="ml-2 text-white">🔍 No activity found</Text>
            }

        </>
    );
};

export default IssueNotes;

