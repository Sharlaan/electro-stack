import type { SupabaseClientOptions } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { name as appName } from 'package.json';

if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is required');
}

if (!process.env.SUPABASE_KEY) {
  throw new Error('SUPABASE_KEY is required');
}

const supabaseOptions: SupabaseClientOptions = {
  schema: 'public',
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
  headers: { 'x-application-name': appName },
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabaseServer = createClient(supabaseUrl, supabaseKey, supabaseOptions);
