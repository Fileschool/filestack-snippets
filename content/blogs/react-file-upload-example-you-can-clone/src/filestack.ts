// Shared configuration for every example in this repo.
//
// The types below come from filestack-js, which v7 declares as a peer dependency.
// Import them from 'filestack-react' (it re-exports the type names) or from
// 'filestack-js' directly. Both resolve to the same declarations.
import type { PickerOptions, PickerResponse, ClientOptions } from 'filestack-react';

export const apikey: string = import.meta.env.VITE_FILESTACK_API_KEY ?? 'YOUR_API_KEY';

// Options handed to filestack-js as client.picker(options).
export const basePickerOptions: PickerOptions = {
  accept: ['image/*', 'application/pdf'],
  maxFiles: 5,
  fromSources: ['local_file_system', 'url'],
};

// Options handed to the underlying Filestack(apikey, clientOptions) call.
export const baseClientOptions: ClientOptions = {};

// One typed handler shared by the examples. PickerResponse splits the result into
// files that uploaded and files that did not, so both have to be read.
export function logResult(label: string) {
  return (result: PickerResponse): void => {
    for (const file of result.filesUploaded) {
      console.log(`${label} uploaded`, file.filename, file.handle, file.mimetype);
    }
    for (const file of result.filesFailed) {
      console.warn(`${label} failed`, file.filename);
    }
  };
}

// The CDN URL for a handle. The handle identifies the application, so no API key
// belongs in a delivery URL.
export function cdnUrl(handle: string, task?: string): string {
  return task
    ? `https://cdn.filestackcontent.com/${task}/${handle}`
    : `https://cdn.filestackcontent.com/${handle}`;
}
