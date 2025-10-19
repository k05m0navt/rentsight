// Background Sync Service for RentSight PWA

import { getUnsyncedData, markAsSynced } from './offlineDataService';
import { OfflineDataRecord } from '@/types/pwa';

interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync?: {
    register(tag: string): Promise<void>;
  };
}

interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

class BackgroundSyncService {
  private isOnline = true;
  private syncInProgress = false;
  private syncQueue: (() => Promise<void>)[] = [];
  private listeners: Set<(result: SyncResult) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupEventListeners();
      this.registerBackgroundSync();
    }
  }

  private setupEventListeners() {
    const handleOnline = () => {
      this.isOnline = true;
      this.triggerSync();
    };

    const handleOffline = () => {
      this.isOnline = false;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial state
    this.isOnline = navigator.onLine;
  }

  private async registerBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await (registration as ServiceWorkerRegistrationWithSync).sync?.register('background-sync');
        console.log('Background sync registered');
      } catch (error) {
        console.error('Failed to register background sync:', error);
      }
    }
  }

  /**
   * Subscribe to sync events
   */
  subscribe(listener: (result: SyncResult) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Trigger sync when online
   */
  private async triggerSync() {
    if (!this.isOnline || this.syncInProgress) {
      return;
    }

    try {
      await this.syncOfflineData();
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }

  /**
   * Sync offline data with server
   */
  async syncOfflineData(): Promise<SyncResult> {
    if (this.syncInProgress) {
      return { success: false, synced: 0, failed: 0, errors: ['Sync already in progress'] };
    }

    this.syncInProgress = true;
    const result: SyncResult = {
      success: true,
      synced: 0,
      failed: 0,
      errors: [],
    };

    try {
      const unsyncedData = await getUnsyncedData();

      if (unsyncedData.length === 0) {
        this.notifyListeners(result);
        return result;
      }

      console.log(`Syncing ${unsyncedData.length} offline records`);

      for (const record of unsyncedData) {
        try {
          await this.syncRecord(record);
          await markAsSynced(record.id as number);
          result.synced++;
        } catch (error) {
          result.failed++;
          result.errors.push(
            `Failed to sync ${record.tableName}/${record.recordId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
          result.success = false;
        }
      }

      this.notifyListeners(result);
    } catch (error) {
      result.success = false;
      result.errors.push(
        `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      this.notifyListeners(result);
    } finally {
      this.syncInProgress = false;
    }

    return result;
  }

  /**
   * Sync individual record
   */
  private async syncRecord(record: OfflineDataRecord): Promise<void> {
    const { tableName, recordId, data, operation } = record;

    let url = '';
    let method = '';

    switch (tableName) {
      case 'properties':
        url = operation === 'create' ? '/api/properties' : `/api/properties/${recordId}`;
        method = operation === 'create' ? 'POST' : operation === 'update' ? 'PUT' : 'DELETE';
        break;
      case 'rentEntries':
        url = operation === 'create' ? '/api/rent_entries' : `/api/rent_entries/${recordId}`;
        method = operation === 'create' ? 'POST' : operation === 'update' ? 'PUT' : 'DELETE';
        break;
      case 'expenseEntries':
        url = operation === 'create' ? '/api/expense_entries' : `/api/expense_entries/${recordId}`;
        method = operation === 'create' ? 'POST' : operation === 'update' ? 'PUT' : 'DELETE';
        break;
      case 'tags':
        url = operation === 'create' ? '/api/tags' : `/api/tags/${recordId}`;
        method = operation === 'create' ? 'POST' : operation === 'update' ? 'PUT' : 'DELETE';
        break;
      default:
        throw new Error(`Unknown table: ${tableName}`);
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: operation !== 'delete' ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log(`Synced ${tableName}/${recordId} (${operation})`);
  }

  /**
   * Notify listeners of sync results
   */
  private notifyListeners(result: SyncResult) {
    this.listeners.forEach((listener) => {
      try {
        listener(result);
      } catch (error) {
        console.error('Error in sync listener:', error);
      }
    });
  }

  /**
   * Queue sync operation for when online
   */
  queueSync(operation: () => Promise<void>) {
    this.syncQueue.push(operation);

    if (this.isOnline) {
      this.processSyncQueue();
    }
  }

  /**
   * Process queued sync operations
   */
  private async processSyncQueue() {
    if (this.syncQueue.length === 0) {
      return;
    }

    const operations = [...this.syncQueue];
    this.syncQueue = [];

    for (const operation of operations) {
      try {
        await operation();
      } catch (error) {
        console.error('Queued sync operation failed:', error);
      }
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<{
    isOnline: boolean;
    syncInProgress: boolean;
    queuedOperations: number;
    unsyncedRecords: number;
  }> {
    const unsyncedData = await getUnsyncedData();

    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      queuedOperations: this.syncQueue.length,
      unsyncedRecords: unsyncedData.length,
    };
  }

  /**
   * Force sync attempt
   */
  async forceSync(): Promise<SyncResult> {
    if (!this.isOnline) {
      return {
        success: false,
        synced: 0,
        failed: 0,
        errors: ['Cannot sync while offline'],
      };
    }

    return this.syncOfflineData();
  }

  /**
   * Clear all unsynced data (use with caution)
   */
  async clearUnsyncedData(): Promise<void> {
    // This would require implementing a method to delete unsynced records
    // For now, we'll just log a warning
    console.warn('clearUnsyncedData not implemented - use with caution');
  }
}

// Create singleton instance
export const backgroundSyncService = new BackgroundSyncService();

// Export convenience functions
export const subscribeToSync = (listener: (result: SyncResult) => void) =>
  backgroundSyncService.subscribe(listener);
export const triggerSync = () => backgroundSyncService.forceSync();
export const getSyncStatus = () => backgroundSyncService.getSyncStatus();
export const queueSyncOperation = (operation: () => Promise<void>) =>
  backgroundSyncService.queueSync(operation);
