const BASE_URL = 'https://nanoschool.in/wp-json/wp/v2';
import { cache } from 'react';
import { fetchWithTimeout } from './fetch-utils';

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
  _embedded?: any;
  // Add WooCommerce price fields
  price?: string;
  regular_price?: string;
  sale_price?: string;
  on_sale?: boolean;
  prices_inr?: {
    regular?: string;
    sale?: string;
  };
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  date_created: string;
  description: string;
  short_description: string;
  images: { src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
  meta_data: { key: string; value: any }[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// Helper function for consistent fetching
async function fetchWP(url: string): Promise<Response> {
  const WP_USER = process.env.WP_USER;
  const WP_PASSWORD = process.env.WP_PASSWORD;
  const headers: Record<string, string> = {
    'User-Agent': 'NanoSchool-Frontend/1.0',
    'Accept': 'application/json',
    'Connection': 'close'
  };

  if (WP_USER && WP_PASSWORD) {
    headers['Authorization'] = `Basic ${Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64')}`;
  }

  try {
    const response = await fetchWithTimeout(url, {
      timeoutMs: 15000, // 15s timeout
      next: { revalidate: 3600 }, // 1 hour cache
      headers
    });

    if (!response.ok) {
      console.warn(`[WP API] Warning: ${url} returned ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error(`[WP API] Error fetching ${url}:`, error);
    // Return a dummy 500 response
    return new Response(JSON.stringify({ error: 'Fetch Network Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
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
    // Safety cap: Never auto-fetch more than 10 pages in a burst loop
    const cap = Math.min(totalPages, 10);
    const promises = [];
    for (let page = 2; page <= cap; page++) {
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
    url += `&categories=5088,5059,5085`;
  }

  const response = await fetchWP(url);

  if (!response.ok) {
    console.error(`Failed to fetch workshops: ${response.status}`);
    return { posts: [], totalPages: 0 };
  }

  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);
  const posts: WordPressPost[] = await response.json();

  // PERFORMANCE OPTIMIZATION: Parallel WooCommerce Pricing Fetch
  // Fetch prices for all 9 posts in ONE parallel burst
  const WP_USER = process.env.WP_USER;
  const WP_PASSWORD = process.env.WP_PASSWORD;

  if (WP_USER && WP_PASSWORD && posts.length > 0) {
    const authHeader = `Basic ${Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64')}`;
    const wcBaseUrl = BASE_URL.replace('/wp/v2', '/wc/v3');

    const pricingPromises = posts.map(async (post) => {
      try {
        const wcUrl = `${wcBaseUrl}/products?slug=${post.slug}`;
        const res = await fetchWithTimeout(wcUrl, {
          timeoutMs: 3000, // Hard 3s limit for individual pricing
          headers: { 'Authorization': authHeader },
          next: { revalidate: 3600 }
        });

        if (res.ok) {
          const products = await res.json();
          if (products.length > 0) {
            const product = products[0];
            post.price = product.price;
            post.regular_price = product.regular_price;
            post.sale_price = product.sale_price;
            post.on_sale = product.on_sale;
          }
        }
      } catch (err) {
        console.error(`Failed to fetch price for workshop ${post.slug}:`, err);
      }
    });

    await Promise.all(pricingPromises);
  }

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

export async function getWooCommerceProducts({ perPage = 40, page = 1, categoryId = 0 } = {}): Promise<WordPressPost[]> {
  const WP_USER = process.env.WP_USER;
  const WP_PASSWORD = process.env.WP_PASSWORD;

  if (!WP_USER || !WP_PASSWORD) {
    console.error('Missing WooCommerce credentials in .env');
    return [];
  }

  const authHeader = `Basic ${Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64')}`;
  const wcBaseUrl = BASE_URL.replace('/wp/v2', '/wc/v3');
  let url = `${wcBaseUrl}/products?per_page=${perPage}&page=${page}`;

  if (categoryId > 0) {
    url += `&category=${categoryId}`;
  }

  try {
    const response = await fetchWithTimeout(url, {
      timeoutMs: 8000,
      next: { revalidate: 3600 },
      keepalive: false,
      headers: {
        'Authorization': authHeader,
        'User-Agent': 'NanoSchool-Frontend',
        'Connection': 'close'
      }
    });

    if (!response.ok) {
      console.error('WooCommerce API Error:', response.status, response.statusText);
      return [];
    }

    const wcProducts: WooCommerceProduct[] = await response.json();

    return wcProducts.map(wc => {
      // Extract INR prices from meta data if they exist
      const inrRegularField = wc.meta_data.find(m => m.key === '_regular_price_wmcp');
      const inrSaleField = wc.meta_data.find(m => m.key === '_sale_price_wmcp');

      let inrRegular = '';
      let inrSale = '';

      try {
        if (inrRegularField?.value) {
          const parsed = typeof inrRegularField.value === 'string' ? JSON.parse(inrRegularField.value) : inrRegularField.value;
          inrRegular = parsed.INR || '';
        }
        if (inrSaleField?.value) {
          const parsed = typeof inrSaleField.value === 'string' ? JSON.parse(inrSaleField.value) : inrSaleField.value;
          inrSale = parsed.INR || '';
        }
      } catch (e) {
        console.warn('Failed to parse INR prices for product:', wc.id);
      }

      return {
        id: wc.id,
        slug: wc.slug,
        title: { rendered: wc.name },
        excerpt: { rendered: wc.short_description },
        content: { rendered: wc.description },
        date: wc.date_created,
        featured_media: 0,
        _embedded: {
          'wp:featuredmedia': wc.images.length > 0 ? [{
            source_url: wc.images[0].src,
            alt_text: wc.images[0].alt
          }] : [],
          'wp:term': [
            wc.categories.map(cat => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              taxonomy: 'product_cat'
            })),
            wc.tags.map(tag => ({
              id: tag.id,
              name: tag.name,
              slug: tag.slug,
              taxonomy: 'product_tag'
            }))
          ]
        },
        price: wc.price,
        regular_price: wc.regular_price,
        sale_price: wc.sale_price,
        on_sale: wc.on_sale,
        prices_inr: {
          regular: inrRegular,
          sale: inrSale
        }
      };
    });
  } catch (error) {
    console.error('Error fetching WooCommerce products:', error);
    return [];
  }
}

export async function getProducts({ perPage = 40, page = 1, categoryId = 0 } = {}): Promise<WordPressPost[]> {
  console.log('[INFO] Fetching real WooCommerce products for page:', page);
  return getWooCommerceProducts({ perPage, page, categoryId });
}

export async function getPagedProducts(perPage: number = 6, page: number = 1): Promise<WordPressPost[]> {
  const response = await fetchWP(`${BASE_URL}/product?per_page=${perPage}&page=${page}&_embed`);
  if (!response.ok) return [];
  return response.json();
}

/**
 * Fetches a single post by slug from optimized parallel WordPress/WooCommerce checks.
 * Wrapped in React cache() to deduplicate Metadata and Page renders.
 */
export const getPostBySlug = cache(async function (type: string, slug: string): Promise<WordPressPost | null> {
  const WP_USER = process.env.WP_USER;
  const WP_PASSWORD = process.env.WP_PASSWORD;

  // Decide if we should try WooCommerce
  const isWcType = ['courses', 'product', 'programs', 'workshops'].includes(type);

  // 1. Prepare WooCommerce Promise
  const wcPromise = (isWcType && WP_USER && WP_PASSWORD) ? (async () => {
    const authHeader = `Basic ${Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64')}`;
    const wcBaseUrl = BASE_URL.replace('/wp/v2', '/wc/v3');
    const url = `${wcBaseUrl}/products?slug=${slug}`;

    try {
      const response = await fetchWithTimeout(url, {
        timeoutMs: 2500, // Hard 2.5s limit for pricing data
        next: { revalidate: 3600 },
        headers: {
          'Authorization': authHeader,
        }
      });

      if (response.ok) {
        const products: WooCommerceProduct[] = await response.json();
        return products.length > 0 ? products[0] : null;
      }
    } catch (error) {
      console.error('Error fetching WooCommerce product by slug:', error);
    }
    return null;
  })() : Promise.resolve(null);

  // 2. Prepare WordPress Promise
  const wpPromise = (async () => {
    let restBase = 'posts';
    if (type === 'courses') {
      restBase = 'product';
    } else if (type === 'pages') {
      restBase = 'pages';
    } else if (type === 'programs') {
      restBase = 'program';
    } else if (type === 'workshops') {
      restBase = 'posts';
    }

    try {
      const response = await fetchWP(`${BASE_URL}/${restBase}?slug=${slug}&_embed`);
      if (response.ok) {
        const posts = await response.json();
        return posts.length > 0 ? posts[0] : null;
      }
    } catch (error) {
      console.error('Error fetching WP post by slug:', error);
    }
    return null;
  })();

  // 3. Execute in parallel
  const [wc, wpPost] = await Promise.all([wcPromise, wpPromise]);

  // 4. Merge results (Prioritize WooCommerce for pricing/e-commerce meta)
  if (wc) {
    // Extract INR prices
    const inrRegularField = wc.meta_data.find((m: any) => m.key === '_regular_price_wmcp');
    const inrSaleField = wc.meta_data.find((m: any) => m.key === '_sale_price_wmcp');

    let inrRegular = '';
    let inrSale = '';

    try {
      if (inrRegularField?.value) {
        const parsed = typeof inrRegularField.value === 'string' ? JSON.parse(inrRegularField.value) : inrRegularField.value;
        inrRegular = parsed.INR || '';
      }
      if (inrSaleField?.value) {
        const parsed = typeof inrSaleField.value === 'string' ? JSON.parse(inrSaleField.value) : inrSaleField.value;
        inrSale = parsed.INR || '';
      }
    } catch (e) {
      console.warn('Failed to parse INR prices for product slug:', slug);
    }

    return {
      id: wc.id,
      slug: wc.slug,
      title: { rendered: wc.name },
      excerpt: { rendered: wc.short_description },
      content: { rendered: wc.description },
      date: wc.date_created,
      featured_media: 0,
      _embedded: {
        'wp:featuredmedia': wc.images.length > 0 ? [{
          source_url: wc.images[0].src,
          alt_text: wc.images[0].alt
        }] : []
      },
      price: wc.price,
      regular_price: wc.regular_price,
      sale_price: wc.sale_price,
      on_sale: wc.on_sale,
      prices_inr: {
        regular: inrRegular,
        sale: inrSale
      }
    };
  }

  return wpPost;
});

export function sanitizeWPContent(html: string, stripAllTags: boolean = false): string {
  if (!html) return '';

  // 1. Strip [tcb-script] tags and content
  let sanitized = html.replace(/\[tcb-script.*?\][\s\S]*?\[\/tcb-script\]/gi, '');

  // 2. Strip other bracketed shortcodes
  sanitized = sanitized.replace(/\[.*?\]/g, '');

  // Add space after strong tag if needed for UI spacing when inline
  sanitized = sanitized.replace(/<\/strong>([A-Za-z])/g, '</strong> $1');

  if (stripAllTags) {
    // Strip all HTML tags for excerpts
    sanitized = sanitized.replace(/<[^>]*>?/gm, '');
  } else {
    // 3. AGGRESSIVE STRIPPING for full content

    // Remove images pointing to port 7071 (Developer-only hardcoded URLs)
    sanitized = sanitized.replace(/<img[^>]+src="http:\/\/localhost:7071\/[^>]+>/gi, '');

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
    // 4. Inject Premium Insight Boxes for common patterns
    sanitized = sanitized.replace(/<p>(\s*Quick answer:)/gi, '<p class="insight-box">$1');

    // 5. Detect text-based headings that should be structural headings
    const headingPatterns = [
      "About the Course",
      "Why This Topic Matters",
      "What Participants Will Learn",
      "Course Structure",
      "Why This Course Stands Out",
      "Frequently Asked Questions",
      "Program Overview",
      "Detailed Syllabus",
      "Curriculum",
      "Project Details",
      "Certification",
      "Who Should Attend",
      "Learning Outcomes",
      "The program integrates",
      "Real-World Applications",
      "Key Features"
    ];

    headingPatterns.forEach(pattern => {
      // PRO: Aggressive detection of headings inside ANY block-level tag (p, div, h2-h6)
      // Handles: <div>About the Course</div>, <p><strong>About the Course</strong></p>, etc.
      // Also handles &nbsp; and varied whitespace
      const regex = new RegExp(`<(?:p|div|h[2-6])(?:\\s+[^>]*)*?>[\\s\\&nbsp\\;]*(?:<strong>[\\s\\&nbsp\\;]*)?(${pattern}:?)(?:[\\s\\&nbsp\\;]*<\\/strong>)?[\\s\\&nbsp\\;]*<\\/(?:p|div|h[2-6])>`, 'gi');
      sanitized = sanitized.replace(regex, '<h3>$1</h3>');
    });

    // 6. PRO MODULE DETECTOR: Detect "Module X" patterns in any container
    // Handles: Module 1, Module: 1, MODULE - 1, Module — 1, etc.
    // Catches hyphens (-), slashes (/), colons (:), and em-dashes (—)
    sanitized = sanitized.replace(/<(?:p|div|h[2-6])(?:\s+[^>]*)*?>[\s\&nbsp\;]*(?:<strong>[\s\&nbsp\;]*)?(Module\s+\d+[\s\:\-\—\/\|]*.*?)(?:\s*<\/strong>)?[\s\&nbsp\;]*<\/(?:p|div|h[2-6])>/gi, '<h4>$1</h4>');

    // 7. PRO SEMANTIC NORMALIZER (Ultimate Protection)
    // Ensure all H[2-4] get our design system classes
    sanitized = sanitized.replace(/<(h[2-4])([^>]*)>(.*?)<\/h\1>/gi, '<$1 class="wp-title" $2>$3</$1>');

    // Convert bulleted text strings into clean <li>Item</li>
    // Target both <div>• Text</div> and plain text lines in the description
    sanitized = sanitized.replace(/(?:^|<br\s*\/?>|<(?:div|p|li)[^>]*>)\s*•\s*(.*?)(?=\s*(?:<|$))/gi, '<li>$1</li>');

    // Safety wrap for Li elements that are orphans
    sanitized = sanitized.replace(/(<li>.*?<\/li>)+/g, (match) => {
      if (match.includes('<ul>')) return match;
      return `<ul>${match}</ul>`;
    });

    // Multi-pass cleanup for redundant UL nesting
    sanitized = sanitized.replace(/<\/ul>\s*<ul>/g, '');

    // Convert orphaned <div>Text</div> into <p>Text</p>
    sanitized = sanitized.replace(/<div>\s*((?!<(?:h|ul|li|div|p|blockquote)).*?)\s*<\/div>/gi, '<p>$1</p>');

    // Structural healing for broken headings
    sanitized = sanitized.replace(/<\/p><h([2-4])>/gi, '</h$1><h$1>');
    sanitized = sanitized.replace(/<h([2-4])>(.*?)<\/p>/gi, '<h$1>$2</h$1>');

    // 8. Convert sequential image lists (like partner logos) into modern grids
    sanitized = sanitized.replace(/<p>([\s\S]*?)<\/p>/gi, (match, inner) => {
      const imgCount = (inner.match(/<img/gi) || []).length;
      if (imgCount >= 3) {
        // Evaluate text content without tags
        const textOnly = inner.replace(/<[^>]*>?/gm, '').trim();
        // If there's barely any text, it's a logo grid
        if (textOnly.length < 50) {
          return `<div class="logo-grid">${inner}</div>`;
        }
      }
      return match;
    });

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

export const getBlogBySlug = cache(async function (slug: string): Promise<BlogPost | null> {
  const response = await fetchWP(`${BASE_URL}/nstc_blog?slug=${slug}&_embed`);
  if (!response.ok) return null;
  const posts = await response.json();
  return posts.length > 0 ? posts[0] : null;
});

export function structureWPContent(html: string, description?: string) {
  if (!html) return { overview: description || '', modules: [] };

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

  const firstModule = modules.length > 0 ? modules[0] : null;
  const fallbackOverview = firstModule ? `<h3>${firstModule.title}</h3>${firstModule.content}` : '';

  // Sanitize description if provided
  const cleanDescription = description ? sanitizeWPContent(description) : '';

  // Use sanitized description if provided, otherwise fallback to the extracted overview or first module
  const finalOverview = cleanDescription && stripHtml(cleanDescription).trim().length > 10
    ? cleanDescription
    : (stripHtml(overview).length < 50 ? fallbackOverview : overview);

  return {
    overview: finalOverview,
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
      keepalive: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Connection': 'close'
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
      keepalive: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Connection': 'close'
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
