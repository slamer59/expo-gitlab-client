import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';

import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SectionTitle } from '../Section/param';
import { EditParamMergeRequestDialog } from './mr-edit-param';

function getTimeRemaining(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return '⚠️ Overdue';
    } else if (diffDays === 0) {
        return '⏰ Due today';
    } else if (diffDays === 1) {
        return '🕐 1 day remaining';
    } else if (diffDays < 7) {
        return `📅 ${diffDays} days remaining`;
    } else if (diffDays < 14) {
        return '🗓️ 1 week remaining';
    } else {
        const diffWeeks = Math.floor(diffDays / 7);
        return `🗓️ ${diffWeeks} weeks remaining`;
    }
}


function MilestonePill({ milestone, onPress }) {
    const timeRemaining = getTimeRemaining(milestone.due_date);
    return (
        <Button variant="icon" onPress={onPress} className='flex-row items-center justify-between w-full'>
            <Text className="ml-2 text-sm text-primary">{milestone.title}</Text>
            <Text className="text-xs text-muted">{timeRemaining}</Text>
        </Button>
    );
}

export default function EditMilestoneMergeRequest({ projectId, mrIid }) {
    const { session } = useSession()
    const api = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const { data: mr, loading, error } = api.useProjectMergeRequest(projectId, mrIid) ?? {};
    const { execute: updateMergeRequest, loading: updating, error: updateError } = api.useUpdateProjectMergeRequest(projectId, mrIid);
    const { data: milestones, loading: milestonesLoading, error: milestonesError } = api.useProjectMilestones(projectId);

    if (error || milestonesError || updateError) return <Text>Error: {error?.message || milestonesError?.message || updateError?.message}</Text>;

    const [checkedId, setCheckedId] = useState(null);

    const handleSave = async () => {
        await updateMergeRequest({
            milestone_id: checkedId,
        });
    };

    useEffect(() => {
        if (mr && mr.milestone) {
            setCheckedId(mr.milestone.id);
        }
    }, [loading, mr]);

    return (
        <ScrollView>
            <SectionTitle title="Milestone">
                <EditParamMergeRequestDialog title="Milestone" handleSave={handleSave} loading={updating} error={updateError}>
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
                </EditParamMergeRequestDialog>
            </SectionTitle>
            {checkedId ? (
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
            )}
        </ScrollView>
    );
};
