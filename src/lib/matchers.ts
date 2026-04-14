/**
 * Utility to match product titles between WordPress (Frontend) and Formidable/Payments (Database)
 * Handles fuzzy matching, HTML entities, and similarity-based intersections.
 */

function getKeywords(title: string): string[] {
    if (!title) return [];
    
    // 1. Decode entities and clean up
    const clean = title.toLowerCase()
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#8211;/g, '-')
        .replace(/[^a-z0-9\s]/g, ' ') // replace symbols with spaces
        .trim();
    
    // 2. Split and filter (keep substantial words)
    // We ignore common filler words and extremely short words relative to the technical domain
    const stopWords = ['and', 'the', 'with', 'for', 'from', 'course', 'workshop', 'masterclass', 'program', 'session'];
    return clean.split(/\s+/)
        .filter(word => word.length > 2)
        .filter(word => !stopWords.includes(word));
}

export function isProductMatched(dbTitle: string, wpTitle: string): boolean {
    const dbRaw = (dbTitle || '').toLowerCase()
        .replace(/&amp;/g, '&')
        .replace(/&#8211;/g, '-')
        .trim();
    const wpRaw = (wpTitle || '').toLowerCase()
        .replace(/&amp;/g, '&')
        .replace(/&#8211;/g, '-')
        .trim();

    if (!dbRaw || !wpRaw) return false;

    // 1. Direct or Partial String Match (High confidence)
    if (dbRaw.includes(wpRaw) || wpRaw.includes(dbRaw)) {
        if (wpRaw.length > 10 || dbRaw.length > 10) return true;
    }

    // 2. Surrogate Matches (Explicit high-priority mapping)
    const surrogates = [
        { wp: 'advanced manufacturing', db: 'smart factories' },
        { wp: 'manufacturing and smart factories', db: 'advanced manufacturing' },
        { wp: 'advanced manufacturing and smart', db: 'factories' },
        { wp: 'computational drug discovery', db: 'intensive genomics' },
        { wp: 'drug discovery', db: 'omics' },
        { wp: 'genomics', db: 'drug discovery' },
        { wp: 'bioinformatics', db: 'genomics' }
    ];

    for (const s of surrogates) {
        if (wpRaw.includes(s.wp) && dbRaw.includes(s.db)) return true;
        if (wpRaw.includes(s.db) && dbRaw.includes(s.wp)) return true;
    }

    // 3. Keyword Overlap (Resilient technical matching)
    const dbKeys = getKeywords(dbTitle);
    const wpKeys = getKeywords(wpTitle);

    if (dbKeys.length > 0 && wpKeys.length > 0) {
        const intersection = dbKeys.filter(k => wpKeys.includes(k));
        const overlapCount = intersection.length;
        
        // Use the length of the shorter set as the baseline (to allow sub-matches)
        const shorterSetLen = Math.min(dbKeys.length, wpKeys.length);
        const similarity = overlapCount / shorterSetLen;

        // If >= 70% of the core keywords match, we treat it as the same product
        // This is extremely robust against added descriptive text like "(Spring 2024)"
        if (similarity >= 0.7) return true;
        
        // Absolute overlap fallback: if they share 3+ substantial technical words, it's a match
        if (overlapCount >= 3) return true;
        
        // Specific case for very short titles (e.g. "AutoCAD")
        if (shorterSetLen <= 2 && overlapCount >= 1) {
             // Check if the 1 match is exactly the whole title
             const exactMatch = dbKeys.some(k => wpKeys.includes(k) && (k.length > 5));
             if (exactMatch) return true;
        }
    }

    return false;
}
