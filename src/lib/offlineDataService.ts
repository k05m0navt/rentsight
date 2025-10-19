// Offline Data Service for RentSight PWA

import { OfflineDataRecord } from '@/types/pwa';

class OfflineDataService {
  private dbName = 'RentSightOfflineDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initDB();
    }
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('IndexedDB not available'));
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Offline database initialized');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create offline data store
        if (!db.objectStoreNames.contains('offlineData')) {
          const store = db.createObjectStore('offlineData', { keyPath: 'id', autoIncrement: true });
          store.createIndex('tableName', 'tableName', { unique: false });
          store.createIndex('recordId', 'recordId', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('synced', 'synced', { unique: false });
        }

        // Create properties cache store
        if (!db.objectStoreNames.contains('properties')) {
          const store = db.createObjectStore('properties', { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
        }

        // Create rent entries cache store
        if (!db.objectStoreNames.contains('rentEntries')) {
          const store = db.createObjectStore('rentEntries', { keyPath: 'id' });
          store.createIndex('propertyId', 'propertyId', { unique: false });
          store.createIndex('date', 'date', { unique: false });
        }

        // Create expense entries cache store
        if (!db.objectStoreNames.contains('expenseEntries')) {
          const store = db.createObjectStore('expenseEntries', { keyPath: 'id' });
          store.createIndex('propertyId', 'propertyId', { unique: false });
          store.createIndex('date', 'date', { unique: false });
        }

        // Create tags cache store
        if (!db.objectStoreNames.contains('tags')) {
          const store = db.createObjectStore('tags', { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: true });
        }
      };
    });
  }

  /**
   * Store data for offline access
   */
  async storeOfflineData(
    tableName: string,
    recordId: string,
    data: Record<string, unknown>,
    operation: 'create' | 'update' | 'delete',
  ): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');

      const record: OfflineDataRecord = {
        tableName,
        recordId,
        data,
        operation,
        timestamp: new Date(),
        synced: false,
        syncAttempts: 0,
      };

      const request = store.add(record);

      request.onsuccess = () => {
        console.log(`Offline data stored: ${tableName}/${recordId}`);
        resolve();
      };

      request.onerror = () => {
        console.error('Failed to store offline data:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Get unsynced offline data
   */
  async getUnsyncedData(): Promise<OfflineDataRecord[]> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const index = store.index('synced');
      const request = index.getAll(IDBKeyRange.only(false));

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Mark data as synced
   */
  async markAsSynced(id: number): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const request = store.get(id);

      request.onsuccess = () => {
        const record = request.result;
        if (record) {
          record.synced = true;
          const updateRequest = store.put(record);

          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve();
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Cache data for offline access
   */
  async cacheData(tableName: string, data: Record<string, unknown>[]): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([tableName], 'readwrite');
      const store = transaction.objectStore(tableName);

      // Clear existing data
      store.clear();

      // Add new data
      data.forEach((item, index) => {
        const request = store.add(item);
        request.onerror = () => {
          console.error(`Failed to cache ${tableName} item ${index}:`, request.error);
        };
      });

      transaction.oncomplete = () => {
        console.log(`Cached ${data.length} items for ${tableName}`);
        resolve();
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }

  /**
   * Get cached data
   */
  async getCachedData(tableName: string): Promise<Record<string, unknown>[]> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([tableName], 'readonly');
      const store = transaction.objectStore(tableName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Check if data is cached
   */
  async hasCachedData(tableName: string): Promise<boolean> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([tableName], 'readonly');
      const store = transaction.objectStore(tableName);
      const request = store.count();

      request.onsuccess = () => {
        resolve(request.result > 0);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Clear all cached data
   */
  async clearCache(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const storeNames = ['properties', 'rentEntries', 'expenseEntries', 'tags'];
      const transaction = this.db.transaction(storeNames, 'readwrite');

      let completed = 0;
      const total = storeNames.length;

      storeNames.forEach((storeName) => {
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            resolve();
          }
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    });
  }

  /**
   * Get storage usage info
   */
  async getStorageInfo(): Promise<{ used: number; available: number; total: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        available: (estimate.quota || 0) - (estimate.usage || 0),
        total: estimate.quota || 0,
      };
    }

    return { used: 0, available: 0, total: 0 };
  }
}

// Create singleton instance
export const offlineDataService = new OfflineDataService();

// Export convenience functions
export const storeOfflineData = (
  tableName: string,
  recordId: string,
  data: Record<string, unknown>,
  operation: 'create' | 'update' | 'delete',
) => offlineDataService.storeOfflineData(tableName, recordId, data, operation);

export const getUnsyncedData = () => offlineDataService.getUnsyncedData();
export const markAsSynced = (id: number) => offlineDataService.markAsSynced(id);
export const cacheData = (tableName: string, data: Record<string, unknown>[]) =>
  offlineDataService.cacheData(tableName, data);
export const getCachedData = (tableName: string) => offlineDataService.getCachedData(tableName);
export const hasCachedData = (tableName: string) => offlineDataService.hasCachedData(tableName);
export const clearCache = () => offlineDataService.clearCache();
export const getStorageInfo = () => offlineDataService.getStorageInfo();
