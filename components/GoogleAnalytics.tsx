import { Platform } from 'react-native';
import Head from 'expo-router/head';

export function GoogleAnalytics() {
    if (Platform.OS !== 'web') return null;

    const measurementId = process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID;

    if (!measurementId) return null;

    return (
        <Head>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
            <script src="/ga-init.js" data-ga-id={measurementId} />
        </Head>
    );
}
