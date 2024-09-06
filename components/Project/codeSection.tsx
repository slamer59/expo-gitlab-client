import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { ButtonList } from "@/components/buttonList";
import { ChooseBranches } from "@/components/ChooseBranche";

// interface for code
interface CodeSectionProps {
  selectedBranch: string;
  defaultBranchName: string;
  repoBranchesName: string[];
  handlValueChange: (value: string) => void;
  listItemsSecond: {
    icon: string;
    text: string;
    onPress: () => void;
  }[];
}

export const CodeSection = ({
  selectedBranch,
  defaultBranchName,
  repoBranchesName,
  handleValueChange,
  listItemsSecond,
}: CodeSectionProps) => (
  <View className="p-4 m-2 bg-gray-200 rounded-lg">
    <TouchableOpacity
      className="flex-row items-center justify-between py-2"
      onPress={() => { }}
    >
      <View className="flex flex-row items-center">
        <Ionicons name="code-slash-outline" size={24} color="black" />
        <Text className="ml-2 font-bold text-gray-950 ">
          {selectedBranch?.label || defaultBranchName}
        </Text>
      </View>
      <ChooseBranches
        branches={repoBranchesName}
        defaultValue={{
          value: defaultBranchName,
          label: defaultBranchName,
        }}
        handleValueChange={handleValueChange}
      />
    </TouchableOpacity>
    <ButtonList listItems={listItemsSecond} />
  </View>
);
