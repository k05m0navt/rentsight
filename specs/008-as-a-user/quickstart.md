# Quickstart Guide: Progressive Web App Implementation

**Feature**: 008-as-a-user  
**Date**: 2025-01-27  
**Purpose**: Step-by-step implementation guide for converting RentSight to PWA

## Prerequisites

- Node.js 18+ installed
- Next.js 15.5.4 project setup
- HTTPS enabled (required for PWA)
- Basic understanding of service workers and web app manifests

## Phase 1: Core PWA Setup

### 1.1 Install Dependencies

```bash
npm install next-pwa workbox-webpack-plugin
npm install --save-dev @types/serviceworker
```

### 1.2 Configure Next.js for PWA

Update `next.config.ts`:

```typescript
import type { NextConfig } from 'next';

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-static',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
        },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-font-assets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-image-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-image',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:js)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-js-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:css|less)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-style-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.(?:js|css|woff|woff2|ttf|eot)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'external-assets',
        expiration: {
          maxEntries: 16,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  // existing config
};

export default withPWA(nextConfig);
```

### 1.3 Create Web App Manifest

Create `public/manifest.json`:

```json
{
  "name": "RentSight - Rental Analytics Dashboard",
  "short_name": "RentSight",
  "description": "Modern analytics platform for rental property management. Track income, expenses, and performance across all your properties.",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#f97316",
  "background_color": "#0f172a",
  "lang": "en",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "categories": ["business", "productivity", "finance"],
  "screenshots": [
    {
      "src": "/screenshots/desktop-dashboard.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile-dashboard.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

### 1.4 Update Layout with PWA Metadata

Update `src/app/layout.tsx`:

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RentSight - Rental Analytics Dashboard',
  description: 'Modern analytics platform for rental property management. Track income, expenses, and performance across all your properties.',
  manifest: '/manifest.json',
  themeColor: '#f97316',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RentSight',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'RentSight',
    title: 'RentSight - Rental Analytics Dashboard',
    description: 'Modern analytics platform for rental property management.',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

// Rest of layout component...
```

## Phase 2: Offline Support

### 2.1 Create PWA Utilities

Create `src/lib/pwa.ts`:

```typescript
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

export const isInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

export const canInstall = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

export const getInstallPrompt = (): Promise<any> => {
  return new Promise((resolve) => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      resolve(e);
    });
  });
};
```

### 2.2 Create PWA Hook

Create `src/hooks/usePWA.ts`:

```typescript
import { useState, useEffect } from 'react';
import { isOnline, isInstalled, canInstall } from '@/lib/pwa';

export const usePWA = () => {
  const [online, setOnline] = useState(true);
  const [installed, setInstalled] = useState(false);
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    setOnline(isOnline());
    setInstalled(isInstalled());
    setInstallable(canInstall());

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { online, installed, installable };
};
```

### 2.3 Add Offline Indicator Component

Create `src/components/OfflineIndicator.tsx`:

```typescript
import { usePWA } from '@/hooks/usePWA';

export const OfflineIndicator = () => {
  const { online } = usePWA();

  if (online) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 z-50">
      <span className="text-sm font-medium">
        You're offline. Some features may be limited.
      </span>
    </div>
  );
};
```

## Phase 3: Push Notifications

### 3.1 Create Push Notification Service

Create `src/lib/pushService.ts`:

```typescript
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export const subscribeToPush = async (): Promise<PushSubscription | null> => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push messaging is not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPID_PUBLIC_KEY,
    });

    // Send subscription to server
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
};

export const unsubscribeFromPush = async (): Promise<boolean> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      await fetch('/api/push/unsubscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
};
```

### 3.2 Create Push Notification Component

Create `src/components/PushNotificationSettings.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { subscribeToPush, unsubscribeFromPush } from '@/lib/pushService';
import { Button } from '@/components/ui/button';

export const PushNotificationSettings = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already subscribed
    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        setSubscribed(!!subscription);
      });
    });
  }, []);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const subscription = await subscribeToPush();
      setSubscribed(!!subscription);
    } catch (error) {
      console.error('Failed to subscribe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      const success = await unsubscribeFromPush();
      if (success) {
        setSubscribed(false);
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Push Notifications</h3>
      <p className="text-sm text-gray-600">
        Get notified about important rental property updates.
      </p>
      {subscribed ? (
        <Button onClick={handleUnsubscribe} disabled={loading}>
          {loading ? 'Unsubscribing...' : 'Disable Notifications'}
        </Button>
      ) : (
        <Button onClick={handleSubscribe} disabled={loading}>
          {loading ? 'Subscribing...' : 'Enable Notifications'}
        </Button>
      )}
    </div>
  );
};
```

## Phase 4: Testing

### 4.1 Create PWA E2E Tests

Create `tests/e2e/pwa.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('PWA Functionality', () => {
  test('should have web app manifest', async ({ page }) => {
    await page.goto('/');
    
    const manifest = await page.evaluate(() => {
      const link = document.querySelector('link[rel="manifest"]');
      return link?.getAttribute('href');
    });
    
    expect(manifest).toBe('/manifest.json');
  });

  test('should register service worker', async ({ page }) => {
    await page.goto('/');
    
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    expect(swRegistered).toBe(true);
  });

  test('should work offline', async ({ page }) => {
    await page.goto('/');
    
    // Go offline
    await page.context().setOffline(true);
    
    // Refresh page
    await page.reload();
    
    // Check if content is still visible
    await expect(page.locator('body')).toBeVisible();
  });
});
```

## Phase 5: Deployment

### 5.1 Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_EMAIL=your_email@example.com
```

### 5.2 Build and Deploy

```bash
npm run build
npm start
```

### 5.3 Verify PWA

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run PWA audit
4. Ensure score is 90+ for all categories

## Troubleshooting

### Common Issues

1. **Service Worker not registering**: Check HTTPS requirement
2. **Manifest not loading**: Verify file path and JSON syntax
3. **Push notifications not working**: Check VAPID keys and permissions
4. **Offline functionality broken**: Verify caching strategies

### Debug Commands

```bash
# Check service worker registration
navigator.serviceWorker.getRegistrations().then(console.log);

# Check manifest
fetch('/manifest.json').then(r => r.json()).then(console.log);

# Check push subscription
navigator.serviceWorker.ready.then(sw => 
  sw.pushManager.getSubscription().then(console.log)
);
```

## Next Steps

After completing this quickstart:

1. Run `/speckit.tasks` to generate detailed implementation tasks
2. Set up CI/CD pipeline for PWA deployment
3. Configure monitoring and analytics for PWA usage
4. Plan user education and onboarding for PWA features
