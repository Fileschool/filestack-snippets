import UploadButton from './upload-button';

// A Server Component. It renders the client upload button but never touches
// the picker itself, so nothing here is sent to the browser except markup.
export default function Page() {
  return (
    <main>
      <h1>Upload</h1>
      <p>This page is server rendered. Only the button below ships JavaScript.</p>
      <UploadButton />
    </main>
  );
}
