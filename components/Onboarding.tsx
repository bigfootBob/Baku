import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type OnboardingProps = {
    onComplete: () => void;
};

const STEPS = [
    {
        title: "The Baku",
        description: "I am the eater of nightmares. I hunger for your worries.",
        // icon: placeholder for Baku icon
    },
    {
        title: "Feed Me",
        description: "Write down what burdens you. A sentence is enough.",
    },
    {
        title: "Let Go",
        description: "I will devour your worry. It will be gone forever. Safe.",
    },
];

export function Onboarding({ onComplete }: OnboardingProps) {
    const [step, setStep] = useState(0);
    const insets = useSafeAreaInsets();

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View
                style={styles.content}
                accessible={true}
                accessibilityLabel={`${STEPS[step].title}. ${STEPS[step].description}`}
            >
                <Text style={styles.title}>{STEPS[step].title}</Text>
                <Text style={styles.description}>{STEPS[step].description}</Text>
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={handleNext}
                accessibilityRole="button"
            >
                <Text style={styles.buttonText}>{step === STEPS.length - 1 ? "Begin" : "Next"}</Text>
            </TouchableOpacity>
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
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 60, // push the button further up the screen
    },
    buttonText: {
        color: '#FDFCF0',
        fontSize: 18,
        fontWeight: '600',
    },
});
