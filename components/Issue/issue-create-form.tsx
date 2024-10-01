import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Label } from "@rn-primitives/select";
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import InfoAlert from "../InfoAlert";
import EnhancedMarkdownEditor from "../markdown-editor";

// Replace these with your actual GitLab API base URL and access token
const GITLAB_API_BASE_URL = 'https://gitlab.com/api/v4';
const GITLAB_ACCESS_TOKEN = 'GITLAB_PAT_REMOVED';

interface IssueFormData {
    title: string;
    description: string;
    confidential: boolean;
    due_date: Date | undefined;
    labels: string;
    assignee_id: string;
    milestone_id: string;
    // weight: string;
}

interface CreateIssueResponse {
    id: number;
    iid: number;
    title: string;
    // Add other response fields as needed
}

export default function CreateIssueForm({ projectId, members, milestones, labels }: { projectId: string, members: any[], milestones: any[], labels: any[] }) {
    const [alert, setAlert] = useState({ message: "", isOpen: false });
    const router = useRouter();
    const { control, handleSubmit, formState: { errors }, reset } = useForm<IssueFormData>({
        defaultValues: {
            title: '',
            description: '',
            confidential: false,
            due_date: undefined,
            labels: '',
            assignee_id: '',
            milestone_id: '',
            // weight: '',
        },
    });

    const [showDatePicker, setShowDatePicker] = useState(false);

    const createIssueMutation = useMutation<CreateIssueResponse, Error, IssueFormData>({
        mutationFn: (data) =>
            axios.post(`${GITLAB_API_BASE_URL}/projects/${projectId}/issues`, {
                ...data,
                due_date: data.due_date ? format(data.due_date, 'yyyy-MM-dd') : undefined,
            }, {
                headers: {
                    'PRIVATE-TOKEN': GITLAB_ACCESS_TOKEN,
                },
            }).then(response => response.data),
        onSuccess: (data) => {
            // Alert.alert('Success', `Issue #${data.iid} has been successfully created.`);
            setAlert({ message: `Issue #${data.iid} has been successfully created.`, isOpen: true });
            reset();
            router.push(`/workspace/projects/${projectId}/issues/${data.iid}`);
        },
        onError: (error) => {
            // Alert.alert('Error', `Failed to create issue: ${error.message}`);
            setAlert({ message: `Failed to create issue: ${error.message}`, isOpen: true });
        },
    });

    const onSubmit = (data: IssueFormData) => {
        createIssueMutation.mutate(data);
    };

    return (
        <>
            <InfoAlert
                isOpen={alert.isOpen}
                onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
                title="Information"
                message={alert.message}
            />
            <Text className="mb-4 text-4xl font-bold">Create Issue</Text>
            <Controller
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        placeholder="Title"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        className="mb-2"
                        aria-errormessage={!!errors.title}
                    />
                )}
                name="title"
            />

            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View className="mb-2">
                        <Label nativeID='description' className="mb-2 text-xl font-semibold text-white">Description</Label>
                        <EnhancedMarkdownEditor
                            projectId={projectId}
                            markdown={value}
                            onChangeText={onChange}
                        />
                    </View>
                )}
                name="description"
            />

            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <View className="flex-row items-center mb-4">
                        <Checkbox
                            checked={value}
                            onCheckedChange={() => onChange(!value)}
                        />
                        <Text className="ml-2">Confidential</Text>
                    </View>
                )}
                name="confidential"
            />

            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <View>
                        <Button onPress={() => setShowDatePicker(true)} className="mb-4">
                            <Text>{value ? format(value, 'PPP') : 'Select Due Date'}</Text>
                        </Button>
                        {showDatePicker && (
                            <DateTimePicker
                                value={value || new Date()}
                                mode="date"
                                display="calendar"
                                themeVariant="light"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) {
                                        onChange(selectedDate);
                                    }
                                }}
                            />
                        )}
                    </View>
                )}
                name="due_date"
            />

            {labels && <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        placeholder="Labels (comma-separated)"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        className="mb-2"
                    />
                )}
                name="labels"
            />}

            {members && <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        placeholder="Assignee ID"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType="numeric"
                        className="mb-2"
                    />
                )}
                name="assignee_id"
            />}
            {/* Add milestone */}
            {milestones && <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        placeholder="Milestone"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        className="mb-2"
                    />
                )
                }
                name="milestone_id"
            />}
            {/* Premium and ultimate */}
            {/* <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        placeholder="Weight"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType="numeric"
                        className="mb-2"
                    />
                )}
                name="weight"
            /> */}

            <Button
                onPress={handleSubmit(onSubmit)}
                disabled={createIssueMutation.isPending}
                className="mt-4"
            >
                <Text>{createIssueMutation.isPending ? "Creating..." : "Create Issue"}</Text>
            </Button>
        </>
    );
}
