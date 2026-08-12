import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// No Filestack-specific configuration is needed here, but getting to that point took one
// install. filestack-js imports tslib without declaring it as a dependency, so Remix's
// server pass fails with "Cannot find module 'tslib'" until you add it yourself:
//
//   npm install tslib
//
// Do not reach for ssr.noExternal to work around it. Bundling filestack-js into the server
// pass swaps that error for "require is not defined", because its ESM build still contains
// a CommonJS require in the Node request adapter. Leaving it external is correct.
// resolve.dedupe is here because this example lives inside a repository that has its own
// React in a parent node_modules. Without it the browser bundle can load two copies of
// React and every hook throws "Invalid hook call". A standalone project does not need it.
export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
});
