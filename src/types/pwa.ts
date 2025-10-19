// PWA Type Definitions for RentSight

export interface WebAppManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui';
  orientation: 'portrait' | 'landscape' | 'any';
  theme_color: string;
  background_color: string;
  icons: ManifestIcon[];
  categories?: string[];
  lang: string;
  scope: string;
}

export interface ManifestIcon {
  src: string;
  sizes: string;
  type?: string;
  purpose?: 'monochrome' | 'maskable' | 'any';
}

export interface ServiceWorkerRegistration {
  scriptURL: string;
  scope: string;
  updateViaCache: 'imports' | 'all' | 'none';
  registrationId: string;
  state: 'installing' | 'installed' | 'activating' | 'activated' | 'redundant';
  installingWorker?: ServiceWorker;
  waitingWorker?: ServiceWorker;
  activeWorker?: ServiceWorker;
}

export interface CacheStorage {
  cacheName: string;
  version: string;
  resources: string[];
  createdAt: Date;
  lastUpdated: Date;
  size?: number;
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId: string;
  createdAt: Date;
  expiresAt?: Date;
  notificationTypes: string[];
}

export interface OfflineDataRecord {
  id?: number;
  tableName: string;
  recordId: string;
  data: Record<string, unknown>;
  operation: 'create' | 'update' | 'delete';
  timestamp: Date;
  synced: boolean;
  syncAttempts: number;
  lastSyncError?: string;
}

export interface PWASettings {
  installPromptShown: boolean;
  installPromptDismissed: boolean;
  pushNotificationsEnabled: boolean;
  offlineModeEnabled: boolean;
  lastSyncTime?: Date;
}

export interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAState {
  isOnline: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  installPrompt: InstallPromptEvent | null;
  serviceWorkerReady: boolean;
  pushSubscription: PushSubscription | null;
}
