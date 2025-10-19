// Offline Property Service for RentSight PWA

import {
  storeOfflineData,
  getCachedData,
  cacheData,
  hasCachedData,
} from '@/lib/offlineDataService';
import { queueSyncOperation } from '@/lib/backgroundSyncService';

interface Property {
  id: string;
  name: string;
  address?: string;
  property_type?: string;
  start_date?: string;
  notes?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  _count?: {
    rentEntries: number;
    expenseEntries: number;
  };
}

interface PropertyCreateInput {
  name: string;
  address?: string;
  property_type?: string;
  start_date?: string;
  notes?: string;
}

interface PropertyUpdateInput {
  name?: string;
  address?: string;
  property_type?: string;
  start_date?: string;
  notes?: string;
}

class OfflinePropertyService {
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes
  private lastCacheTime = 0;

  private async cacheProperties(properties: Property[]): Promise<void> {
    await cacheData('properties', properties as unknown as Record<string, unknown>[]);
  }

  /**
   * Get properties with offline support
   */
  async getProperties(
    userId: string,
    options: {
      cursor?: string;
      limit?: number;
      search?: string;
      forceRefresh?: boolean;
    } = {},
  ): Promise<{ items: Property[]; nextCursor: string | null }> {
    const { forceRefresh = false } = options;

    // Check if we have cached data and it's still fresh
    const hasCache = await hasCachedData('properties');
    const cacheIsFresh = Date.now() - this.lastCacheTime < this.cacheExpiry;

    if (hasCache && cacheIsFresh && !forceRefresh) {
      console.log('Using cached properties data');
      const cachedData = (await getCachedData('properties')) as unknown as Property[];
      const userProperties = cachedData.filter((p: Property) => p.user_id === userId);

      return {
        items: userProperties,
        nextCursor: null, // Simplified for offline
      };
    }

    // Try to fetch from server if online
    if (navigator.onLine) {
      try {
        const response = await fetch(
          `/api/properties?${new URLSearchParams({
            ...(options.cursor && { cursor: options.cursor }),
            ...(options.limit && { limit: options.limit.toString() }),
            ...(options.search && { search: options.search }),
          })}`,
        );

        if (response.ok) {
          const data = await response.json();

          // Cache the data
          await this.cacheProperties(data.items);
          this.lastCacheTime = Date.now();

          return data;
        }
      } catch (error) {
        console.error('Failed to fetch properties from server:', error);
      }
    }

    // Fallback to cached data if available
    if (hasCache) {
      console.log('Using stale cached properties data');
      const cachedData = (await getCachedData('properties')) as unknown as Property[];
      const userProperties = cachedData.filter((p) => p.user_id === userId);

      return {
        items: userProperties,
        nextCursor: null,
      };
    }

    // No data available
    return { items: [], nextCursor: null };
  }

  /**
   * Create property with offline support
   */
  async createProperty(userId: string, data: PropertyCreateInput): Promise<Property> {
    const propertyData = {
      ...data,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (navigator.onLine) {
      try {
        const response = await fetch('/api/properties', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(propertyData),
        });

        if (response.ok) {
          const newProperty = await response.json();

          // Update cache
          const cachedProperties = (await getCachedData('properties')) as unknown as Property[];
          await this.cacheProperties([...cachedProperties, newProperty]);

          return newProperty;
        }
      } catch (error) {
        console.error('Failed to create property on server:', error);
      }
    }

    // Store for offline sync
    const tempId = `temp_${Date.now()}`;
    await storeOfflineData('properties', tempId, propertyData as Record<string, unknown>, 'create');

    // Add to local cache with temp ID
    const cachedProperties = (await getCachedData('properties')) as unknown as Property[];
    const tempProperty = {
      ...propertyData,
      id: tempId,
      _count: { rentEntries: 0, expenseEntries: 0 },
    };
    await this.cacheProperties([...cachedProperties, tempProperty]);

    // Queue for sync when online
    queueSyncOperation(async () => {
      try {
        const response = await fetch('/api/properties', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(propertyData),
        });

        if (response.ok) {
          const newProperty = await response.json();
          // Update cache with real ID
          const cachedProperties = (await getCachedData('properties')) as unknown as Property[];
          const updatedProperties = cachedProperties.map((p) =>
            p.id === tempId ? newProperty : p,
          );
          await this.cacheProperties(updatedProperties);
        }
      } catch (error) {
        console.error('Failed to sync property creation:', error);
      }
    });

    return tempProperty;
  }

  /**
   * Get single property with offline support
   */
  async getProperty(propertyId: string, userId: string): Promise<Property | null> {
    // Try cache first
    const hasCache = await hasCachedData('properties');
    if (hasCache) {
      const cachedProperties = (await getCachedData('properties')) as unknown as Property[];
      const property = cachedProperties.find((p) => p.id === propertyId && p.user_id === userId);
      if (property) {
        return property;
      }
    }

    // Try server if online
    if (navigator.onLine) {
      try {
        const response = await fetch(`/api/properties/${propertyId}`);
        if (response.ok) {
          const property = await response.json();

          // Update cache
          const cachedProperties = (await getCachedData('properties')) as unknown as Property[];
          const updatedProperties = cachedProperties.filter((p) => p.id !== propertyId);
          await cacheData('properties', [...updatedProperties, property]);

          return property;
        }
      } catch (error) {
        console.error('Failed to fetch property from server:', error);
      }
    }

    return null;
  }

  /**
   * Update property with offline support
   */
  async updateProperty(
    propertyId: string,
    userId: string,
    data: PropertyUpdateInput,
  ): Promise<Property | null> {
    const existingProperty = await this.getProperty(propertyId, userId);
    if (!existingProperty) {
      throw new Error('Property not found');
    }

    const updatedData = {
      ...existingProperty,
      ...data,
      updated_at: new Date().toISOString(),
    };

    if (navigator.onLine) {
      try {
        const response = await fetch(`/api/properties/${propertyId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const updatedProperty = await response.json();

          // Update cache
          const cachedProperties = (await getCachedData('properties')) as unknown as Property[];
          const updatedProperties = cachedProperties.map((p) =>
            p.id === propertyId ? updatedProperty : p,
          );
          await this.cacheProperties(updatedProperties);

          return updatedProperty;
        }
      } catch (error) {
        console.error('Failed to update property on server:', error);
      }
    }

    // Store for offline sync
    await storeOfflineData(
      'properties',
      propertyId,
      updatedData as Record<string, unknown>,
      'update',
    );

    // Update local cache
    const cachedProperties = (await getCachedData('properties')) as unknown as Property[];
    const updatedProperties = cachedProperties.map((p) => (p.id === propertyId ? updatedData : p));
    await this.cacheProperties(updatedProperties);

    // Queue for sync when online
    queueSyncOperation(async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const updatedProperty = await response.json();
          // Update cache with server response
          const cachedProperties = (await getCachedData('properties')) as unknown as Property[];
          const updatedProperties = cachedProperties.map((p) =>
            p.id === propertyId ? updatedProperty : p,
          );
          await this.cacheProperties(updatedProperties);
        }
      } catch (error) {
        console.error('Failed to sync property update:', error);
      }
    });

    return updatedData;
  }

  /**
   * Delete property with offline support
   */
  async deleteProperty(propertyId: string, userId: string): Promise<boolean> {
    const existingProperty = await this.getProperty(propertyId, userId);
    if (!existingProperty) {
      throw new Error('Property not found');
    }

    if (navigator.onLine) {
      try {
        const response = await fetch(`/api/properties/${propertyId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove from cache
          const cachedProperties = (await getCachedData('properties')) as unknown as Property[];
          const updatedProperties = cachedProperties.filter((p) => p.id !== propertyId);
          await this.cacheProperties(updatedProperties);

          return true;
        }
      } catch (error) {
        console.error('Failed to delete property on server:', error);
      }
    }

    // Store for offline sync
    await storeOfflineData(
      'properties',
      propertyId,
      existingProperty as unknown as Record<string, unknown>,
      'delete',
    );

    // Remove from local cache
    const cachedProperties = (await getCachedData('properties')) as unknown as Property[];
    const updatedProperties = cachedProperties.filter((p) => p.id !== propertyId);
    await this.cacheProperties(updatedProperties);

    // Queue for sync when online
    queueSyncOperation(async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log(`Property ${propertyId} deleted successfully`);
        }
      } catch (error) {
        console.error('Failed to sync property deletion:', error);
      }
    });

    return true;
  }

  /**
   * Refresh cache from server
   */
  async refreshCache(): Promise<void> {
    if (!navigator.onLine) {
      throw new Error('Cannot refresh cache while offline');
    }

    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        await this.cacheProperties(data.items);
        this.lastCacheTime = Date.now();
      }
    } catch (error) {
      console.error('Failed to refresh properties cache:', error);
      throw error;
    }
  }

  /**
   * Clear cache
   */
  async clearCache(): Promise<void> {
    const emptyProperties: Property[] = [];
    await this.cacheProperties(emptyProperties);
    this.lastCacheTime = 0;
  }
}

// Create singleton instance
export const offlinePropertyService = new OfflinePropertyService();

// Export convenience functions
export const getProperties = (userId: string, options?: Record<string, unknown>) =>
  offlinePropertyService.getProperties(userId, options);
export const createProperty = (userId: string, data: PropertyCreateInput) =>
  offlinePropertyService.createProperty(userId, data);
export const getProperty = (propertyId: string, userId: string) =>
  offlinePropertyService.getProperty(propertyId, userId);
export const updateProperty = (propertyId: string, userId: string, data: PropertyUpdateInput) =>
  offlinePropertyService.updateProperty(propertyId, userId, data);
export const deleteProperty = (propertyId: string, userId: string) =>
  offlinePropertyService.deleteProperty(propertyId, userId);
export const refreshPropertiesCache = () => offlinePropertyService.refreshCache();
export const clearPropertiesCache = () => offlinePropertyService.clearCache();
