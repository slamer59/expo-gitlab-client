import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { ButtonList } from "@/components/buttonList";
import { ChooseBranches } from "@/components/ChooseBranche";

// interface for code
interface CodeSectionProps {
  selectedBranch: string;
  defaultBranchName: string;
  branchesName: string[];
  handleValueChange: (value: string) => void;
  listItemsSecond: {
    icon: string;
    text: string;
    onPress: () => void;
  }[];
}

export const CodeSection = ({
  selectedBranch,
  defaultBranchName,
  branchesName,
  handleValueChange,
  listItemsSecond,
}: CodeSectionProps) => (

  <View className="p-4 mt-4 mb-4 rounded-lg bg-card-600">
    <TouchableOpacity
      className="flex-row items-center justify-between py-2"
      onPress={() => { }}
    >
      <View className="flex flex-row items-center">
        <Ionicons name="git-branch-outline" size={24} color="white" />
        <Text className="ml-2 font-bold text-white truncate max-w-[120px]">
          {selectedBranch?.label || defaultBranchName}
        </Text>
      </View>
      <ChooseBranches
        branches={branchesName}
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
