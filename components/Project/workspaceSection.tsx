import React from "react";
import { Text, View } from "react-native";

import { ButtonList } from "@/components/buttonList";


export const WorkspaceSection = ({ listItems }) => (
    <View className="p-4 m-2 bg-gray-200 rounded-lg">
        <Text className="text-lg font-[600]">Workspace</Text>
        <ButtonList isSimple={false} listItems={listItems} />
    </View>
);