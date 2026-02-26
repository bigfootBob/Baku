import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable, Keyboard, Platform, TouchableWithoutFeedback, ActivityIndicator, Image, Linking } from 'react-native';
import { Onboarding } from '@/components/Onboarding';
import { BakuCharacter } from '@/components/BakuCharacter';
import { PodcastHeader } from '@/components/PodcastHeader';
import { LevelUpCelebration } from '@/components/LevelUpCelebration';
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
    const [botField, setBotField] = useState(''); // Honeypot
    const [response, setResponse] = useState<string | null>(null);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [previousLevel, setPreviousLevel] = useState(level);

    // Track level changes
    React.useEffect(() => {
        if (level > previousLevel && previousLevel > 0) {
            setShowLevelUp(true);
        }
        setPreviousLevel(level);
    }, [level]);

    const handleFeed = async () => {
        Keyboard.dismiss();
        if (!worryText.trim()) return;

        setBakuState('EATING');

        try {
            // Short delay for eating animation
            await new Promise(resolve => setTimeout(resolve, 1500));
            setBakuState('PROCESSING');

            const apiResponse = await processWorry(worryText, botField);

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
                <PodcastHeader showTitle={true} />
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
                        <Pressable
                            onPress={resetLoop}
                            style={({ pressed, hovered }: any) => [
                                styles.resetButton,
                                hovered && styles.buttonHover,
                                pressed && styles.buttonPressed,
                            ]}
                            accessibilityRole="button"
                            accessibilityHint="Resets the Baku to sleeping state"
                        >
                            <Text style={styles.resetButtonText}>Rest</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => Linking.openURL('https://www.uncannycoffeepodcast.com/')}
                            style={({ pressed, hovered }: any) => [
                                styles.exploreButton,
                                hovered && styles.buttonHover,
                                pressed && styles.buttonPressed,
                            ]}
                            accessibilityRole="link"
                            accessibilityHint="Navigates to the Uncanny Coffee Hour Podcast website"
                        >
                            <Text style={styles.exploreButtonText}>Explore the Uncanny</Text>
                        </Pressable>
                    </View>
                )}
            </View>

            {!response && (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.honeypot}
                        autoComplete="off"
                        value={botField}
                        onChangeText={setBotField}
                        tabIndex={-1}
                        accessibilityElementsHidden={true}
                        importantForAccessibility="no"
                    />
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
                    <Pressable
                        style={({ pressed, hovered }: any) => [
                            styles.feedButton,
                            !worryText.trim() && styles.feedButtonDisabled,
                            worryText.trim() && hovered && styles.buttonHover,
                            worryText.trim() && pressed && styles.buttonPressed,
                        ]}
                        onPress={handleFeed}
                        disabled={!worryText.trim()}
                        accessibilityRole="button"
                        accessibilityLabel="Feed"
                        accessibilityHint="Feeds your input to the Baku"
                        accessibilityState={{ disabled: !worryText.trim() }}
                    >
                        <Text style={styles.feedButtonText}>Feed</Text>
                    </Pressable>
                </View>
            )}

            <LevelUpCelebration
                visible={showLevelUp}
                level={level}
                onClose={() => setShowLevelUp(false)}
            />
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
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: '#F3EFE0',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#8A3324',
        shadowColor: '#8A3324',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
        // @ts-ignore
        transitionDuration: '150ms',
    },
    resetButtonText: {
        color: '#8A3324', // Vermilion red
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 1,
    },
    exploreButton: {
        marginTop: 16,
        marginBottom: 20, // Added space below
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#3B2F2F', // Dark lacquer
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#211818',
        shadowColor: '#211818',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
        // @ts-ignore
        transitionDuration: '150ms',
    },
    exploreButtonText: {
        color: '#F3EFE0', // Light Washi
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    inputContainer: {
        padding: 20,
        backgroundColor: '#F3EFE0', // Match background
        width: '100%',
        maxWidth: 680, // User requested 680 instead of 450
        alignSelf: 'center', // Center the block on larger screens
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
    honeypot: {
        position: 'absolute',
        top: -9999,
        left: -9999,
        opacity: 0,
        height: 0,
        width: 0,
    },
    feedButton: {
        marginTop: 16,
        backgroundColor: '#3B2F2F', // Dark Lacquer
        paddingVertical: 16,
        borderRadius: 6, // Square edges
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#211818',
        shadowColor: '#211818',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
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
    feedButtonDisabled: {
        backgroundColor: '#A39C8E', // Faded ink color
        borderColor: '#A39C8E',
        shadowOpacity: 0,
        transform: [{ translateX: 4 }, { translateY: 4 }],
    },
    feedButtonText: {
        color: '#F3EFE0', // Light Washi text
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 2,
    },
});
