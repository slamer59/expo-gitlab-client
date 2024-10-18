import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { Octicons } from "@expo/vector-icons";
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
    due_date?: Date;
    labels: string;
    assignee_id: string;
    milestone_id: string;
}

export default function CreateIssueForm({ projectId }: { projectId: string }) {
    const [alert, setAlert] = useState({ message: "", isOpen: false });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const router = useRouter();
    const { session } = useSession();

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const { useCreateProjectIssue } = useGitLab(client);
    const createIssueMutation = useCreateProjectIssue();

    const { control, handleSubmit: handleSave, formState: { errors }, reset } = useForm<IssueFormData>({
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
    const onSubmit = (data: IssueFormData) => {
        if (!projectId) {
            setAlert({ message: "Project ID is missing. Unable to create issue.", isOpen: true });
            return;
        }

        createIssueMutation.mutate({
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
                        className="mb-2 border-2 border-white bg-card"
                        aria-errormessage={!!errors.title}
                    />
                )}
                name="title"
            />

            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
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
                            className="border-2 border-white active:bg-card"
                            checked={value}
                            onCheckedChange={() => onChange(!value)}
                        />
                        <Text className="ml-2 font-semibold">Confidential</Text>
                    </View>
                )}
                name="confidential"
            />


            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <View>
                        <Button
                            onPress={() => setShowDatePicker(true)}
                            className="flex-row items-center justify-start w-full border-2 border-white rounded-md bg-card"
                        >
                            <Octicons name="calendar" size={16} color="white" style={{ marginRight: 8 }} />
                            <Text className="text-white">{value ? format(value, 'PPP') : 'Select Due Date'}</Text>
                        </Button>
                        {showDatePicker && (
                            <DateTimePicker
                                value={value || new Date()}
                                mode="date"
                                display="default"
                                themeVariant="dark"
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

            {/* <Controller
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
            />

            <Controller
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
            />

            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        placeholder="Milestone ID"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        className="mb-2"
                    />
                )}
                name="milestone_id"
            /> */}
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

            {/* <Button
                onPress={handleSave(onSubmit)}
                disabled={createIssueMutation.isLoading}
                className="mt-4"
            >
                <Text>{createIssueMutation.isLoading ? "Creating..." : "Create Issue"}</Text>
            </Button> */}

            <View className="flex flex-row justify-start mt-4 mb-2 space-x-2">
                <Button
                    variant="destructive"
                    onPress={handleSave(onSubmit)}
                    className='m-2'
                    disabled={createIssueMutation.isLoading}
                >
                    <Text>{createIssueMutation.isLoading ? "⏳  Loading   " : "Save changes"}</Text>
                </Button>
                <Button
                    variant="outline"
                    onPress={() => router.back()}
                    className='m-2'
                    disabled={createIssueMutation.isLoading}
                >
                    <Text>Cancel</Text>
                </Button>
            </View>
        </>
    );
}

