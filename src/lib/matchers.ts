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
    const stopWords = [
        'and', 'the', 'with', 'for', 'from', 'course', 'workshop', 'masterclass', 
        'program', 'session', 'advanced', 'introduction', 'basics', 'fundamentals',
        'training', 'certification', 'online', 'live', 'bootcamp', 'module', 'learning'
    ];

    const techAcronyms = ['ai', 'ml', 'gis', 'iot', 'ar', 'vr', 'ui', 'ux'];

    return clean.split(/\s+/)
        .filter(word => word.length > 2 || techAcronyms.includes(word))
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

    // 1. Exact Match (Highest confidence)
    if (dbRaw === wpRaw) return true;

    // 2. Substantial Partial Match
    if (dbRaw.includes(wpRaw) || wpRaw.includes(dbRaw)) {
        const shorterLen = Math.min(dbRaw.length, wpRaw.length);
        const longerLen = Math.max(dbRaw.length, wpRaw.length);
        const ratio = shorterLen / longerLen;

        if (ratio > 0.5 && longerLen > 15) return true;
        if (ratio > 0.8) return true;
    }

    // 3. Keyword Overlap (Resilient technical matching)
    const dbKeys = getKeywords(dbTitle);
    const wpKeys = getKeywords(wpTitle);

    if (dbKeys.length > 0 && wpKeys.length > 0) {
        const intersection = dbKeys.filter(k => wpKeys.includes(k));
        const overlapCount = intersection.length;
        
        const shorterSetLen = Math.min(dbKeys.length, wpKeys.length);
        const longerSetLen = Math.max(dbKeys.length, wpKeys.length);
        const similarity = overlapCount / shorterSetLen;

        // NEW: Stricter logic for short title sets
        if (shorterSetLen === 1) {
            // Only match if they are nearly identical in keyword count (1 vs 1 or 1 vs 2)
            // This prevents a long DB title from being "matched" by a single common word in a workshop
            if (overlapCount === 1 && longerSetLen <= 2) return true;
            return false;
        }

        if (shorterSetLen === 2) {
            // Require matching both words if the longer set is significantly different
            if (overlapCount === 2) return true;
            return false;
        }

        // If workshop is longer, allow >= 80% similarity
        if (similarity >= 0.8) return true;
        
        // Absolute overlap fallback
        if (overlapCount >= 4 && similarity >= 0.5) return true;
    }

    // 4. Surrogate Matches (Last resort for historical aliases)
    const surrogates = [
        { wp: 'advanced manufacturing', db: 'smart factories' },
        { wp: 'computational drug discovery', db: 'intensive genomics' },
        { wp: 'bioinformatics', db: 'genomics' }
    ];

    for (const s of surrogates) {
        if (wpRaw.includes(s.wp) && dbRaw.includes(s.db)) return true;
        if (wpRaw.includes(s.db) && dbRaw.includes(s.wp)) return true;
    }

    return false;
}
