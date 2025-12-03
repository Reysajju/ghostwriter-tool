<<<<<<< HEAD
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export const generateContent = async (prompt: string, apiKey: string) => {
    try {
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: prompt
        });

        return response.text || '';
    } catch (error) {
        console.error('Error generating content:', error);
        throw error;
    }
};

export const streamContent = async (prompt: string, apiKey: string) => {
    try {
        // For now, use non-streaming for compatibility
        const text = await generateContent(prompt, apiKey);

        // Return an async generator that yields the complete text
        async function* mockStream() {
            yield { text: () => text };
        }

        return mockStream();
    } catch (error) {
        console.error('Error streaming content:', error);
        throw error;
    }
}
=======
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export const generateContent = async (prompt: string, apiKey: string) => {
    try {
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: prompt
        });

        return response.text || '';
    } catch (error) {
        console.error('Error generating content:', error);
        throw error;
    }
};

export const streamContent = async (prompt: string, apiKey: string) => {
    try {
        // For now, use non-streaming for compatibility
        const text = await generateContent(prompt, apiKey);

        // Return an async generator that yields the complete text
        async function* mockStream() {
            yield { text: () => text };
        }

        return mockStream();
    } catch (error) {
        console.error('Error streaming content:', error);
        throw error;
    }
}
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
