import { ActivityIndicator, View } from "react-native";

const Loading = () => {
    return (
        <View className="items-center justify-center flex-1 m-4">
            <ActivityIndicator size="large" color="#000" />
        </View>
    );
};

export default Loading;
