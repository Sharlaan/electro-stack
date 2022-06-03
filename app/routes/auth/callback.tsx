import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useFetcher, useSearchParams } from '@remix-run/react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useMount } from 'react-use';
import { commitSession, getSession, updateAuthSession } from '~/services/auth.service.server';
import { supabaseClient } from '~/services/supabase/supabase.client';
import { unauthorizedResponse } from '~/utils/httpResponseErrors';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formDataSession = formData.get('session') as string | null;
  const event = formData.get('event') as AuthChangeEvent | null;
  const redirectTo = String(formData.get('redirectTo')) || '/profile';

  if (!formDataSession || !event) {
    return redirect('/auth/login');
  }

  const supabaseSession: Session = JSON.parse(formDataSession);
  const { access_token, refresh_token, user } = supabaseSession;

  if (!user || !access_token || !refresh_token) return unauthorizedResponse();

  let session = await getSession(request.headers.get('Cookie'));
  session = await updateAuthSession(session, user, access_token, refresh_token);

  const redirectUrlByEvent: Record<AuthChangeEvent, string> = {
    SIGNED_IN: redirectTo,
    SIGNED_OUT: '/',
    PASSWORD_RECOVERY: '/auth/change-password',
    TOKEN_REFRESHED: '/',
    USER_UPDATED: '/profile',
    USER_DELETED: '/',
  };

  const redirectionHeaders = redirectUrlByEvent[event]
    ? {
        headers: { 'Set-Cookie': await commitSession(session) },
      }
    : undefined;

  return redirect(redirectUrlByEvent[event] || '/auth/login', redirectionHeaders);
};

/**
 * This virtual component serves as frontside catcher for the return OAuth callback containing the tokens;
 * which then triggers a form action request, to then execute the auth controller in 'Action' above.
 *
 * It will mount/unmount at each call to this endpoint from supabase oauth service
 */
export default function AuthCallback() {
  const fetcher = useFetcher();
  const [searchParams] = useSearchParams();

  useMount(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      const formData = new FormData();
      formData.append('session', JSON.stringify(session));
      formData.append('event', event);
      formData.append('redirectTo', searchParams.get('redirectTo') || '/profile');

      fetcher.submit(formData, { method: 'post' });
    });

    return () => authListener?.unsubscribe();
  });

  return null;
}
