'use client';

import { FilestackProvider } from 'filestack-react';
import type { PickerResponse } from 'filestack-react';
import type { ReactNode } from 'react';

// This file is the whole trick of the App Router integration.
//
// filestack-react ships its own 'use client' directive, so the components are client
// components already. That is not enough on its own: FilestackProvider takes function
// props (onUploadDone, onError), and functions cannot cross the server to client
// boundary. Declaring them in a Server Component fails at render, not at build.
//
// So the provider gets its own client component, the callbacks are defined here, and
// layout.tsx stays a Server Component that renders <Providers> around its children.
export default function Providers({ children }: { children: ReactNode }) {
  const onUploadDone = (result: PickerResponse) => {
    console.log('uploaded', result.filesUploaded.map((file) => file.handle));
  };

  return (
    <FilestackProvider
      apikey={process.env.NEXT_PUBLIC_FILESTACK_API_KEY ?? 'YOUR_API_KEY'}
      pickerOptions={{ accept: ['image/*'], maxFiles: 3 }}
      onUploadDone={onUploadDone}
    >
      {children}
    </FilestackProvider>
  );
}
