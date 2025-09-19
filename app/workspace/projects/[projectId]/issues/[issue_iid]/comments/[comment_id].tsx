import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';

import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';

export default function DiscussionsEditComponent() {
    const { session } = useSession()

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });
    const { projectId, issue_iid: issueId, comment_id: commentId } = useLocalSearchParams();

    console.log("🚀 ~ DiscussionsEditComponent ~ commentId:", commentId)
    console.log("🚀 ~ DiscussionsEditComponent ~ issueIid:", issueId)
    console.log("🚀 ~ DiscussionsEditComponent ~ projectId:", projectId)
    const api = useGitLab(client);
    const { data: issue, isLoading: isLoadingIssue, error: errorIssue } = api.useIssueDiscussion(projectId, issueId, 1);
    console.log("🚀 ~ DiscussionsEditComponent ~ issue:", issue)


    // const { data: discussion, isLoading: isLoadingDiscussion, error: errorDiscussion } = api.useIssueDiscussion(projectId, issueIid, commentId);
    // const createDiscussion = api.useCreateIssueDiscussion(projectId, issueId);
    // if (isLoadingIssue) return <Text>Loading...</Text>;
    // if (errorIssue) return <Text>Error: {errorIssue?.message}</Text>;
    return (
        <ScrollView
            className="flex-1 p-4 bg-card"
            contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
        >
            <Stack.Screen
                options={{
                    title: `Discussion`,
                }}
            />
            {/* 
            {isLoadingIssue ? <CommentSkeleton /> :
                // <IssueComment issue={issue} />
            } */}

        </ScrollView>
    );
};
