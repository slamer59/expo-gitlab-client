import { styled } from 'nativewind';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(StyledView);

interface ErrorProps {
    message: string;
    onRetry?: () => void;
}

export default function Error({ message, onRetry }: ErrorProps) {
    const scale = useSharedValue(0.8);

    React.useEffect(() => {
        scale.value = withSpring(1);
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <StyledView className="items-center justify-center flex-1 bg-gray-100">
            <AnimatedView style={animatedStyle} className="items-center">
                <StyledView className="items-center justify-center w-20 h-20 bg-red-500 rounded-full">
                    <StyledText className="text-4xl text-white">!</StyledText>
                </StyledView>
                <StyledText className="mt-4 text-lg font-semibold text-center text-gray-700">
                    {message}
                </StyledText>
                {onRetry && (
                    <StyledTouchableOpacity
                        className="px-6 py-3 mt-6 bg-blue-500 rounded-full"
                        onPress={onRetry}
                    >
                        <StyledText className="font-semibold text-white">
                            Retry
                        </StyledText>
                    </StyledTouchableOpacity>
                )}
            </AnimatedView>
        </StyledView>
    );
}