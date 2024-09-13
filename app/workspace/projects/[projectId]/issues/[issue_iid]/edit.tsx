import EditParamIssue from '@/components/Issue/issue-edit-param';
import { Pills } from '@/components/Pills';
import { SectionContent, SectionTitle } from '@/components/Section/param';
import { Text } from '@/components/ui/text';
import { defaultOptionsHeader } from '@/lib/constants';
import GitLabClient from '@/lib/custom-gitlab-api-wrapper';
import { useSession } from '@/lib/session/SessionProvider';
import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';


export default function TaskDetailsComponent() {
    const { session } = useSession()
    const api = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });
    const projectId = 59795263
    const issueIid = 30;
    const { data: issue, loading, error } = api.useProjectIssue(projectId, issueIid) ?? {};

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <>
            <Stack.Screen
                options={{
                    title: `Edit issues ###`,
                    ...defaultOptionsHeader,
                }}
            />
            <ScrollView className="flex-1 p-4 bg-background">
                <EditParamIssue projectId={projectId} issueIid={issueIid} />


                <SectionTitle title="Labels" />
                <View className="flex-row flex-wrap mb-4">
                    <Pills label="enhancement" variant="green" />
                    <Pills label="kind/cooldown" variant="purple" />
                    <Pills label="kind/good-first-issue" variant="purple" />
                </View>

                <SectionTitle title="Milestone" />
                <SectionContent content="No milestone selected" />

                <SectionTitle title="Linked items" />
                <SectionContent content="No linked items" />

                {/* <SectionTitle title="Projects" />
                <View className="p-4 rounded-lg bg-card">
                    <ProjectField title="Issues" value=">" />
                    <ProjectField title="Status" value="Backlog" locked={true} />
                    <ProjectField title="Release" value="v9.99.9" locked={true} />
                    <ProjectField title="Priority" value="P3: Could Have" locked={true} />
                    <ProjectField title="Appetite" value="Edit" locked={true} />
                    <ProjectField title="Next steps" value="Edit" locked={true} />
                    <ProjectField title="Validated" value="Edit" locked={true} />
                    <ProjectField title="Marketing" value="Edit" locked={true} />
                    <ProjectField title="1.0" value="Edit" locked={true} />
                </View> */}
            </ScrollView>
        </>
    );
};

