import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebaseConfig';

const functions = getFunctions(app);

// Use a local emulator if dev (optional, can be toggled)
// import { connectFunctionsEmulator } from 'firebase/functions';
// connectFunctionsEmulator(functions, "127.0.0.1", 5001);

export const processWorry = async (text: string): Promise<string> => {
    try {
        const processWorryFn = httpsCallable<{ text: string }, { response: string }>(functions, 'processWorry');
        const result = await processWorryFn({ text });
        return result.data.response;
    } catch (error) {
        console.error("Error calling processWorry:", error);
        // Fallback for MVP if backend fails or not deployed
        if (process.env.NODE_ENV === 'development') {
            return "The wind whispers... (Backend not connected. This is a fallback response.)";
        }
        throw error;
    }
};
