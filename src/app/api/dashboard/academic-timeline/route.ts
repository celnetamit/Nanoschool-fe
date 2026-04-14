import { NextResponse } from 'next/server';
import { getWorkshops, getCourses } from '@/lib/wordpress';
import { getInternships } from '@/lib/internships';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const offset = (page - 1) * limit;

  try {
    const [workshopData, courses, internships] = await Promise.all([
      getWorkshops({ page: 1, perPage: 100 }), // Get a good batch for filtering
      getCourses({ stripContent: false }),
      getInternships()
    ]);

    const now = new Date();

    // 1. Helper for Date Extraction
    function extractEventDate(content: string | undefined, fallback: string): Date {
        if (!content) return new Date(fallback);
        
        // Match hidden target date or common patterns
        const srOnlyMatch = content.match(/<p id="nsp-target-date"[^>]*>(.*?)<\/p>/);
        const regEndsMatch = content.match(/Registration Ends[\s\S]*?<p>([\s\S]*?)<br/);
        const closedMatch = content.match(/Registration closes\s*<strong>(.*?)<\/strong>/i);
        
        const dateStr = (srOnlyMatch?.[1] || regEndsMatch?.[1] || closedMatch?.[1] || '').trim();
        const parsed = new Date(dateStr);
        
        return isNaN(parsed.getTime()) ? new Date(fallback) : parsed;
    }

    // Unified items array
    let items: any[] = [];

    // 1. Process Workshops
    workshopData.posts.forEach((w: any) => {
        const startDate = extractEventDate(w.content?.rendered, w.date);
        // Default workshops to 3 hours duration if no endDate
        const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); 
        
        // Infer status if not explicitly 'upcoming' or 'live'
        let status = 'upcoming';
        if (startDate <= now && endDate >= now) status = 'live';
        else if (endDate < now) status = 'expired';

        items.push({
            id: `workshop-${w.id}`,
            title: w.title.rendered,
            type: 'Workshop',
            startDate,
            endDate,
            status,
            link: `/workshops/${w.slug}`
        });
    });

    // 2. Process Courses
    courses.forEach((c: any) => {
        const startDate = extractEventDate(c.content?.rendered, c.date);
        // Courses usually don't "expire" in the same way, but let's assume 1 year duration
        const endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
        
        // For courses, status is usually 'live' once published
        let status = 'live';
        if (startDate > now) status = 'upcoming';

        items.push({
            id: `course-${c.id}`,
            title: c.title.rendered,
            type: 'Course',
            startDate,
            endDate,
            status,
            link: `/course/${c.slug}`
        });
    });

    // 3. Process Internships
    internships.forEach((i: any) => {
        // Internships have a duration like "45 Days"
        const startDate = new Date(i.created_at || now); // Fallback to now if no date
        let durationDays = 30; // default
        if (i.duration) {
            const match = i.duration.match(/(\d+)/);
            if (match) durationDays = parseInt(match[1]);
        }
        const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
        
        let status = 'upcoming';
        if (startDate <= now && endDate >= now) status = 'live';
        else if (endDate < now) status = 'expired';

        items.push({
            id: `internship-${i.id}`,
            title: i.title,
            type: 'Internship',
            startDate,
            endDate,
            status,
            link: `/internship/${i.key}`
        });
    });

    // Apply strict filtering: ONLY show Live or Future items
    const filteredItems = items.filter(item => {
        const isLive = item.status === 'live';
        const isUpcoming = item.status === 'upcoming';
        
        // Safety check on dates if status is ambiguous
        const isFuture = item.startDate > now || item.endDate > now;

        return (isLive || isUpcoming || isFuture) && item.status !== 'expired';
    });

    // Sort by startDate ASC (so upcoming shows in order)
    filteredItems.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    // Paginate
    const paginatedItems = filteredItems.slice(offset, offset + limit);

    return NextResponse.json({
        success: true,
        items: paginatedItems,
        total: filteredItems.length,
        page,
        limit,
        totalPages: Math.ceil(filteredItems.length / limit)
    });

  } catch (error) {
    console.error('Academic Timeline API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch timeline' }, { status: 500 });
  }
}
