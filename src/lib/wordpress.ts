const BASE_URL = 'https://nanoschool.in/wp-json/wp/v2';

export interface WordPressPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  date: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _embedded?: any; // Using any for flexibility with WP API response
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${BASE_URL}/categories?per_page=100&hide_empty=true`, {
    next: { revalidate: 3600 },
  });
  if (!response.ok) return [];
  return response.json();
}

// Helper to fetch ALL items across pages
async function fetchAllItems<T>(endpoint: string): Promise<T[]> {
  const perPage = 100;
  const initialUrl = `${BASE_URL}/${endpoint}?per_page=${perPage}&_embed`; // Always embed for consistency

  const response = await fetch(initialUrl, { next: { revalidate: 3600 } });
  if (!response.ok) return [];

  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
  let allItems = await response.json();

  if (totalPages > 1) {
    const promises = [];
    for (let page = 2; page <= totalPages; page++) {
      promises.push(
        fetch(`${BASE_URL}/${endpoint}?per_page=${perPage}&page=${page}&_embed`, {
          next: { revalidate: 3600 },
        }).then((res) => (res.ok ? res.json() : []))
      );
    }
    const results = await Promise.all(promises);
    results.forEach((pageItems) => {
      allItems = allItems.concat(pageItems);
    });
  }

  return allItems;
}

export async function getCourses(): Promise<WordPressPost[]> {
  // Assuming 'ai_course' might eventually need pagination too
  return fetchAllItems<WordPressPost>('ai_course');
}

export async function getPrograms(): Promise<WordPressPost[]> {
  return fetchAllItems<WordPressPost>('program');
}

export async function getWorkshops({ page = 1, perPage = 9, category = 0 }: { page?: number, perPage?: number, category?: number } = {}): Promise<{ posts: WordPressPost[], totalPages: number }> {
  let url = `${BASE_URL}/posts?per_page=${perPage}&page=${page}&_embed`;
  if (category > 0) {
    url += `&categories=${category}`;
  }

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) return { posts: [], totalPages: 0 };

  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);
  const posts = await response.json();

  return { posts, totalPages };
}

export async function getMedia(id: number) {
  if (!id) return null;
  const response = await fetch(`${BASE_URL}/media/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!response.ok) return null;
  return response.json();
}

export async function getLandingPages(): Promise<WordPressPost[]> {
  const response = await fetch(`${BASE_URL}/pages?per_page=100`, {
    next: { revalidate: 3600 },
  });
  if (!response.ok) return [];
  return response.json();
}

export async function getProducts(): Promise<WordPressPost[]> {
  return fetchAllItems<WordPressPost>('product');
}

export async function getPostBySlug(type: string, slug: string): Promise<WordPressPost | null> {
  let restBase = 'posts';

  if (type === 'courses') {
    restBase = 'product'; // Map 'courses' URL to 'product' API
  } else if (type === 'pages') {
    restBase = 'pages'; // Map 'pages' URL to 'pages' API
  } else if (type === 'programs') {
    restBase = 'program'; // Keep programs if still needed? User didn't mention, but safe to keep
  }

  // Use _embed to get featured media in the same request
  const response = await fetch(`${BASE_URL}/${restBase}?slug=${slug}&_embed`, {
    next: { revalidate: 3600 },
  });
  if (!response.ok) return null;
  const posts = await response.json();
  return posts.length > 0 ? posts[0] : null;
}

export function sanitizeWPContent(html: string, stripAllTags: boolean = false): string {
  if (!html) return '';

  // 1. Strip [tcb-script] tags and content
  let sanitized = html.replace(/\[tcb-script.*?\][\s\S]*?\[\/tcb-script\]/gi, '');

  // 2. Strip other bracketed shortcodes
  sanitized = sanitized.replace(/\[.*?\]/g, '');

  if (stripAllTags) {
    // Strip all HTML tags for excerpts
    sanitized = sanitized.replace(/<[^>]*>?/gm, '');
  } else {
    // 3. AGGRESSIVE STRIPPING for full content

    // Remove <style> blocks and their content to prevent global layout breakage
    sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Remove <script> blocks and their content
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove <link> tags
    sanitized = sanitized.replace(/<link\b[^>]*>/gi, '');

    // Remove <meta> tags
    sanitized = sanitized.replace(/<meta\b[^>]*>/gi, '');

    // Remove "nsp-isolated-wrapper" class
    sanitized = sanitized.replace(/class=["']\s*nsp-isolated-wrapper\s*["']/gi, '');

    // Add responsive classes to images if they don't have them
    // This is a simple regex replacement; for more complex cases, a parser would be better but this suffices for known WP content issues.
    sanitized = sanitized.replace(/<img(?![^>]*\bclass=["'][^"']*\b(max-w-full|h-auto)\b)([^>]+)>/gi, '<img class="max-w-full h-auto" $1>');
  }

  return sanitized.trim();
}

// Helper to strip HTML tags
function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
}

export function structureWPContent(html: string) {
  if (!html) return { overview: '', modules: [] };

  // 1. Sanitize first to remove scripts/styles
  const cleanHtml = sanitizeWPContent(html);

  // 2. Simple heuristic extraction
  // We'll treat the first part of the content as "Overview" until we hit a heading that suggests "Modules", "Curriculum", "Structure", etc.
  // Or if we don't find those, we take the first 2-3 paragraphs.

  const overviewMatch = cleanHtml.split(/<(h[1-6]).*?>/i);
  const overview = overviewMatch[0] || '';

  // If overview is huge, truncation might be needed, but strictly users want "real data".
  // Let's look for specific keywords in headings to identify modules.

  const modules: { title: string, content: string }[] = [];

  // Regex to find Headings and their following content
  // This is a naive parser but robust enough for standard WP posts
  // Matches <h2>Title</h2>Content...
  const sectionRegex = /<(h[2-4])[^>]*>(.*?)<\/\1>([\s\S]*?)(?=<h[2-4]|$)/gi;
  let match;

  while ((match = sectionRegex.exec(cleanHtml)) !== null) {
    const title = stripHtml(match[2]).trim();
    const content = match[3].trim();

    // Filter for relevant sections if needed, or just map all H2/H3s as "Modules"
    if (title.length > 2 && content.length > 10) {
      modules.push({ title, content });
    }
  }

  return {
    overview: stripHtml(overview).length < 50 && modules.length > 0 ? modules[0].content : overview, // Fallback if overview is empty
    modules: modules.length > 0 ? modules : []
  };
}
