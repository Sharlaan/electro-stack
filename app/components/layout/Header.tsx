import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Link } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { MdLogin, MdPersonAdd } from 'react-icons/md';
import { useMount } from 'react-use';
import { destroySession, getSession } from '~/services/auth.service.server';
import { supabaseClient } from '~/services/supabase/supabase.client';
import { HeaderMenu } from '../HeaderMenu';

/**
 * Logging out process requires 2 steps:
 * - Notify Supabase remote auth manager to signout
 * - Notify backend to destroy the access-token in session
 */

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

export function Header() {
  // const authContext = useAuth();
  // const { auth } = authContext || {};
  // console.log('HEADER authContext', { auth, session: auth?.session() });
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
    <header>
      <Link to="/">TITLE</Link>

      {
        /* auth?.session()?.access_token */ user ? (
          <HeaderMenu user={user} />
        ) : (
          <aside>
            <Link to="/auth/login">
              <MdLogin />
              LOGIN
            </Link>
            <Link to="/auth/register">
              <MdPersonAdd />
              REGISTER
            </Link>
          </aside>
        )
      }
    </header>
  );
}

// ===================================================================

/**
 * EXPLICIT Strategy
 *
 * Alternative: does not require to wrap the logout button in a form,
 * but handles the redirect in a dedicated route /signout
 */
// export function HeaderWithAlternativeLogoutStrategy() {
//   const { auth } = useAuth();
//   const submit = useSubmit();

//   const handleSignOut = () => {
//     auth.signOut().then(() => {
//       submit(null, { method: 'post', action: '/signout' });
//     });
//   };

//   return (
//     <header>
//       <Link to="/">TITLE</Link>

//       {auth.session() ? (
//         <button type="button" onClick={handleSignOut}>
//           LOGOUT
//         </button>
//       ) : (
//         <Link to="/login">LOGIN</Link>
//       )}
//     </header>
//   );
// }

/**
 * Route signout.tsx, for alternative logout strategy
 */
// export const action: ActionFunction = async ({ request }) => {
//   const session = await getSession(request.headers.get('Cookie'));

//   return redirect('/auth', {
//     headers: {
//       'Set-Cookie': await destroySession(session),
//     },
//   });
// };

// export const loader = () => {
//   return redirect('/');
// };
