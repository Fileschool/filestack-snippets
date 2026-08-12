import { useState } from 'react';
import { PickerOverlay } from 'filestack-react';
import type { PickerResponse, PickerFileMetadata, FilestackError } from 'filestack-react';

import { cdnUrl } from '../filestack';

// v7 ships its own .d.ts files, so none of this needs a @types package and none of it
// needs an any. PickerFileMetadata is the per-file shape inside PickerResponse.
type UploadState =
  | { status: 'idle' }
  | { status: 'done'; files: PickerFileMetadata[] }
  | { status: 'error'; message: string };

export default function TypedCallbacks() {
  const [state, setState] = useState<UploadState>({ status: 'idle' });
  const [open, setOpen] = useState(false);

  const onUploadDone = (result: PickerResponse): void => {
    setState({ status: 'done', files: result.filesUploaded });
    setOpen(false);
  };

  const onError = (error: FilestackError | Error): void => {
    setState({ status: 'error', message: error.message });
    setOpen(false);
  };

  return (
    <div>
      <h2>Typed callbacks</h2>
      <p>
        The result type is checked at compile time, so a misspelled field on the response
        fails the build rather than the browser.
      </p>

      <button onClick={() => setOpen(true)}>Upload</button>
      {open && <PickerOverlay onUploadDone={onUploadDone} onError={onError} />}

      {state.status === 'error' && <p role="alert">{state.message}</p>}

      {state.status === 'done' && (
        <table>
          <thead>
            <tr>
              <th align="left">File</th>
              <th align="left">Type</th>
              <th align="left">Bytes</th>
              <th align="left">URL</th>
            </tr>
          </thead>
          <tbody>
            {state.files.map((file) => (
              <tr key={file.handle}>
                <td>{file.filename}</td>
                <td>{file.mimetype}</td>
                <td>{file.size}</td>
                <td>
                  <a href={cdnUrl(file.handle)} target="_blank" rel="noreferrer">
                    open
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
