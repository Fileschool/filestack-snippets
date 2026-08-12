import { useState } from 'react';

import OverlayExample from './examples/OverlayExample';
import InlineExample from './examples/InlineExample';
import DropPaneExample from './examples/DropPaneExample';
import CustomContainer from './examples/CustomContainer';
import TypedCallbacks from './examples/TypedCallbacks';
import FolderUpload from './examples/FolderUpload';
import SecurePicker from './examples/SecurePicker';

const examples = {
  overlay: { label: 'PickerOverlay', node: <OverlayExample /> },
  inline: { label: 'PickerInline', node: <InlineExample /> },
  droppane: { label: 'PickerDropPane', node: <DropPaneExample /> },
  container: { label: 'Custom container', node: <CustomContainer /> },
  typed: { label: 'Typed callbacks', node: <TypedCallbacks /> },
  folder: { label: 'Folder upload', node: <FolderUpload /> },
  secure: { label: 'Signed policy', node: <SecurePicker /> },
} as const;

type ExampleKey = keyof typeof examples;

export default function App() {
  const [active, setActive] = useState<ExampleKey>('overlay');

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 820, margin: '2rem auto' }}>
      <h1>filestack-react v7 examples</h1>
      <nav style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
        {(Object.keys(examples) as ExampleKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            style={{ fontWeight: key === active ? 700 : 400, padding: '0.4rem 0.7rem' }}
          >
            {examples[key].label}
          </button>
        ))}
      </nav>
      <section>{examples[active].node}</section>
    </main>
  );
}
