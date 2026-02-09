import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { Onboarding } from '@/components/Onboarding';
import { BakuCharacter } from '@/components/BakuCharacter';
import { useAuth } from '@/contexts/AuthContext';
import { processWorry } from '@/data/api';
import { SafeAreaView } from 'react-native-safe-area-context';

type BakuState = 'SLEEPING' | 'WAKING' | 'EATING' | 'PROCESSING' | 'IDLE';

export default function HomeScreen() {
    const { user, loading, hasSeenOnboarding, completeOnboarding } = useAuth();
    const [bakuState, setBakuState] = useState<BakuState>('SLEEPING');
    const [worryText, setWorryText] = useState('');
    const [response, setResponse] = useState<string | null>(null);

    const handleFeed = async () => {
        Keyboard.dismiss();
        if (!worryText.trim()) return;

        setBakuState('EATING');

        try {
            // Short delay for eating animation
            await new Promise(resolve => setTimeout(resolve, 1500));
            setBakuState('PROCESSING');

            const apiResponse = await processWorry(worryText);

            setResponse(apiResponse);
            setBakuState('IDLE');
            setWorryText('');
        } catch (error) {
            console.error("Failed to feed Baku:", error);
            setResponse("The Baku turns its head away. Something is wrong (Check backend/network).");
            setBakuState('IDLE');
        }
    };

    const resetLoop = () => {
        setResponse(null);
        setBakuState('SLEEPING');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!hasSeenOnboarding) {
        return <Onboarding onComplete={completeOnboarding} />;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.headerTitle}>Baku</Text>

                <View style={styles.stage}>
                    <BakuCharacter state={bakuState} />
                    {response && (
                        <View style={styles.responseContainer}>
                            <Text style={styles.responseText}>{response}</Text>
                            <TouchableOpacity onPress={resetLoop} style={styles.resetButton}>
                                <Text style={styles.resetButtonText}>Rest</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {!response && (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="What burdens you?"
                            placeholderTextColor="#888"
                            multiline
                            maxLength={280}
                            value={worryText}
                            onChangeText={(text) => {
                                setWorryText(text);
                                if (bakuState === 'SLEEPING' && text.length > 0) {
                                    setBakuState('WAKING');
                                } else if (bakuState === 'WAKING' && text.length === 0) {
                                    setBakuState('SLEEPING');
                                }
                            }}
                        />
                        <TouchableOpacity
                            style={[styles.feedButton, !worryText.trim() && styles.feedButtonDisabled]}
                            onPress={handleFeed}
                            disabled={!worryText.trim()}
                        >
                            <Text style={styles.feedButtonText}>Feed</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDFCF0',
    },
    container: {
        flex: 1,
        backgroundColor: '#FDFCF0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2D2D2D',
        textAlign: 'center',
        marginTop: 10,
        opacity: 0.6,
    },
    stage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    responseContainer: {
        marginTop: 30,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    responseText: {
        fontSize: 18,
        color: '#2D2D2D',
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 28,
    },
    resetButton: {
        marginTop: 20,
        padding: 10,
    },
    resetButtonText: {
        color: '#8AB0AB',
        fontSize: 16,
    },
    inputContainer: {
        padding: 20,
        backgroundColor: '#FDFCF0',
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: '#2D2D2D',
        minHeight: 100,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#E6E6FA',
    },
    feedButton: {
        marginTop: 16,
        backgroundColor: '#E6A57E',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#E6A57E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    feedButtonDisabled: {
        backgroundColor: '#E0E0E0', // Gray out
        shadowOpacity: 0,
    },
    feedButtonText: {
        color: '#FDFCF0',
        fontSize: 18,
        fontWeight: '600',
    },
});
