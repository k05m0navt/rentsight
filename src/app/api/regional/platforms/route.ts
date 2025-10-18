/**
 * Regional Platforms API
 * Returns available platforms by region
 */

import { NextResponse } from 'next/server';
import { getAllPlatforms, getPlatformsByRegion } from '@/lib/regional-config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');

    if (region) {
      // Return platforms for specific region
      const platforms = getPlatformsByRegion(region);
      return NextResponse.json(platforms);
    } else {
      // Return all platforms
      const platforms = getAllPlatforms();
      return NextResponse.json(platforms);
    }
  } catch (error) {
    console.error('Error fetching platforms:', error);
    return NextResponse.json({ error: 'Failed to fetch platforms' }, { status: 500 });
  }
}
