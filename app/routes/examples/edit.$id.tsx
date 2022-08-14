import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ErrorCaughtNotification, ExampleForm } from '~/components';
import type { ExampleType } from '~/models';
import type { Example, ExampleDB } from '~/models/example';
import { ExampleEnum } from '~/models/example';
import { supabaseServer } from '~/services/supabase/supabase.server';
import { notFoundResponse } from '~/utils/httpResponseErrors';
import { snakeToCamelObject } from '~/utils/snakeCamelConverters';

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const id = params.id as string;

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

  const updates: Omit<ExampleDB, 'id'> = {
    name,
    type,
    property,
    array_property: arrayProperty as string[],
  };

  await supabaseServer
    .from<ExampleDB>('examples')
    .update(updates, { returning: 'minimal' })
    .eq('id', id);

  return redirect(`/examples/${id}`);
};

export const loader: LoaderFunction = async ({ params }) => {
  const data = await supabaseServer
    .from<ExampleDB>('examples')
    .select('*')
    .eq('id', params.id as string)
    .single()
    .then(({ data }) => (data ? snakeToCamelObject(data) : null));

  if (!data) {
    throw notFoundResponse();
  }

  return data;
};

export default function EditExample() {
  const example = useLoaderData<Example>();

  return <ExampleForm title="Edit example" example={example} />;
}

export function CatchBoundary() {
  return <ErrorCaughtNotification />;
}
