import type { ActionFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, NavLink, useActionData, useTransition } from '@remix-run/react';
import type { AuthError, User } from '@supabase/supabase-js';

import { Button } from '~/components/Button';
import { createSupabaseServerClient } from '~/services/supabase/supabase.server';
import styles from '~/styles/login.css';
import { badRequest } from '~/utils/httpResponseErrors';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

interface ActionData {
  user: User | null;
  error: AuthError | null; // SignUpError or ProfileError
}

export const action: ActionFunction = async ({ request }) => {
  const {
    email,
    password,
    firstname: first_name,
    lastname: last_name,
  } = Object.fromEntries(await request.formData());
  const response = new Response();
  const supabaseServerClient = createSupabaseServerClient(request, response);

  const { error: logoutError } = await supabaseServerClient.auth.signOut();
  if (logoutError) throw logoutError;

  if (!email || !password) {
    return badRequest({ user: null, error: 'Email and Password are required' });
  }
  if (
    email instanceof File ||
    password instanceof File ||
    first_name instanceof File ||
    last_name instanceof File
  ) {
    return badRequest({ user: null, error: 'Email and Password must be string, not files' });
  }

  const user_metadata =
    !first_name && !last_name
      ? undefined
      : {
          ...(first_name && { first_name }),
          ...(last_name && { last_name }),
        };

  const { data /*: { user, session: sessionData }*/, error } =
    await supabaseServerClient.auth.signUp({
      email,
      password,
      options: { data: user_metadata },
    });

  // in order for the set-cookie header to be set,
  // headers must be returned as part of the loader response
  return json({ data, error }, { headers: response.headers });
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
