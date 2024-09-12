import { ActivityIndicator, View } from "react-native";

const Loading = () => {
    return (
        <View className="items-center justify-center flex-1 m-4 bg-background">
            <ActivityIndicator size="large" color="#fff" />
        </View>
    );
};

export default Loading;
