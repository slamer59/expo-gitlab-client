import { Text } from "@/components/ui/text";
import { Octicons } from "@expo/vector-icons";

import { useSession } from "@/lib/session/SessionProvider";
import { Link } from "expo-router";
import React from 'react';
import { View } from 'react-native';
import { Pills } from "../Pills";
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
};



const iconMap = {
    label: "tag",
    comment: "comment",
    review: "checklist",
    commit: "git-commit",
    issue: "issue-opened",
    "pull-request": "git-pull-request",
    release: "package",
    discussion: "comment-discussion",
    project: "project",
    milestone: "milestone",
    assigned: "person",
    "review-request": "eye",
    visible: "eye",
    confidential: "circle-slash",
    mention: "mention",
    delete: "trash",
    pushed: "repo-push",
    opened: "issue-opened",
    added: "plus-circle",
    removed: "minus-circle",
    mentioned: "mention",
    changed: "calendar",
    branch: "git-branch",
    marked: "bookmark"
};


const getEventIcon = (eventType: string) => {
    console.log("eventType", eventType)
    const iconName = iconMap[eventType];
    return iconName ? (
        <Octicons
            name={iconName}
            size={16}
            color="#8b949e"
            className="mr-2"
        />
    ) : null;
};

const IssueNote = ({ note }) => {
    const { project_id } = note
    const renderNoteWithPills = (body) => {
        const parts = body.split(/(\[`.*?`\]\(.*?\))/);
        console.log("parts", parts);
        return (
            <Text>
                {parts.map((part, index) => {
                    if (part.match(/\[`.*?`\]\(.*?\)/)) {
                        const [_, branchName, url] = part.match(/\[`(.*?)`\]\((.*?)\)/);
                        return (
                            <React.Fragment key={index}>
                                <Pills label={branchName} />
                                <Text
                                    className="font-semibold text-primary">
                                    {" "}{url}
                                </Text>

                            </React.Fragment>
                        );
                    }
                    return <Text key={index}>{part}</Text>;
                })}
            </Text>
        );
    };
    const renderLinkifiedText = (text) => {
        const parts = text.split(/(\#\d+|\!\d+|\@\S+)/);

        return parts.map((part, index) => {
            if (part.match(/\#\d+/)) {
                const issueNumber = part.slice(1);
                console.log("wrong issue url", `https://gitlab.com/projects/${project_id}/issues/${issueNumber}`)
                return (
                    <Link key={index} href={`https://gitlab.com/projects/${project_id}/issues/${issueNumber}`}>
                        <Text className="underline text-secondary">{part}</Text>
                    </Link>
                );
            } else if (part.match(/\[`(.+?)`\]\((.+?)\)/)) {
                return renderNoteWithPills(text);
            }
            // else if (part.match(/\!\d+/)) {
            //     console.log("merge request activity")
            //     const mrNumber = part.slice(1);
            //     return (
            //         <Pressable key={index} onPress={() => openLink(`http://gitlab.com/merge_requests/${mrNumber}`)}>
            //             <Text className="underline text-primary-700">{part}</Text>
            //         </Pressable>
            //     );
            // } else if (part.match(/\@\S+/)) {
            //     console.log("people activity")
            //     return (
            //         <Pressable key={index} onPress={() => openLink(`http://gitlab.com/${part.slice(1)}`)}>
            //             <Text className="text-white underline">{part}</Text>
            //         </Pressable>
            //     );
            // }
            return <Text key={index}>{part}</Text>;
        });
    };
    const label = note?.type !== "DiscussionNote" ? determineLabel(note.body, myLabelMap) : "discussion"

    if (note.system) {
        return <Text className="mb-4">{getEventIcon(label)}  {renderLinkifiedText(note.body)}</Text>;
    }
    // else if (note.type === 'DiscussionNote') {
    //     return (
    //         <View className="mb-2 bg-background">
    //             <Text className="font-bold text-white">{note.author.name}</Text>
    //             <Markdown
    //                 style={styles}
    //             >
    //                 {note.body}
    //             </Markdown>
    //         </View>
    //     );
    // }
    else {
        return (
            <View className="mb-2 bg-background">
                <Text className="font-bold text-white">{note.author.name}</Text>
                <Text>{note.body}</Text>
            </View>
        );
    }
};

const IssueNotes = ({ notes }) => {
    const { session } = useSession()
    console.log("note", notes[10])
    return (
        <>
            <Text className="mb-2 text-4xl font-bold text-white">Activity</Text>
            <View className="p-4 mb-4">
                {notes.map((note) => (
                    note.system ? (
                        <IssueNote key={note.id} note={note} />
                    ) :
                        <IssueComment issue={note} />
                    // <View className="mb-2 bg-background">
                    //     <Text className="font-bold text-white">{note.author.name}</Text>

                    //     <Markdown
                    //         style={styles}
                    //     >
                    //         {note.body}
                    //     </Markdown>
                    // </View>
                ))}
            </View>
        </>
    );
};

export default IssueNotes;
