import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, useWindowDimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay, Easing, runOnJS } from 'react-native-reanimated';
import '../global.css';

interface LevelUpCelebrationProps {
    visible: boolean;
    level: number;
    onClose: () => void;
}

const lvlupImages = [require('@/assets/images/baku-lvlup.webp'), require('@/assets/images/baku-lvlup.jpg')];

export function LevelUpCelebration({ visible, level, onClose }: LevelUpCelebrationProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);
    const [showFireworks, setShowFireworks] = useState(false);

    useEffect(() => {
        if (visible) {
            setShowFireworks(true);
            opacity.value = withTiming(1, { duration: 500 });
            scale.value = withSequence(
                withTiming(1.05, { duration: 400, easing: Easing.out(Easing.back(1.5)) }),
                withTiming(1, { duration: 200 })
            );
        } else {
            opacity.value = withTiming(0, { duration: 300 });
            scale.value = withTiming(0.8, { duration: 300 }, (finished) => {
                if (finished) {
                    runOnJS(setShowFireworks)(false);
                }
            });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ scale: scale.value }],
        };
    });

    if (!visible && !showFireworks) return null;

    return (
        <Modal transparent visible={visible || showFireworks} animationType="fade">
            <View style={styles.overlay}>
                {Platform.OS === 'web' && showFireworks && (
                    <div className="fireworks-container">
                        <div className="firework"></div>
                        <div className="firework"></div>
                        <div className="firework"></div>
                    </div>
                )}

                <Animated.View style={[styles.container, isMobile && styles.containerMobile, animatedStyle]}>
                    <Text style={styles.title}>Level Up!</Text>
                    <View style={[styles.imageWrapper, isMobile && styles.imageWrapperMobile]}>
                        <Image
                            source={lvlupImages}
                            style={styles.image}
                            contentFit="cover"
                            accessibilityLabel="The Baku celebrating a character level up"
                        />
                    </View>
                    <Text style={styles.subtitle}>You have reached Level {level}</Text>
                    <Text style={styles.description}>The Baku grows stronger, and your burdens grow lighter.</Text>

                    <Pressable
                        style={({ pressed, hovered }: any) => [
                            styles.button,
                            hovered && styles.buttonHover,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(59, 47, 47, 0.85)', // Dark lacquer transparent
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        backgroundColor: '#F3EFE0', // Washi
        borderRadius: 12,
        padding: 30,
        alignItems: 'center',
        width: 500,
        maxWidth: '100%',
        borderWidth: 4,
        borderColor: '#3B2F2F',
        shadowColor: '#000',
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 0,
        elevation: 10,
    },
    containerMobile: {
        width: '100%',
        padding: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#8A3324', // Vermilion
        marginBottom: 20,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    imageWrapper: {
        width: 400,
        height: 250,
        backgroundColor: '#D1C7A9',
        borderWidth: 4,
        borderColor: '#3B2F2F',
        marginBottom: 20,
        overflow: 'hidden',
    },
    imageWrapperMobile: {
        width: '100%',
        height: 200,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    subtitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#3B2F2F',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#5B6F5F',
        textAlign: 'center',
        marginBottom: 30,
        fontStyle: 'italic',
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#E6A57E',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#2D2D2D',
        alignItems: 'center',
        shadowColor: '#2D2D2D',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        // @ts-ignore
        transitionDuration: '150ms',
    },
    buttonHover: {
        shadowOffset: { width: 6, height: 6 },
        transform: [{ translateX: -2 }, { translateY: -2 }],
    },
    buttonPressed: {
        shadowOffset: { width: 0, height: 0 },
        transform: [{ translateX: 4 }, { translateY: 4 }],
    },
    buttonText: {
        color: '#3B2F2F', // Dark lacquer for high contrast
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
