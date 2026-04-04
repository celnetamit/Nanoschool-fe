'use client';

import { useState, useEffect } from 'react';

interface DateDisplayProps {
    date: string;
    formatOptions?: Intl.DateTimeFormatOptions;
    locale?: string;
    className?: string;
}

export default function DateDisplay({ 
    date, 
    formatOptions = { month: 'long', day: 'numeric', year: 'numeric' },
    locale = 'en-US',
    className = ""
}: DateDisplayProps) {
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        try {
            const d = new Date(date);
            setFormattedDate(d.toLocaleDateString(locale, formatOptions));
        } catch (e) {
            console.error("Invalid date:", date);
            setFormattedDate(date);
        }
    }, [date, locale, formatOptions]);

    // Show nothing or a placeholder during hydration to prevent mismatch
    if (!formattedDate) {
        return <span className={`${className} opacity-0`}>Loading...</span>;
    }

    return <span className={className}>{formattedDate}</span>;
}
