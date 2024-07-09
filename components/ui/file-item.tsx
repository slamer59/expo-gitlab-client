import { Text } from "@/components/ui/text";
import { FontAwesome5 } from '@expo/vector-icons';
import { Link } from "expo-router";
import React from 'react';
import { View } from 'react-native';

const FileItem = ({ type, name, href }) => {
    return (
        <Link href={href}>
            <View className="flex-row items-center">
                {type === 'tree' ? (
                    <FontAwesome5
                        name="folder"
                        size={32}
                        color="black"
                        className="mr-4"
                    />
                ) : (
                    <FontAwesome5
                        name="file-alt"
                        size={32}
                        color="gray"
                        className="mr-4"
                    />
                )}
                <Text className={type === 'tree' ? '' : 'text-gray-400'}>{name}</Text>
            </View>
        </Link>
    );
};

export default FileItem;
