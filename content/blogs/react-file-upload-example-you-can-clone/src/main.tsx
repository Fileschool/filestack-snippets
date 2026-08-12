import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { FilestackProvider } from 'filestack-react';

import App from './App';
import { apikey, basePickerOptions, baseClientOptions, logResult } from './filestack';

// FilestackProvider is the v7 addition that removes the repeated apikey prop.
// Every picker below it reads apikey, pickerOptions, clientOptions and the callbacks
// from context. A component that sets its own prop still wins, so a single picker can
// override the app default without the provider being reconfigured.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FilestackProvider
      apikey={apikey}
      pickerOptions={basePickerOptions}
      clientOptions={baseClientOptions}
      onUploadDone={logResult('app')}
      onError={(error) => console.error('picker error', error)}
    >
      <App />
    </FilestackProvider>
  </StrictMode>,
);
