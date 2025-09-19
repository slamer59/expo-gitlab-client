import { Ionicons } from "@expo/vector-icons";
import React from "react";

import { Text } from "@/components/ui/text";

export default function MergeRequestStatusIcon(
    MergeRequest: any,
    withText: boolean = false,
) {
    return (
        <>
            {MergeRequest.state === "opened" ? (
                <>
                    <Ionicons name="git-pull-request" size={24} color="green" />
                    {withText && (
                        <Text className="ml-1 font-semibold text-green-500">Open</Text>
                    )}
                </>
            ) : MergeRequest.state === "closed" ? (
                <>
                    <Ionicons name="git-pull-request" size={24} color="red" />
                    {withText && (
                        <Text className="ml-1 font-semibold text-red-500">Closed</Text>
                    )}
                </>
            ) : MergeRequest.state === "locked" ? (
                <>
                    <Ionicons name="lock-closed" size={24} color="orange" />
                    {withText && (
                        <Text className="ml-1 font-semibold text-orange-500">Locked</Text>
                    )}
                </>
            ) : MergeRequest.state === "merged" ? (
                <>
                    <Ionicons name="git-merge" size={24} color="purple" />
                    {withText && (
                        <Text className="ml-1 font-semibold text-purple-500">Merged</Text>
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
