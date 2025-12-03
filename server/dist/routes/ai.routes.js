"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gemini_service_1 = require("../services/gemini.service");
const supabase_service_1 = require("../services/supabase.service");
const router = (0, express_1.Router)();
router.post('/generate', async (req, res) => {
    const { prompt } = req.body;
    const userId = req.headers['user-id'];
    if (!prompt || !userId) {
        res.status(400).json({ error: 'Prompt and User ID are required' });
        return;
    }
    try {
        // Fetch user's API key
        const { data, error } = await supabase_service_1.supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();
        if (error || !data?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found. Please complete onboarding.' });
            return;
        }
        const text = await (0, gemini_service_1.generateContent)(prompt, data.gemini_api_key);
        res.json({ text });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});
router.post('/stream', async (req, res) => {
    const { prompt } = req.body;
    const userId = req.headers['user-id'];
    if (!prompt || !userId) {
        res.status(400).json({ error: 'Prompt and User ID are required' });
        return;
    }
    try {
        const { data, error } = await supabase_service_1.supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();
        if (error || !data?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found' });
            return;
        }
        const stream = await (0, gemini_service_1.streamContent)(prompt, data.gemini_api_key);
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');
        for await (const chunk of stream) {
            const chunkText = chunk.text();
            res.write(chunkText);
        }
        res.end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to stream content' });
    }
});
exports.default = router;
