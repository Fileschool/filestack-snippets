import { Links, Meta, Outlet, Scripts, useLoaderData } from '@remix-run/react';
import { FilestackProvider } from 'filestack-react';

// Remix has no client-side process.env, so the key reaches the browser through a loader.
// That is more ceremony than Vite's import.meta.env and it means the key can change
// without a rebuild.
export function loader() {
  return { apikey: process.env.FILESTACK_API_KEY ?? 'YOUR_API_KEY' };
}

// Remix has no server component boundary, so the provider can sit in the root
// directly. The callbacks are ordinary closures and never cross a serialization line.
export default function App() {
  const { apikey } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <FilestackProvider
          apikey={apikey}
          pickerOptions={{ accept: ['image/*'], maxFiles: 3 }}
          onUploadDone={(result) => console.log(result.filesUploaded)}
        >
          <Outlet />
        </FilestackProvider>
        <Scripts />
      </body>
    </html>
  );
}
