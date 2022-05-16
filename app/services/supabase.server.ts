import { createClient } from '@supabase/supabase-js';

const { SUPABASE_KEY, SUPABASE_URL } = process.env;

if (!SUPABASE_KEY || !SUPABASE_URL)
  throw new Error('Can not initialize Supabase client: required env variables are not set.');

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
