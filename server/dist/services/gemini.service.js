"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamContent = exports.generateContent = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateContent = async (prompt, apiKey) => {
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
    catch (error) {
        console.error('Error generating content:', error);
        throw error;
    }
};
exports.generateContent = generateContent;
const streamContent = async (prompt, apiKey) => {
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContentStream(prompt);
        return result.stream;
    }
    catch (error) {
        console.error('Error streaming content:', error);
        throw error;
    }
};
exports.streamContent = streamContent;
