import * as React from "react";
import { Platform, Text } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "./ui/select";

type ChooseBranchesProps = {
    branches: string[];
    defaultValue: { value: string; label: string };
    handleValueChange: (value: string) => void;
};

export function ChooseBranches({ branches, defaultValue, handleValueChange }: ChooseBranchesProps) {

    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
        left: 12,
        right: 12,
    };
    return (
        <Select
            defaultValue={{ value: defaultValue.value, label: defaultValue.label }}

            // className='w-[250px]'
            onValueChange={(value) => handleValueChange(value)}
        >
            <SelectTrigger className='w-[200px] flex-row items-center justify-center flex-1 rounded-3xl'>
                {/* <SelectValue
                    className='text-sm text-foreground native:text-lg'
                    placeholder='Select a fruit'
                /> */}
                <Text className="ml-2 font-bold text-right text-white">
                    SELECT BRANCH
                </Text>
            </SelectTrigger>
            <SelectContent insets={contentInsets} className='w-[250px]  mt-1 font-bold rounded-2xl '>


                <SelectGroup>
                    <ScrollView className='max-h-64'>
                        <SelectLabel>
                            Branches name
                            {/* <View className="flex-row items-center">
                            <Ionicons name="search" size={20} color="#000" />
                            <Input
                                className="w-full h-10 ml-2"
                                placeholder="Branches..."
                                value={value}
                                onChangeText={onChangeText}
                                aria-labelledby="inputLabel"
                                aria-errormessage="inputError"
                            />
                        </View> */}
                        </SelectLabel>
                        {/* https://github.com/mrzachnugent/react-native-reusables/blob/main/apps/showcase/app/select.tsx */}
                        {branches?.map((branch, index) => (
                            <SelectItem
                                key={index}
                                label={branch}
                                value={index}
                            >
                                {branch}
                            </SelectItem>
                        ))
                        }
                    </ScrollView>
                </SelectGroup>


            </SelectContent>
        </Select>

        // <DropdownMenu>
        //     <DropdownMenuTrigger asChild>
        //         <Button variant="outline">
        //             <Text className="ml-2 font-bold text-right text-blue-500">
        //                 CHANGE BRANCH
        //             </Text>
        //         </Button>
        //     </DropdownMenuTrigger>
        //     <DropdownMenuContent
        //         insets={contentInsets}
        //         className="w-64 native:w-72"
        //     >
        //         <DropdownMenuLabel>Choose Branch</DropdownMenuLabel>
        //         <DropdownMenuSeparator />
        //         <View className="flex-row items-center">
        //             <Ionicons name="search" size={20} color="#000" />
        //             <Input
        //                 className="w-full h-10 ml-2"
        //                 placeholder="Branches..."
        //                 value={value}
        //                 onChangeText={onChangeText}
        //                 aria-labelledby="inputLabel"
        //                 aria-errormessage="inputError"
        //             />
        //         </View>
        //         <DropdownMenuSeparator />

        //         <DropdownMenuGroup>

        //             {branches.map((branch, index) => (
        //                 <DropdownMenuItem key={index}>
        //                     <Text>{branch}</Text>
        //                 </DropdownMenuItem>
        //             ))}

        //         </DropdownMenuGroup>

        //     </DropdownMenuContent>
        // </DropdownMenu >
    );
}
