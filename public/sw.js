const CACHE_NAME = 'devmate-v1';
const OFFLINE_URL = '/offline';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  // Add critical assets here
];

// Runtime caching strategy - cache first for assets, network first for API calls
const CACHE_STRATEGIES = {
  images: 'cache-first',
  assets: 'cache-first', 
  pages: 'network-first',
  api: 'network-first'
};

// Install event - precache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Precaching assets...');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Precaching failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Take control immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  // Skip non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Skip POST requests and other non-GET methods
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  
  // Handle navigation requests (pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful page responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Serve offline page if network fails
          return caches.match(OFFLINE_URL)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Fallback offline page
              return new Response(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <title>DevMate - Offline</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                      body { font-family: system-ui; text-align: center; padding: 2rem; background: #0a0a0a; color: #fff; }
                      .container { max-width: 400px; margin: 0 auto; }
                      h1 { color: #3b82f6; margin-bottom: 1rem; }
                      p { color: #9ca3af; line-height: 1.5; }
                      .retry-btn { 
                        background: #3b82f6; color: white; border: none; 
                        padding: 12px 24px; border-radius: 8px; cursor: pointer; 
                        margin-top: 1rem; 
                      }
                      .retry-btn:hover { background: #2563eb; }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <h1>You're Offline</h1>
                      <p>DevMate requires an internet connection. Please check your network and try again.</p>
                      <button class="retry-btn" onclick="location.reload()">Retry</button>
                    </div>
                  </body>
                </html>
              `, {
                status: 200,
                statusText: 'OK',
                headers: { 'Content-Type': 'text/html' }
              });
            });
        })
    );
    return;
  }

  // Handle asset requests (images, CSS, JS)
  if (requestUrl.pathname.match(/\\.(css|js|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Cache hit - serve from cache, but update in background
            fetch(event.request)
              .then((response) => {
                if (response.status === 200) {
                  caches.open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, response.clone()));
                }
              })
              .catch(() => {
                // Network error - stick with cached version
              });
            return cachedResponse;
          }
          
          // Cache miss - fetch from network and cache
          return fetch(event.request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(event.request, responseClone));
              }
              return response;
            });
        })
    );
    return;
  }

  // Default strategy for other requests
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any queued offline actions
      Promise.resolve()
    );
  }
});

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'devmate-notification',
    actions: [
      { action: 'open', title: 'Open DevMate' },
      { action: 'close', title: 'Close' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('DevMate', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});