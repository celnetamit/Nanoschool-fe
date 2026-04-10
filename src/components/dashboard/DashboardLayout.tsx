'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  GraduationCap,
  Bell,
  PieChart,
  Calendar,
  Home,
  CreditCard,
  Package,
  Award
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'admin' | 'user';
  userEmail: string;
  userName?: string;
  userImage?: string;
}

export default function DashboardLayout({ children, role, userEmail, userName, userImage }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/dashboard/login' });
  };

  const menuItems = role === 'admin' ? [
    { icon: <Home size={20} />, label: 'Home', href: '/' },
    { icon: <PieChart size={20} />, label: 'Overview', href: '/dashboard' },
    { icon: <CreditCard size={20} />, label: 'Payments', href: '/dashboard/payments' },
    { icon: <Users size={20} />, label: 'Registrations', href: '/dashboard/registrations' },
    { icon: <Package size={20} />, label: 'All Products', href: '/dashboard/products' },
  ] : [
    { icon: <Home size={20} />, label: 'Home', href: '/' },
    { icon: <LayoutDashboard size={20} />, label: 'My Dashboard', href: '/dashboard' },
    { icon: <CreditCard size={20} />, label: 'My Payments', href: '/dashboard/payments' },
    { icon: <Package size={20} />, label: 'My Products', href: '/dashboard/products' },
    { icon: <Award size={20} />, label: 'Certifications', href: '/dashboard/certificates' },
  ];

  return (
    <div 
      className="min-h-screen bg-[#fcfdfe] flex font-sans selection:bg-blue-100 selection:text-blue-900"
      style={{ '--sidebar-width': isSidebarOpen ? '320px' : '100px' } as React.CSSProperties}
    >
      {/* Sidebar - High End Sapphire Glass */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-slate-950/95 backdrop-blur-3xl border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.1)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-[100px]'}
      `}>
        <div className="h-full flex flex-col p-6">
          {/* Logo Section - Floating Tech look */}
          <div className="flex items-center gap-4 px-4 py-8 mb-12 group cursor-pointer" onClick={() => router.push('/')}>
            <div className="relative">
                <div className="absolute -inset-2 bg-blue-500/20 rounded-2xl blur-lg group-hover:bg-blue-500/40 transition-all duration-1000"></div>
                <div className="relative w-12 h-12 min-w-[3rem] rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-all duration-500">
                    <GraduationCap size={28} className="drop-shadow-lg" />
                </div>
            </div>
            <div className={`transition-all duration-700 delay-100 ${!isSidebarOpen && 'lg:opacity-0 lg:w-0 overflow-hidden'}`}>
                <span className="font-black text-2xl bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tighter">
                  NanoSchool
                </span>
                <div className="flex items-center gap-1.5 -mt-0.5">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Academy</p>
                </div>
            </div>
          </div>

          {/* Navigation - Ultra Polished */}
          <nav className="flex-1 space-y-2.5">
            <p className={`text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] px-5 mb-6 transition-all ${!isSidebarOpen && 'lg:opacity-0 lg:h-0'}`}>System Console</p>
            {menuItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`
                    flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden
                    ${isActive 
                      ? 'text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/10 ring-1 ring-blue-500/20' 
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'}
                  `}
                >
                  {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-transparent opacity-50"></div>
                  )}
                  <span className={`transition-all duration-500 relative z-10 ${isActive ? 'text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'group-hover:text-blue-400 group-hover:scale-110'} min-w-[1.25rem]`}>
                    {item.icon}
                  </span>
                  <span className={`font-black text-sm tracking-tight transition-all duration-700 relative z-10 ${!isSidebarOpen && 'lg:opacity-0 lg:w-0 overflow-hidden'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-l-full shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-in slide-in-from-right duration-700"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer - Integrated Glass Pill for User Profile */}
          <div className="pt-8 mt-auto relative z-10">
            <div className={`
                p-5 rounded-[2rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 backdrop-blur-md transition-all duration-700 hover:border-white/10 hover:shadow-2xl hover:shadow-black/20
                ${!isSidebarOpen && 'lg:scale-0 lg:h-0 lg:p-0 opacity-0 overflow-hidden'}
            `}>
                <Link href="/dashboard/profile" className="flex items-center gap-4 mb-4 group/card">
                    <div className="relative group/avatar">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-md opacity-20 group-hover/avatar:opacity-40 transition-opacity"></div>
                        <div className="relative w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center font-black text-blue-400 text-lg shadow-xl group-hover/card:scale-105 transition-transform">
                            {userEmail.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-white truncate leading-tight tracking-tight group-hover/card:text-blue-400 transition-colors">{userEmail.split('@')[0]}</p>
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{role}</p>
                        </div>
                    </div>
                </Link>
                <div className="h-px w-full bg-white/5 mb-4"></div>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/10 text-rose-500 text-[10px] font-black hover:bg-rose-500 hover:text-white transition-all active:scale-95 border border-rose-500/20 uppercase tracking-widest"
                >
                    <LogOut size={14} /> 
                    Terminate Session
                </button>
            </div>
            
            {!isSidebarOpen && (
                <div className="space-y-4">
                    <Link href="/dashboard/profile" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-blue-400 mx-auto hover:bg-white/10 transition-colors">
                        {userEmail.charAt(0).toUpperCase()}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 mx-auto group shadow-lg"
                        title="Logout"
                    >
                        <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Header - High Gloss Translucency (Fixed) */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/40 px-10 flex items-center justify-between z-40 fixed top-0 right-0 left-0 lg:left-[var(--sidebar-width)] h-28 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-4 rounded-2xl bg-white shadow-xl shadow-slate-200/20 border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-90"
            >
              {isSidebarOpen ? <X size={20} className="stroke-[2.5]" /> : <Menu size={20} className="stroke-[2.5]" />}
            </button>
            <div className="hidden sm:block">
                <nav className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-1.5">
                    <span className="hover:text-blue-600 cursor-pointer transition-colors px-1">Engine</span>
                    <span>/</span>
                    <span className="text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded-lg border border-blue-100/30">{pathname === '/dashboard' ? 'Overview' : pathname.split('/').pop()}</span>
                </nav>
                <h2 className="text-3xl font-black text-slate-950 tracking-tighter transition-all">
                  {pathname === '/dashboard' ? 'Core Analytics' : pathname.split('/').pop()?.replace(/^\w/, c => c.toUpperCase())}
                </h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden xl:flex items-center gap-4 px-6 py-2.5 bg-slate-50/80 rounded-[1.25rem] border border-slate-100 shadow-sm">
                <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-60"></div>
                </div>
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">Security Active</span>
                <div className="w-px h-3 bg-slate-200"></div>
                <span className="text-[10px] font-bold text-slate-400 tabular-nums">4 ms latency</span>
             </div>
             
             <button className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-blue-600 transition-all relative group shadow-sm">
                <Bell size={22} className="group-hover:rotate-12 transition-transform stroke-[2]" />
                <span className="absolute top-4 right-4 w-2 h-2 bg-rose-600 rounded-full border-2 border-white animate-bounce"></span>
             </button>
             
             <div className="h-14 w-px bg-slate-100 hidden sm:block"></div>
             
             <div className="flex items-center gap-4 pl-2 pl-4">
                <div className="hidden text-right lg:block">
                    <p className="text-sm font-black text-slate-950 leading-tight">{userName || userEmail.split('@')[0]}</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center justify-end gap-1.5">
                       <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></span>
                       {role === 'admin' ? 'Academy Admin' : 'Academy Student'}
                    </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-950 shadow-[0_15px_30px_rgba(0,0,0,0.15)] flex items-center justify-center font-black text-white text-xl relative group overflow-hidden">
                    {userImage ? (
                        <img src={userImage} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-indigo-600/30 group-hover:opacity-100 opacity-0 transition-opacity"></div>
                            <span className="relative z-10">{userEmail.substring(0, 1).toUpperCase()}</span>
                        </>
                    )}
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic Content Scrollbox */}
        <div className="flex-1 overflow-y-auto p-10 lg:p-14 pt-[calc(7rem+3.5rem)] lg:pt-[calc(7rem+3.5rem)] scroll-smooth bg-slate-50/10">
          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-1000">
            {children}
          </div>
        </div>
      </main>

      {/* Ultra-Soft Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-500"
        />
      )}
    </div>
  );
}