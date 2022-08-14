import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useLocation,
} from '@remix-run/react';
import type { PropsWithChildren } from 'react';
import { memo, useState } from 'react';
import { useMount, useUpdateEffect } from 'react-use';
import buttonStyles from '~/styles/buttons.css';
import colors from '~/styles/colors-hsl.css';
import formStyles from '~/styles/forms.css';
import globalStyles from '~/styles/global.css';
import headerMenuStyles from '~/styles/header-menu.css';
import heartBeatAnimation from '~/styles/heart-beat.css';
import { ErrorCaughtNotification, Footer, SideMenu } from './components';
import type { SessionUser } from './services/auth.service.server';
import { getUserFromSession } from './services/auth.service.server';

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
  viewport: 'width=device-width,initial-scale=1',
});

export interface LoaderData {
  user: SessionUser | null;
  ENV: {
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
  };
}
export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await getUserFromSession(request);

  return json({
    user: sessionUser,
    ENV: {
      SUPABASE_URL: process.env.SUPABASE_URL || '',
      SUPABASE_KEY: process.env.SUPABASE_KEY || '',
    },
  });
};

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
      {/* <AuthProvider>
        <Layout>
          <Outlet />
        </Layout>
      </AuthProvider> */}
    </Document>
  );
}

function Document({
  children,
  title = 'Remix / Supabase / Vercel - Template',
}: PropsWithChildren<{ title?: string }>) {
  const { ENV } = useLoaderData<LoaderData>();

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <Meta />
        <Links />
      </head>

      <body>
        {children}
        <RouteChangeAnnouncement />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
      </body>
    </html>
  );
}

function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      {/* <Header /> */}
      <SideMenu />
      <main>
        {children}
        <div className="spacer"></div>
        <Footer />
      </main>
      {/* <Footer /> */}
    </>
  );
}

export function CatchBoundary() {
  const { status, statusText } = useCatch();
  return (
    <Document title={`${status} ${statusText}`}>
      <Layout>
        <ErrorCaughtNotification />
      </Layout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <Layout>
        <h1 className="error">An error occured</h1>
        <p>{error.message}</p>
        <hr />
        <p>Hey, developer, you should replace this with what you want your users to see.</p>
      </Layout>
    </Document>
  );
}

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
