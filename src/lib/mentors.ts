export interface MentorData {
  id: string;
  name: string;
  bio: string;
  image: string;
  roles: string[];
  domains: string[];
  expertise: string[];
  organization: string;
  country: string;
  designation: string;
  skills: string[];
  experience: string;
  status: string;
}

export interface MentorsResponse {
  mentors: MentorData[];
  totalCount: number;
  totalApprovedCount: number;
}

export interface MentorFilter {
  search?: string;
  domains?: string[];
  experience?: string;
}

export async function getMentors(page: number = 1, pageSize: number = 10, filters?: MentorFilter): Promise<MentorsResponse> {
  const url = process.env.MENTOR_API_URL;
  const user = process.env.WP_USER;
  const pass = process.env.WP_PASSWORD;

  if (!url || !user || !pass) {
    console.warn('Missing Mentor API Environment Variables');
    return { mentors: [], totalCount: 0, totalApprovedCount: 0 };
  }

  try {
    const authString = Buffer.from(`${user}:${pass}`).toString('base64');
    
    // Fetch a large page_size to allow robust local sorting and filtering of all mentors
    // This payload is heavily cached for 1 hour to prevent crashing the external WordPress API.
    const fetchUrl = `${url}&page_size=500`;

    const response = await fetch(fetchUrl, {
      next: { revalidate: 60 * 60 }, // Cache for 1 hour
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch mentors', response.statusText);
      return { mentors: [], totalCount: 0, totalApprovedCount: 0 };
    }

    // Attempt to get total items from X-WP-Total header if available
    const data = await response.json();
    
    // The data is an object mapping entry IDs to the entry details.
    // Convert object values to an array.
    const entriesArray = Object.values(data);

    const mentors: MentorData[] = entriesArray.map((entry: any) => {
      const meta = entry.meta || {};
      
      return {
        id: entry.id || String(Math.random()),
        name: meta.qrtsy || 'Mentor',
        bio: meta.cy1dp || '',
        image: meta.gflux || 'https://images.unsplash.com/photo-1594824436951-7f126744d0d1?auto=format&fit=crop&q=80&w=400&h=400',
        roles: Array.isArray(meta['9mw4h']) ? meta['9mw4h'] : [meta['9mw4h']].filter(Boolean),
        domains: (Array.isArray(meta['h7f22']) ? meta['h7f22'] : [meta['h7f22']])
          .concat(Array.isArray(meta['3omjv']) ? meta['3omjv'] : [meta['3omjv']])
          .filter(Boolean),
        expertise: Array.isArray(meta.ycqum) ? meta.ycqum : [meta.ycqum].filter(Boolean),
        organization: meta.n9pgu || '',
        country: meta.an3kf || '',
        designation: meta.c8oxl || '',
        skills: (Array.isArray(meta['2wf8o']) ? meta['2wf8o'] : [meta['2wf8o']])
          .filter(Boolean)
          .flatMap((s: any) => typeof s === 'string' ? s.split(/[;,]/).map((x: string) => x.trim()).filter(Boolean) : String(s)),
        experience: meta.err89 || '',
        status: meta.hfsot || 'Pending',
      };
    });

    // 1. Strictly restrict to only Approved mentors across the system
    let approvedMentors = mentors.filter(m => String(m.status).includes('Approved'));
    const absoluteTotalCount = approvedMentors.length;

    // 2. Apply local filters on top of the Approved subset
    let filteredMentors = approvedMentors;

    if (filters) {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        filteredMentors = filteredMentors.filter(m => 
          m.name.toLowerCase().includes(query) || 
          m.bio.toLowerCase().includes(query) ||
          m.organization.toLowerCase().includes(query)
        );
      }
      
      if (filters.domains && filters.domains.length > 0) {
        filteredMentors = filteredMentors.filter(m => 
          m.domains.some(d => filters.domains!.some(fd => d.toLowerCase().includes(fd.toLowerCase())))
        );
      }

      if (filters.experience) {
        const expQuery = filters.experience.toLowerCase();
        filteredMentors = filteredMentors.filter(m => !!m.experience && m.experience.toLowerCase().includes(expQuery));
      }
    }

    const finalTotalCount = filteredMentors.length;
    const startIndex = (page - 1) * pageSize;
    const pagedMentors = filteredMentors.slice(startIndex, startIndex + pageSize);

    return { mentors: pagedMentors, totalCount: finalTotalCount, totalApprovedCount: absoluteTotalCount };
  } catch (error) {
    console.error('Error in getMentors:', error);
    return { mentors: [], totalCount: 0, totalApprovedCount: 0 };
  }
}

export async function getMentorById(id: string): Promise<MentorData | null> {
  const url = process.env.MENTOR_API_URL;
  const user = process.env.WP_USER;
  const pass = process.env.WP_PASSWORD;

  if (!url || !user || !pass) return null;

  try {
    const authString = Buffer.from(`${user}:${pass}`).toString('base64');
    
    // Formidable API gets specific entries via /frm/v2/entries/[id]
    const baseUrl = url.split('?')[0];
    const fetchUrl = `${baseUrl}/${id}`;

    const response = await fetch(fetchUrl, {
      next: { revalidate: 60 * 60 },
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch mentor ${id}`);
      return null;
    }

    const entry = await response.json();
    const meta = entry.meta || {};

    return {
      id: entry.id || id,
      name: meta.qrtsy || 'Mentor',
      bio: meta.cy1dp || '',
      image: meta.gflux || 'https://images.unsplash.com/photo-1594824436951-7f126744d0d1?auto=format&fit=crop&q=80&w=400&h=400',
      roles: Array.isArray(meta['9mw4h']) ? meta['9mw4h'] : [meta['9mw4h']].filter(Boolean),
      domains: (Array.isArray(meta['h7f22']) ? meta['h7f22'] : [meta['h7f22']])
        .concat(Array.isArray(meta['3omjv']) ? meta['3omjv'] : [meta['3omjv']])
        .filter(Boolean),
      expertise: Array.isArray(meta.ycqum) ? meta.ycqum : [meta.ycqum].filter(Boolean),
      organization: meta.n9pgu || '',
      country: meta.an3kf || '',
      designation: meta.c8oxl || '',
      skills: (Array.isArray(meta['2wf8o']) ? meta['2wf8o'] : [meta['2wf8o']])
        .filter(Boolean)
        .flatMap((s: any) => typeof s === 'string' ? s.split(/[;,]/).map((x: string) => x.trim()).filter(Boolean) : String(s)),
      experience: meta.err89 || '',
      status: meta.hfsot || 'Pending',
    };
  } catch (error) {
    console.error(`Error fetching mentor ${id}:`, error);
    return null;
  }
}
