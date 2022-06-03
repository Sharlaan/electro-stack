import type { ActionFunction, LinksFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Link, useLoaderData, useTransition } from '@remix-run/react';
import { DeleteButton, ErrorCaughtNotification } from '~/components';
import type { Example, ExampleDB } from '~/models';
import { supabaseServer } from '~/services/supabase/supabase.server';
import styles from '~/styles/example-details.css';
import { notFoundResponse } from '~/utils/httpResponseErrors';
import { snakeToCamelObject } from '~/utils/snakeCamelConverters';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

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

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  if (formData.get('_method') === 'delete') {
    await supabaseServer
      .from<ExampleDB>('examples')
      .delete()
      .eq('id', params.id as string);

    return redirect('/examples');
  }
};

export function CatchBoundary() {
  return <ErrorCaughtNotification />;
}

export default function ExampleDetails() {
  const example = useLoaderData<Example>();
  const { id, name, type, property, arrayProperty } = example;
  const transition = useTransition();

  return (
    <section className="example-details">
      <header>
        <div>
          <h3 style={{ marginRight: 10 }}>{name}</h3>
          <span>({type})</span>
        </div>

        <aside>
          <Link to={`/examples/edit/${id}`}>🖊️ EDIT</Link>
          <DeleteButton />
        </aside>
      </header>

      <small>Form State: {transition.state}</small>

      <p>{property}</p>

      {arrayProperty.map((subExample, i) => (
        <p key={i}>{subExample}</p>
      ))}
    </section>
  );
}
