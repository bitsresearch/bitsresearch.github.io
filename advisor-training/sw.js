let aesKey = null;

self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });

self.addEventListener('message', event => {
  if (!event.data || event.data.type !== 'SET_KEY') return;
  const raw = new Uint8Array(event.data.key);
  event.waitUntil((async () => {
    aesKey = await crypto.subtle.importKey('raw', raw, {name:'AES-GCM'}, false, ['decrypt']);
    if (event.ports && event.ports[0]) event.ports[0].postMessage('KEY_OK');
  })());
});

function mime(path) {
  const p = path.toLowerCase();
  if (p.endsWith('.html')) return 'text/html; charset=utf-8';
  if (p.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (p.endsWith('.css')) return 'text/css; charset=utf-8';
  if (p.endsWith('.png')) return 'image/png';
  if (p.endsWith('.jpg') || p.endsWith('.jpeg')) return 'image/jpeg';
  if (p.endsWith('.webp')) return 'image/webp';
  if (p.endsWith('.pdf')) return 'application/pdf';
  if (p.endsWith('.woff')) return 'font/woff';
  if (p.endsWith('.woff2')) return 'font/woff2';
  if (p.endsWith('.ttf')) return 'font/ttf';
  if (p.endsWith('.json')) return 'application/json; charset=utf-8';
  if (p.endsWith('.txt')) return 'text/plain; charset=utf-8';
  return 'application/octet-stream';
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname + 'protected/')) return;

  event.respondWith((async () => {
    if (!aesKey) {
      return new Response('<!doctype html><meta name="robots" content="noindex"><title>Access required</title><p>Please return to the training access page and enter the password.</p>', {
        status: 401,
        headers: {'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-store'}
      });
    }
    try {
      const encryptedResponse = await fetch(event.request, {cache:'no-store'});
      if (!encryptedResponse.ok) return encryptedResponse;
      const blob = new Uint8Array(await encryptedResponse.arrayBuffer());
      if (blob.length < 29) throw new Error('invalid encrypted file');
      const iv = blob.slice(0, 12);
      const ciphertext = blob.slice(12);
      const clear = await crypto.subtle.decrypt({name:'AES-GCM', iv}, aesKey, ciphertext);
      return new Response(clear, {
        status: 200,
        headers: {
          'Content-Type': mime(url.pathname),
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    } catch (e) {
      return new Response('Unable to decrypt this training resource. Please return to the access page and try again.', {
        status: 403,
        headers: {'Content-Type':'text/plain; charset=utf-8', 'Cache-Control':'no-store'}
      });
    }
  })());
});
