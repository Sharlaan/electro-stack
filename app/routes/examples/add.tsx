import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { ErrorCaughtNotification, ExampleForm } from '~/components';
import type { Database } from '~/database.types';
import type { ExampleTypes } from '~/models';
import { createSupabaseServerClient } from '~/services/supabase/supabase.server';

export const action: ActionFunction = async ({ request }) => {
  const { arrayProperty, name, property, type } = Object.fromEntries(await request.formData());

  // Handle null cases against the db schema
  if (typeof name !== 'string') throw Error('"Input "name" is not a string');

  function checkType(value: FormDataEntryValue): value is ExampleTypes {
    return typeof type === 'string' && ['Type A', 'Type B', 'Type C'].includes(type);
  }
  if (!checkType(type)) throw Error('"Input "type" is not a string');

  if (typeof property !== 'string') throw Error('"Input "property" is not a string');

  // @ts-ignore
  function checkArrayproperty(value: FormDataEntryValue): value is string[] {
    return Array.isArray(value) && value.every((prop) => typeof prop === 'string');
  }
  if (!checkArrayproperty(arrayProperty))
    throw Error('"Input "arrayProperty" is not an array of strings');

  const supabaseServerClient = createSupabaseServerClient(request);

  const newExample: Database['public']['Tables']['examples']['Insert'] = {
    name,
    type,
    property,
    array_property: arrayProperty as string[],
  };

  const { data, error } = await supabaseServerClient
    .from('examples')
    .insert(newExample)
    .select('id')
    .single();

  if (error) {
    return redirect(`/examples`);
  }

  return redirect(`/examples/${data.id}`);
};

export default function AddExample() {
  return <ExampleForm title="New example" />;
}

export function CatchBoundary() {
  return <ErrorCaughtNotification />;
}
