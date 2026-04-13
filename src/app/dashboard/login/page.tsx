'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Shield, Loader2, LogIn, Home } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const { status } = useSession();

    const getTargetUrl = () => {
        if (typeof window === 'undefined') return '/dashboard';
        
        // 1. Check query parameter
        const callbackUrl = searchParams.get('callbackUrl');
        if (callbackUrl && callbackUrl.startsWith('/')) return callbackUrl;
        
        // 2. Check localStorage
        const storedRedirect = localStorage.getItem('redirectAfterLogin');
        if (storedRedirect && storedRedirect.startsWith('/')) {
            return storedRedirect;
        }
        
        return '/dashboard';
    };

    useEffect(() => {
        if (status === 'authenticated') {
            const target = getTargetUrl();
            localStorage.removeItem('redirectAfterLogin');
            router.push(target);
        }
    }, [status, router, searchParams]);

    useEffect(() => {
        const error = searchParams.get('error');
        if (error === 'NotEnrolled') {
            toast.error('No enrollment found with this email. Please register first.');
        } else if (error) {
            toast.error('Authentication failed. Please try again.');
        }
    }, [searchParams]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        const target = getTargetUrl();
        try {
            await signIn('google', { callbackUrl: target });
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    const handleManualLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please enter both email and password');
            return;
        }

        setLoading(true);
        const target = getTargetUrl();
        
        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl: target
            });

            if (result?.error) {
                toast.error('Invalid email or password');
                setLoading(false);
            } else {
                toast.success('Login successful!');
                localStorage.removeItem('redirectAfterLogin');
                router.push(target);
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full relative">
                {/* Decorative Elements */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-200/40 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-200/40 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white/40 p-10 overflow-hidden outline outline-1 outline-slate-100">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 mb-8 group transition-transform hover:scale-110 active:scale-95 duration-300">
                            <Shield className="w-10 h-10 group-hover:rotate-12 transition-transform" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">NanoSchool Portal</h1>
                        <p className="text-slate-500 mt-2 font-medium">Safe & Secure Access</p>
                    </div>

                    <form onSubmit={handleManualLogin} className="space-y-4 mb-8">
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-slate-400 group-focus-within:text-blue-600 transition-colors">@</span>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Shield className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || status === 'loading'}
                            className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Login
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-slate-400 font-black tracking-widest">Or access with</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading || status === 'loading'}
                            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-4 px-6 rounded-2xl font-bold text-slate-700 shadow-sm hover:shadow-md hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading || status === 'loading' ? (
                                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Sign in with Google
                                </>
                            )}
                        </button>
                        
                        <button
                            onClick={() => router.push('/')}
                            className="w-full flex items-center justify-center gap-3 bg-slate-100/50 text-slate-600 py-3.5 px-6 rounded-2xl font-bold hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98] transition-all group text-sm border border-slate-200/60"
                        >
                            <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                            Go to Home
                        </button>

                        {loading && (
                            <div className="flex items-center justify-center gap-2 text-blue-600 font-medium animate-pulse text-sm">
                                Redirecting to secure login...
                            </div>
                        )}
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100">
                        <p className="text-center text-xs text-slate-400 font-medium leading-relaxed">
                            Sign in with your registered Google account.<br />
                            Admins must use approved organizational emails.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
