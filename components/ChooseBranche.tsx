import * as React from "react";
import { Platform, Text } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

type ChooseBranchesProps = {
    branches: string[];
    defaultValue: { value: string; label: string };
    handleValueChange: (value: string) => void;
    placeholder?: any;
};

export function ChooseBranches({ branches, defaultValue, handleValueChange, placeholder }: ChooseBranchesProps) {

    const [selectedBranch, setSelectedBranch] = React.useState(defaultValue.value);

    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
        left: 12,
        right: 12,
    };

    const onValueChange = (value: string) => {
        setSelectedBranch(value);
        handleValueChange(value);
    };

    return (
        <Select
            defaultValue={{ value: defaultValue.value, label: defaultValue.label }}
            // className='w-[250px]'
            onValueChange={(value) => onValueChange(value)}
        >
            <SelectTrigger className='web:flex h-10 native:h-12 web:w-full rounded-md border border-input bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2'>
                {/* <SelectValue
                    className='text-sm text-foreground native:text-lg'
                    placeholder='Select a fruit'
                /> */}
                {/* <Text className="ml-2 text-right text-white">
                    {placeholder ? placeholder : "SELECT BRANCH"}
                </Text> */}
                <SelectValue
                    className='text-sm text-foreground native:text-lg'
                    placeholder={placeholder || "SELECT BRANCH"}>
                    <Text className="ml-2 font-bold text-right text-white">
                        {selectedBranch}
                    </Text>
                </SelectValue>
            </SelectTrigger>
            <SelectContent insets={contentInsets} className='w-[250px]  mt-1 font-bold '>
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
