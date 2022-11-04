import type { ActionFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, NavLink, useActionData, useSearchParams, useTransition } from '@remix-run/react';
import type { User } from '@supabase/auth-helpers-remix';

import { AuthSocialProviderButton } from '~/components';
import { Button } from '~/components/Button';
import { createSupabaseServerClient } from '~/services/supabase/supabase.server';
import largeStyles from '~/styles/login-large.css';
import styles from '~/styles/login.css';
import { badRequest } from '~/utils/httpResponseErrors';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: largeStyles, media: '(min-width: 990px)' },
];

interface ActionData {
  user: User | null;
  error: string | null;
}

export const action: ActionFunction = async ({ request }) => {
  const { email, password } = Object.fromEntries(await request.formData());

  if (!email || !password) {
    return badRequest({ user: null, error: 'Email and Password are required' });
  }
  if (email instanceof File || password instanceof File) {
    return badRequest({ user: null, error: 'Email and Password must be string, not files' });
  }

  const response = new Response();
  const supabaseServerClient = createSupabaseServerClient(request, response);

  const { data, error } = await supabaseServerClient.auth.signInWithPassword({ email, password });

  // in order for the set-cookie header to be set,
  // headers must be returned as part of the loader response
  return json({ data, error }, { headers: response.headers });
};

export default function LoginPage() {
  const response = useActionData<ActionData>();
  const transition = useTransition();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') ?? '/profile';

  return (
    <>
      <h2>Login Page</h2>

      <section className="responsive-stack">
        {/* {supabaseBrowserClient && !session && (
          <Auth
            redirectTo="http://localhost:3004"
            appearance={{ theme: ThemeSupa }}
            supabaseClient={supabaseBrowserClient}
            providers={['google', 'github']}
            socialLayout="horizontal"
          />
        )}

        <hr /> */}

        <div className="social-login-buttons stack">
          <AuthSocialProviderButton provider="google" />
          <AuthSocialProviderButton provider="apple" />
          <AuthSocialProviderButton provider="linkedin" />
          <AuthSocialProviderButton provider="github" />
          {/* <AuthSocialProviderButton provider="microsoft" /> */}
          <AuthSocialProviderButton provider="gitlab" />
        </div>

        <div className="separator">
          <hr />
          <span>OR</span>
          <hr />
        </div>

        <div>
          <Form method="post" className="form-template">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />

            <input type="hidden" name="returnUrl" value={returnUrl} />

            <Button>LOGIN</Button>

            <aside>
              Not registered yet ?<NavLink to="/auth/register">Create an Account</NavLink>
            </aside>
          </Form>
          <small>Form State: {transition.state}</small>
          {response?.error ? <div className="error">{response.error}</div> : null}
        </div>
      </section>
    </>
  );
}
