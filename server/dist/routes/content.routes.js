"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const contentProcessor_service_1 = require("../services/contentProcessor.service");
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    try {
        const text = await (0, contentProcessor_service_1.extractText)(filePath, mimeType);
        // In a real app, we would save this to Supabase here.
        // For now, we return the extracted text so the frontend can display it or save it.
        // Cleanup
        fs_1.default.unlinkSync(filePath);
        res.json({ text, message: 'File processed successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process file' });
        // Cleanup
        if (fs_1.default.existsSync(filePath))
            fs_1.default.unlinkSync(filePath);
    }
});
exports.default = router;
