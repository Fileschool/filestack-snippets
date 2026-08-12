import { useEffect, useState } from 'react';
import { PickerOverlay } from 'filestack-react';
import type { Security } from 'filestack-react';

import { logResult } from '../filestack';

// A signed policy is generated on the server, never in the browser, because signing
// needs the app secret. The client only ever receives the finished policy and signature.
// Run `npm run policy-server` alongside `npm run dev` for this example.
export default function SecurePicker() {
  const [security, setSecurity] = useState<Security | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8787/filestack-policy')
      .then((response) => response.json())
      .then((data: Security) => setSecurity(data))
      .catch(() => setSecurity(null));
  }, []);

  if (!security) {
    return (
      <div>
        <h2>Signed policy</h2>
        <p>Start the policy server first, then reload.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Signed policy</h2>
      <p>The picker below is scoped by a policy that expires, and the browser never sees the secret.</p>

      <button onClick={() => setOpen(true)}>Upload with a policy</button>

      {open && (
        <PickerOverlay
          clientOptions={{ security }}
          onUploadDone={logResult('secure')}
        />
      )}
    </div>
  );
}
