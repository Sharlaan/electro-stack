import type { Session } from '@remix-run/node';
import { createCookieSessionStorage } from '@remix-run/node';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '~/models';
import { getProfile } from './profile.service';
import { supabaseServer } from './supabase/supabase.server';

interface AuthPayload {
  email: string;
  password: string;
}

export interface SessionUser {
  id: User['id'];
  firstName: Profile['firstName'];
}

interface Error {
  error: string | null;
}

interface LoginReturn extends Error {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

interface RegisterReturn extends Error {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

interface SignOutUserReturn extends Error {
  done: boolean;
}

interface GetUserReturn extends Error {
  user: User | null;
}

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is required');
}

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
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
  },
});

/** Updates remix's session with tokens from Supabase's auth provider */
export async function updateAuthSession(
  session2update: Session,
  supabaseUser: User,
  accessToken: string,
  refreshToken: string
): Promise<Session> {
  session2update.set('access_token', accessToken);
  session2update.set('refresh_token', refreshToken);

  // Get the user profile and set that also
  const profile = await getProfile();
  if (profile) {
    const user: SessionUser = {
      id: supabaseUser.id,
      firstName: profile.firstName,
    };
    session2update.set('user', user);
  }

  return session2update;
}

export async function isAuthenticated(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  const access_token = session.get('access_token');
  return !!access_token;
}

export async function refreshToken(session: Session): Promise<LoginReturn> {
  try {
    const { data: sessionData, error } = await supabaseServer.auth.api.refreshAccessToken(
      session.get('refresh_token')
    );
    const { access_token, refresh_token, user } = sessionData || {};

    if (error || !user || !access_token || !refresh_token) {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: error?.message || 'Something went wrong',
      };
    }

    return { user, accessToken: access_token, refreshToken: refresh_token, error: null };
  } catch {
    return { user: null, accessToken: null, refreshToken: null, error: 'Something went wrong' };
  }
}

export async function login({ email, password }: AuthPayload): Promise<LoginReturn> {
  try {
    const { user, session, error } = await supabaseServer.auth.signIn({ email, password });
    const { access_token, refresh_token } = session || {};

    if (error || !user || !access_token || !refresh_token) {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: error?.message || 'Something went wrong',
      };
    }

    return { user, accessToken: access_token, refreshToken: refresh_token, error: null };
  } catch {
    return { user: null, accessToken: null, refreshToken: null, error: 'Something went wrong' };
  }
}

export async function register({ email, password }: AuthPayload): Promise<RegisterReturn> {
  try {
    const { user, session, error } = await supabaseServer.auth.signUp({ email, password });
    const { access_token, refresh_token } = session || {};

    if (error || !user || !access_token || !refresh_token) {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: error?.message || 'Something went wrong',
      };
    }

    return { user, accessToken: access_token, refreshToken: refresh_token, error: null };
  } catch {
    return { user: null, accessToken: null, refreshToken: null, error: 'Something went wrong' };
  }
}

export async function signOut(session: Session): Promise<SignOutUserReturn> {
  try {
    const { error } = await supabaseServer.auth.api.signOut(session.get('access_token'));

    if (error) {
      return { done: false, error: error?.message || 'Something went wrong' };
    }

    return { done: true, error: null };
  } catch {
    return { done: false, error: 'Something went wrong' };
  }
}

export async function getUserFromSession(request: Request): Promise<SessionUser | null> {
  const session = await getSession(request.headers.get('Cookie'));
  return session.get('user') as SessionUser | null;
}

export async function getUserByAccessToken(accessToken: string): Promise<GetUserReturn> {
  try {
    const { user, error } = await supabaseServer.auth.api.getUser(accessToken);

    if (error || !user) {
      return { user: null, error: error?.message || 'Something went wrong' };
    }

    return { user, error: null };
  } catch {
    return { user: null, error: 'Something went wrong' };
  }
}
