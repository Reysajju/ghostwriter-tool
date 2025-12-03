<<<<<<< HEAD
import { Router } from 'express';
import multer from 'multer';
import { extractText } from '../services/contentProcessor.service';
import fs from 'fs';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    try {
        const text = await extractText(filePath, mimeType);

        // In a real app, we would save this to Supabase here.
        // For now, we return the extracted text so the frontend can display it or save it.

        // Cleanup
        fs.unlinkSync(filePath);

        res.json({ text, message: 'File processed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process file' });
        // Cleanup
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
});

export default router;
=======
import { Router } from 'express';
import multer from 'multer';
import { extractText } from '../services/contentProcessor.service';
import fs from 'fs';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    try {
        const text = await extractText(filePath, mimeType);

        // In a real app, we would save this to Supabase here.
        // For now, we return the extracted text so the frontend can display it or save it.

        // Cleanup
        fs.unlinkSync(filePath);

        res.json({ text, message: 'File processed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process file' });
        // Cleanup
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
});

export default router;
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
