import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { Pressable, View } from 'react-native';

export interface HeaderOption {
    icon: string;
    color?: string;
    label: string;
    onPress: () => void;
    testID?: string;
}

export interface HeaderAction {
    icon: string;
    color?: string;
    onPress: () => void;
    testID?: string;
}

export interface HeaderRightProps {
    actions?: HeaderAction[];
    options?: HeaderOption[];
    dropdownLabel?: string;
}

export function HeaderRight({ actions = [], options = [], dropdownLabel = "Options" }: HeaderRightProps) {
    return (
        <View className='flex-row items-center'>
            {actions.map((action, index) => (
                <Pressable
                    key={index}
                    onPress={action.onPress}
                    className='pl-2 pr-2 m-2'
                    testID={action.testID}
                >
                    {({ pressed }) => (
                        <Ionicons
                            name={action.icon}
                            size={25}
                            color={action.color || "white"}
                            className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`}
                        />
                    )}
                </Pressable>
            ))}

            {options.length > 0 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Pressable>
                            {({ pressed }) => (
                                <Ionicons
                                    name="ellipsis-vertical"
                                    size={25}
                                    color="white"
                                    className={`m-2 ml-2 mr-2 ${pressed ? 'opacity-50' : 'opacity-100'}`}
                                    testID="options"
                                />
                            )}
                        </Pressable>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-64 native:w-72'>
                        <DropdownMenuLabel>{dropdownLabel}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {options.map((option, index) => (
                                <DropdownMenuItem key={index} onPress={option.onPress} testID={option.testID}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons
                                            color={option.color || "white"}
                                            name={option.icon}
                                            size={20}
                                            style={{ marginRight: 10 }}
                                        />
                                        <Text>{option.label}</Text>
                                    </View>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </View>
    );
}
