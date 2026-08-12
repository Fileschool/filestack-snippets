import { PickerDropPane } from 'filestack-react';

import { logResult } from '../filestack';

// PickerDropPane is a drop target only. It has no source list and no browse chrome,
// so it is the one to reach for when the surrounding form already does the explaining.
export default function DropPaneExample() {
  return (
    <div>
      <h2>PickerDropPane</h2>
      <p>A drop zone with no cloud sources and no modal. The smallest of the three.</p>

      <div style={{ height: 220, border: '2px dashed #999', borderRadius: 8 }}>
        <PickerDropPane
          onUploadDone={logResult('droppane')}
          pickerOptions={{ maxFiles: 10 }}
        />
      </div>
    </div>
  );
}
