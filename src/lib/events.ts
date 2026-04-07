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
  endDate?: Date | null;
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
    
    // API-side filtering: Get 'Biotechnology' events marked for 'Show'
    const fetchUrl = `${url}&5715=Biotechnology&4422=Show&page_size=200&order_by=id&order=DESC`;

    const response = await fetchWithTimeout(fetchUrl, {
      timeoutMs: 40000,
      useCache: false, 
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const entriesArray = Array.isArray(data) ? data : Object.values(data);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allEvents = entriesArray.map((entry: any) => {
      const meta = entry.meta || {};
      
      const parseDate = (val: any): Date | null => {
        if (!val) return null;
        let str = Array.isArray(val) ? val[0] : String(val).trim();
        if (!str || str === 'null' || str === 'undefined') return null;

        const parts = str.split('/');
        if (parts.length === 3) {
          const m = parseInt(parts[0], 10);
          const d = parseInt(parts[1], 10);
          const y = parseInt(parts[2], 10);
          const fullYearNum = y < 100 ? 2000 + y : y;
          const parsed = new Date(fullYearNum, m - 1, d);
          return isNaN(parsed.getTime()) ? null : parsed;
        }
        const parsed = new Date(str);
        return isNaN(parsed.getTime()) ? null : parsed;
      };

      const startDate = parseDate(meta['1rme4']);
      const endDate = parseDate(meta['9p93w']);

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
      
      const genericSlugs = ['', 'biotechnology', 'nanoschool.in', 'workshop', 'workshops'];
      if (!slug || genericSlugs.includes(slug.toLowerCase()) || slug.includes('?')) {
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
        endDate,
        slug
      } as UpcomingEvent;
    });

    // STRICT FILTERING: Only show upcoming (on or after today)
    // Also include events with NO date if they are from the 2026 session (placeholder upcoming)
    return allEvents
      .filter(e => {
        if (e.startDate) return e.startDate >= today;
        return e.year === '26' || e.year === '2026'; // Session-based upcoming if date is TBD
      })
      .sort((a, b) => {
        if (a.startDate && b.startDate) return a.startDate.getTime() - b.startDate.getTime();
        if (a.startDate) return -1;
        if (b.startDate) return 1;
        return Number(b.id) - Number(a.id);
      })
      .slice(0, 6);
      
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}
