import type { ActionFunction, LinksFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, NavLink, useActionData, useSearchParams, useTransition } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import { AuthSocialProviderButton } from '~/components';
import { Button } from '~/components/Button';
import {
  commitSession,
  getSession,
  login,
  updateAuthSession,
} from '~/services/auth.service.server';
import { supabaseServer } from '~/services/supabase/supabase.server';
import largeStyles from '~/styles/login-large.css';
import styles from '~/styles/login.css';
import { badRequest, unauthorizedResponse } from '~/utils/httpResponseErrors';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: largeStyles, media: '(min-width: 990px)' },
];

interface ActionData {
  user: User | null;
  error: string | null;
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get('email');
  const password = form.get('password');
  const returnUrl = form.get('returnUrl');

  if (!email || !password) {
    return badRequest({ user: null, error: 'Email and Password are required' });
  }

  const { user, accessToken, refreshToken, error } = await login({ email, password });

  if (error || !user || !accessToken || !refreshToken)
    return unauthorizedResponse(error || undefined);

  supabaseServer.auth.setAuth(accessToken);
  let session = await getSession(request.headers.get('Cookie'));
  session = await updateAuthSession(session, user, accessToken, refreshToken);
  return redirect(returnUrl || '/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
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
        <div className="social-login-buttons stack">
          <AuthSocialProviderButton provider="google" returnUrl={returnUrl} />
          <AuthSocialProviderButton provider="apple" returnUrl={returnUrl} />
          <AuthSocialProviderButton provider="linkedin" returnUrl={returnUrl} />
          <AuthSocialProviderButton provider="github" returnUrl={returnUrl} />
          {/* <AuthSocialProviderButton provider="microsoft" returnUrl={returnUrl} /> */}
          {/* <AuthSocialProviderButton provider="gitlab" returnUrl={returnUrl} /> */}
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
