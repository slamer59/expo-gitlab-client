import { Label } from "@rn-primitives/select";
import React, { useCallback, useEffect, useState } from "react";
import { Keyboard, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Text } from "../ui/text";
import { Textarea } from "../ui/textarea";

export function EditTitleDescriptionIssueBlock({ issue, updateIssue }) {
    const [formData, setFormData] = useState({
        title: issue.title || '',
        description: issue?.description || '',
        issueType: issue?.issue_type || 'issue'
    });

    const [isLoading, setIsLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 12,
        right: 12,
    };

    useEffect(() => {
        if (issue) {
            setFormData({
                title: issue.title || '',
                description: issue.description || '',
                issueType: issue.issue_type || 'issue'
            });
        }
    }, [issue]);

    const handleCancel = useCallback(() => {
        setFormData({
            title: issue.title || '',
            description: issue.description || '',
            issueType: issue.issue_type || 'issue'
        });
    }, [issue]);

    const handleSave = useCallback(async () => {
        console.log("Save button clicked");
        Keyboard.dismiss();

        setIsLoading(true);
        const updatedData = {
            title: formData.title,
            description: formData.description,
            issue_type: formData.issueType,
        };
        try {
            await updateIssue(updatedData);
        } catch (error) {
            console.error("Error updating issue:", error);
        } finally {
            setIsLoading(false);
        }
    }, [formData.title, formData.description, formData.issueType, updateIssue]);

    return (
        <>
            <View className="mb-4">
                <Label nativeID='title' className="mb-2 text-xl font-semibold text-white">Title</Label>
                <Input
                    placeholder="Issue Title"
                    className="text-white"
                    value={formData.title}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                    aria-labelledby="title"
                    aria-errormessage='titleInputError'
                    testID="input-title"
                />
            </View>
            <View className="mb-4">
                <Select
                    onValueChange={(value) => setFormData(prev => ({ ...prev, issueType: value?.value }))}
                    defaultValue={{
                        label: formData.issueType ? formData.issueType.charAt(0).toUpperCase() + formData.issueType.slice(1) : "Issue",
                        value: formData.issueType || "issue"
                    }}
                    aria-labelledby="issue-type"
                    aria-errormessage='issueTypeInputError'
                    testID="select-issue-type"
                    className='mt-4 font-bold bg-card-500'
                >
                    <SelectTrigger className='w-full'>
                        <SelectValue
                            className='text-sm text-foreground native:text-lg'
                            placeholder='Select an issue type'
                        />
                    </SelectTrigger>
                    <SelectContent insets={contentInsets} className='w-full'>
                        <SelectGroup>
                            <SelectLabel>Issue Type</SelectLabel>
                            <SelectItem label='Issue' value='issue'>Issue</SelectItem>
                            <SelectItem label='Incident' value='incident'>Incident</SelectItem>
                            <SelectItem label='Test Case' value='test_case'>Test Case</SelectItem>
                            <SelectItem label='Task' value='task'>Task</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </View>
            <View className="mb-2">
                <Label nativeID='description' className="mb-2 text-xl font-semibold text-white">Description</Label>

                <Textarea
                    placeholder="Issue Description"
                    value={formData.description}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}

                // multiline
                // numberOfLines={4}
                />
            </View>
            <View className="flex flex-row justify-start mt-4 mb-2 space-x-2">
                <Button
                    variant="destructive"
                    onPress={handleSave}
                    className='m-2'
                    disabled={isLoading}
                >
                    <Text>{isLoading ? "⏳  Loading   " : "Save changes"}</Text>
                </Button>
                <Button
                    variant="outline"
                    onPress={handleCancel}
                    className='m-2'
                    disabled={isLoading}
                >
                    <Text>Cancel</Text>
                </Button>
            </View>
        </>
    );
}
