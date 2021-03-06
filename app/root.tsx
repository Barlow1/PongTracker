import {
  json,
  Link,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useLocation,
} from 'remix';
import type { LinksFunction } from 'remix';
import globalStylesUrl from '~/styles/global.css';
import tailwindStyleUrls from '~/styles/tailwind.css';
import ThemeProvider, { Theme } from './components/ThemeProvider/ThemeProvider';
import { ReactNode } from 'react';
import useTheme from './hooks/useTheme';
import { Navigation } from './components/Navigation/Navigation';
import faCss from '@fortawesome/fontawesome-svg-core/styles.css';
import { Footer } from './components/Footer/Footer';
import { getThemeSession } from './utils/theme.session';
import { getUserSession } from './utils/user.session';
import { PlayerWithOrg } from './utils/types';
import { getUserWithOrg } from './services/user.server';

// https://remix.run/api/app#links
export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStylesUrl },
    { rel: 'stylesheet', href: tailwindStyleUrls },
    {
      rel: 'image',
      href: '/android-chrome-192x192.png',
    },
    {
      rel: 'stylesheet',
      href: faCss,
    },
  ];
};

export type LoaderData = {
  session: {
    theme: Theme | undefined;
    user: PlayerWithOrg | null;
  };
};

export const handle: { id: string } = {
  id: 'root',
};

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
  const theme = themeSession.getTheme();
  const userSession = await getUserSession(request);
  const sessionUser = userSession.getUser();
  let data: LoaderData;
  let user;
  if (sessionUser?.id) {
    user = await getUserWithOrg(sessionUser?.id);
  }
  if (user) {
    userSession.setUser(user);
    data = {
      session: {
        theme,
        user,
      },
    };
  } else {
    data = {
      session: { theme, user: null },
    };
  }
  return json(data, { headers: { 'Set-Cookie': await userSession.commit() } });
};

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const data = useLoaderData<LoaderData>();
  const theme = data.session.theme;
  return (
    <DocumentWithTheme theme={theme}>
      <Layout>
        <Outlet />
      </Layout>
    </DocumentWithTheme>
  );
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <DocumentWithTheme title="Error!">
      <Layout>
        <div>
          <h1>There was an unexpected error</h1>
          {process.env.NODE_ENV === 'development' && <p>{error.message}</p>}
          <hr />
          <p>Please try again in a few minutes.</p>
        </div>
      </Layout>
    </DocumentWithTheme>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <DocumentWithTheme title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </DocumentWithTheme>
  );
}
function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const [theme] = useTheme();
  const location = useLocation();
  return (
    <html lang="en" className={`${theme} bg-primary`}>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content={theme === "dark" ? "#171921" : "#ffffff" } />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="bg-primary">
        {location.pathname.includes('play') ? null : Header}
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

function DocumentWithTheme({
  children,
  theme,
  ...rest
}: {
  children: ReactNode;
  title?: string;
  theme?: Theme;
}): JSX.Element {
  return (
    <ThemeProvider suppliedTheme={theme}>
      <Document {...rest} title={'PongTracker'}>
        {children}
      </Document>
    </ThemeProvider>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <div className="main">{children}</div>
      <footer className="footer">
        <div className="container footer-content">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
export function Logo() {
  return (
    <Link
      to="/"
      className="block text-2xl font-medium transition text-primary underlined whitespace-nowrap focus:outline-none"
    >
      <div className="flex">
        <img
          className={'w-10 h-10 md:w-14 md:h-14'}
          src={'/android-chrome-192x192.png'}
        ></img>
        <h1 className="self-center pl-2">PongTracker</h1>
      </div>
    </Link>
  );
}

export const Header = (
  <header className="header">
    <div className="container header-content">
      <Logo />
      <Navigation />
    </div>
  </header>
);
