import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { ActivityIndicator, View } from "react-native";

const Loading = () => {
    // const [loadingText, setLoadingText] = useState("Igniting the rockets");
    // const spinValue = new Animated.Value(0);
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: 'bg-background',
            },
            headerTintColor: 'bg-background',
            headerTitleStyle: {
                color: 'bg-background',
            },
        });
    }, [navigation]);
    return (
        <View className="items-center justify-center flex-1 p-4 bg-background">
            <ActivityIndicator size="large" color="#fff" />
        </View>
    );
};

export default Loading;
