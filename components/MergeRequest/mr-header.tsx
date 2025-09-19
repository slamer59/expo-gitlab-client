import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import MergeStatusIcon from "@/components/MergeRequest/mr-status-icon";

const MergeRequestHeader = ({ mr }) => {
	return (
		<View className="mb-4">
			<Text className="mb-2 font-bold text-md text-muted">
				{mr?.references.full}
			</Text>
			<Text className="mb-2 text-4xl font-bold text-white" testID="mr-title">
				{mr?.title}
			</Text>
			{/* <Pills
                label={mr?.state}
                variant={getMergeRequestStateColor(mr?.state as MergeRequestState) as unknown as PillProps}
            /> */}
			<ScrollView
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				className="flex-row mb-4"
			>
				<View className="flex-row items-center">
					{MergeStatusIcon(mr, true)}
					<Text className="px-2 m-2 text-white border rounded-md border-muted bg-muted">
						{mr?.source_branch}
					</Text>
					<Ionicons name="arrow-forward" size={16} color="gray" />
					<Text className="px-2 m-2 text-white border rounded-md border-muted bg-muted">
						{mr?.target_branch}
					</Text>
				</View>
			</ScrollView>
			<View className="flex-row items-center mb-4">
				<TouchableOpacity className="flex-row items-center mr-2">
					<Ionicons name="thumbs-up-sharp" size={20} color="gray" />
					<Text className="ml-1 text-gray-500">{mr?.upvotes}</Text>
				</TouchableOpacity>
				<TouchableOpacity className="flex-row items-center mr-2">
					<Ionicons name="thumbs-down-sharp" size={20} color="gray" />
					<Text className="ml-1 text-gray-500">{mr?.downvotes}</Text>
				</TouchableOpacity>
				{/* <TouchableOpacity>
                            <FontAwesome6 name="bookmark" size={20} color="gray" />
                        </TouchableOpacity> */}
			</View>
		</View>
	);
};

export default MergeRequestHeader;
