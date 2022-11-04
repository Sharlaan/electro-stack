import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import type { Example } from '~/models/example';
import { createSupabaseServerClient } from '~/services/supabase/supabase.server';

export const loader: LoaderFunction = async ({ request }) => {
  const supabaseServerClient = createSupabaseServerClient(request);
  const { data: examples } = await supabaseServerClient
    .from('examples')
    .select('id, name')
    .order('id');

  return examples;
};

export default function ExamplesList() {
  const examples = useLoaderData<Example[] | null>();

  return (
    <>
      <h2>List of examples</h2>

      <Link to="add">➕ Add a new example</Link>

      {examples?.length ? (
        <ul>
          {examples.map(({ id, name }) => (
            <li key={id}>
              <Link to={String(id)}>{name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nothing found in database</p>
      )}
    </>
  );
}
