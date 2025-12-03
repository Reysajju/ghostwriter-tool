<<<<<<< HEAD
import { Router } from 'express';
import { supabase } from '../services/supabase.service';

const router = Router();

// Get all projects for a user
router.get('/', async (req, res) => {
    const userId = req.headers['user-id']; // Assuming passed from frontend for now
    if (!userId) {
        res.status(400).json({ error: 'User ID required' });
        return;
    }

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.json(data);
    }
});

// Create a new project
router.post('/', async (req, res) => {
    const { title, description, userId } = req.body;

    const { data, error } = await supabase
        .from('projects')
        .insert([{ title, description, user_id: userId }])
        .select();

    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.json(data[0]);
    }
});

// Get a single project
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        res.status(404).json({ error: 'Project not found' });
    } else {
        res.json(data);
    }
});

// Update a project
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, content } = req.body;

    try {
        const updates: any = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;

        // If content is provided, store it in settings (JSONB)
        if (content !== undefined) {
            // First fetch current settings to merge
            const { data: current, error: fetchError } = await supabase
                .from('projects')
                .select('settings')
                .eq('id', id)
                .single();

            if (!fetchError && current) {
                const currentSettings = current.settings || {};
                updates.settings = { ...currentSettings, content };
            } else {
                // If fetch fails, just set content
                updates.settings = { content };
            }
        }

        const { data, error } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json(data[0]);
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
=======
import { Router } from 'express';
import { supabase } from '../services/supabase.service';

const router = Router();

// Get all projects for a user
router.get('/', async (req, res) => {
    const userId = req.headers['user-id']; // Assuming passed from frontend for now
    if (!userId) {
        res.status(400).json({ error: 'User ID required' });
        return;
    }

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.json(data);
    }
});

// Create a new project
router.post('/', async (req, res) => {
    const { title, description, userId } = req.body;

    const { data, error } = await supabase
        .from('projects')
        .insert([{ title, description, user_id: userId }])
        .select();

    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.json(data[0]);
    }
});

// Get a single project
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        res.status(404).json({ error: 'Project not found' });
    } else {
        res.json(data);
    }
});

// Update a project
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, content } = req.body;

    try {
        const updates: any = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;

        // If content is provided, store it in settings (JSONB)
        if (content !== undefined) {
            // First fetch current settings to merge
            const { data: current, error: fetchError } = await supabase
                .from('projects')
                .select('settings')
                .eq('id', id)
                .single();

            if (!fetchError && current) {
                const currentSettings = current.settings || {};
                updates.settings = { ...currentSettings, content };
            } else {
                // If fetch fails, just set content
                updates.settings = { content };
            }
        }

        const { data, error } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json(data[0]);
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
