import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ErrorCaughtNotification, ExampleForm } from '~/components';
import type { Example, ExampleDB } from '~/models/example';
import { supabase } from '~/services/supabase.server';
import { notFoundResponse } from '~/utils/httpResponseErrors';
import { snakeToCamelObject } from '~/utils/snakeCamelConverters';

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const id = params.id as string;

  // TODO: Handle null cases against the db schema
  const property = formData.get('property');
  if (typeof property !== 'string') throw Error('"Input "property" is not a string');

  const updates: Example = {
    name: formData.get('name'),
    type: formData.get('type'),
    property,
    array_property: formData.getAll('arrayProperty'),
  };

  await supabase.from<ExampleDB>('examples').update(updates, { returning: 'minimal' }).eq('id', id);

  return redirect(`/examples/${id}`);
};

export const loader: LoaderFunction = async ({ params }) => {
  const data = await supabase
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
