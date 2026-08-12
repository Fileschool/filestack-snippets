import { PickerInline } from 'filestack-react';

import { logResult } from '../filestack';

// Every picker component accepts one child element. When you pass one, the component
// clones it and sets the generated DOM id on it, then mounts the picker inside. That is
// the supported way to put the picker in a container you style yourself, instead of the
// default div. The child must accept an id prop, so a plain element or a component that
// spreads its props onto one.
export default function CustomContainer() {
  return (
    <div>
      <h2>Your own container</h2>
      <p>
        Pass a single child element and the picker mounts inside it, keeping whatever
        border, radius, height and background you gave it.
      </p>

      <PickerInline onUploadDone={logResult('custom-container')}>
        <div
          style={{
            height: 420,
            border: '1px solid #d0d0d0',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        />
      </PickerInline>
    </div>
  );
}
