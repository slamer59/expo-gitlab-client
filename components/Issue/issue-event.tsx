import { Octicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Pills } from '../Pills';


const events = [
    { user: 'anna-geller', action: 'removed', eventType: 'milestone', label: 'enhancement', labelType: 'enhancement' },
    { user: 'anna-geller', action: 'added', eventType: 'comment', label: 'technical-issue', labelType: 'technical-issue' },
    { user: 'tchiotludo', action: 'added', eventType: 'review', label: 'kind/cooldown', labelType: 'other' },
    { user: 'tchiotludo', action: 'removed', eventType: 'pull-request', label: 'kind/technical-issue', labelType: 'other' },
    { user: 'anna-geller', action: 'added', eventType: 'discussion', label: 'enhancement', labelType: 'enhancement' },
    { user: 'anna-geller', action: 'added', eventType: 'assignee', label: 'kind/good-first-issue', labelType: 'other' },
    { user: 'anna-geller', action: 'added', eventType: 'review-request', label: 'kind/good-first-issue', labelType: 'other' },
    { user: 'anna-geller', action: 'added', eventType: 'mention', label: 'kind/good-first-issue', labelType: 'other' }
];

export interface EventItemProps {
    user: string;
    action: string;
    eventType: string;
    label: string;
    labelType: string;
}

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
    assignee: "person",
    "review-request": "eye",
    mention: "mention",
    delete: "trash",
    pushed: "repo-push",
    opened: "issue-opened",
};


const getEventIcon = (eventType: string) => {
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



const EventItem = ({ user, action, eventType, label, labelType }: EventItemProps) => (
    <View className="flex-row items-center py-2">
        {getEventIcon(eventType)}
        <Text className="text-muted ">
            <Text className="font-semibold text-white">{user}</Text>
            {' '}{action} the{' '}
            <Pills label={label} />
            {' '}label
        </Text>
    </View>
);

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
    // "bug": "Bug Report",
    // "feature": "Feature Request",
    // "question": "User Question",
    // "documentation": "Documentation",
    // "marked": "marked",
    // "added": "added",
    // "removed": "removed",
    // "mentioned": "mentioned",
    // "changed": "changed",
    // "created-branch": "created",
    // "assigned": "assigned",
};

export function IssueEventComponent({ notes }: { notes: any }) {

    console.log("notes", notes)
    const events1 = notes.map((note: any) => ({
        user: note.author.username,
        label: note?.type !== "DiscussionNote" ? determineLabel(note.body, myLabelMap) : "discussion",
        type: note.type,
        // action: note.event,
        // eventType: note.event,
        // label: note.label.name,
        // labelType: note.label.color,
    }));
    // DiscussionNote
    console.log("events1", events1)
    return (
        <View className="p-4 mb-4 rounded-lg bg-card-600">
            <Text className="mb-2 text-lg font-bold text-white">Activity</Text>
            <ScrollView>
                {events.map((event, index) => (
                    <EventItem key={index} {...event} />
                ))}
            </ScrollView>
        </View>
    );
}
