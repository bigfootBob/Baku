import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { app } from './firebaseConfig';

const functions = getFunctions(app);

// Use the emulator if in development
if (process.env.NODE_ENV === 'development' || __DEV__) {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

export const processWorry = async (text: string): Promise<string> => {
    try {
        const processWorryFn = httpsCallable<{ text: string }, { response: string }>(functions, 'processWorry');

        const result = await processWorryFn({ text });
        return result.data.response;

    } catch (error: any) {
        console.error("Error calling Firebase Function:", error);

        // httpsCallable errors map to standard Firebase HTTP error codes
        if (error.code === 'functions/unauthenticated') {
            return "The Baku awaits a known soul. (Please log in)";
        }

        if (process.env.NODE_ENV === 'development') {
            return `The wind is silent... (Error: ${error.message})`;
        }

        return "The Baku turns its head in confusion. (Connection error)";
    }
};
