const V = 'arc-v4';
const ASSETS = [
  './', './index.html', './404.html', './manifest.webmanifest', './icon.svg',
  './assets/style.css', './assets/play.css', './assets/core.js', './assets/doc.svg',
  './g/snake.html', './g/breakout.html', './g/tetris.html', './g/2048.html',
  './g/flappy.html', './g/minesweeper.html', './g/pong.html', './g/asteroids.html',
  './g/doodle.html', './g/connect4.html', './g/memory.html', './g/invaders.html',
  './g/sudoku.html'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  if (new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(r, { ignoreSearch: true }).then(hit => {
      const net = fetch(r).then(res => {
        if (res && res.ok) caches.open(V).then(c => c.put(r, res.clone()));
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
