/**
 * Cache invalidation API route
 * Handles cache invalidation requests from client-side
 */

import { NextRequest, NextResponse } from 'next/server';
import { cacheService } from '@/services/cacheService';

/**
 * POST /api/cache/invalidate
 * Invalidate caches based on the request body
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pattern, tags, operation, clearAll } = body;

    // Validate request
    if (!pattern && !tags && !operation && !clearAll) {
      return NextResponse.json(
        { error: 'Invalid request: must provide pattern, tags, operation, or clearAll' },
        { status: 400 },
      );
    }

    // Handle clear all request
    if (clearAll) {
      await cacheService.clearAll();
      return NextResponse.json({ message: 'All caches cleared successfully' });
    }

    // Handle specific operation invalidation
    if (operation) {
      const { type, action } = operation;

      switch (type) {
        case 'property':
          await cacheService.invalidateAfterPropertyOperation(action);
          break;
        case 'tag':
          await cacheService.invalidateAfterTagOperation(action);
          break;
        case 'rent-entry':
          await cacheService.invalidateAfterRentEntryOperation(action);
          break;
        case 'expense-entry':
          await cacheService.invalidateAfterExpenseEntryOperation(action);
          break;
        case 'user-preferences':
          await cacheService.invalidateAfterPreferenceChange();
          break;
        default:
          return NextResponse.json({ error: `Unknown operation type: ${type}` }, { status: 400 });
      }

      return NextResponse.json({
        message: `Caches invalidated after ${type} ${action}`,
      });
    }

    // Handle pattern-based invalidation
    if (pattern) {
      const regex = new RegExp(pattern);
      await cacheService.invalidateClientCache(regex);
    }

    // Handle tag-based invalidation
    if (tags && Array.isArray(tags)) {
      await cacheService.invalidateServerCache(tags);
    }

    return NextResponse.json({
      message: 'Caches invalidated successfully',
    });
  } catch (error) {
    console.error('Cache invalidation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/cache/invalidate
 * Get cache metrics and status
 */
export async function GET() {
  try {
    const metrics = await cacheService.getCacheMetrics();

    return NextResponse.json({
      status: 'healthy',
      metrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cache metrics error:', error);
    return NextResponse.json({ error: 'Failed to get cache metrics' }, { status: 500 });
  }
}

/**
 * DELETE /api/cache/invalidate
 * Clear all caches (alternative to POST with clearAll: true)
 */
export async function DELETE() {
  try {
    await cacheService.clearAll();

    return NextResponse.json({
      message: 'All caches cleared successfully',
    });
  } catch (error) {
    console.error('Cache clear error:', error);
    return NextResponse.json({ error: 'Failed to clear caches' }, { status: 500 });
  }
}
