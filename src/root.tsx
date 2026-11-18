import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import type { ReactNode } from 'react';
import type { Route } from './+types/root';
import stylesheet from '@/index.css?url';
import { ThemeProvider } from '@/hooks/use-theme.jsx';
import { WorkspaceProvider } from '@/hooks/use-workspace.jsx';

const prepareMicroGramReturn = `
  if (
    performance.getEntriesByType('navigation')[0]?.type === 'back_forward' &&
    history.state?.microgramPortfolioReturn &&
    matchMedia('(prefers-reduced-motion: no-preference)').matches
  ) {
    document.documentElement.setAttribute('data-microgram-return', '');
  }
`;

export const links: Route.LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  { rel: 'preload', as: 'image', href: `${import.meta.env.BASE_URL}microgram-startup.png` },
  { rel: 'icon', href: `${import.meta.env.BASE_URL}favicon.svg`, type: 'image/svg+xml' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400..700&family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@700&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap' },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="only light" />
        <script dangerouslySetInnerHTML={{ __html: prepareMicroGramReturn }} />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <WorkspaceProvider>{children}</WorkspaceProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
