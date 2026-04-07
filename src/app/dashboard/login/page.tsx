'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Shield, ArrowRight, Loader2, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [role, setRole] = useState<'user' | 'admin'>('user');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Login successful!');
                router.push('/dashboard');
                router.refresh();
            } else {
                toast.error(data.error || 'Login failed');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full relative">
                {/* Decorative Elements */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-200/40 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-200/40 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white/40 p-8 pt-10 overflow-hidden outline outline-1 outline-slate-100">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 mb-6 group transition-transform hover:scale-105 active:scale-95 duration-300">
                            <Shield className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-500 mt-2 font-medium">Access your NanoSchool dashboard</p>
                    </div>

                    {/* Role Switcher */}
                    <div className="flex p-1 bg-slate-100/80 rounded-2xl mb-8">
                        <button
                            onClick={() => setRole('user')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 font-semibold text-sm ${role === 'user' ? 'bg-white text-blue-600 shadow-lg shadow-blue-500/5 border border-blue-50' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <User className="w-4 h-4" />
                            Student
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 font-semibold text-sm ${role === 'admin' ? 'bg-white text-blue-600 shadow-lg shadow-blue-500/5 border border-blue-50' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Shield className="w-4 h-4" />
                            Admin
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900"
                                />
                            </div>
                        </div>

                        {role === 'admin' && (
                            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-8 font-medium">
                        {role === 'user'
                            ? "Please use the same email you used for enrollment."
                            : "Admin credentials required for metrics access."}
                    </p>
                </div>
            </div>
        </div>
    );
}
