import { Platform } from 'react-native';
import Head from 'expo-router/head';

export function GoogleAnalytics() {
    if (Platform.OS !== 'web') return null;

    const measurementId = process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID;

    if (!measurementId) return null;

    return (
        <Head>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `,
                }}
            />
        </Head>
    );
}
