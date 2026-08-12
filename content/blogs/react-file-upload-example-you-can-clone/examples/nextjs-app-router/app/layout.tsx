import type { ReactNode } from 'react';

import Providers from './providers';

// Still a Server Component. It renders a client component, which is allowed;
// what is not allowed is passing it a function from here.
export const metadata = {
  title: 'filestack-react v7 on the App Router',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
