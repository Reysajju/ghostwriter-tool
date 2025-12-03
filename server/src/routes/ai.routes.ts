<<<<<<< HEAD
import { Router } from 'express';
import { generateContent, streamContent } from '../services/gemini.service';
import { supabase } from '../services/supabase.service';

const router = Router();

router.post('/generate', async (req, res) => {
    const { prompt } = req.body;
    const userId = req.headers['user-id'] as string;

    if (!prompt || !userId) {
        res.status(400).json({ error: 'Prompt and User ID are required' });
        return;
    }

    try {
        // Fetch user's API key
        const { data, error } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();

        if (error || !data?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found. Please complete onboarding.' });
            return;
        }

        const text = await generateContent(prompt, data.gemini_api_key);
        res.json({ text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});

router.post('/stream', async (req, res) => {
    const { prompt } = req.body;
    const userId = req.headers['user-id'] as string;

    if (!prompt || !userId) {
        res.status(400).json({ error: 'Prompt and User ID are required' });
        return;
    }

    try {
        const { data, error } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();

        if (error || !data?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found' });
            return;
        }

        const stream = await streamContent(prompt, data.gemini_api_key);

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        for await (const chunk of stream) {
            const chunkText = chunk.text();
            res.write(chunkText);
        }
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to stream content' });
    }
});

router.post('/suggestions', async (req, res) => {
    const { projectId, currentText, cursorPosition } = req.body;
    const userId = req.headers['user-id'] as string;

    if (!projectId || !userId) {
        res.status(400).json({ error: 'Project ID and User ID are required' });
        return;
    }

    try {
        // 1. Get User API Key
        const { data: userData, error: userError } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();

        if (userError || !userData?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found' });
            return;
        }

        // 2. Fetch Project Assets (Context)
        const { data: assets, error: assetsError } = await supabase
            .from('assets')
            .select('processed_text, type, url')
            .eq('project_id', projectId)
            .not('processed_text', 'is', null);

        if (assetsError) throw assetsError;

        // 3. Construct Context
        let context = "";
        if (assets && assets.length > 0) {
            context = "Here is some background context from the project resources:\n\n";
            assets.forEach((asset, index) => {
                // Truncate long assets to avoid token limits (simple truncation for MVP)
                const text = asset.processed_text.substring(0, 2000);
                context += `--- Resource ${index + 1} (${asset.url}) ---\n${text}\n\n`;
            });
        }

        // 4. Construct Prompt
        const prompt = `
        You are an expert ghostwriter and editor.
        
        ${context}
        
        Here is the text the user is currently writing:
        "${currentText}"
        
        Based on the context and the current text, provide 3 short, specific suggestions for what to write next or how to improve the current paragraph.
        
        Format the output as a JSON array of objects with 'type' (continuation, improvement, idea) and 'text' properties.
        Example:
        [
            {"type": "continuation", "text": "The door creaked open..."},
            {"type": "improvement", "text": "Consider using stronger verbs..."},
            {"type": "idea", "text": "Maybe reveal the secret now..."}
        ]
        Only return the JSON array, no other text.
        `;

        // 5. Generate with Gemini
        const responseText = await generateContent(prompt, userData.gemini_api_key);

        // Clean up response to ensure valid JSON
        const jsonMatch = responseText.match(/\[.*\]/s);
        const jsonString = jsonMatch ? jsonMatch[0] : '[]';

        let suggestions;
        try {
            suggestions = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse AI response:", responseText);
            suggestions = [];
        }

        res.json({ suggestions });

    } catch (error) {
        console.error('Suggestion generation error:', error);
        res.status(500).json({ error: 'Failed to generate suggestions' });
    }
});

router.post('/improvements', async (req, res) => {
    const { selectedText, contextBefore, contextAfter, projectId, maxSuggestions = 10 } = req.body;
    const userId = req.headers['user-id'] as string;

    if (!selectedText || !userId) {
        res.status(400).json({ error: 'Selected text and User ID are required' });
        return;
    }

    try {
        // Get User API Key
        const { data: userData, error: userError } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();

        if (userError || !userData?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found' });
            return;
        }

        // Construct prompt for improvements
        const prompt = `
You are an expert editor. Analyze the following text and provide ${Math.min(maxSuggestions, 100)} specific improvements.

Context before: "${contextBefore || ''}"
Selected text to improve: "${selectedText}"
Context after: "${contextAfter || ''}"

For each improvement, provide:
1. Type: grammar, clarity, style, or conciseness
2. The improved version of the text (use Markdown for formatting like **bold**, *italic* if needed)
3. A brief reason for the change

Format as a JSON array:
[
  {
    "type": "grammar",
    "improved": "corrected text here",
    "reason": "Fixed subject-verb agreement"
  }
]

Only return the JSON array, no other text.
        `;

        const responseText = await generateContent(prompt, userData.gemini_api_key);

        // Parse JSON response
        const jsonMatch = responseText.match(/\[.*\]/s);
        const jsonString = jsonMatch ? jsonMatch[0] : '[]';

        let improvements;
        try {
            improvements = JSON.parse(jsonString);
            // Add IDs and original text to each improvement
            improvements = improvements.map((imp: any, index: number) => ({
                id: `imp-${index}`,
                type: imp.type || 'style',
                original: selectedText,
                improved: imp.improved || imp.text || '',
                reason: imp.reason || ''
            }));
        } catch (e) {
            console.error("Failed to parse AI response:", responseText);
            improvements = [];
        }

        res.json({ improvements });

    } catch (error) {
        console.error('Improvements generation error:', error);
        res.status(500).json({ error: 'Failed to generate improvements' });
    }
});

router.post('/continue', async (req, res) => {
    const { currentText, cursorPosition, projectId, length = 'medium' } = req.body;
    const userId = req.headers['user-id'] as string;

    if (!currentText || !userId) {
        res.status(400).json({ error: 'Current text and User ID are required' });
        return;
    }

    try {
        // Get User API Key
        const { data: userData, error: userError } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();

        if (userError || !userData?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found' });
            return;
        }

        // Fetch project assets for context
        const { data: assets } = await supabase
            .from('assets')
            .select('processed_text')
            .eq('project_id', projectId)
            .not('processed_text', 'is', null);

        let context = "";
        if (assets && assets.length > 0) {
            context = "Reference materials:\n";
            assets.forEach((asset, index) => {
                const text = asset.processed_text.substring(0, 1000);
                context += `${index + 1}. ${text}\n\n`;
            });
        }

        // Determine word count based on length
        const wordCounts: Record<string, number> = {
            short: 50,
            medium: 150,
            long: 300
        };
        const targetWords = wordCounts[length] || 150;

        const prompt = `
You are a creative writer continuing a story. Analyze the style and tone of the existing text, then continue writing seamlessly in the same style.

${context}

Current text:
"${currentText}"

Continue writing for approximately ${targetWords} words. Match the existing style, tone, and voice. Use Markdown for formatting (headings, **bold**, *italic*, lists) where appropriate. Only return the continuation text, nothing else.
        `;

        const continuationText = await generateContent(prompt, userData.gemini_api_key);

        res.json({ continuation: continuationText.trim() });

    } catch (error) {
        console.error('Continue writing error:', error);
        res.status(500).json({ error: 'Failed to continue writing' });
    }
});

router.post('/analyze-style', async (req, res) => {
    const { text } = req.body;
    const userId = req.headers['user-id'] as string;

    if (!text || !userId) {
        res.status(400).json({ error: 'Text and User ID are required' });
        return;
    }

    try {
        const { data: userData, error: userError } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();

        if (userError || !userData?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found' });
            return;
        }

        const prompt = `
Analyze the writing style of the following text and suggest 3 alternative styles it could be rewritten in.

Text: "${text}"

Provide:
1. Current style description
2. Three suggested alternative styles with descriptions

Format as JSON:
{
  "currentStyle": "description of current style",
  "suggestedStyles": [
    { "name": "Formal Academic", "description": "Scholarly and precise" },
    { "name": "Conversational", "description": "Friendly and casual" },
    { "name": "Poetic", "description": "Lyrical and expressive" }
  ]
}

Only return the JSON, no other text.
        `;

        const responseText = await generateContent(prompt, userData.gemini_api_key);
        const jsonMatch = responseText.match(/\{.*\}/s);
        const jsonString = jsonMatch ? jsonMatch[0] : '{}';

        let analysis;
        try {
            analysis = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse style analysis:", responseText);
            analysis = {
                currentStyle: "Unknown",
                suggestedStyles: []
            };
        }

        res.json(analysis);

    } catch (error) {
        console.error('Style analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze style' });
    }
});

router.post('/rewrite-style', async (req, res) => {
    const { text, targetStyle, projectId } = req.body;
    const userId = req.headers['user-id'] as string;

    if (!text || !targetStyle || !userId) {
        res.status(400).json({ error: 'Text, target style, and User ID are required' });
        return;
    }

    try {
        const { data: userData, error: userError } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();

        if (userError || !userData?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found' });
            return;
        }

        const prompt = `
Rewrite the following text in a ${targetStyle} style. Maintain the same meaning and key points, but adjust the tone, word choice, and sentence structure to match the target style. Use Markdown for formatting (**bold**, *italic*, etc.) if appropriate for the style.

Original text: "${text}"

Target style: ${targetStyle}

Only return the rewritten text, nothing else.
        `;

        const rewrittenText = await generateContent(prompt, userData.gemini_api_key);

        res.json({
            rewrittenText: rewrittenText.trim(),
            styleApplied: targetStyle
        });

    } catch (error) {
        console.error('Style rewrite error:', error);
        res.status(500).json({ error: 'Failed to rewrite in new style' });
    }
});

export default router;

=======
import { Router } from 'express';
import { generateContent, streamContent } from '../services/gemini.service';
import { supabase } from '../services/supabase.service';

const router = Router();

router.post('/generate', async (req, res) => {
    const { prompt } = req.body;
    const userId = req.headers['user-id'] as string;

    if (!prompt || !userId) {
        res.status(400).json({ error: 'Prompt and User ID are required' });
        return;
    }

    try {
        // Fetch user's API key
        const { data, error } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();

        if (error || !data?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found. Please complete onboarding.' });
            return;
        }

        const text = await generateContent(prompt, data.gemini_api_key);
        res.json({ text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});

router.post('/stream', async (req, res) => {
    const { prompt } = req.body;
    const userId = req.headers['user-id'] as string;

    if (!prompt || !userId) {
        res.status(400).json({ error: 'Prompt and User ID are required' });
        return;
    }

    try {
        const { data, error } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();

        if (error || !data?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found' });
            return;
        }

        const stream = await streamContent(prompt, data.gemini_api_key);

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        for await (const chunk of stream) {
            const chunkText = chunk.text();
            res.write(chunkText);
        }
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to stream content' });
    }
});

router.post('/suggestions', async (req, res) => {
    const { projectId, currentText, cursorPosition } = req.body;
    const userId = req.headers['user-id'] as string;

    if (!projectId || !userId) {
        res.status(400).json({ error: 'Project ID and User ID are required' });
        return;
    }

    try {
        // 1. Get User API Key
        const { data: userData, error: userError } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();

        if (userError || !userData?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found' });
            return;
        }

        // 2. Fetch Project Assets (Context)
        const { data: assets, error: assetsError } = await supabase
            .from('assets')
            .select('processed_text, type, url')
            .eq('project_id', projectId)
            .not('processed_text', 'is', null);

        if (assetsError) throw assetsError;

        // 3. Construct Context
        let context = "";
        if (assets && assets.length > 0) {
            context = "Here is some background context from the project resources:\n\n";
            assets.forEach((asset, index) => {
                // Truncate long assets to avoid token limits (simple truncation for MVP)
                const text = asset.processed_text.substring(0, 2000);
                context += `--- Resource ${index + 1} (${asset.url}) ---\n${text}\n\n`;
            });
        }

        // 4. Construct Prompt
        const prompt = `
        You are an expert ghostwriter and editor.
        
        ${context}
        
        Here is the text the user is currently writing:
        "${currentText}"
        
        Based on the context and the current text, provide 3 short, specific suggestions for what to write next or how to improve the current paragraph.
        
        Format the output as a JSON array of objects with 'type' (continuation, improvement, idea) and 'text' properties.
        Example:
        [
            {"type": "continuation", "text": "The door creaked open..."},
            {"type": "improvement", "text": "Consider using stronger verbs..."},
            {"type": "idea", "text": "Maybe reveal the secret now..."}
        ]
        Only return the JSON array, no other text.
        `;

        // 5. Generate with Gemini
        const responseText = await generateContent(prompt, userData.gemini_api_key);

        // Clean up response to ensure valid JSON
        const jsonMatch = responseText.match(/\[.*\]/s);
        const jsonString = jsonMatch ? jsonMatch[0] : '[]';

        let suggestions;
        try {
            suggestions = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse AI response:", responseText);
            suggestions = [];
        }

        res.json({ suggestions });

    } catch (error) {
        console.error('Suggestion generation error:', error);
        res.status(500).json({ error: 'Failed to generate suggestions' });
    }
});

router.post('/improvements', async (req, res) => {
    const { selectedText, contextBefore, contextAfter, projectId, maxSuggestions = 10 } = req.body;
    const userId = req.headers['user-id'] as string;

    if (!selectedText || !userId) {
        res.status(400).json({ error: 'Selected text and User ID are required' });
        return;
    }

    try {
        // Get User API Key
        const { data: userData, error: userError } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();

        if (userError || !userData?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found' });
            return;
        }

        // Construct prompt for improvements
        const prompt = `
You are an expert editor. Analyze the following text and provide ${Math.min(maxSuggestions, 100)} specific improvements.

Context before: "${contextBefore || ''}"
Selected text to improve: "${selectedText}"
Context after: "${contextAfter || ''}"

For each improvement, provide:
1. Type: grammar, clarity, style, or conciseness
2. The improved version of the text (use Markdown for formatting like **bold**, *italic* if needed)
3. A brief reason for the change

Format as a JSON array:
[
  {
    "type": "grammar",
    "improved": "corrected text here",
    "reason": "Fixed subject-verb agreement"
  }
]

Only return the JSON array, no other text.
        `;

        const responseText = await generateContent(prompt, userData.gemini_api_key);

        // Parse JSON response
        const jsonMatch = responseText.match(/\[.*\]/s);
        const jsonString = jsonMatch ? jsonMatch[0] : '[]';

        let improvements;
        try {
            improvements = JSON.parse(jsonString);
            // Add IDs and original text to each improvement
            improvements = improvements.map((imp: any, index: number) => ({
                id: `imp-${index}`,
                type: imp.type || 'style',
                original: selectedText,
                improved: imp.improved || imp.text || '',
                reason: imp.reason || ''
            }));
        } catch (e) {
            console.error("Failed to parse AI response:", responseText);
            improvements = [];
        }

        res.json({ improvements });

    } catch (error) {
        console.error('Improvements generation error:', error);
        res.status(500).json({ error: 'Failed to generate improvements' });
    }
});

router.post('/continue', async (req, res) => {
    const { currentText, cursorPosition, projectId, length = 'medium' } = req.body;
    const userId = req.headers['user-id'] as string;

    if (!currentText || !userId) {
        res.status(400).json({ error: 'Current text and User ID are required' });
        return;
    }

    try {
        // Get User API Key
        const { data: userData, error: userError } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();

        if (userError || !userData?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found' });
            return;
        }

        // Fetch project assets for context
        const { data: assets } = await supabase
            .from('assets')
            .select('processed_text')
            .eq('project_id', projectId)
            .not('processed_text', 'is', null);

        let context = "";
        if (assets && assets.length > 0) {
            context = "Reference materials:\n";
            assets.forEach((asset, index) => {
                const text = asset.processed_text.substring(0, 1000);
                context += `${index + 1}. ${text}\n\n`;
            });
        }

        // Determine word count based on length
        const wordCounts: Record<string, number> = {
            short: 50,
            medium: 150,
            long: 300
        };
        const targetWords = wordCounts[length] || 150;

        const prompt = `
You are a creative writer continuing a story. Analyze the style and tone of the existing text, then continue writing seamlessly in the same style.

${context}

Current text:
"${currentText}"

Continue writing for approximately ${targetWords} words. Match the existing style, tone, and voice. Use Markdown for formatting (headings, **bold**, *italic*, lists) where appropriate. Only return the continuation text, nothing else.
        `;

        const continuationText = await generateContent(prompt, userData.gemini_api_key);

        res.json({ continuation: continuationText.trim() });

    } catch (error) {
        console.error('Continue writing error:', error);
        res.status(500).json({ error: 'Failed to continue writing' });
    }
});

router.post('/analyze-style', async (req, res) => {
    const { text } = req.body;
    const userId = req.headers['user-id'] as string;

    if (!text || !userId) {
        res.status(400).json({ error: 'Text and User ID are required' });
        return;
    }

    try {
        const { data: userData, error: userError } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();

        if (userError || !userData?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found' });
            return;
        }

        const prompt = `
Analyze the writing style of the following text and suggest 3 alternative styles it could be rewritten in.

Text: "${text}"

Provide:
1. Current style description
2. Three suggested alternative styles with descriptions

Format as JSON:
{
  "currentStyle": "description of current style",
  "suggestedStyles": [
    { "name": "Formal Academic", "description": "Scholarly and precise" },
    { "name": "Conversational", "description": "Friendly and casual" },
    { "name": "Poetic", "description": "Lyrical and expressive" }
  ]
}

Only return the JSON, no other text.
        `;

        const responseText = await generateContent(prompt, userData.gemini_api_key);
        const jsonMatch = responseText.match(/\{.*\}/s);
        const jsonString = jsonMatch ? jsonMatch[0] : '{}';

        let analysis;
        try {
            analysis = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse style analysis:", responseText);
            analysis = {
                currentStyle: "Unknown",
                suggestedStyles: []
            };
        }

        res.json(analysis);

    } catch (error) {
        console.error('Style analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze style' });
    }
});

router.post('/rewrite-style', async (req, res) => {
    const { text, targetStyle, projectId } = req.body;
    const userId = req.headers['user-id'] as string;

    if (!text || !targetStyle || !userId) {
        res.status(400).json({ error: 'Text, target style, and User ID are required' });
        return;
    }

    try {
        const { data: userData, error: userError } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .single();

        if (userError || !userData?.gemini_api_key) {
            res.status(403).json({ error: 'Gemini API Key not found' });
            return;
        }

        const prompt = `
Rewrite the following text in a ${targetStyle} style. Maintain the same meaning and key points, but adjust the tone, word choice, and sentence structure to match the target style. Use Markdown for formatting (**bold**, *italic*, etc.) if appropriate for the style.

Original text: "${text}"

Target style: ${targetStyle}

Only return the rewritten text, nothing else.
        `;

        const rewrittenText = await generateContent(prompt, userData.gemini_api_key);

        res.json({
            rewrittenText: rewrittenText.trim(),
            styleApplied: targetStyle
        });

    } catch (error) {
        console.error('Style rewrite error:', error);
        res.status(500).json({ error: 'Failed to rewrite in new style' });
    }
});

export default router;

>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
