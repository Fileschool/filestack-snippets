import { useEffect, useState } from 'react';
import { PickerInline } from 'filestack-react';

// The picker touches window as it mounts, so it must not render during the server
// pass. A mounted flag is the smallest gate that works and keeps hydration matched:
// the server and the first client render both produce the placeholder.
export default function Index() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <main>
      <h1>Upload</h1>
      {mounted ? (
        <div style={{ height: 500 }}>
          <PickerInline />
        </div>
      ) : (
        <div style={{ height: 500 }} />
      )}
    </main>
  );
}
