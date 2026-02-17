import React from 'react';

interface HighlightItem {
    label: string;
    value: string;
    icon: string;
    color: string;
}

export default function KeyHighlights({ content }: { content: string }) {
    // Helper to extract value by label
    const extractValue = (label: string): string => {
        // More robust regex to match "Label: Value" pattern
        // Matches: Label followed by optional colon, whitespace, or HTML tags, then captures the text value until next tag or newline
        // Example matches: "Mode: <br> Online", "<strong>Mode</strong>: Online"
        const regex = new RegExp(`${label}\\s*:?\\s*(?:<[^>]+>|\\s)*([^<\\n\\r]+)`, 'i');
        const match = content.match(regex);
        return match ? match[1].trim() : '';
    };

    const highlights: HighlightItem[] = [
        { label: 'Mode', value: extractValue('Mode'), icon: '💻', color: 'bg-blue-100 text-blue-600' },
        { label: 'Type', value: extractValue('Type'), icon: '👨‍🏫', color: 'bg-indigo-100 text-indigo-600' },
        { label: 'Level', value: extractValue('Level'), icon: '📊', color: 'bg-purple-100 text-purple-600' },
        { label: 'Duration', value: extractValue('Duration'), icon: '⏳', color: 'bg-orange-100 text-orange-600' },
        { label: 'Starts', value: extractValue('Starts'), icon: '🗓️', color: 'bg-green-100 text-green-600' },
        { label: 'Time', value: extractValue('Time'), icon: '⏰', color: 'bg-red-100 text-red-600' },
    ].filter(item => item.value); // Only show items found

    if (highlights.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {highlights.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${item.color}`}>
                        {item.icon}
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">{item.label}</p>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{item.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
