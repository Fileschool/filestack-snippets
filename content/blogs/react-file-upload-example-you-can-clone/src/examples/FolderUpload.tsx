import { useState } from 'react';
import { PickerOverlay } from 'filestack-react';
import type { PickerResponse } from 'filestack-react';

// Folder upload is a filestack-js v4 capability, which v7 reaches because it moved
// filestack-js to a peer dependency instead of pinning its own copy. Turning it on is
// one picker option; what changes is the result, which now arrives as a whole tree.
export default function FolderUpload() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  const onUploadDone = (result: PickerResponse) => {
    setCount(result.filesUploaded.length);
    setOpen(false);
  };

  return (
    <div>
      <h2>Folder upload</h2>
      <p>
        With <code>allowManualRetry</code> and folder selection enabled, the local file
        system source accepts a directory and uploads everything inside it.
      </p>

      <button onClick={() => setOpen(true)}>Choose a folder</button>

      {open && (
        <PickerOverlay
          onUploadDone={onUploadDone}
          pickerOptions={{
            fromSources: ['local_file_system'],
            maxFiles: 100,
            allowManualRetry: true,
uploadInBackground: false,
          }}
        />
      )}

      {count !== null && <p>{count} files uploaded.</p>}
    </div>
  );
}
