import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { NavLink } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { MdLogin, MdLogout, MdPerson, MdPersonAdd, MdSettings } from 'react-icons/md';
import { useMount } from 'react-use';
import { destroySession, getSession } from '~/services/auth.service.server';
import { supabaseClient } from '~/services/supabase/supabase.client';
import { Button } from '../Button';

/**
 * IMPLICIT Strategy
 *
 * Handles the logout via an implicit form submit which asks server to destroy the user session;
 * then, by default, this logs the user out of application (since no more access-token available in session)
 */
export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  console.log('Does session have an access token ?', session.has('access_token'));

  return redirect('/auth/login', {
    headers: { 'Set-Cookie': await destroySession(session) },
  });
};

export function SideMenu() {
  // const authContext = useAuth();
  // const { auth } = authContext || {};
  // console.log('AuthContext', { auth, session: auth?.session() });
  const [user, setUser] = useState<User | null>(null);
  useMount(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log({ event, session });
      event === 'SIGNED_IN' && setUser(session?.user || null);
      event === 'SIGNED_OUT' && setUser(null);
    });
    return () => authListener?.unsubscribe();
  });

  return (
    <aside>
      <h2>
        <NavLink to="/">TITLE</NavLink>
      </h2>

      <nav>
        <NavLink to="/examples">Examples Section</NavLink>
        <NavLink to="/tatas">Tatas Section</NavLink>
        <NavLink to="/titis">Titis Section</NavLink>
        <NavLink to="/totos">Totos Section</NavLink>
      </nav>

      <div className="spacer"></div>

      <section>
        {
          /* auth?.session()?.access_token */ user ? (
            <>
              <NavLink to="/profile">
                <MdPerson />
                Profile
              </NavLink>
              <NavLink to="/settings">
                <MdSettings />
                Settings
              </NavLink>
              <hr />
              <form method="post">
                <Button variant="flat">
                  <MdLogout />
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <NavLink to="/auth/login">
                <MdLogin />
                LOGIN
              </NavLink>
              <NavLink to="/auth/register">
                <MdPersonAdd />
                REGISTER
              </NavLink>
            </>
          )
        }
      </section>
    </aside>
  );
}
