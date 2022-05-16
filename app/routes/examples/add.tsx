import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { ErrorCaughtNotification, ExampleForm } from '~/components';
import type { ExampleDB } from '~/models';
import { supabase } from '~/services/supabase.server';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  // TODO: Handle null cases against the db schema

  const newExample: ExampleDB = {
    name: formData.get('name'),
    type: formData.get('type'),
    property: formData.get('property'),
    array_property: formData.getAll('arrayProperty'),
  };

  const { data, error } = await supabase.from<ExampleDB>('examples').insert(newExample).single();

  if (error) {
    return redirect(`/examples`);
  }

  return redirect(`/examples/${data?.id}`);
};

export default function AddExample() {
  return <ExampleForm title="New example" />;
}

export function CatchBoundary() {
  return <ErrorCaughtNotification />;
}
