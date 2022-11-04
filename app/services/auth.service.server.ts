import { createSupabaseServerClient } from './supabase/supabase.server';

export async function isAuthenticated(request: Request) {
  const supabaseServerClient = createSupabaseServerClient(request);
  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();
  return !!session?.user;
}
