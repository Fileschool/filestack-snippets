import { PickerInline } from 'filestack-react';

import { logResult } from '../filestack';

// PickerInline renders the picker into the page instead of over it. With no children
// it renders its own 500px-tall div, which is why the wrapper below sets the height.
export default function InlineExample() {
  return (
    <div>
      <h2>PickerInline</h2>
      <p>The picker as part of the page. Best when uploading is the whole point of the screen.</p>

      <div style={{ height: 500 }}>
        <PickerInline onUploadDone={logResult('inline')} />
      </div>
    </div>
  );
}
