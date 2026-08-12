# Upgrading filestack-react from v6 to v7

Verified against `filestack-react@7.0.1` on 6 August 2026.

## 1. Install filestack-js yourself

v7 moves `filestack-js` from a dependency to a peer dependency.

```bash
npm install filestack-react@^7.0.1 filestack-js@^4.0.1
```

If you already had `filestack-js` in your `package.json`, you are now shipping one copy
instead of two.

## 2. Pick one upload callback

In v6, providing both `onSuccess` and `onUploadDone` called both on every upload. In v7
`onUploadDone` fires and `onSuccess` is only the fallback when `onUploadDone` is absent.

```diff
 <PickerOverlay
-  onSuccess={track}
-  onUploadDone={track}
+  onUploadDone={track}
 />
```

If you were relying on the double call, your analytics were counting every upload twice.

## 3. Expect silence

v6 logged the full result object to the console on every successful upload, twice. v7 logs
nothing when you pass no callback. If a console line was how you knew an upload worked, add a
callback.

## 4. Move shared configuration to the provider

Optional, and the main reason to bother upgrading on a large codebase.

```diff
-<PickerOverlay apikey={KEY} pickerOptions={opts} onUploadDone={done} />
-<PickerInline  apikey={KEY} pickerOptions={opts} onUploadDone={done} />
+<FilestackProvider apikey={KEY} pickerOptions={opts} onUploadDone={done}>
+  <PickerOverlay />
+  <PickerInline />
+</FilestackProvider>
```

Component props still win over the provider, so a single picker can differ without the
provider changing. Option objects are shallow-merged with the provider's as the base.

## 5. Drop your type shims

Type declarations ship in the package. Remove any local `declare module 'filestack-react'`
file, and there is no `@types/filestack-react` to install.

## 6. Remove SSR workarounds

`'use client'` is on both builds, IDs come from `useId()`, and the ESM and CJS export maps
are corrected. Dynamic-import wrappers and `transpilePackages` entries added to work around
v6 can usually go. Remove them one at a time and rebuild.

## What did not change

Props, component names and the picker options object are the same. The upgrade is a version
bump plus the callback change for most applications.
