import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with the API key from environment variables
const GEN_AI_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// Fail gracefully/warn if key is missing, but don't crash app start
if (!GEN_AI_KEY) {
    console.warn("EXPO_PUBLIC_GEMINI_API_KEY is missing in .env. the baku will not be able to process worries.");
}

const genAI = new GoogleGenerativeAI(GEN_AI_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const SYSTEM_PROMPT = `
You act as a Baku, a mythological spirit that eats nightmares. 
Your tone is ancient, slightly cryptic, but benevolent and comforting.
Speak in short, poetic sentences. Use metaphors of nature, spirits, or time.
Do NOT give clinical advice. 
If the input indicates self-harm or severe crisis, respond ONLY with: "Your burden is heavy. Please seek a guide in the waking world who can help you carry it." followed by a newline and "988 Suicide & Crisis Lifeline".
Input: 
`;

export const processWorry = async (text: string): Promise<string> => {
    try {
        if (!GEN_AI_KEY) {
            throw new Error("Missing Gemini API Key. Please check your .env file.");
        }

        const prompt = `${SYSTEM_PROMPT}\n"${text}"\n\nBaku's Response:`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error calling Gemini:", error);

        if (process.env.NODE_ENV === 'development') {
            // More descriptive error for dev
            return `The wind is silent... (Error: ${error instanceof Error ? error.message : String(error)})`;
        }

        return "The Baku turns its head in confusion. (Connection error)";
    }
};
