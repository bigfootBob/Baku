import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { app } from './firebaseConfig';

const functions = getFunctions(app);

// Defaulting strictly to use the local emulator to test the web build locally.
if (process.env.NODE_ENV === 'development') {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

export const processWorry = async (text: string, botField: string = ''): Promise<string> => {
    try {
        const processWorryFn = httpsCallable<{ text: string; botField: string }, { response: string }>(functions, 'processWorry', {
            limitedUseAppCheckTokens: true, // pairs with consumeAppCheckToken on the server
            timeout: 30000, // don't leave the Baku "devouring" forever
        });

        const result = await processWorryFn({ text, botField });
        return result.data.response;

    } catch (error: any) {
        console.error("Error calling Firebase Function:", error);

        // httpsCallable errors map to standard Firebase HTTP error codes
        if (error.code === 'functions/unauthenticated') {
            return "The Baku awaits a known soul. (Please log in)";
        }

        if (error.code === 'functions/resource-exhausted') {
            return "The Baku is full. Rest a while and return later.";
        }

        if (process.env.NODE_ENV === 'development') {
            return `The wind is silent... (Error: ${error.message})`;
        }

        return "The Baku turns its head in confusion. (Connection error)";
    }
};
