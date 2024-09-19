import { Label } from "@rn-primitives/select";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Text } from "../ui/text";
import { Textarea } from "../ui/textarea";

export function EditTitleDescriptionIssueBlock({ issue, updateIssue, projectId, issue_iid }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [issueType, setIssueType] = useState('issue');
    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 12,
        right: 12,
    };

    useEffect(() => {
        if (issue) {
            setTitle(issue.title || '');
            setDescription(issue.description || '');
            setIssueType(issue.issue_type || 'issue');
        }
    }, [issue]);

    const handleCancel = useCallback(() => {
        setTitle(issue.title || '');
        setDescription(issue.description || '');
        setIssueType(issue.issue_type || 'issue');
    }, [issue]);

    const handleSave = useCallback(() => {
        const updatedData = {
            title,
            description,
            issue_type: issueType,
        };
        updateIssue(updatedData);
    }, [title, description, issueType, updateIssue]);

    return (
        <>
            <View className="mb-4">
                <Label nativeID='title' className="mb-2 font-bold text-white">Title</Label>
                <Input
                    placeholder="Issue Title"
                    className="text-white"
                    value={title}
                    onChangeText={setTitle}
                    aria-labelledby="title"
                    aria-errormessage='titleInputError'
                    testID="input-title"
                />
            </View>
            <View className="mb-4">
                <Select
                    value={issueType}
                    onValueChange={setIssueType}
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
                <Textarea
                    placeholder="Issue Description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                />
            </View>
            <View className="flex flex-row justify-start mt-4 mb-2 space-x-2">
                <Button
                    variant="destructive"
                    onPress={handleSave}
                    className='m-2'
                >
                    <Text>Save changes</Text>
                </Button>
                <Button
                    variant="outline"
                    onPress={handleCancel}
                    className='m-2'
                >
                    <Text>Cancel</Text>
                </Button>
            </View>
        </>
    );
}
