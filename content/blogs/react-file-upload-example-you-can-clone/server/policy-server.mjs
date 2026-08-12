// Minimal signed-policy endpoint. Node 18+, no dependencies.
//
// A Filestack policy is base64url JSON; the signature is an HMAC-SHA256 of that string
// keyed with the app secret. The secret stays here. The browser receives only the pair.
//
//   node server/policy-server.mjs
//
import { createHmac } from 'node:crypto';
import { createServer } from 'node:http';

const APP_SECRET = process.env.FILESTACK_APP_SECRET ?? 'YOUR_APP_SECRET';
const PORT = 8787;

function signPolicy(policy) {
  const encoded = Buffer.from(JSON.stringify(policy)).toString('base64url');
  const signature = createHmac('sha256', APP_SECRET).update(encoded).digest('hex');
  return { policy: encoded, signature };
}

createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!req.url?.startsWith('/filestack-policy')) {
    res.writeHead(404).end();
    return;
  }

  // Scope every policy: what it may do, and when it stops working. An expiry is the
  // one field that is never optional, because a policy without it never stops being valid.
  const oneHourFromNow = Math.floor(Date.now() / 1000) + 60 * 60;
  const { policy, signature } = signPolicy({
    expiry: oneHourFromNow,
    call: ['pick', 'read', 'store'],
    maxSize: 10 * 1024 * 1024,
  });

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ policy, signature }));
}).listen(PORT, () => {
  console.log(`policy server on http://localhost:${PORT}/filestack-policy`);
});
