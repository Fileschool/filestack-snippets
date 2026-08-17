# filestack-react v7 examples

Every code sample in the Filestack blog's React v7 series lives here, so the articles can
stay short and you can run the thing instead of assembling it from snippets.

Verified on 6 August 2026 against `filestack-react@7.0.1`, `filestack-js@4.x`,
React 19.2 (Vite and Next.js) and React 18.3.1 (Remix).

## Quick start

```bash
git clone https://github.com/Fileschool/filestack-snippets.git
cd filestack-snippets/content/blogs/react-file-upload-example-you-can-clone
npm install
cp .env.example .env
npm run dev
```

Get a free API key at [filestack.com/signup-free](https://filestack.com/signup-free).
The key is safe in the browser. It identifies the application; it is not a secret.

## What is in here

The root app is Vite, React 19 and TypeScript. The two framework integrations are separate
apps with their own `package.json`, because they need their own toolchains.

| Path | What it shows |
|---|---|
| `src/main.tsx` | `FilestackProvider` configured once for the whole app |
| `src/filestack.ts` | shared typed options and a typed result handler |
| `src/examples/OverlayExample.tsx` | `PickerOverlay`, the modal |
| `src/examples/InlineExample.tsx` | `PickerInline`, the in-page picker |
| `src/examples/DropPaneExample.tsx` | `PickerDropPane`, the drop target |
| `src/examples/CustomContainer.tsx` | mounting a picker inside your own styled element |
| `src/examples/TypedCallbacks.tsx` | `PickerResponse` and `PickerFileMetadata` under strict TypeScript |
| `src/examples/FolderUpload.tsx` | uploading a whole directory |
| `src/examples/SecurePicker.tsx` | a picker scoped by a signed policy |
| `server/policy-server.mjs` | signing policies on the server, with no dependencies |
| `examples/nextjs-app-router/` | App Router, Server Components and the provider boundary |
| `examples/remix/` | Remix, and gating the picker out of the server render |
| `docs/upgrade-v6-to-v7.md` | the v6 to v7 changes in one page |

## Commands

```bash
npm run dev          # the Vite app on :5173
npm run typecheck    # tsc --noEmit, strict
npm run build        # typecheck then production build
npm run policy-server  # the signing endpoint on :8787, for SecurePicker
```

The two framework examples install separately:

```bash
cd examples/nextjs-app-router && npm install && npm run build
cd examples/remix            && npm install && npm run build
```

## Two things worth knowing before you start

**`filestack-js` is a peer dependency in v7.** It is no longer bundled inside
`filestack-react`, so it goes in your own `package.json`. That is what stops you shipping two
copies of it, and it is what gives you the v4 client methods.

**The picker is a large dependency.** In the Vite build here it is most of a 786 kB bundle,
197 kB gzipped. Remix splits it into its own 580 kB chunk automatically. If your first paint
matters, load the picker behind an interaction rather than at the top of the page.

## Licence

MIT.
