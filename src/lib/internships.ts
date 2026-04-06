import { fetchWithTimeout } from './fetch-utils';

export interface InternshipOption {
    duration: string;
    mode: string;
    priceInr: string;
    priceUsd: string;
}

export interface Internship {
    id: string;
    key: string;
    code: string;
    shortTitle: string;
    title: string;
    description: string;
    duration?: string;
    mode?: string;
    icon: string;
    detailsLink: string;
    registerLink: string;
    category: string;
    image?: string;
    overview: string;
    options: InternshipOption[];
}

export async function getInternships(): Promise<Internship[]> {
    const url = process.env.INTERNSHIP_API_URL;
    const user = process.env.WP_USER;
    const pass = process.env.WP_PASSWORD;

    if (!url || !user || !pass) {
        console.warn('Missing Internship API Environment Variables');
        return [];
    }

    try {
        const authString = Buffer.from(`${user}:${pass}`).toString('base64');
        
        // Fetch up to 50 active internships
        const fetchUrl = `${url}&page_size=50`;

        const response = await fetchWithTimeout(fetchUrl, {
            timeoutMs: 15000,
            useCache: true,
            ttlMs: 300000, // 5 min memory cache
            next: { revalidate: 3600 }, // 1 hour Next.js cache
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch internships', response.statusText);
            return [];
        }

        const data = await response.json();
        const entriesArray = Object.values(data);

        return entriesArray
            .map((entry: any) => {
                const meta = entry.meta || {};
                
                // Parse "Duration: 45 Days | Mode: Online"
                const descFull = meta.nu9c7 || '';
                let duration = 'Flexible';
                let mode = 'Online / Offline';
                
                if (descFull.includes('|')) {
                    const parts = descFull.split('|');
                    duration = parts[0].replace('Duration:', '').trim() || duration;
                    mode = parts[1].replace('Mode:', '').trim() || mode;
                } else if (descFull) {
                    duration = descFull; // fallback
                }

                // Make icon dynamic based on category or assign a generic biotech one
                const category = meta.hfghl || 'Biotechnology';
                let icon = '🧬';
                if (category.toLowerCase().includes('nano')) icon = '⚛️';
                if (category.toLowerCase().includes('ai') || category.toLowerCase().includes('data')) icon = '🤖';

                // Extract Options Matrix (Pricing and Modes)
                const options: InternshipOption[] = [];
                // Handle case where properties are arrays from Formidable repeater fields
                if (Array.isArray(meta.s77gk)) {
                    for (let i = 0; i < meta.s77gk.length; i++) {
                        options.push({
                            mode: meta.s77gk[i] || '',
                            duration: Array.isArray(meta.nqr35) ? meta.nqr35[i] : (meta.nqr35 || duration),
                            priceInr: Array.isArray(meta.g3fe2) ? meta.g3fe2[i] : (meta.g3fe2 || ''),
                            priceUsd: Array.isArray(meta.lulj6) ? meta.lulj6[i] : (meta.lulj6 || '')
                        });
                    }
                } else if (meta.s77gk) {
                    options.push({
                        mode: meta.s77gk,
                        duration: meta.nqr35 || duration,
                        priceInr: meta.g3fe2 || '',
                        priceUsd: meta.lulj6 || ''
                    });
                }

                return {
                    id: entry.id,
                    key: entry.item_key,
                    code: meta['8c9fn'] || `INT-${entry.id}`,
                    shortTitle: meta.uo3fy || 'Specialized Program',
                    title: meta.x85s8 || 'Internship Program',
                    description: descFull,
                    duration,
                    mode,
                    icon,
                    category,
                    detailsLink: meta.l0lg3 || '#',
                    registerLink: `https://nanoschool.in/biotech-internship/projects/application/${entry.item_key}/#apply`,
                    image: meta.fdn75 || '',
                    overview: meta['1fuff'] || '',
                    options
                };
            })
            .sort((a, b) => Number(b.id) - Number(a.id)); // Newest first based on ID
            
    } catch (error) {
        console.error('Error fetching internships:', error);
        return [];
    }
}
