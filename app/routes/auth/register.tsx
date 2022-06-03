import type { ActionFunction, LinksFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, NavLink, useActionData, useTransition } from '@remix-run/react';
import type { ApiError, User } from '@supabase/supabase-js';
import { Button } from '~/components/Button';
import type { ProfileDB } from '~/models';
import { commitSession, getSession } from '~/services/auth.service.server';
import { supabaseServer } from '~/services/supabase/supabase.server';
import styles from '~/styles/login.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

interface ActionData {
  user: User | null;
  error: ApiError | null; // SignUpError or ProfileError
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get('email');
  const password = form.get('password');
  const first_name = form.get('firstname');
  const last_name = form.get('lastname');

  await supabaseServer.auth.signOut();

  const {
    session: sessionData,
    user,
    error,
  } = await supabaseServer.auth.signUp({ email, password });

  if (!error && user) {
    const { data: updatedUsers, error: profileError } = await supabaseServer
      .from<ProfileDB>('profiles')
      .insert({ id: user?.id, first_name, last_name });

    console.log({ updatedUsers, profileError });

    if (profileError) return { user: updatedUsers?.[0], error: profileError };

    const session = await getSession(request.headers.get('Cookie'));
    session.set('access_token', sessionData?.access_token);
    session.set('userId', user.id);
    session.set('username', updatedUsers[0].first_name);

    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  return { user, error };
};

export default function RegisterPage() {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();

  return (
    <>
      <h2>Create New Account Page</h2>

      <Form method="post" className="form-template">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />

        <label htmlFor="firstname">First name</label>
        <input type="text" id="firstname" name="firstname" />

        <label htmlFor="lastname">Last name</label>
        <input type="text" id="lastname" name="lastname" />

        <Button>REGISTER</Button>
        <NavLink to="/auth/login">Already have an account ?</NavLink>
      </Form>
      <small>Form State: {transition.state}</small>

      {actionData?.error?.message ? <div className="error">{actionData.error.message}</div> : null}
    </>
  );
}
