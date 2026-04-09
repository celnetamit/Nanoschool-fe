import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User, Mail, Shield, Calendar, Clock, MapPin, Phone, GraduationCap, Award } from 'lucide-react';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/dashboard/login');
  }

  const user = session.user as any;
  const role = user.role;

  return (
    <DashboardLayout role={role} userEmail={user.email!}>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Profile Header Card */}
        <div className="relative group overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 p-8 lg:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors duration-1000"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                <div className="relative">
                    <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-[2.25rem] bg-slate-900 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center">
                        {user.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-5xl font-black text-white">{user.name?.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
                        <Shield size={20} className="fill-current" />
                    </div>
                </div>

                <div className="text-center md:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter">{user.name}</h1>
                        <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                            {role}
                        </span>
                    </div>
                    <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2 mb-6">
                        <Mail size={18} className="text-slate-400" />
                        {user.email}
                    </p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
                            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                                Active Connection
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account ID</span>
                            <span className="text-sm font-bold text-slate-700 tabular-nums">#{user.id?.substring(0, 8) || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid md:grid-cols-2 gap-8">
            {/* Personal Details */}
            <div className="rounded-[2.25rem] bg-white border border-slate-200 p-8 shadow-xl shadow-slate-200/40">
                <h3 className="text-lg font-black text-slate-950 tracking-tight mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                        <User size={20} />
                    </div>
                    Profile Information
                </h3>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                            <Phone size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contact Number</p>
                            <p className="text-sm font-bold text-slate-700">Not provided</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                            <MapPin size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                            <p className="text-sm font-bold text-slate-700">Not provided</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Member Since</p>
                            <p className="text-sm font-bold text-slate-700">April 2024</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Academic Summary (Role Dependent) */}
            <div className="rounded-[2.25rem] bg-white border border-slate-200 p-8 shadow-xl shadow-slate-200/40 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-400/50 transition-all duration-300">
                <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-500">
                    <Award size={40} className="stroke-[1.5]" />
                </div>
                <h4 className="text-xl font-black text-slate-950 tracking-tight mb-2">My Certifications</h4>
                <p className="text-sm text-slate-500 font-medium px-4">View and download your earned certificates from completed core programs.</p>
                <Link href="/dashboard/certificates" className="mt-8">
                  <button className="px-8 py-3 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-600 active:scale-95 transition-all shadow-xl shadow-slate-900/20">
                      Access Portal
                  </button>
                </Link>
            </div>
        </div>

        {/* Security Settings Area */}
        <div className="rounded-[2.25rem] bg-slate-950 p-10 text-white relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h3 className="text-2xl font-black tracking-tight mb-2">Account Security</h3>
                    <p className="text-slate-400 text-sm font-medium">Your profile is managed by Google. Your authentication is safe and secure.</p>
                </div>
                <button className="px-8 py-4 rounded-2xl bg-white text-slate-950 text-xs font-black uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95">
                    Google Security Settings
                </button>
            </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
