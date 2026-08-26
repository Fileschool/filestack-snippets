# Filestack Security Demo (Go)

A small Go program that demonstrates how Filestack file security controls the
delete (`remove`) operation.

## How Filestack security works

Authorization is done per request
with a **security policy** — a JSON document listing the permitted operations
(the `call` array) and an expiry. The policy is base64url-encoded and signed
with **HMAC-SHA256** using your **App Secret**. The `(policy, signature)` pair
is sent as query parameters and *is* the file's security for that request.

- A policy whose `call` list omits `remove` → cannot delete (HTTP 403).
- A policy whose `call` list includes `remove` → can delete (HTTP 200).

## What this program does

1. Builds a **restrictive** policy (`call: ["read", "stat"]`) and attempts to
   delete the file — Filestack rejects it.
2. Builds a **permissive** policy (`call: ["read", "stat", "remove"]`),
   re-signs it, and deletes the file successfully.

## Run it

```bash
go run .
```

Credentials can be provided with environment
variables:

```bash
FILESTACK_APP_KEY=...  FILESTACK_APP_SECRET=...  FILESTACK_HANDLE=...  go run .
```

## Note

Deleting a file is permanent. After a successful run, the handle no longer
resolves, so a second run will return a non-200 status on step 1 (the file is
already gone).
