import React, { useCallback, useState } from "react";
import { Keyboard, View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { Textarea } from "../ui/textarea";

export function EditProjectDescription({ project, updateProject }) {
    const [description, setDescription] = useState(project?.description || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = useCallback(async () => {
        console.log("Save button clicked");
        Keyboard.dismiss();

        setIsLoading(true);
        try {
            await updateProject(description);
        } catch (error) {
            console.error("Error updating project description:", error);
        } finally {
            setIsLoading(false);
        }
    }, [description, updateProject]);

    const handleCancel = useCallback(() => {
        setDescription(project?.description || '');
    }, [project]);

    return (
        <>
            <View className="mb-2">
                <Text className="mb-2 text-xl font-semibold text-white">Description</Text>
                <Textarea
                    placeholder="Project Description"
                    value={description}
                    onChangeText={setDescription}
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
