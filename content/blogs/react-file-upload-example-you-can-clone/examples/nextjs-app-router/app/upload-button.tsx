'use client';

import { useState } from 'react';
import { PickerOverlay } from 'filestack-react';

// The picker opens on render, so it sits behind state. useState makes this a client
// component regardless, which is why the directive is at the top of this file too.
export default function UploadButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Upload</button>
      {open && <PickerOverlay onUploadDone={() => setOpen(false)} />}
    </>
  );
}
