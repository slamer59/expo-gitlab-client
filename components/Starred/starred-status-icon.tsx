import { Ionicons } from "@expo/vector-icons";
import React from "react";

import { Text } from "@/components/ui/text";

export default function StarredStatusIcon(
    Starred: any,
    withText: boolean = false,
) {
    return (
        <>
            {Starred.state === "opened" ? (
                <>
                    <Ionicons name="git-pull-" size={24} color="green" />
                    {withText && (
                        <Text className="ml-1 font-semibold text-green-500">Open</Text>
                    )}
                </>
            ) : Starred.state === "closed" ? (
                <>
                    <Ionicons name="git-pull-" size={24} color="red" />
                    {withText && (
                        <Text className="ml-1 font-semibold text-red-500">Closed</Text>
                    )}
                </>
            ) : Starred.state === "locked" ? (
                <>
                    <Ionicons name="lock-closed" size={24} color="orange" />
                    {withText && (
                        <Text className="ml-1 font-semibold text-orange-500">Locked</Text>
                    )}
                </>
            ) : Starred.state === "Starredd" ? (
                <>
                    <Ionicons name="git-Starred" size={24} color="purple" />
                    {withText && (
                        <Text className="ml-1 font-semibold text-purple-500">Starredd</Text>
                    )}
                </>
            ) : (
                <>
                    <Ionicons name="help-circle" size={24} color="blue" />
                    {withText && (
                        <Text className="ml-1 font-semibold text-blue-500">Unknown</Text>
                    )}
                </>
            )}
        </>
    );
}
