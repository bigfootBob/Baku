import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';

interface PodcastHeaderProps {
    showTitle?: boolean;
}

export function PodcastHeader({ showTitle = false }: PodcastHeaderProps) {
    return (
        <View style={styles.header}>
            <TouchableOpacity className="logo-container" onPress={() => Linking.openURL('https://www.uncannycoffeepodcast.com/')} activeOpacity={0.8} accessibilityRole="link" accessibilityLabel="Visit Uncanny Coffee Hour Podcast website">
                <Image source={require('@/assets/images/UCHlogo.png')} style={styles.logo} resizeMode="contain" className="logo-image" />
            </TouchableOpacity>
            <Text style={styles.podcastTextSmall}>The Dr Kitsune and Odd Bob</Text>
            <Text style={styles.podcastTextLarge}>Uncanny Coffee Hour Podcast</Text>
            <Text style={styles.podcastTextSmall}>presents:</Text>

            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
                <View style={styles.separatorDiamond} />
                <View style={styles.separatorLine} />
            </View>

            {showTitle && (
                <Text style={styles.headerTitle} accessibilityRole="header">Baku Worry Eater</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        width: '100%',
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
});
