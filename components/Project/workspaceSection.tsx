import React from "react";
import { Text, View } from "react-native";

import { ButtonList } from "@/components/buttonList";


export const WorkspaceSection = ({ listItems }) => (
    <View className="p-4 mt-4 mb-4 rounded-lg bg-card-600">
        <Text className="text-lg font-semibold text-white">Workspace</Text>
        <ButtonList isSimple={false} listItems={listItems} />
    </View>
);