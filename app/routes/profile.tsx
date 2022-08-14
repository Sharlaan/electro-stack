import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData, useTransition } from '@remix-run/react';
import { Button } from '~/components/Button';
import type { ProfileDB } from '~/models';
import { getSession, isAuthenticated } from '~/services/auth.service.server';
import { supabaseServer } from '~/services/supabase/supabase.server';
import { unauthorizedResponse } from '~/utils/httpResponseErrors';

export const loader: LoaderFunction = async ({ request }) => {
  if (!(await isAuthenticated(request))) throw unauthorizedResponse();
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get('email');
  const first_name = (form.get('firstname') || undefined) as string | undefined;
  const last_name = (form.get('lastname') || undefined) as string | undefined;

  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');

  // create the user in profiles table
  const { error: updateError } = await supabaseServer
    .from<ProfileDB>('profiles')
    .update({ id: userId, first_name, last_name });

  return updateError ? { error: updateError } : json({ success: 'Profile updated successfully !' });
};

export default function ProfilePage() {
  const actionData = useActionData();
  const transition = useTransition();

  return (
    <>
      <h2>Profile Page</h2>

      <Form method="post" className="form-template">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />

        <label htmlFor="firstname">First name</label>
        <input type="text" id="firstname" name="firstname" />

        <label htmlFor="lastname">Last name</label>
        <input type="text" id="lastname" name="lastname" />

        <Button>UPDATE</Button>
      </Form>
      <small>Form State: {transition.state}</small>

      {actionData?.success ? <div className="success">{actionData.success}</div> : null}
      {actionData?.error?.message ? <div className="error">{actionData.error.message}</div> : null}
    </>
  );
}
