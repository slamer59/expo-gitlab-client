import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { View } from "react-native";
import { Input } from "./ui/input";

const contentInsets = { padding: "1rem" };

type ChooseBranchesProps = {
    branches: string[];
};

export function ChooseBranches({ branches }: ChooseBranchesProps) {
    const [value, setValue] = React.useState("");

    const onChangeText = (text: string) => {
        setValue(text);
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Text className="ml-2 font-bold text-right text-blue-500">
                        CHANGE BRANCH
                    </Text>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                insets={contentInsets}
                className="w-64 native:w-72"
            >
                <DropdownMenuLabel>Choose Branch</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <View className="flex-row items-center">
                    <Ionicons name="search" size={20} color="#000" />
                    <Input
                        className="w-full h-10 ml-2"
                        placeholder="Branches..."
                        value={value}
                        onChangeText={onChangeText}
                        aria-labelledby="inputLabel"
                        aria-errormessage="inputError"
                    />
                </View>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>

                    {branches.map((branch, index) => (
                        <DropdownMenuItem key={index}>
                            <Text>{branch}</Text>
                        </DropdownMenuItem>
                    ))}

                </DropdownMenuGroup>

            </DropdownMenuContent>
        </DropdownMenu >
    );
}
