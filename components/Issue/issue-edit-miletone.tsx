import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';

import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SectionTitle } from '../Section/param';
import { EditParamIssueDialog } from './issue-edit-param';

function getTimeRemaining(dueDate: string): { timeRemainingIcon: string, timeRemainingText: string } {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { timeRemainingIcon: '⚠️', timeRemainingText: 'Overdue' };
    } else if (diffDays === 0) {
        return { timeRemainingIcon: '⏰', timeRemainingText: 'Due today' };
    } else if (diffDays === 1) {
        return { timeRemainingIcon: '🕐', timeRemainingText: '1 day remaining' };
    } else if (diffDays < 7) {
        return { timeRemainingIcon: '📅', timeRemainingText: `${diffDays} days remaining` };
    } else if (diffDays < 14) {
        return { timeRemainingIcon: '🗓️', timeRemainingText: '1 week remaining' };
    } else {
        const diffWeeks = Math.floor(diffDays / 7);
        return { timeRemainingIcon: '🗓️', timeRemainingText: `${diffWeeks} weeks remaining` };
    }
}

function MilestonePill({ milestone, onPress }) {
    const { timeRemainingIcon, timeRemainingText } = getTimeRemaining(milestone.due_date);
    return (
        <Button variant="icon" onPress={onPress} className='flex-row items-center justify-between'>
            <View className='items-center mr-2'>
                <Text className="text-xs text-muted">{timeRemainingIcon}</Text>
                <Text className="text-xs text-muted">{timeRemainingText}</Text>
            </View>
            <Text className="ml-2 text-sm text-primary">{milestone.title}</Text>
        </Button>
    );
}

export default function EditMilestoneIssue({ projectId, issueIid }) {
    const { session } = useSession()
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);
    const { data: issue, loading, error } = api.useProjectIssue(projectId, issueIid) ?? {};
    const { execute: updateIssue, loading: updating, error: updateError } = api.useUpdateProjectIssue(projectId, issueIid);
    const { data: milestones, loading: milestonesLoading, error: milestonesError } = api.useProjectMilestones(projectId);

    if (error || milestonesError || updateError) return <Text>Error: {error?.message || milestonesError?.message || updateError?.message}</Text>;

    const [checkedId, setCheckedId] = useState(null);

    const handleSave = async () => {
        await updateIssue({
            milestone_id: checkedId,
        });
    };

    useEffect(() => {
        if (issue && issue.milestone) {
            setCheckedId(issue.milestone.id);
        }
    }, [loading, issue]);

    return (
        <ScrollView>
            <SectionTitle title="Milestone">
                <EditParamIssueDialog title="Milestone" handleSave={handleSave} loading={updating} error={updateError}>
                    <Text className='text-xl font-semibold text-white'>Assigned milestone</Text>
                    {checkedId ? (
                        <View className="flex-row flex-wrap mb-4">
                            {milestones?.map((milestone) => (
                                milestone.id === checkedId && (
                                    <MilestonePill
                                        key={milestone.id}
                                        milestone={milestone}
                                        onPress={() => setCheckedId(null)}
                                    />
                                )
                            ))}
                        </View>
                    ) : (
                        <Text className='mb-4 text-muted'>No Milestone assigned</Text>
                    )}

                    <Separator className='my-4 bg-primary' />
                    <Text className='text-xl font-semibold text-white'>Project's milestones</Text>

                    {milestones && milestones.length > 0 ? (
                        <View className="flex-row flex-wrap mb-4">
                            {milestones.map((milestone) => (
                                milestone.id !== checkedId && (
                                    <MilestonePill
                                        key={milestone.id}
                                        milestone={milestone}
                                        onPress={() => setCheckedId(milestone.id)}
                                    />
                                )
                            ))}
                        </View>
                    ) : (
                        <Text className="h-12 mb-4 text-muted">No Milestones</Text>
                    )}
                </EditParamIssueDialog>
            </SectionTitle>
            {
                checkedId ? (
                    <View className="flex-row flex-wrap mb-4">
                        {milestones?.map((milestone) => (
                            milestone.id === checkedId && (
                                <MilestonePill
                                    key={milestone.id}
                                    milestone={milestone}
                                    onPress={() => { }}
                                />
                            )
                        ))}
                    </View>
                ) : (
                    <Text className="h-12 mb-4 text-muted">No Milestone</Text>
                )
            }
        </ScrollView >
    );
};
