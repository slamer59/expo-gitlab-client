import React from "react";
import { Text, View } from "react-native";

import { ButtonList } from "@/components/buttonList";


export const WorkspaceSection = ({ listItems }) => (
    <View className="p-4 m-2 rounded-lg bg-card">
        <Text className="text-lg font-semibold text-white">Workspace</Text>
        <ButtonList isSimple={false} listItems={listItems} />
    </View>
);