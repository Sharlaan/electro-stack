import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { ErrorCaughtNotification, ExampleForm } from '~/components';
import type { ExampleDB, ExampleType } from '~/models';
import { ExampleEnum } from '~/models/example';
import { supabaseServer } from '~/services/supabase/supabase.server';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  // Handle null cases against the db schema
  const name = formData.get('name');
  if (typeof name !== 'string') throw Error('"Input "name" is not a string');

  const type = formData.get('type') as ExampleType;
  if (!type || !Object.values(ExampleEnum).includes(type))
    throw Error('"Input "type" is not a string');

  const property = formData.get('property');
  if (typeof property !== 'string') throw Error('"Input "property" is not a string');

  const arrayProperty = formData.getAll('arrayProperty');
  if (!Array.isArray(arrayProperty) || arrayProperty.some((prop) => typeof prop !== 'string'))
    throw Error('"Input "arrayProperty" is not an array of strings');

  const newExample: Omit<ExampleDB, 'id'> = {
    name,
    type,
    property,
    array_property: arrayProperty as string[],
  };

  const { data, error } = await supabaseServer
    .from<ExampleDB>('examples')
    .insert(newExample)
    .single();

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
