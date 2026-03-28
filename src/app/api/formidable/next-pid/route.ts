import { NextResponse } from 'next/server';

/**
 * GET /api/formidable/next-pid
 * Returns the next sequential PID in the format NSTCXXXX based on current
 * entry count in Formidable form 673.
 */
export async function GET() {
  try {
    const FORMIDABLE_API_URL = 'https://nanoschool.in/wp-json/frm/v2/entries';
    const formId = 673;

    const wpUser = process.env.WP_USER;
    const wpPassword = process.env.WP_PASSWORD;

    if (!wpUser || !wpPassword) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing WP credentials' },
        { status: 500 }
      );
    }

    const authHeader = `Basic ${Buffer.from(`${wpUser}:${wpPassword}`).toString('base64')}`;

    // Fetch entries count for form 673 (page_size=1 to minimise payload)
    const response = await fetch(
      `${FORMIDABLE_API_URL}?form_id=${formId}&page_size=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        // No cache so we always get the latest count
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('Formidable entries fetch error:', err);
      // Fall back to a timestamp-based PID if the API fails
      const fallback = `NSTC${Date.now().toString().slice(-6)}`;
      return NextResponse.json({ pid: fallback }, { status: 200 });
    }

    // Formidable returns X-WP-Total header with total entry count
    const totalHeader = response.headers.get('X-WP-Total');
    let nextNumber = 1;

    if (totalHeader) {
      nextNumber = parseInt(totalHeader, 10) + 1;
    } else {
      // Fallback: fetch latest entry and increment its number
      const latestRes = await fetch(
        `${FORMIDABLE_API_URL}?form_id=${formId}&order=desc&page_size=1`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader,
          },
          cache: 'no-store',
        }
      );
      const latestData = await latestRes.json();
      const entries = Object.values(latestData);
      if (entries.length > 0) {
        const lastEntry: any = entries[0];
        const lastPid = lastEntry.name || ""; // Formidable often puts the entry name in 'name'
        const match = lastPid.match(/\d+$/);
        if (match) {
          nextNumber = parseInt(match[0], 10) + 1;
        }
      }
    }

    // Format: NSTC0001, NSTC0002, …
    const pid = `NSTC${String(nextNumber).padStart(4, '0')}`;

    return NextResponse.json({ pid }, { status: 200 });
  } catch (error) {
    console.error('Error generating next PID:', error);
    const fallback = `NSTC${Date.now().toString().slice(-6)}`;
    return NextResponse.json({ pid: fallback }, { status: 200 });
  }
}
