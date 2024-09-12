import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Animated, Easing, Text, View } from "react-native";

export const LoadingFun = () => {
    const navigation = useNavigation();
    const [loadingText, setLoadingText] = useState("Igniting the rockets");
    const spinValue = new Animated.Value(0);

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

    useEffect(() => {
        const spin = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        spin.start();

        const textArray = [
            "Debugging the universe",
            "Merging without conflicts",
            "Pushing to the cloud",
            "Resolving conflicts automatically",
            "Forking repos at light speed",
            "Polishing commit messages",
            "Organizing a code review party",
            "Deploying to production... just kidding!",
            "Generating witty pull request titles",
            "Summoning the CI/CD pipeline",
            "Crafting the perfect .gitignore",
        ];

        let index = 0;
        const interval = setInterval(() => {
            setLoadingText(textArray[index]);
            index = (index + 1) % textArray.length;
        }, 3000);

        return () => {
            spin.stop();
            clearInterval(interval);
        };
    }, []);

    const spinVal = 4
    const spin = spinValue.interpolate({
        inputRange: [0, spinVal],
        outputRange: ['0deg', `${spinVal * 360}deg`]
    });

    return (
        <View className="items-center justify-center flex-1 p-4 bg-background">
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <FontAwesome5 className="m-10" name="rocket" size={100} color="#9400D3" />
            </Animated.View>
            <Text className="mt-6 text-4xl font-bold text-center text-secondary">{loadingText}</Text>
            <Text className="mt-4 text-lg text-actions">Please wait while we prepare for liftoff!</Text>
        </View>
    );
};


