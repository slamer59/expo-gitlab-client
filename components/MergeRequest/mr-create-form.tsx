import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useGitLab } from "@/lib/gitlab/future/hooks/useGitlab";
import GitLabClient from "@/lib/gitlab/gitlab-api-wrapper";
import { useSession } from "@/lib/session/SessionProvider";
import { Label } from "@rn-primitives/select";
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from "react-native";
import { ChooseBranches } from "../ChooseBranche";
import InfoAlert from "../InfoAlert";
import EnhancedMarkdownEditor from "../markdown-editor";
import { Input } from "../ui/input";
import { SelectSeparator } from "../ui/select";

interface MergeRequestFormData {
    title: string;
    description: string;
    sourceBranch: string,
    targetBranch: string,
    // confidential: boolean;
    // due_date: Date | undefined;
    // labels: string;
    // assignee_id: string;
    // milestone_id: string;
    // weight: string;
}
// projectId: string; sourceBranch: string; targetBranch: string; title: string; options
interface CreateMergeRequestResponse {
    id: number;
    iid: number;
    title: string;
    // Add other response fields as needed
}

export default function CreateMergeRequestForm({ projectId, mrDescription, branches, members, milestones, labels }: any) {
    console.log("🚀 ~ CreateMergeRequestForm ~ mrDescription:", mrDescription)
    const { targetBranchName, branchesName, defaultBranchName } = branches
    const [alert, setAlert] = useState({ message: "", isOpen: false });
    const router = useRouter();

    const { session } = useSession()

    const client = new GitLabClient({
        url: session?.url,
        token: session?.token,
    });

    const api = useGitLab(client);
    const createMergeRequestMutation = api.useCreateProjectMergeRequest();

    const { control, handleSubmit: handleSave, formState: { errors }, watch, reset } = useForm<MergeRequestFormData>({

        defaultValues: {
            title: mrDescription?.title || "",
            description: mrDescription?.description || "",
            // title: `${title ? `Draft: Resolve "${title}"` : ''}`,
            // description: `${mrIid ? `Closes #${issueIid}` : ""}`,
            sourceBranch: defaultBranchName,
            targetBranch: targetBranchName,
            // confidential: false,
            // due_date: undefined,
            // labels: '',
            // assignee_id: '',
            // milestone_id: '',
            // weight: '',
        },
    });

    const onSubmit = (data: MergeRequestFormData) => {
        if (!projectId) {
            setAlert({ message: "Project ID is missing. Unable to create issue.", isOpen: true });
            return;
        }

        createMergeRequestMutation.mutate(
            {
                projectId: projectId,
                ...data,
                sourceBranch: data.sourceBranch?.label || data.sourceBranch,
            }, {
            onSuccess: (data) => {
                setAlert({ message: `Issue #${data.iid} has been successfully created.`, isOpen: true });
                reset();
                router.push(`/workspace/projects/${projectId}/merge-requests/${data.iid}`);
            },
            onError: (error, data) => {
                let errorMessage = error.message
                // Check for 409 conflict error
                if (errorMessage.includes('409')) {
                    setAlert({
                        message: `These branches already have an open merge request. Select a different source or target branch.`,
                        isOpen: true
                    });
                    return;
                }
                // For other errors
                setAlert({ message: `Failed to create merge request: ${errorMessage}`, isOpen: true });
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
            <Text className="mb-4 text-4xl font-bold">Create MergeRequest</Text>

            <Controller
                control={control}
                rules={{ required: 'Source Branch is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <View className="justify-between mb-4">
                            <Label className="mb-2 text-xl font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70" nativeID={''}>
                                Source Branch
                            </Label>
                            <ChooseBranches
                                branches={branchesName}
                                defaultValue={{
                                    value: defaultBranchName,
                                    label: defaultBranchName,
                                }}
                                handleValueChange={onChange}
                                placeholder={<Label className="mb-2 text-xl font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70" nativeID={''}>
                                    Select
                                </Label>}
                            />
                        </View>
                    </>
                )}
                name="sourceBranch"
            />
            <>
                <View className="justify-between mb-4">

                    <Label className="mb-2 text-xl font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70" nativeID={''}>
                        Target Branch
                    </Label>
                    <Input editable={false} className='mb-2' value={targetBranchName} />
                    {/* <EditTitleDescriptionMergeRequestBlock updateMergeRequest={createMergeRequest} mr={mr} projectId={projectId} mr_iid={issueIid} /> */}
                </View>

            </>
            <SelectSeparator className="my-2" />
            <Controller
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        placeholder="Title"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        className="mb-2 border-2 border-white"
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
            {/* 
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
            />} */}
            {/* Add milestone */}
            {/* {milestones && <Controller
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
            />} */}
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
            <View className="flex flex-row justify-start mt-4 mb-2 space-x-2">
                <Button
                    variant="destructive"
                    onPress={handleSave(onSubmit)}
                    className='m-2'
                    disabled={createMergeRequestMutation.isLoading}
                >
                    <Text>{createMergeRequestMutation.isLoading ? "⏳  Loading   " : "Save changes"}</Text>
                </Button>
                <Button
                    variant="outline"
                    onPress={() => router.back()}
                    className='m-2'
                    disabled={createMergeRequestMutation.isLoading}
                >
                    <Text>Cancel</Text>
                </Button>
            </View>
        </>
    );
}
