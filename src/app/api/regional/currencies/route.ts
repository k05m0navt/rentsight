/**
 * Regional Currencies API
 * Returns available currencies for the application
 */

import { NextResponse } from 'next/server';
import { currencies } from '@/lib/regional-config';

export async function GET() {
  try {
    return NextResponse.json(Object.values(currencies));
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return NextResponse.json({ error: 'Failed to fetch currencies' }, { status: 500 });
  }
}
