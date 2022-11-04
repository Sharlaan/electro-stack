import type { CookieOptions } from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';
import type { Database } from '~/database.types';

if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is required');
}

if (!process.env.SUPABASE_KEY) {
  throw new Error('SUPABASE_KEY is required');
}

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is required');
}

const { SUPABASE_KEY, SUPABASE_URL } = process.env;

// const supabaseOptions: SupabaseClientOptions<'public'> = {
//   db: { schema: 'public' },
//   auth: {
//     autoRefreshToken: true,
//     detectSessionInUrl: true,
//     persistSession: true,
//   },
//   global: {
//     headers: { 'x-application-name': appName },
//   },
// };

const cookieOptions: CookieOptions = {
  // All these are optional
  // name: 'supabase-session',
  expires: new Date(Date.now() + 3600),
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30,
  path: '/',
  sameSite: 'lax',
  secrets: [process.env.SESSION_SECRET],

  // Normally you want this to be `secure: true`
  // but that doesn't work on localhost for Safari
  // https://web.dev/when-to-use-local-https/
  secure: process.env.NODE_ENV === 'production',
};

export function createSupabaseServerClient(request: Request, response: Response = new Response()) {
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    request,
    response,
    // cookieOptions,
  });
}
