import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Label } from "@rn-primitives/select";
import { format } from 'date-fns';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import InfoAlert from "../InfoAlert";
import EnhancedMarkdownEditor from "../markdown-editor";

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

export default function CreateIssueForm({ projectId, members, milestones, labels }: { projectId: string, members: any[], milestones: any[], labels: any[] }) {
    const [alert, setAlert] = useState({ message: "", isOpen: false });
    const router = useRouter();

    const { session } = useSession()

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);

    const { mutate: createIssue, isLoading: isCreatingIssue, error: createIssueError } = api.useCreateProjectIssue();


    const { control, handleSubmit, formState: { errors }, reset } = useForm<IssueFormData>({
        defaultValues: {
            title: '',
            description: '',
            confidential: false,
            due_date: undefined,
            labels: '',
            assignee_id: '',
            milestone_id: '',
        },
    });

    const [showDatePicker, setShowDatePicker] = useState(false);

    const onSubmit = (data: IssueFormData) => {
        if (!projectId) {
            setAlert({ message: "Project ID is missing. Unable to create issue.", isOpen: true });
            return;
        }

        createIssue({
            projectId,
            ...data,
            due_date: data.due_date ? format(data.due_date, 'yyyy-MM-dd') : undefined,
        }, {
            onSuccess: (data) => {
                setAlert({ message: `Issue #${data.iid} has been successfully created.`, isOpen: true });
                reset();
                router.push(`/workspace/projects/${projectId}/issues/${data.iid}`);
            },
            onError: (error) => {
                setAlert({ message: `Failed to create issue: ${error.message}`, isOpen: true });
            }
        });
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
                disabled={isCreatingIssue}
                className="mt-4"
            >
                <Text>{isCreatingIssue ? "Creating..." : "Create Issue"}</Text>
            </Button>
        </>
    );
}
