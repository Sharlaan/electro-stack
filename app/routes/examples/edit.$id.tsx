import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { ErrorCaughtNotification, ExampleForm } from '~/components';
import type { Database } from '~/database.types';
import type { Example, ExampleTypes } from '~/models/example';
import { createSupabaseServerClient } from '~/services/supabase/supabase.server';
import { notFoundResponse } from '~/utils/httpResponseErrors';
import { snakeToCamelObject } from '~/utils/snakeCamelConverters';

export const action: ActionFunction = async ({ request, params }) => {
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

  const updates: Database['public']['Tables']['examples']['Update'] = {
    name,
    type,
    property,
    array_property: arrayProperty as string[],
  };

  const { error } = await supabaseServerClient.from('examples').update(updates).eq('id', params.id);

  return redirect(`/examples/${error ? '' : params.id}`);
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const supabaseServerClient = createSupabaseServerClient(request);
  const data = await supabaseServerClient
    .from('examples')
    .select('*')
    .eq('id', params.id)
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
