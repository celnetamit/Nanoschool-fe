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

// Helper function for consistent fetching
async function fetchWP(url: string): Promise<Response> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    return response;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    // Return a dummy error response to be handled by caller
    return new Response(null, { status: 500, statusText: 'Fetch Network Error' });
  }
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetchWP(`${BASE_URL}/categories?per_page=100&hide_empty=true`);
  if (!response.ok) return [];
  return response.json();
}

// Helper to fetch ALL items across pages
async function fetchAllItems<T>(endpoint: string): Promise<T[]> {
  const perPage = 100;
  const initialUrl = `${BASE_URL}/${endpoint}?per_page=${perPage}&_embed`; // Always embed for consistency

  const response = await fetchWP(initialUrl);

  if (!response.ok) {
    console.error(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`);
    return [];
  }

  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
  let allItems = await response.json();

  if (totalPages > 1) {
    const promises = [];
    for (let page = 2; page <= totalPages; page++) {
      promises.push(
        fetchWP(`${BASE_URL}/${endpoint}?per_page=${perPage}&page=${page}&_embed`).then((res) => (res.ok ? res.json() : []))
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
  } else {
    // If "All" workshops requested, filter by ALL allowed workshop categories
    // 5088: AI, 5059: Biotech, 5085: Nanotech
    url += `&categories=5088,5059,5085`;
  }

  const response = await fetchWP(url);

  if (!response.ok) {
    console.error(`Failed to fetch workshops: ${response.status} ${response.statusText}`);
    return { posts: [], totalPages: 0 };
  }

  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);
  const posts = await response.json();

  return { posts, totalPages };
}

export async function getMedia(id: number) {
  if (!id) return null;
  const response = await fetchWP(`${BASE_URL}/media/${id}`);
  if (!response.ok) return null;
  return response.json();
}

export async function getLandingPages(): Promise<WordPressPost[]> {
  const response = await fetchWP(`${BASE_URL}/pages?per_page=100`);
  if (!response.ok) return [];
  return response.json();
}

export async function getProducts(perPage: number = 100, page: number = 1): Promise<WordPressPost[]> {
  // If perPage is 100 (default), we might still want all, but let's allow fetching just a few.
  // Actually, standard behavior of fetchAllItems was to get ALL.
  // Let's keep getProducts as is for compatibility if used elsewhere,
  // and add getFeaturedProducts or simply use a new function with pagination.
  // To avoid breaking changes, let's add a new function for paged products.

  // FIXME: Fetching all 425+ products at once causes timeouts/504 errors.
  // For now, limiting to 100 items to ensure the page loads.
  // return fetchAllItems<WordPressPost>('product');

  const response = await fetchWP(`${BASE_URL}/product?per_page=100&_embed`);
  if (!response.ok) return [];
  return response.json();
}

export async function getPagedProducts(perPage: number = 6, page: number = 1): Promise<WordPressPost[]> {
  const response = await fetchWP(`${BASE_URL}/product?per_page=${perPage}&page=${page}&_embed`);
  if (!response.ok) return [];
  return response.json();
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
  const response = await fetchWP(`${BASE_URL}/${restBase}?slug=${slug}&_embed`);
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


export interface BlogPost extends WordPressPost {
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  slug: string;
  featured_media: number;
}

// Helper to parse the full HTML content from NSTC blogs
export function parseBlogContent(html: string) {
  if (!html) return { title: '', content: '' };

  // 1. Extract Title
  // Try <title> tag first
  let titleMatch = html.match(/<title>(.*?)<\/title>/i);
  let title = titleMatch ? titleMatch[1] : '';

  // If no title tag, try <h1>
  if (!title) {
    titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    title = titleMatch ? stripHtml(titleMatch[1]) : 'Untitled Blog Post';
  }

  // Clean up title (remove | NanoSchool etc if present)
  title = title.split('|')[0].trim();

  // 2. Extract Body Content
  // We want everything inside <body>...</body>
  // If no body tag, we assume the whole thing is content (fallback)
  let contentMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = contentMatch ? contentMatch[1] : html;

  // 3. Sanitization & Cleanup
  // Remove the header/footer from the blog content if it mimics the main site
  // This is specific to NSTC blogs which seem to be full pages
  // We'll remove specific known containers if possible, or just rely on the fact that
  // we might want to render it somewhat raw but controlled.

  // Remove <header>...</header>
  content = content.replace(/<header[\s\S]*?<\/header>/gi, '');

  // Remove <footer>...</footer>
  content = content.replace(/<footer[\s\S]*?<\/footer>/gi, '');

  // Remove <nav>...</nav>
  content = content.replace(/<nav[\s\S]*?<\/nav>/gi, '');

  // Remove scripts
  content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  return { title, content };
}

export async function getBlogs(): Promise<BlogPost[]> {
  const response = await fetchWP(`${BASE_URL}/nstc_blog?per_page=100&_embed`);
  if (!response.ok) return [];
  const posts = await response.json();

  // Parse titles for listing
  return posts.map((post: BlogPost) => {
    const { title } = parseBlogContent(post.content.rendered);
    return {
      ...post,
      title: { rendered: title || post.title.rendered || 'Untitled' } // Fallback to parsed title
    };
  });
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const response = await fetchWP(`${BASE_URL}/nstc_blog?slug=${slug}&_embed`);
  if (!response.ok) return null;
  const posts = await response.json();
  return posts.length > 0 ? posts[0] : null;
}

export function structureWPContent(html: string) {
  if (!html) return { overview: '', modules: [] };

  // 1. Sanitize first to remove scripts/styles
  let cleanHtml = sanitizeWPContent(html);

  // 1.5 Strip unwanted legacy sections (Need Help, Feedback, etc.)
  // Remove sections starting with headers containing these keywords until the next header or end
  const unwantedRegex = /<(h[1-6])[^>]*>.*?(Need Help|Feedback|Reviews|Related Products).*?<\/\1>[\s\S]*?(?=(<h[1-6])|$)/gi;
  cleanHtml = cleanHtml.replace(unwantedRegex, '');

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

export interface StoreProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
    currency_symbol: string;
  };
  description: string;
  short_description: string;
  images: {
    id: number;
    src: string;
    name: string;
    alt: string;
  }[];
  variations: number[];
  add_to_cart: {
    url: string;
    text: string;
    minimum: number;
    maximum: number;
  };
}

export async function getStoreProduct(slug: string): Promise<StoreProduct | null> {
  try {
    // Fetch by slug from the Store API
    // Strategy: Search for the product.
    // We replace /wp/v2 with /wc/store to switch APIs
    const storeApiUrl = BASE_URL.replace('/wp/v2', '/wc/store');

    const res = await fetch(`${storeApiUrl}/products?slug=${slug}&_embed`, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!res.ok) {
      console.error('Store API Error:', res.status, res.statusText);
      return null;
    }

    const products: StoreProduct[] = await res.json();

    if (products.length > 0) {
      return products[0];
    }

    // Fallback: Try fetching a larger list and finding by slug if the direct param doesn't work
    const resList = await fetch(`${storeApiUrl}/products?per_page=20`, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!resList.ok) return null;

    const allProducts: StoreProduct[] = await resList.json();
    return allProducts.find(p => p.slug === slug) || null;

  } catch (error) {
    console.error('Error fetching store product:', error);
    return null;
  }
}
