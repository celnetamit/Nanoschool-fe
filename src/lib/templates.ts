// Template mapping for different page types
export const TEMPLATE_MAP: Record<string, 'home' | 'domain' | 'about' | 'mentors' | 'contact' | 'faqs' | 'careers' | 'internship' | 'default'> = {
    // Home
    'nanoschool-home-v2': 'home',

    // Domain pages
    'ai': 'domain',
    'artificial-intelligence': 'domain',
    'biotech': 'domain',
    'nano-technology': 'domain',
    'nanotech-4': 'domain',

    // About pages
    'about-us': 'about',
    'major-initiatives-by-nstc': 'about',
    'association': 'about',
    'achievements': 'about',
    'how-to-apply': 'about',
    'cep': 'about',
    'placement-cell': 'about',

    // Corporate
    'corporate': 'about',
    'corporate-vv2': 'about',

    // Mentors
    'mentors-profile': 'mentors',

    // Contact
    'contact-us': 'contact',

    // FAQs
    'faqs': 'faqs',

    // Careers
    'careers': 'careers',

    // Internship
    'biotech-internship': 'internship',
    'nstc-internship-programs': 'internship',
    'summer-winter-internship-projects': 'internship',
    'summer-internship': 'internship',
};


export function getTemplateForSlug(slug: string): 'home' | 'domain' | 'about' | 'mentors' | 'contact' | 'faqs' | 'careers' | 'internship' | 'default' {
    return TEMPLATE_MAP[slug] || 'default';
}
