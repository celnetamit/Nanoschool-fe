import { NextResponse } from 'next/server';
import { getMentors } from '@/lib/mentors';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domains = searchParams.getAll('domain');
  const result = await getMentors(1, 500, {
    search: searchParams.get('search') || '',
    domains: domains.length ? domains : undefined,
    experience: searchParams.get('exp') || ''
  });
  return NextResponse.json({ total: result.totalCount, names: result.mentors.map(m => m.name) });
}
