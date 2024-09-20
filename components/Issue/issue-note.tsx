import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import RenderHtml from 'react-native-render-html';

import React, { useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
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

const convertMarkdownToHtml = async (markdown) => {
    try {
        const response = await fetch('https://gitlab.com/api/v4/markdown', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

                'PRIVATE-TOKEN': "GITLAB_PAT_REMOVED",
            },
            body: JSON.stringify({
                text: markdown,
                gfm: true,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to convert Markdown to HTML');
        }

        const data = await response.json();
        return data.html;
    } catch (error) {
        console.error('Error converting Markdown to HTML:', error);
        return markdown; // Return original markdown if conversion fails
    }
};

const IssueNote = ({ note }) => {
    const [htmlContent, setHtmlContent] = useState('');
    const { width } = useWindowDimensions();

    useEffect(() => {
        convertMarkdownToHtml(note.body).then(bodyHtml => {
            const cleanBodyHtml = bodyHtml.replace(/<p/g, '<span').replace(/<\/p>/g, '</span>').trim();
            setHtmlContent(`<strong>${note.author.name}</strong> ${cleanBodyHtml}`);
        });
    }, [note.body, note.author.name]);

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
            <RenderHtml
                contentWidth={width - 24} // Adjust based on your layout
                source={{ html: htmlContent }}
                tagsStyles={tagsStyles}
            />
        </View>
    );
};

const IssueNotes = ({ notes }) => {

    return (
        <>
            <Text className="text-4xl font-bold text-white">Activity</Text>
            {notes && notes.length > 0 ? <View className="p-4 mb-2">
                {notes.map((note) => (
                    note.system ? (
                        <IssueNote key={note.id} note={note} />
                    ) :
                        <IssueComment key={note.id} issue={note} />
                ))
                }
            </View> : <Text className="ml-2 text-white">🔍 No activity found</Text>
            }

        </>
    );
};

export default IssueNotes;

