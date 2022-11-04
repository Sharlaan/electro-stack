import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from '@remix-run/react';
import type { Session, SupabaseClient } from '@supabase/auth-helpers-remix';
import { createBrowserClient, createServerClient } from '@supabase/auth-helpers-remix';
import { memo, useState } from 'react';
import { useMount, useUpdateEffect } from 'react-use';

import { Footer, SideMenu } from './components';
import type { Database } from './database.types';

import buttonStyles from '~/styles/buttons.css';
import colors from '~/styles/colors-hsl.css';
import formStyles from '~/styles/forms.css';
import globalStyles from '~/styles/global.css';
import headerMenuStyles from '~/styles/header-menu.css';
import heartBeatAnimation from '~/styles/heart-beat.css';

export type ContextType = {
  supabaseBrowserClient: SupabaseClient<Database> | null;
  session: Session | null;
};

type LoaderData = {
  env: Record<'SUPABASE_URL' | 'SUPABASE_KEY', string>;
  initialSession: Session | null;
};

export const links: LinksFunction = () =>
  [
    'https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css',
    'https://fonts.googleapis.com/css?family=Montserrat',
    'https://fonts.googleapis.com/css?family=Open+Sans',
    globalStyles,
    colors,
    buttonStyles,
    formStyles,
    heartBeatAnimation,
    headerMenuStyles,
  ].map((href) => ({ rel: 'stylesheet', href }));

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix / Supabase / Vercel - Template',
  viewport: 'width=device-width,initial-scale=1',
});

export const loader: LoaderFunction = async ({ request }) => {
  // environment variables may be stored somewhere other than
  // `process.env` in runtimes other than node
  // we need to pipe these Supabase environment variables to the browser
  const { SUPABASE_URL, SUPABASE_KEY } = process.env;

  // We can retrieve the session on the server and hand it to the client.
  // This is used to make sure the session is available immediately upon rendering
  const response = new Response();
  const supabaseClient = createServerClient<Database>(SUPABASE_URL!, SUPABASE_KEY!, {
    request,
    response,
  });
  const {
    data: { session: initialSession },
  } = await supabaseClient.auth.getSession();

  // in order for the set-cookie header to be set,
  // headers must be returned as part of the loader response
  return json(
    {
      initialSession,
      env: {
        SUPABASE_URL,
        SUPABASE_KEY,
      },
    },
    { headers: response.headers }
  );
};

export default function App() {
  const { env, initialSession } = useLoaderData<LoaderData>();
  const [supabaseBrowserClient, setSupabaseBrowserClient] =
    useState<SupabaseClient<Database> | null>(null);
  const [session, setSession] = useState<Session | null>(initialSession);

  const context: ContextType = { supabaseBrowserClient: supabaseBrowserClient, session };

  useMount(() => {
    if (!supabaseBrowserClient) {
      const supabaseClient = createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_KEY);
      setSupabaseBrowserClient(supabaseClient);
      const {
        data: { subscription },
      } = supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('Session', { event, session });
        // event === 'SIGNED_IN' && setUser(session?.user || null);
        // event === 'SIGNED_OUT' && setUser(null);
        setSession(session);
      });
      return () => subscription.unsubscribe();
    }
  });

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>

      <body>
        {/* <Header /> */}
        <SideMenu context={context} />
        <main>
          <Outlet context={context} />
          <div className="spacer"></div>
          <Footer />
        </main>
        {/* <Footer /> */}

        <RouteChangeAnnouncement />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

// export function CatchBoundary() {
// const { status, statusText } = useCatch();
//   return (
//     <App>
//       <ErrorCaughtNotification />
//     </App>
//   );
// }

// export function ErrorBoundary({ error }: { error: Error }) {
//   return (
//     <Document title="Error!">
//       <Layout>
//         <h1 className="error">An error occured</h1>
//         <p>{error.message}</p>
//         <hr />
//         <p>Hey, developer, you should replace this with what you want your users to see.</p>
//       </Layout>
//     </Document>
//   );
// }

/**
 * Provides an alert for screen reader users when the route changes.
 */
const RouteChangeAnnouncement = memo(function RouteChanged() {
  const [hydrated, setHydrated] = useState(false);
  const [innerHtml, setInnerHtml] = useState('');
  const { pathname } = useLocation();

  useMount(() => setHydrated(true));

  // Skip the first render because we don't want an announcement on the initial page load.
  useUpdateEffect(() => {
    const pageTitle = pathname === '/' ? 'Home page' : pathname;
    setInnerHtml(`Navigated to ${pageTitle}`);
  }, [pathname]);

  // Render nothing on the server. The live region provides no value unless
  // scripts are loaded and the browser takes over normal routing.
  if (!hydrated) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      aria-atomic
      id="route-change-region"
      style={{
        border: '0',
        clipPath: 'inset(100%)',
        clip: 'rect(0 0 0 0)',
        height: '1px',
        margin: '-1px',
        overflow: 'hidden',
        padding: '0',
        position: 'absolute',
        width: '1px',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
      }}
    >
      {innerHtml}
    </div>
  );
});
