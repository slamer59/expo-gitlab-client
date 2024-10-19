import { Label } from "@rn-primitives/select";
import React, { useCallback, useEffect, useState } from "react";
import { Keyboard, View } from "react-native";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { Textarea } from "../ui/textarea";

export function EditTitleDescriptionMergeRequestBlock({ mr, updateMergeRequest, projectId, mr_iid }) {
    const [formData, setFormData] = useState({
        title: mr?.title || '',
        description: mr?.description || '',
        // draft: mr?.draft || false
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (mr) {
            setFormData({
                title: mr.title || '',
                description: mr.description || '',
                // draft: mr.draft || false
            });
        }
    }, [mr]);

    const handleCancel = useCallback(() => {
        setFormData({
            title: mr.title || '',
            description: mr.description || '',
            // draft: mr.draft || false
        });
    }, [mr]);

    const handleSave = useCallback(async () => {
        console.log("Save button clicked");
        Keyboard.dismiss();

        setIsLoading(true);
        const updatedData = {
            title: formData.title,
            description: formData.description,
            // draft: formData.draft,
        };
        try {
            await updateMergeRequest(updatedData);
        } catch (error) {
            console.error("Error updating mr:", error);
        } finally {
            setIsLoading(false);
        }
    }, [formData.title, formData.description, updateMergeRequest]);

    // const handleDraftChange = useCallback(async (checked: boolean) => {
    //     setIsLoading(true);
    //     const updatedData = {
    //         title: formData.title,
    //         description: formData.description,
    //         draft: checked,
    //     };
    //     try {
    //         await updateMergeRequest(updatedData);
    //         setFormData(prev => ({ ...prev, draft: checked }));
    //     } catch (error) {
    //         console.error("Error updating draft status:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, [updateMergeRequest]);

    return (
        <>
            <View className="mb-4">
                <Label nativeID='title' className="mb-2 text-xl font-semibold text-white">Title</Label>
                <Input
                    placeholder="MergeRequest Title"
                    className="text-white"
                    value={formData.title}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                    aria-labelledby="title"
                    aria-errormessage='titleInputError'
                    testID="mr-input-title"
                />
            </View>
            <View className="mb-4">
                {/* <View className='flex-row items-center gap-3'>
                    <Checkbox
                        aria-labelledby='mark-as-draft'
                        checked={formData.draft}
                        onCheckedChange={handleDraftChange}
                        disabled={isLoading}
                    />
                    <Label nativeID='mark-as-draft' className="text-white" onPress={() => !isLoading && handleDraftChange(!formData.draft)}>
                        Mark as draft
                    </Label>
                </View> */}
            </View>
            <View className="mb-2">
                <Label nativeID='description' className="mb-2 text-xl font-semibold text-white">Description</Label>

                <Textarea
                    placeholder="MergeRequest Description"
                    value={formData.description}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                    testID="mr-description-input"
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
