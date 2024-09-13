
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import GitLabClient from '@/lib/gitlab/gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';

import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Pills } from '../Pills';
import { SectionTitle } from '../Section/param';
import { EditParamIssueDialog } from './issue-edit-param';


export default function EditLabelIssue({ projectId, issueIid }) {

    const { session } = useSession()
    const api = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const { data: issue, loading, error } = api.useProjectIssue(projectId, issueIid) ?? {};
    const { execute: updateIssue, loading: updating, error: updateError } = api.useUpdateProjectIssue(projectId, issueIid);
    const { data: labels, loading: labelsLoading, error: labelsError } = api.useProjectLabels(projectId);

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
        await updateIssue({
            labels: checkedIds,
        });
    };
    useEffect(() => {

        if (issue) {
            setCheckedIds(issue.labels)
        }
    }, [loading, issue]);

    return (
        <ScrollView>
            {/* {loading && <Loading />}; */}

            <SectionTitle title="Labels">
                {/* <Text className='text-white'>{JSON.stringify(checkedIds)}</Text> */}
                <EditParamIssueDialog title="Labels" handleSave={handleSave} loading={updating} error={updateError}>
                    <Text className='text-xl font-semibold text-white'>Assigned labels</Text>
                    {checkedIds && checkedIds.length > 0 ? (
                        <View className="flex-row flex-wrap mb-4">
                            {labels?.map((label) => (
                                checkedIds.includes(`${label.name}`) && (
                                    <Button
                                        key={label.name}
                                        variant="icon"
                                        onPress={() => toggleSwitch(`${label.name}`)}
                                    >
                                        <Pills label={label.name} variant={label.color} />
                                    </Button>
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
                                    <Button
                                        key={label.name}
                                        variant="icon"
                                        onPress={() => toggleSwitch(`${label.name}`)}
                                    >
                                        <Pills label={label.name} variant={label.color} />
                                    </Button>
                                )
                            ))}
                        </View>
                    ) : (
                        <Text className="h-12 mb-4 text-muted">No Labels</Text>
                    )}

                </EditParamIssueDialog >
            </SectionTitle >
            {checkedIds && checkedIds.length > 0 ? (
                <View className="flex-row flex-wrap mb-4">
                    {labels?.map((label: Label) => (
                        checkedIds.includes(label.name.toString()) && (
                            <Pills key={label.name} label={label.name} variant={label.color} />
                        )
                    ))}
                </View>
            ) : (
                <Text className="h-12 mb-4 text-muted">No Labels</Text>
            )}
        </ScrollView>
    );
};

