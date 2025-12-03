<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Key is missing. Database operations will fail.');
}

// Using service role key for server-side operations to bypass RLS
export const supabase = createClient(supabaseUrl, supabaseKey);
=======
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Key is missing. Database operations will fail.');
}

// Using service role key for server-side operations to bypass RLS
export const supabase = createClient(supabaseUrl, supabaseKey);
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
