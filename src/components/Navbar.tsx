'use client';
import { useState, useEffect } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';

interface NavItem {
    label: string;
    href?: string;
    children?: NavItem[];
    icon?: string;
    description?: string;
}

const NAV_MENU: NavItem[] = [
    { label: 'Home', href: '/' },
    {
        label: 'Academics',
        children: [
            {
                label: 'Domains',
                children: [
                    { label: 'Artificial Intelligence', href: '/ai', icon: '🤖', description: 'Master AI & ML' },
                    { label: 'Biotechnology', href: '/biotech', icon: '🧬', description: 'Innovate Life Sciences' },
                    { label: 'Nanotechnology', href: '/nano-technology', icon: '⚛️', description: 'Molecular Engineering' },
                ]
            },
            {
                label: 'Programs',
                children: [
                    { label: 'Biotech Internship', href: '/biotech-internship', icon: '🧪', description: 'Summer/Winter Training' },
                    { label: 'Courses', href: '/course', icon: '🎓', description: 'Skill Development' },
                ]
            }
        ]
    },
    {
        label: 'Workshops',
        children: [
            { label: 'Browse List', href: '/workshops', icon: '📋', description: 'Upcoming sessions' },
            { label: 'Calendar View', href: '/workshop-calendar', icon: '📅', description: 'Schedule view' },
        ]
    },
    { label: 'Mentors', href: '/mentors' },
    {
        label: 'Company',
        children: [
            { label: 'About Us', href: '/about-us', icon: '🏢', description: 'Our Mission & Vision' },
            { label: 'Corporate', href: '/corporate', icon: '🤝', description: 'Partner with us' },
            { label: 'Blogs', href: '/blogs', icon: '📝', description: 'Latest Insights' },
        ]
    }
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
    const [userRole, setUserRole] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/login');
                const data = await res.json();
                if (data.authenticated) {
                    setUserRole(data.role);
                }
            } catch (err) {
                console.error('Auth check failed', err);
            }
        };
        checkAuth();
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = (label: string) => {
        setMobileExpanded(prev => ({ ...prev, [label]: !prev[label] }));
    };

    // Recursive Desktop Menu Item
    const DesktopMenuItem = ({ item, depth = 0 }: { item: NavItem; depth?: number }) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = pathname === item.href;

        if (!hasChildren) {
            return (
                <Link
                    href={item.href || '#'}
                    className={`
                        relative px-4 py-2 text-sm font-semibold transition-all duration-300 group
                        ${isActive
                            ? 'text-blue-600'
                            : 'text-slate-700 hover:text-blue-600'
                        }
                    `}
                >
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                </Link>
            );
        }

        return (
            <div className="relative group/menu h-full flex items-center">
                <button className={`
                    flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-all duration-300
                    text-slate-700 hover:text-blue-600
                `}>
                    {item.label}
                    <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover/menu:rotate-180 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {/* Dropdown Menu */}
                <div className={`
                    absolute pt-6 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible 
                    transition-all duration-300 transform origin-top -translate-y-2 group-hover/menu:translate-y-0 z-50
                    ${depth === 0 ? 'top-full left-1/2 -translate-x-1/2 min-w-[280px]' : 'top-0 left-full ml-3 min-w-[260px]'}
                `}>
                    <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/80 p-3 ring-1 ring-black/5">
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 border-l border-t border-slate-200/80 rotate-45"></div>
                        {item.children?.map((child, idx) => (
                            <div key={idx} className="relative group/submenu">
                                {child.children ? (
                                    <>
                                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/80 text-slate-700 text-sm font-semibold cursor-pointer transition-all group/item">
                                            <span className="group-hover/item:text-blue-600 transition-colors">{child.label}</span>
                                            <svg className="w-4 h-4 text-slate-400 rotate-[-90deg] group-hover/item:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                        {/* Nested Dropdown */}
                                        <div className="absolute top-0 left-full ml-4 opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-300 transform translate-x-2 group-hover/submenu:translate-x-0 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/80 p-3 min-w-[280px] z-50">
                                            {child.children.map((subChild, subIdx) => (
                                                <Link key={subIdx} href={subChild.href || '#'} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-blue-50/80 border border-transparent hover:border-blue-200/50 transition-all group/item">
                                                    {subChild.icon && (
                                                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-xl group-hover/item:bg-gradient-to-br group-hover/item:from-blue-600 group-hover/item:to-indigo-600 group-hover/item:scale-110 transition-all duration-300">
                                                            {subChild.icon}
                                                        </span>
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-slate-700 text-sm group-hover/item:text-blue-600 transition-colors">{subChild.label}</div>
                                                        {subChild.description && <div className="text-xs text-slate-500 font-medium mt-0.5">{subChild.description}</div>}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <Link href={child.href || '#'} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-blue-50/80 border border-transparent hover:border-blue-200/50 transition-all group/item">
                                        {child.icon && (
                                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-xl group-hover/item:bg-gradient-to-br group-hover/item:from-blue-600 group-hover/item:to-indigo-600 group-hover/item:scale-110 transition-all duration-300">
                                                {child.icon}
                                            </span>
                                        )}
                                        <div className="flex-1">
                                            <div className="font-semibold text-slate-700 text-sm group-hover/item:text-blue-600 transition-colors">{child.label}</div>
                                            {child.description && <div className="text-xs text-slate-500 font-medium mt-0.5">{child.description}</div>}
                                        </div>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Recursive Mobile Menu Item
    const MobileMenuItem = ({ item, depth = 0 }: { item: NavItem; depth?: number }) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = mobileExpanded[item.label];

        return (
            <div className="w-full">
                {hasChildren ? (
                    <div className="mb-1">
                        <button
                            onClick={() => toggleMobileMenu(item.label)}
                            className={`
                                flex justify-between items-center w-full p-3.5 rounded-xl text-left transition-all
                                ${isExpanded ? 'bg-blue-50 border border-blue-200 text-blue-600' : 'text-slate-700 hover:bg-slate-50 border border-transparent'}
                            `}
                        >
                            <span className={`font-semibold ${depth === 0 ? 'text-base' : 'text-sm'}`}>
                                {item.label}
                            </span>
                            <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-3 py-2 space-y-1 border-l-2 border-blue-200 ml-3 mt-2">
                                {item.children?.map((child, idx) => (
                                    <MobileMenuItem key={idx} item={child} depth={depth + 1} />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link
                        href={item.href || '#'}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3.5 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-transparent transition-all group active:scale-98"
                    >
                        {item.icon && <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>}
                        <div className="flex-1">
                            <div className={`font-semibold ${depth === 0 ? 'text-base' : 'text-sm'}`}>{item.label}</div>
                            {item.description && <div className="text-xs text-slate-500 font-medium mt-0.5">{item.description}</div>}
                        </div>
                    </Link>
                )}
            </div>
        );
    };

    if (pathname.startsWith('/dashboard')) return null;

    return (
        <>
            {/* Modern Glassmorphism Navbar */}
            <div className={`
                fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
            `}>
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/50"></div>
                <div className={`
                    absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent
                    ${scrolled ? 'opacity-100' : 'opacity-0'}
                    transition-opacity duration-500
                `}></div>

                <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo Section */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="relative w-11 h-11 flex items-center justify-center">
                                    <NextImage
                                        src="https://nanoschool.in/wp-content/uploads/2025/05/NSTC-Logo-2-removebg-preview.png"
                                        alt="NanoSchool Logo"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 44px"
                                        className="object-contain"
                                    />
                                </div>
                                <div className="hidden sm:block">
                                    <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                                        NanoSchool
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {NAV_MENU.map((item, idx) => (
                                <DesktopMenuItem key={idx} item={item} />
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            {userRole ? (
                                <Link
                                    href="/dashboard"
                                    className="
                                        flex items-center gap-2 px-6 py-2.5 rounded-xl
                                        bg-slate-100 text-slate-700 text-sm font-bold 
                                        hover:bg-blue-50 hover:text-blue-600 transition-all duration-300
                                        border border-slate-200 hover:border-blue-200
                                    "
                                >
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/dashboard/login"
                                    className="
                                        flex items-center gap-2 px-6 py-2.5 rounded-xl
                                        text-slate-600 text-sm font-bold hover:text-blue-600 transition-all
                                    "
                                >
                                    Sign In
                                </Link>
                            )}
                            <Link
                                href="/contact-us"
                                className="
                                    relative group overflow-hidden px-6 py-2.5 rounded-xl
                                    bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold 
                                    shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40
                                    hover:-translate-y-0.5 transition-all duration-300
                                    border border-blue-400/20
                                "
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Contact Us
                                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className={`
                                    relative p-2.5 rounded-xl transition-all duration-300
                                    ${isOpen
                                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-200'
                                        : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                                    }
                                `}
                                aria-label="Toggle menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`
                fixed inset-0 z-40 md:hidden transform transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                ${isOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible pointer-events-none'}
            `}>
                <div className="absolute inset-0 bg-white/98 backdrop-blur-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white/30 to-white/0"></div>
                </div>

                <div className="relative h-full flex flex-col pt-24 pb-6 px-6 overflow-y-auto">
                    <div className="space-y-2 flex-1">
                        {NAV_MENU.map((item, idx) => (
                            <MobileMenuItem key={idx} item={item} />
                        ))}
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-200 flex flex-col gap-3">
                        {userRole ? (
                            <Link
                                href="/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-slate-700 font-bold bg-slate-100 border border-slate-200 active:scale-95 transition-all"
                            >
                                <LayoutDashboard size={20} />
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/dashboard/login"
                                onClick={() => setIsOpen(false)}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-slate-700 font-bold bg-slate-100 border border-slate-200 active:scale-95 transition-all"
                            >
                                Sign In
                            </Link>
                        )}
                        <Link
                            href="/contact-us"
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30 active:scale-95 transition-all"
                        >
                            Contact Us
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Backdrop for Mobile Menu */}
            <div
                className={`
                    fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-500 md:hidden
                    ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
                `}
                onClick={() => setIsOpen(false)}
            />
        </>
    );
}
