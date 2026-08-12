import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// filestack-js ships a browser build. Nothing special is needed for it under Vite 7,
// which is the point of the v7 ESM/CJS export fix.
export default defineConfig({
  plugins: [react()],
});
