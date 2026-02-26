import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

type BakuState = 'SLEEPING' | 'WAKING' | 'EATING' | 'PROCESSING' | 'IDLE';

interface BakuCharacterProps {
    state: BakuState;
}

// Pre-load or reference the local assets
const images = {
    sleep: [require('@/assets/images/baku-sleep.webp'), require('@/assets/images/baku-sleep.jpg')],
    eat: [require('@/assets/images/baku-eat.webp'), require('@/assets/images/baku-eat.jpg')],
    wise: [require('@/assets/images/baku-wise.webp'), require('@/assets/images/baku-wise.jpg')],
};

export function BakuCharacter({ state }: BakuCharacterProps) {
    const opacity = useSharedValue(1);
    const { width } = useWindowDimensions();
    const isMobile = width < 768; // Cover all modern smartphones including Pro Max models

    const getTargetImage = (currentState: BakuState) => {
        if (currentState === 'SLEEPING' || currentState === 'WAKING') return images.sleep;
        if (currentState === 'EATING' || currentState === 'PROCESSING') return images.eat;
        return images.wise; // IDLE corresponds to the wisdom state here
    };

    const targetImage = getTargetImage(state);
    const [currentImage, setCurrentImage] = useState(targetImage);

    useEffect(() => {
        if (targetImage !== currentImage) {
            // Fade out
            opacity.value = withTiming(0, { duration: 400 }, (isFinished) => {
                if (isFinished) {
                    // Change image when fully faded out
                    runOnJS(setCurrentImage)(targetImage);
                    // Fade back in
                    opacity.value = withTiming(1, { duration: 400 });
                }
            });
        }
    }, [state, targetImage, currentImage, opacity]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <View
            style={[styles.container, isMobile && styles.containerMobile]}
            accessible={true}
            accessibilityLabel={`Illustration of the Baku. The Baku is ${state === 'IDLE' ? 'wise' : state.toLowerCase()}.`}
            accessibilityLiveRegion="polite"
        >
            <Animated.View style={[styles.characterPlaceholder, isMobile && styles.characterPlaceholderMobile, animatedStyle]}>
                <Image
                    source={currentImage}
                    style={styles.image}
                    contentFit="cover"
                    accessibilityLabel={`Illustration of the Baku. The Baku is ${state === 'IDLE' ? 'wise' : state.toLowerCase()}.`}
                />
            </Animated.View>
            <Text style={styles.label}>
                The Baku is {state === 'IDLE' ? 'wise' : state.toLowerCase()}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%', // Required for percentage-based child widths to resolve correctly
        alignItems: 'center',
        justifyContent: 'center',
        height: 350, // slightly taller to accommodate larger square
    },
    containerMobile: {
        height: 220, // strictly override the 350px height
        paddingVertical: 10,
    },
    characterPlaceholder: {
        width: 450,
        height: 250,
        borderRadius: 8, // slight rounding, but mostly square
        backgroundColor: '#D1C7A9', // Washi paper / tatami color
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 6,
        borderColor: '#3B2F2F', // Dark wood / lacquer color
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    characterPlaceholderMobile: {
        width: 280, // strictly bound width
        height: 160, // strictly bound height
        borderWidth: 3, // thinner border for mobile
    },
    image: {
        width: '100%',
        height: '100%',
    },
    label: {
        marginTop: 15,
        color: '#3B2F2F', // matching dark wood
        fontWeight: '600',
        fontSize: 14, // slightly smaller text on mobile
        letterSpacing: 1, // slightly wider spacing for elegance
    },
});
