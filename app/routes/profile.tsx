import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData, useTransition } from '@remix-run/react';

import { Button } from '~/components/Button';
import { isAuthenticated } from '~/services/auth.service.server';
import { createSupabaseServerClient } from '~/services/supabase/supabase.server';
import { badRequest, unauthorizedResponse } from '~/utils/httpResponseErrors';

export const loader: LoaderFunction = async ({ request }) => {
  if (!(await isAuthenticated(request))) throw unauthorizedResponse();
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const { firstName: first_name, lastName: last_name } = Object.fromEntries(
    await request.formData()
  );

  const response = new Response();
  const supabaseServerClient = createSupabaseServerClient(request, response);

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();
  const user = session?.user;

  if (!user?.id) {
    return badRequest({ user: null, error: 'User ID is required' });
  }
  if (first_name instanceof File || last_name instanceof File) {
    return badRequest({ user: null, error: 'First and last names must be string, not files' });
  }

  // create the user in profiles table
  const { error: updateError } = await supabaseServerClient
    .from('profiles')
    .update({ id: user.id, first_name, last_name });

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
