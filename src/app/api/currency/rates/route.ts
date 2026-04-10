import { NextResponse } from 'next/server';

// In-memory cache for exchange rates
let cache: {
  rates: Record<string, number>;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function GET() {
  const now = Date.now();

  if (cache && now - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json({ rates: cache.rates, source: 'cache' });
  }

  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) {
      throw new Error('Failed to fetch rates from external API');
    }

    const data = await response.json();
    cache = {
      rates: data.rates,
      timestamp: now,
    };

    return NextResponse.json({ rates: cache.rates, source: 'api' });
  } catch (error: any) {
    console.error('Currency API Error:', error);
    
    // If API fails, return cache if available (even if expired)
    if (cache) {
      return NextResponse.json({ rates: cache.rates, source: 'expired-cache' });
    }

    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}
