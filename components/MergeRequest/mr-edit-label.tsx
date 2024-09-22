import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { Pressable } from 'react-native';

import { useGitLab } from '@/lib/gitlab/future/hooks/useGitlab';
import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Pills } from '../Pills';
import { SectionTitle } from '../Section/param';
import { EditParamMergeRequestDialog } from './mr-edit-param';

export default function EditLabelMergeRequest({ projectId, mrIid }) {
    const { session } = useSession()
    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const { data: mr, loading, error } = api.useProjectMergeRequest(projectId, mrIid) ?? {};
    const { execute: updateMergeRequest, loading: updating, error: updateError } = api.useUpdateProjectMergeRequest(projectId, mrIid);
    const { data: labels, loading: labelsLoading, error: labelsError } = api.useProjectLabels(projectId, { per_page: 100 });

    if (error || labelsError || updateError) return <Text>Error: {error?.message || labelsError?.message || updateError?.message}</Text>;

    const [checkedIds, setCheckedIds] = React.useState([]);
    const toggleSwitch = (id) => {
        setCheckedIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((checkedId) => checkedId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSave = async () => {
        await updateMergeRequest({
            labels: checkedIds,
        });
    };
    useEffect(() => {
        if (mr) {
            setCheckedIds(mr.labels)
        }
    }, [loading, mr]);

    return (
        <ScrollView>
            <SectionTitle title="Labels">
                <EditParamMergeRequestDialog title="Labels" handleSave={handleSave} loading={updating} error={updateError}>
                    <Text className='text-xl font-semibold text-white'>Assigned labels</Text>
                    {checkedIds && checkedIds.length > 0 ? (
                        <View className="flex-row flex-wrap mb-4">
                            {labels?.map((label) => (
                                checkedIds.includes(`${label.name}`) && (
                                    <Pressable
                                        key={label.name}
                                        onPress={() => toggleSwitch(`${label.name}`)}
                                        className='mx-2 my-2'
                                    >
                                        <Pills label={label.name} variant={label.color} />
                                    </Pressable>
                                )
                            ))}
                            {!labels?.some((label) => checkedIds.includes(`${label.name}`)) && (
                                <Text className='h-14 text-muted'>No labels assigned</Text>
                            )}
                        </View>
                    ) : (
                        <Text className='mb-4 text-muted'>No Labels</Text>
                    )}

                    <Separator className='my-4 bg-primary' />
                    <Text className='text-xl font-semibold text-white'>Project's labels</Text>

                    {labels && labels.length > 0 ? (
                        <View className="flex-row flex-wrap mb-4">
                            {labels.map((label: Label) => (
                                !checkedIds.includes(`${label.name}`) && (
                                    <Pressable
                                        key={label.name}
                                        onPress={() => toggleSwitch(`${label.name}`)}
                                        className='mx-2 my-2'
                                    >
                                        <Pills label={label.name} variant={label.color} />
                                    </Pressable>
                                )
                            ))}
                        </View>
                    ) : (
                        <Text className="h-12 mb-4 text-muted">No Labels</Text>
                    )}

                </EditParamMergeRequestDialog >
            </SectionTitle >
            {checkedIds && checkedIds.length > 0 ? (
                <View className="flex-row flex-wrap mb-4">
                    {labels?.map((label: Label) => (
                        checkedIds.includes(label.name.toString()) && (
                            <Pills key={label.name} label={label.name} variant={label.color} className="mb-2 mr-2" />
                        )
                    ))}
                </View>
            ) : (
                <Text className="h-12 mb-4 text-muted">No Labels</Text>
            )}
        </ScrollView>
    );
};
