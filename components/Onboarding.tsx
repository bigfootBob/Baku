import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { PodcastHeader } from '@/components/PodcastHeader';

type OnboardingProps = {
    onComplete: () => void;
};

const STEPS = [
    {
        title: "The Baku",
        description: "I am the eater of nightmares. I hunger for your worries.",
        image: [require('@/assets/images/baku-start.webp'), require('@/assets/images/baku-start.jpg')],
    },
    {
        title: "Feed Me",
        description: "Write down what burdens you. A sentence is enough.",
        image: [require('@/assets/images/baku-hungry.webp'), require('@/assets/images/baku-hungry.jpg')],
    },
    {
        title: "Let Go",
        description: "I will devour your worry. It will be gone forever. Safe.",
        image: [require('@/assets/images/baku-ready.webp'), require('@/assets/images/baku-ready.jpg')],
    },
];

export function Onboarding({ onComplete }: OnboardingProps) {
    const [step, setStep] = useState(0);
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <PodcastHeader showTitle={true} />
            <View
                style={styles.content}
                accessible={true}
                accessibilityLabel={`${STEPS[step].title}. ${STEPS[step].description}`}
            >
                <View style={[styles.imageContainer, isMobile && styles.imageContainerMobile]}>
                    <Image
                        source={STEPS[step].image}
                        style={styles.image}
                        contentFit="cover"
                        transition={400}
                        accessibilityLabel={`Illustration of Baku for: ${STEPS[step].title}`}
                    />
                </View>
                <Text style={styles.title}>{STEPS[step].title}</Text>
                <Text style={styles.description}>{STEPS[step].description}</Text>
            </View>
            <Pressable
                style={({ pressed, hovered }: any) => [
                    styles.button,
                    hovered && styles.buttonHover,
                    pressed && styles.buttonPressed,
                ]}
                onPress={handleNext}
                accessibilityRole="button"
            >
                <Text style={styles.buttonText}>{step === STEPS.length - 1 ? "Begin" : "Next"}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFCF0', // paper
        justifyContent: 'space-between',
        padding: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: 450,
        height: 250,
        borderRadius: 8,
        backgroundColor: '#D1C7A9',
        borderWidth: 6,
        borderColor: '#3B2F2F',
        overflow: 'hidden',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    imageContainerMobile: {
        width: 280,
        height: 160,
        borderWidth: 3,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2D2D2D', // ink
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 18,
        color: '#5E548E', // baku
        textAlign: 'center',
        lineHeight: 26,
    },
    button: {
        backgroundColor: '#E6A57E', // sunset
        paddingVertical: 16,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#2D2D2D',
        alignItems: 'center',
        marginBottom: 60, // push the button further up the screen
        width: 220, // Make button smaller
        alignSelf: 'center',
        shadowColor: '#2D2D2D',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
        // @ts-ignore - Web only
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
        color: '#3B2F2F', // Dark lacquer for high contrast against sunset
        fontSize: 18,
        fontWeight: 'bold',
    },
});
