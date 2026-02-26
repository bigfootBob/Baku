import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, Platform, TouchableWithoutFeedback, ActivityIndicator, Image, Linking } from 'react-native';
import { Onboarding } from '@/components/Onboarding';
import { BakuCharacter } from '@/components/BakuCharacter';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { processWorry } from '@/data/api';
import { SafeAreaView } from 'react-native-safe-area-context';

type BakuState = 'SLEEPING' | 'WAKING' | 'EATING' | 'PROCESSING' | 'IDLE';

export default function HomeScreen() {
    const { user, loading, hasSeenOnboarding, completeOnboarding } = useAuth();
    const { xp, level, addXp } = useProgress();
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

            await addXp(20); // Award XP
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.uncannycoffeepodcast.com/')} activeOpacity={0.8} accessibilityRole="link" accessibilityLabel="Visit Uncanny Coffee Hour Podcast website">
                    <Image source={require('@/assets/images/UCHlogo.png')} style={styles.logo} resizeMode="contain" />
                </TouchableOpacity>
                <Text style={styles.podcastTextSmall}>The Dr Kitsune and Odd Bob</Text>
                <Text style={styles.podcastTextLarge}>Uncanny Coffee Hour Podcast</Text>
                <Text style={styles.podcastTextSmall}>presents:</Text>

                <View style={styles.separatorContainer}>
                    <View style={styles.separatorLine} />
                    <View style={styles.separatorDiamond} />
                    <View style={styles.separatorLine} />
                </View>

                <Text style={styles.headerTitle} accessibilityRole="header">Baku Worry Eater</Text>
                <View
                    style={styles.stats}
                    accessible={true}
                    accessibilityLabel={`Level ${level}, ${xp % 100} out of 100 XP`}
                >
                    <Text style={styles.levelText}>Lvl {level}</Text>
                    <Text style={styles.xpText}>{xp % 100} / 100 XP</Text>
                </View>
            </View>

            <View style={styles.stage}>
                <BakuCharacter state={bakuState} />
                {response && (
                    <View style={styles.responseContainer}>
                        <Text style={styles.responseText}>{response}</Text>
                        <TouchableOpacity
                            onPress={resetLoop}
                            style={styles.resetButton}
                            accessibilityRole="button"
                            accessibilityHint="Resets the Baku to sleeping state"
                        >
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
                        accessibilityLabel="Worry input field"
                        accessibilityHint="Type the worry or burden you wish to feed to the Baku"
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
                        accessibilityRole="button"
                        accessibilityLabel="Feed"
                        accessibilityHint="Feeds your input to the Baku"
                        accessibilityState={{ disabled: !worryText.trim() }}
                    >
                        <Text style={styles.feedButtonText}>Feed</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3EFE0', // Washi paper color
    },
    container: {
        flex: 1,
        backgroundColor: '#F3EFE0', // Washi paper color
    },
    header: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 8,
    },
    podcastTextSmall: {
        fontSize: 16,
        color: '#5B6F5F',
        fontStyle: 'italic',
        marginBottom: 2,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    podcastTextLarge: {
        fontSize: 22,
        color: '#3B2F2F',
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginBottom: 4,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        marginVertical: 12,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#8A3324', // Vermilion red
        opacity: 0.5,
    },
    separatorDiamond: {
        width: 6,
        height: 6,
        backgroundColor: '#8A3324',
        transform: [{ rotate: '45deg' }],
        marginHorizontal: 8,
        opacity: 0.8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#3B2F2F', // Dark Lacquer wood
        letterSpacing: 2,
        marginTop: 4,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    levelText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#8A3324', // Rust red / Vermilion
        marginRight: 10,
    },
    xpText: {
        fontSize: 12,
        color: '#5B6F5F', // Muted bamboo green
    },
    stage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    responseContainer: {
        marginTop: 15,
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    responseText: {
        fontSize: 18,
        color: '#3B2F2F', // Dark wood text
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 28,
        fontFamily: Platform.OS === 'ios' ? 'Hoefler Text' : 'serif', // Calligraphic feel
    },
    resetButton: {
        marginTop: 20,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#8A3324',
    },
    resetButtonText: {
        color: '#8A3324', // Vermilion red
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 1,
    },
    inputContainer: {
        padding: 20,
        backgroundColor: '#F3EFE0', // Match background
    },
    input: {
        backgroundColor: '#EBE5D0', // Slightly darker washi paper for depth
        borderRadius: 4, // More square edges
        padding: 16,
        fontSize: 16,
        color: '#3B2F2F',
        minHeight: 100,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#C3BCA5', // Subtle border
        shadowOpacity: 0,
    },
    feedButton: {
        marginTop: 16,
        backgroundColor: '#3B2F2F', // Dark Lacquer
        paddingVertical: 16,
        borderRadius: 4, // Square edges
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#211818',
    },
    feedButtonDisabled: {
        backgroundColor: '#A39C8E', // Faded ink color
        borderColor: '#A39C8E',
        shadowOpacity: 0,
    },
    feedButtonText: {
        color: '#F3EFE0', // Light Washi text
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 2,
    },
});
