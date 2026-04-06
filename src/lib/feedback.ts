/**
 * Feedback Service
 * Fetches real student feedback from the WordPress Formidable API (Form 326)
 */

export interface FeedbackData {
  name: string;
  comment: string;
  rating: number;
  date: string;
  time: string;
  workshopName: string;
}

import { fetchWithTimeout } from './fetch-utils';

export async function getFeedbacks(): Promise<FeedbackData[]> {
  const url = process.env.USER_FEEDBACK_API;
  const user = process.env.WP_USER;
  const pass = process.env.WP_PASSWORD;

  if (!url || !user || !pass) {
    console.warn('Missing Feedback API Environment Variables');
    return [];
  }

  try {
    const authString = Buffer.from(`${user}:${pass}`).toString('base64');
    
    // Fetch a healthy sample (e.g. 50 entries to guarantee latest) and explicitly request DESC
    const fetchUrl = `${url}&page_size=50&order=DESC`;

    const response = await fetchWithTimeout(fetchUrl, {
      timeoutMs: 20000, // 20s max because WP Forms API takes ~15 seconds to query
      useCache: true,
      ttlMs: 300000, // 5 min local in-memory cache fallback
      next: { revalidate: 300 }, // Cache in Next.js for 5 minutes. Fast enough to be 'latest' but safe.
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch feedback entries', response.statusText);
      return [];
    }

    const data = await response.json();
    const entriesArray = Object.values(data);

    const feedbacks: FeedbackData[] = entriesArray
      .map((entry: any) => {
        const meta = entry.meta || {};
        const comment = meta.anl9l || meta.qci7w || '';
        const rawRating = parseInt(meta['504mx']) || 4; // Default to 4 if missing
        
        // Normalize 4-point scale to 5-star UI (multiplied by 1.25)
        const normalizedRating = Math.min(5, Math.ceil(rawRating * 1.25));

        // Format date and time
        const rawCreatedAt = entry.created_at || '';
        const [rawDate, rawTime] = rawCreatedAt.split(' ');
        
        const dateParts = rawDate.split('-');
        const formattedDate = dateParts.length === 3 ? `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}` : rawDate;
        
        // Use top-level 'name' key for workshop title
        const rawWorkshop = entry.name || 'Global Workshop';
        const cleanWorkshop = rawWorkshop.split(',')[0].trim();

        // Format Time to 12h (e.g. 8:33 pm)
        let formattedTime = '';
        if (rawTime) {
          const [hours, minutes] = rawTime.split(':');
          const h = parseInt(hours);
          const ampm = h >= 12 ? 'pm' : 'am';
          const h12 = h % 12 || 12;
          formattedTime = `${h12}:${minutes} ${ampm}`;
        }

        return {
          name: meta.m8t22 || meta['97qte'] || 'Student',
          comment: (meta.qci7w || meta.anl9l || '').trim(),
          rating: Math.min(5, Math.ceil((parseInt(meta['51af9']) || normalizedRating) * 1.25)),
          date: formattedDate,
          time: formattedTime,
          workshopName: cleanWorkshop,
        };
      })
      // Quality Filter: Remove very short feedbacks (<10 chars)
      .filter(f => f.comment.length >= 10 && f.name !== 'Student')
      // Freshness: Sort by recent date
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return feedbacks;
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return [];
  }
}
