import { Text } from '@/components/ui/text';
import { Label } from '@rn-primitives/select';
import { default as React, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Switch } from '~/components/ui/switch';

export const GitLabNotificationSettings = () => {
    const [notifications, setNotifications] = useState({
        all: false,
        issues: false,
        mergeRequests: false,
        pipelineFailures: false,
        approvals: false,
    });

    const toggleSwitch = (key: string) => {
        setNotifications(prevState => {
            const newState = {
                ...prevState,
                [key]: !prevState[key as keyof typeof notifications]
            };
            // If any of the other switches are toggled, update the 'all' switch
            if (key !== 'all') {
                newState.all = newState.issues && newState.mergeRequests && newState.pipelineFailures && newState.approvals;
            }
            // If 'all' is toggled, set all other switches to the same value
            else {
                newState.issues = newState.all;
                newState.mergeRequests = newState.all;
                newState.pipelineFailures = newState.all;
                newState.approvals = newState.all;
            }
            return newState;
        });
    };


    const renderSwitch = (key: string, label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined) => (
        <View className="flex-row items-center justify-between py-3 mb-1">
            <Label
                nativeID={`${key}-mode`}
                onPress={() => {
                    () => toggleSwitch(key);
                }}
            >
                {label}
            </Label>
            <View className='flex-row items-center gap-2'>
                <Switch
                    checked={notifications[key as keyof typeof notifications]}
                    onCheckedChange={() => toggleSwitch(key)}
                    nativeID={`${key}-mode`}
                />
            </View>
        </View>
    );
    console.log(notifications);
    return (
        <ScrollView className="p-4 m-1 bg-gray-200 rounded-lg">
            <Text className="mb-5 text-2xl font-bold">GitLab Notification Settings</Text>
            {renderSwitch('all', 'All Notifications')}
            {renderSwitch('issues', 'Issues')}
            {renderSwitch('mergeRequests', 'Merge Requests')}
            {renderSwitch('pipelineFailures', 'Pipeline Failures')}
            {renderSwitch('approvals', 'Approvals')}
        </ScrollView>
    );
};