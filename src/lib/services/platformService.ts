/**
 * Platform Service
 *
 * Service layer for managing platforms (predefined and custom)
 */

import { prisma } from '@/lib/prisma';
import { getAllPlatforms, getPlatformsByRegion } from '@/lib/regional-config';
import type { CustomPlatform, Platform } from '@/types/regional';
import { getCachedUserPlatforms, invalidateUserPlatformCache } from '@/lib/cache/platform-cache';

export interface PlatformWithCustom extends Platform {
  isCustom?: boolean;
  usage_count?: number;
}

export interface PlatformListResponse {
  predefined: Platform[];
  custom: CustomPlatform[];
}

/**
 * Get all platforms (predefined + custom) for a user
 */
export async function getAllUserPlatforms(userId: string): Promise<PlatformListResponse> {
  try {
    // Get predefined platforms (Russian platforms as primary)
    const predefinedPlatforms = getPlatformsByRegion('russian');

    // Get user's custom platforms
    const customPlatforms = await prisma.customPlatform.findMany({
      where: { user_id: userId },
      orderBy: { name: 'asc' },
    });

    return {
      predefined: predefinedPlatforms,
      custom: customPlatforms,
    };
  } catch (error) {
    console.error('Error fetching user platforms:', error);
    throw new Error('Failed to fetch platforms');
  }
}

/**
 * Get all platforms (predefined + custom) for a user with caching
 */
export async function getAllUserPlatformsCached(userId: string): Promise<PlatformListResponse> {
  const cached = await getCachedUserPlatforms(userId);
  return cached as PlatformListResponse;
}

/**
 * Create a new custom platform for a user
 */
export async function createCustomPlatform(userId: string, name: string): Promise<CustomPlatform> {
  try {
    // Check if platform name already exists for this user
    const existingPlatform = await prisma.customPlatform.findFirst({
      where: {
        user_id: userId,
        name: name.trim(),
      },
    });

    if (existingPlatform) {
      throw new Error('Platform name already exists');
    }

    const customPlatform = await prisma.customPlatform.create({
      data: {
        user_id: userId,
        name: name.trim(),
        usage_count: 0,
      },
    });

    // Invalidate cache for this user
    invalidateUserPlatformCache(userId);

    return customPlatform;
  } catch (error) {
    console.error('Error creating custom platform:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create custom platform');
  }
}

/**
 * Update a custom platform
 */
export async function updateCustomPlatform(
  platformId: string,
  userId: string,
  name: string,
): Promise<CustomPlatform> {
  try {
    // Check if platform exists and belongs to user
    const existingPlatform = await prisma.customPlatform.findFirst({
      where: {
        id: platformId,
        user_id: userId,
      },
    });

    if (!existingPlatform) {
      throw new Error('Platform not found');
    }

    // Check if new name already exists for this user (excluding current platform)
    const duplicatePlatform = await prisma.customPlatform.findFirst({
      where: {
        user_id: userId,
        name: name.trim(),
        id: { not: platformId },
      },
    });

    if (duplicatePlatform) {
      throw new Error('Platform name already exists');
    }

    const updatedPlatform = await prisma.customPlatform.update({
      where: { id: platformId },
      data: {
        name: name.trim(),
        updated_at: new Date(),
      },
    });

    // Invalidate cache for this user
    invalidateUserPlatformCache(userId);

    return updatedPlatform;
  } catch (error) {
    console.error('Error updating custom platform:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update custom platform');
  }
}

/**
 * Delete a custom platform (only if no rent entries use it)
 */
export async function deleteCustomPlatform(platformId: string, userId: string): Promise<void> {
  try {
    // Check if platform exists and belongs to user
    const existingPlatform = await prisma.customPlatform.findFirst({
      where: {
        id: platformId,
        user_id: userId,
      },
    });

    if (!existingPlatform) {
      throw new Error('Platform not found');
    }

    // Check if platform is used in any rent entries
    const rentEntriesCount = await prisma.rentEntry.count({
      where: {
        platform: platformId,
        user_id: userId,
      },
    });

    if (rentEntriesCount > 0) {
      throw new Error('Cannot delete platform that is used in rent entries');
    }

    await prisma.customPlatform.delete({
      where: { id: platformId },
    });

    // Invalidate cache for this user
    invalidateUserPlatformCache(userId);
  } catch (error) {
    console.error('Error deleting custom platform:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete custom platform');
  }
}

/**
 * Get platform usage count
 */
export async function getPlatformUsageCount(platformId: string, userId: string): Promise<number> {
  try {
    const count = await prisma.rentEntry.count({
      where: {
        platform: platformId,
        user_id: userId,
      },
    });

    return count;
  } catch (error) {
    console.error('Error getting platform usage count:', error);
    return 0;
  }
}

/**
 * Update platform usage count
 */
export async function updatePlatformUsageCount(platformId: string): Promise<void> {
  try {
    const count = await prisma.rentEntry.count({
      where: { platform: platformId },
    });

    await prisma.customPlatform.update({
      where: { id: platformId },
      data: { usage_count: count },
    });
  } catch (error) {
    console.error('Error updating platform usage count:', error);
    // Don't throw error for usage count updates
  }
}

/**
 * Get platform display name (handles predefined, custom, and "other" platforms)
 */
export function getPlatformDisplayName(
  platformId: string,
  customPlatformName?: string,
  customPlatforms?: CustomPlatform[],
): string {
  // Handle "other" platform with custom name
  if (platformId === 'other' && customPlatformName) {
    return customPlatformName;
  }

  // Handle custom platform
  if (customPlatforms) {
    const customPlatform = customPlatforms.find((p) => p.id === platformId);
    if (customPlatform) {
      return customPlatform.name;
    }
  }

  // Handle predefined platform
  const allPlatforms = getAllPlatforms();
  const predefinedPlatform = allPlatforms.find((p) => p.id === platformId);
  if (predefinedPlatform) {
    return predefinedPlatform.name;
  }

  // Fallback
  return platformId;
}
