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



// const IssueNote = ({ note }) => {
//     const renderPill = (branchName, url, key) => (
//         <React.Fragment key={key}>
//             <Pills label={branchName} />
//             <Text className="font-semibold text-primary"> {url}</Text>
//         </React.Fragment>
//     );

//     const renderLink = (href, text, className, key) => (
//         <Link key={key} href={href}>
//             <Text className={className}>{text}</Text>
//         </Link>
//     );

//     const renderNoteWithPills = (body) => {
//         const parts = body.split(/(\[`.*?`\]\(.*?\))/);
//         return (
//             <Text>
//                 {parts.map((part, index) => {
//                     const match = part.match(/\[`(.*?)`\]\((.*?)\)/);
//                     return match
//                         ? renderPill(match[1], match[2], index)
//                         : <Text key={index}>{part}</Text>;
//                 })}
//             </Text>
//         );
//     };

//     const renderLinkifiedText = (text) => {
//         const parts = text.split(/(\#\d+|\!\d+|\@\S+|(?<=: )([0-9a-f]{40})|changed target branch from `[^`]+` to `[^`]+`)/);

//         return parts.map((part, index) => {
//             if (!part) return null; // Handle undefined or empty parts

//             if (part.match(/\#\d+/)) {
//                 return renderLink(`https://error.url/${part.slice(1)}`, part, "underline text-secondary", index);
//             } else if (part.includes('[`') && part.includes('`]')) {
//                 return renderNoteWithPills(part);
//             } else if (part.match(/\!\d+/)) {
//                 return renderLink(`https://error.url/${part.slice(1)}`, part, "underline text-secondary", index);
//             } else if (part.match(/\@\S+/)) {
//                 return renderLink(`https://error.url/${part.slice(1)}`, part, "font-semibold underline text-secondary", index);
//             } else if (part.match(/^[0-9a-f]{40}$/)) {
//                 return renderLink(`https://your-git-repository-url/commit/${part}`, part, "underline text-secondary", index);
//             } else if (part.match(/changed target branch from `[^`]+` to `[^`]+`/)) {
//                 const [, oldBranch, newBranch] = part.match(/changed target branch from `([^`]+)` to `([^`]+)`/);
//                 return (
//                     <Text key={index}>
//                         changed target branch from <Text className="font-semibold">`{oldBranch}`</Text> to <Text className="font-semibold">`{newBranch}`</Text>
//                     </Text>
//                 );
//             }
//             return <Text key={index}>{part}</Text>;
//         }).filter(Boolean); // Remove null elements
//     };


//     if (note.system) {
//         return (
//             <View className="flex-row mb-2">
//                 <Text className="font-bold">{note?.author?.name} </Text>
//                 {renderLinkifiedText(note.body)}
//             </View>
//         );
//     }

//     return (
//         <View className="mb-2 bg-background">
//             <Text className="font-bold text-white">{note.author.name}</Text>
//             <Text>{note.body}</Text>
//         </View>
//     );
// };

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

