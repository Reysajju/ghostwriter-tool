<<<<<<< HEAD
import { Router } from 'express';
import multer from 'multer';
import { extractText } from '../services/contentProcessor.service';
import { supabase } from '../services/supabase.service';
import fs from 'fs';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Upload a resource
router.post('/upload', upload.single('file'), async (req, res) => {
    const { projectId } = req.body;

    if (!req.file || !projectId) {
        res.status(400).json({ error: 'File and Project ID are required' });
        return;
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const originalName = req.file.originalname;

    try {
        // 1. Extract text
        let extractedText = '';
        try {
            extractedText = await extractText(filePath, mimeType);
        } catch (err) {
            console.warn('Text extraction failed or unsupported type:', err);
            // We still save the file metadata even if text extraction fails (e.g. for images/audio later)
        }

        // 2. Save to Supabase assets table
        const { data, error } = await supabase
            .from('assets')
            .insert({
                project_id: projectId,
                type: mimeType,
                url: originalName, // For MVP we store filename, later real URL
                processed_text: extractedText,
                tags: ['resource']
            })
            .select()
            .single();

        if (error) throw error;

        // Cleanup temp file
        fs.unlinkSync(filePath);

        res.json(data);
    } catch (error) {
        console.error('Resource upload error:', error);
        res.status(500).json({ error: 'Failed to process resource' });
        // Cleanup temp file
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
});

// Get all resources for a project
router.get('/:projectId', async (req, res) => {
    const { projectId } = req.params;

    try {
        const { data, error } = await supabase
            .from('assets')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Get resources error:', error);
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
});

// Delete a resource
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('assets')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Resource deleted' });
    } catch (error) {
        console.error('Delete resource error:', error);
        res.status(500).json({ error: 'Failed to delete resource' });
    }
});

export default router;
=======
import { Router } from 'express';
import multer from 'multer';
import { extractText } from '../services/contentProcessor.service';
import { supabase } from '../services/supabase.service';
import fs from 'fs';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Upload a resource
router.post('/upload', upload.single('file'), async (req, res) => {
    const { projectId } = req.body;

    if (!req.file || !projectId) {
        res.status(400).json({ error: 'File and Project ID are required' });
        return;
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const originalName = req.file.originalname;

    try {
        // 1. Extract text
        let extractedText = '';
        try {
            extractedText = await extractText(filePath, mimeType);
        } catch (err) {
            console.warn('Text extraction failed or unsupported type:', err);
            // We still save the file metadata even if text extraction fails (e.g. for images/audio later)
        }

        // 2. Save to Supabase assets table
        const { data, error } = await supabase
            .from('assets')
            .insert({
                project_id: projectId,
                type: mimeType,
                url: originalName, // For MVP we store filename, later real URL
                processed_text: extractedText,
                tags: ['resource']
            })
            .select()
            .single();

        if (error) throw error;

        // Cleanup temp file
        fs.unlinkSync(filePath);

        res.json(data);
    } catch (error) {
        console.error('Resource upload error:', error);
        res.status(500).json({ error: 'Failed to process resource' });
        // Cleanup temp file
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
});

// Get all resources for a project
router.get('/:projectId', async (req, res) => {
    const { projectId } = req.params;

    try {
        const { data, error } = await supabase
            .from('assets')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Get resources error:', error);
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
});

// Delete a resource
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('assets')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Resource deleted' });
    } catch (error) {
        console.error('Delete resource error:', error);
        res.status(500).json({ error: 'Failed to delete resource' });
    }
});

export default router;
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
