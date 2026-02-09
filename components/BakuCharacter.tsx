import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

type BakuState = 'SLEEPING' | 'WAKING' | 'EATING' | 'PROCESSING' | 'IDLE';

interface BakuCharacterProps {
    state: BakuState;
}

export function BakuCharacter({ state }: BakuCharacterProps) {
    const breath = useSharedValue(1);

    useEffect(() => {
        if (state === 'SLEEPING') {
            breath.value = withRepeat(
                withTiming(1.05, { duration: 2000, easing: Easing.ease }),
                -1,
                true
            );
        } else {
            breath.value = withTiming(1);
        }
    }, [state]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: breath.value }],
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.characterPlaceholder, animatedStyle]}>
                {/* In a real app, this would be an Image or Lottie animation */}
                <Text style={styles.emoji}>
                    {state === 'SLEEPING' ? '💤' :
                        state === 'EATING' ? '😋' :
                            state === 'PROCESSING' ? '🤔' :
                                '🦁'}
                </Text>
                <Text style={styles.label}>The Baku is {state.toLowerCase()}</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
    },
    characterPlaceholder: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#E6E6FA', // Light purple
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#5E548E',
    },
    emoji: {
        fontSize: 80,
    },
    label: {
        marginTop: 10,
        color: '#5E548E',
        fontWeight: '600',
    },
});
