// Custom Service Worker for RentSight PWA
// Combines workbox functionality with push notifications

// Import workbox functionality
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.6.0/workbox-sw.js');

// Initialize workbox
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// Cache strategies
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'document',
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages',
    plugins: [
      {
        cacheWillUpdate: async ({ request, response, event, state }) => {
          return response && response.status === 200 ? response : null;
        },
      },
    ],
  })
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'script',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'scripts',
  })
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'styles',
  })
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      {
        cacheWillUpdate: async ({ request, response, event, state }) => {
          return response && response.status === 200 ? response : null;
        },
      },
    ],
  })
);

// API routes caching
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api',
    networkTimeoutSeconds: 10,
    plugins: [
      {
        cacheWillUpdate: async ({ request, response, event, state }) => {
          return response && response.status === 200 ? response : null;
        },
      },
    ],
  })
);

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  let notificationData = {
    title: 'RentSight',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'default',
    data: {},
  };

  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (error) {
      console.error('Failed to parse push data:', error);
      // Use text data if JSON parsing fails
      notificationData.body = event.data.text() || notificationData.body;
    }
  }

  // Show notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: notificationData.actions || [],
      requireInteraction: notificationData.requireInteraction || false,
      silent: notificationData.silent || false,
      timestamp: notificationData.timestamp || Date.now(),
    })
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);

  event.notification.close();

  const data = event.notification.data || {};
  const action = event.action;

  // Handle different actions
  if (action === 'view') {
    // Handle view action
    handleNotificationClick(event, data.url || '/');
  } else if (action === 'dismiss') {
    // Handle dismiss action
    console.log('Notification dismissed');
  } else {
    // Default click behavior
    handleNotificationClick(event, data.url || '/');
  }
});

// Notification close handling
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  
  // Track notification close for analytics
  const data = event.notification.data || {};
  if (data.type) {
    // Send analytics event
    trackNotificationEvent('close', data.type);
  }
});

// Background sync handling
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event);

  if (event.tag === 'notification-sync') {
    event.waitUntil(syncNotifications());
  }
});

// Message handling
self.addEventListener('message', (event) => {
  console.log('Message received in service worker:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Helper function to handle notification clicks
function handleNotificationClick(event, url) {
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          // Focus existing window and navigate
          return client.focus().then(() => {
            if (url && url !== '/') {
              return client.navigate(url);
            }
          });
        }
      }

      // Open new window if app is not open
      if (clients.openWindow) {
        return clients.openWindow(url || '/');
      }
    })
  );
}

// Helper function to track notification events
function trackNotificationEvent(action, type) {
  // Send analytics event to server
  fetch('/api/analytics/notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action,
      type,
      timestamp: Date.now(),
    }),
  }).catch((error) => {
    console.error('Failed to track notification event:', error);
  });
}

// Sync notifications when back online
async function syncNotifications() {
  try {
    // Get any pending notifications from IndexedDB
    const pendingNotifications = await getPendingNotifications();
    
    for (const notification of pendingNotifications) {
      await sendNotificationToServer(notification);
      await markNotificationAsSent(notification.id);
    }
  } catch (error) {
    console.error('Failed to sync notifications:', error);
  }
}

// Get pending notifications from IndexedDB
async function getPendingNotifications() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('rentsight-notifications', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['notifications'], 'readonly');
      const store = transaction.objectStore('notifications');
      const index = store.index('status');
      const getRequest = index.getAll('pending');
      
      getRequest.onsuccess = () => resolve(getRequest.result || []);
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('notifications')) {
        const store = db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// Send notification to server
async function sendNotificationToServer(notification) {
  const response = await fetch('/api/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notification),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to send notification: ${response.statusText}`);
  }
  
  return response.json();
}

// Mark notification as sent in IndexedDB
async function markNotificationAsSent(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('rentsight-notifications', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['notifications'], 'readwrite');
      const store = transaction.objectStore('notifications');
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const notification = getRequest.result;
        if (notification) {
          notification.status = 'sent';
          notification.sentAt = Date.now();
          store.put(notification);
        }
        resolve();
      };
      getRequest.onerror = () => reject(getRequest.error);
    };
  });
}

// Service worker installation
self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  self.skipWaiting();
});

// Service worker activation
self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
  event.waitUntil(self.clients.claim());
});

// Fetch event handling
self.addEventListener('fetch', (event) => {
  // Let workbox handle the fetch events
  // This is just for logging purposes
  console.log('Fetch event:', event.request.url);
});
