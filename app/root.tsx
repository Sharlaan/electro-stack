import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
} from '@remix-run/react';
import type { PropsWithChildren, ReactNode } from 'react';
import { memo, useState } from 'react';
import { useMount, useUpdateEffect } from 'react-use';
import buttonStyles from '~/styles/buttons.css';
import colors from '~/styles/colors-hsl.css';
import formStyles from '~/styles/forms.css';
import globalStyles from '~/styles/global.css';
import heartBeatAnimation from '~/styles/heart-beat.css';
import { ErrorCaughtNotification, Footer, Header, SideMenu } from './components';

export const links: LinksFunction = () =>
  [
    'https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css',
    'https://fonts.googleapis.com/css?family=Open+Sans',
    globalStyles,
    colors,
    buttonStyles,
    formStyles,
    heartBeatAnimation,
  ].map((href) => ({ rel: 'stylesheet', href }));

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title = 'Remix / Supabase / Vercel - Template',
}: {
  children: ReactNode;
  title?: string;
}) {
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
      </body>
    </html>
  );
}

function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <Header />
      <SideMenu />
      <main>{children}</main>
      <Footer />
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
