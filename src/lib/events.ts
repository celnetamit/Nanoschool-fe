import { fetchWithTimeout } from './fetch-utils';

export interface UpcomingEvent {
  id: string;
  title: string;
  category: string;
  year: string;
  status: string;
  detailsLink: string;
  registerLink: string;
  image?: string;
  date?: string;
  startDate?: Date | null;
  slug?: string;
}

/**
 * Fetch and filter upcoming events from Formidable Form 40
 */
export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  const url = process.env.UPCOMING_EVENTS_API_URL;
  const user = process.env.WP_USER;
  const pass = process.env.WP_PASSWORD;

  if (!url || !user || !pass) {
    console.warn('Missing Upcoming Events API Environment Variables');
    return [];
  }

  try {
    const authString = Buffer.from(`${user}:${pass}`).toString('base64');
    
    // API-side filtering for efficiency (Field 5715=Category, 4422=Status)
    // Order by ID DESC to get the most recent entries first across all entries
    const fetchUrl = `${url}&5715=Biotechnology&4422=Show&page_size=200&order_by=id&order=DESC`;

    console.log(`Upcoming Events Fetch URL: ${fetchUrl}`);

    const response = await fetchWithTimeout(fetchUrl, {
      timeoutMs: 40000,
      useCache: false, 
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch upcoming events: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    const entriesArray = Array.isArray(data) ? data : Object.values(data);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const results = entriesArray
      .map((entry: any) => {
        const meta = entry.meta || {};
        const startDateStr = meta['1rme4']; 
        let startDate: Date | null = null;
        
        if (startDateStr && typeof startDateStr === 'string' && startDateStr.trim() !== '') {
          const parts = startDateStr.split('/');
          if (parts.length === 3) {
            const m = parseInt(parts[0], 10);
            const d = parseInt(parts[1], 10);
            const y = parseInt(parts[2], 10);
            const fullYearNum = y < 100 ? 2000 + y : y;
            const parsed = new Date(fullYearNum, m - 1, d);
            if (!isNaN(parsed.getTime())) startDate = parsed;
          } else {
            const parsed = new Date(startDateStr);
            if (!isNaN(parsed.getTime())) startDate = parsed;
          }
        }

        const detailsLink = meta['z976q'] || '#';
        let slug = '';
        if (detailsLink && detailsLink !== '#') {
          try {
            const urlObj = new URL(detailsLink);
            const pathParts = urlObj.pathname.split('/').filter((p: string) => p !== '');
            slug = pathParts[pathParts.length - 1] || '';
          } catch (e) {
            const parts = detailsLink.split('/').filter((p: string) => p !== '');
            slug = parts[parts.length - 1] || '';
          }
        }

        const title = (meta['w1zd'] || 'New Program').toString().trim();
        // Fallback: Generate slug from title if extraction failed
        if (!slug || slug === 'biotechnology' || slug === 'nanoschool.in' || slug.includes('?')) {
          slug = title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }

        return {
          id: entry.id,
          title,
          category: (meta['b3bbg'] || 'Biotechnology').toString(),
          year: (meta['wt1je'] || '').toString(),
          status: (meta['9f4wv'] || 'Show').toString(),
          detailsLink,
          registerLink: meta['5sfzh'] || '#',
          image: meta['j8ch6'] || '',
          startDate,
          slug
        };
      })
      .filter((event: any) => {
        // Strictly show events with a confirmed future/today start date
        if (event.startDate) {
          return event.startDate >= today;
        }
        
        // Fallback: Only include events without a date IF they are from the CURRENT year (2026)
        // This avoids showing "random" data from past 2025 sessions
        return event.year === '26' || event.year === '2026';
      })
      .sort((a, b) => {
        // Sort by date (ascending) so the closest event is first
        if (a.startDate && b.startDate) {
          return a.startDate.getTime() - b.startDate.getTime();
        }
        // If one has no date, push it to the end
        if (a.startDate) return -1;
        if (b.startDate) return 1;
        // Final fallback: ID DESC for non-dated ones
        return Number(b.id) - Number(a.id);
      })
      .slice(0, 6);

    console.log(`Upcoming Events Debug: Fetched ${entriesArray.length}, Filtered ${results.length}`);
    return results;
      
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}
