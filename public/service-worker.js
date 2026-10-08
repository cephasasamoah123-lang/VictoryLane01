const CACHE_NAME = 'victory-lane-v3'
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icons/victory-lane-icon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return

  // Let the browser handle MP4 range requests itself. Caching media responses
  // here can interrupt initial playback and make the hero video appear only
  // after a reload.
  const requestUrl = new URL(event.request.url)
  if (requestUrl.pathname.startsWith('/ads/') && /\.(mp4|webm|mov)$/i.test(requestUrl.pathname)) return

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/index.html')))
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone()
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
      return response
    }))
  )
})
