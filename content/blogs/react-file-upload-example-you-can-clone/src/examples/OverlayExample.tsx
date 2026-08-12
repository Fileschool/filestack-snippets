import { useState } from 'react';
import { PickerOverlay } from 'filestack-react';
import type { PickerResponse } from 'filestack-react';

import { cdnUrl } from '../filestack';

// PickerOverlay mounts a modal over the page. It opens as soon as it is rendered,
// so it belongs behind a piece of state rather than in the tree unconditionally.
export default function OverlayExample() {
  const [open, setOpen] = useState(false);
  const [handles, setHandles] = useState<string[]>([]);

  const handleDone = (result: PickerResponse) => {
    setHandles(result.filesUploaded.map((file) => file.handle));
    setOpen(false);
  };

  return (
    <div>
      <h2>PickerOverlay</h2>
      <p>A modal over the current page. Best when uploading is an interruption, not the task.</p>

      <button onClick={() => setOpen(true)}>Upload a file</button>

      {open && <PickerOverlay onUploadDone={handleDone} />}

      <ul>
        {handles.map((handle) => (
          <li key={handle}>
            <a href={cdnUrl(handle)} target="_blank" rel="noreferrer">
              {handle}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
