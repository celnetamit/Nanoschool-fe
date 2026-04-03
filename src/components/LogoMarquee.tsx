'use client';

import Image from 'next/image';

const LOGOS = [
    { name: 'IIT Bombay', src: 'https://upload.wikimedia.org/wikipedia/en/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg' },
    { name: 'IIT Delhi', src: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg' },
    { name: 'BITS Pilani', src: 'https://upload.wikimedia.org/wikipedia/en/d/d3/BITS_Pilani-Logo.svg' },
    { name: 'AIIMS', src: 'https://commons.wikimedia.org/wiki/Special:FilePath/AIIMS_New_Delhi.png' },
    { name: 'DRDO', src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Defence_Research_and_Development_Organisation.svg' },
    { name: 'CSIR', src: 'https://upload.wikimedia.org/wikipedia/en/1/13/CSIR_Logo.svg' },
    { name: 'DST', src: 'https://commons.wikimedia.org/wiki/Special:FilePath/DST_Logo_June_2020.png' },
    { name: 'DBT', src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dpt.bt.png' },
];

export default function LogoMarquee() {
    return (
        <div className="w-full relative overflow-hidden py-10 bg-slate-950 border-y border-white/5">
            <style jsx>{`
                .marquee-content {
                    animation: marquee 40s linear infinite;
                }
                .marquee-content:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Trusted by students from</p>
            </div>

            <div className="flex w-full overflow-hidden mask-linear-gradient">
                <div className="flex marquee-content min-w-full shrink-0 items-center justify-around gap-16 px-8">
                    {LOGOS.map((logo, index) => (
                        <div key={index} className="relative w-32 h-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center group">
                            <Image
                                src={logo.src}
                                alt={logo.name}
                                width={120}
                                height={60}
                                className="object-contain max-h-12 w-auto"
                                unoptimized={true}
                            />
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded">
                                {logo.name}
                            </span>
                        </div>
                    ))}
                    {LOGOS.map((logo, index) => (
                        <div key={`duplicate-${index}`} className="relative w-32 h-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center group">
                            <Image
                                src={logo.src}
                                alt={logo.name}
                                width={120}
                                height={60}
                                className="object-contain max-h-12 w-auto"
                                unoptimized={true}
                            />
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded">
                                {logo.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
