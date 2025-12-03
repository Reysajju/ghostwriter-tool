"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_service_1 = require("../services/supabase.service");
const router = (0, express_1.Router)();
// Get all projects for a user
router.get('/', async (req, res) => {
    const userId = req.headers['user-id']; // Assuming passed from frontend for now
    if (!userId) {
        res.status(400).json({ error: 'User ID required' });
        return;
    }
    const { data, error } = await supabase_service_1.supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);
    if (error) {
        res.status(500).json({ error: error.message });
    }
    else {
        res.json(data);
    }
});
// Create a new project
router.post('/', async (req, res) => {
    const { title, description, userId } = req.body;
    const { data, error } = await supabase_service_1.supabase
        .from('projects')
        .insert([{ title, description, user_id: userId }])
        .select();
    if (error) {
        res.status(500).json({ error: error.message });
    }
    else {
        res.json(data[0]);
    }
});
// Get a single project
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase_service_1.supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        res.status(404).json({ error: 'Project not found' });
    }
    else {
        res.json(data);
    }
});
exports.default = router;
