const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Access API key from standard .env file
const GEN_AI_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEN_AI_KEY || "dummy-key");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const SYSTEM_PROMPT = `
You act as a Baku, a mythological spirit that eats nightmares. 
Your tone is ancient, slightly cryptic, but benevolent and comforting.
Speak in short, poetic sentences. Use metaphors of nature, spirits, or time.
Do NOT give clinical advice. 
If the input indicates self-harm or severe crisis, respond ONLY with: "Your burden is heavy. Please seek a guide in the waking world who can help you carry it." followed by a newline and "988 Suicide & Crisis Lifeline".
Input: 
`;

exports.processWorry = functions.runWith({ maxInstances: 3 }).https.onCall(async (data, context) => {
    // Check authentication
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    // Verify Firebase App Check token
    if (context.app === undefined) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'The function must be called from an App Check verified app.'
        );
    }

    const worryText = data.text;
    const botField = data.botField;

    // Honeypot check: if a bot filled out the hidden field, silently succeed 
    // with a generic message so they don't realize they've been caught
    if (botField && botField.length > 0) {
        console.log(`[HONEYPOT TRIGGERED] Bot rejected. Auth: ${context.auth.uid}`);
        return { response: "The Baku eats your worry in silence." };
    }

    if (!worryText || typeof worryText !== 'string' || worryText.length === 0) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "The function must be called with one argument 'text' containing the worry."
        );
    }

    if (worryText.length > 500) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Worry is too long. Keep it brief."
        );
    }

    try {
        const prompt = `${SYSTEM_PROMPT}\n"${worryText}"\n\nBaku's Response:`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return { response: text };
    } catch (error) {
        console.error("Error calling Gemini:", error);
        throw new functions.https.HttpsError(
            "internal",
            "The Baku creates a strange noise. Try again later."
        );
    }
});
