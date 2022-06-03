import type { SupabaseClientOptions } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { name as appName } from 'package.json';

type TypedWindow = Window &
  typeof globalThis & {
    ENV: {
      SUPABASE_URL: string;
      SUPABASE_KEY: string;
    };
  };

const supabaseOptions: SupabaseClientOptions = {
  schema: 'public',
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
  headers: { 'x-application-name': appName },
};
const customWindow = window as TypedWindow;
const supabaseUrl = customWindow.ENV.SUPABASE_URL;
const supabaseKey = customWindow.ENV.SUPABASE_KEY;

export const supabaseClient = createClient(supabaseUrl, supabaseKey, supabaseOptions);
