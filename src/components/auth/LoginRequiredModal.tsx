"use client";

import { X, Lock, LogIn, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  callbackUrl?: string;
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
  title = "Authentication Required",
  message = "Please sign in to your account to continue with this action. This helps us ensure your data and progress are securely saved.",
  callbackUrl = "/"
}: LoginRequiredModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = () => {
    router.push(`/dashboard/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        
        {/* Header with Icon */}
        <div className="p-8 pb-0 text-center">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-blue-600/10 flex items-center justify-center mb-6">
            <Lock className="text-blue-600" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            {title}
          </h3>
          <p className="mt-4 text-[15px] text-slate-500 font-medium leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-8 space-y-3">
          <button
            onClick={handleLogin}
            className="w-full group relative overflow-hidden px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
          >
            <LogIn size={20} />
            <span>Sign In to Continue</span>
            <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
          
          <button
            onClick={onClose}
            className="w-full px-6 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all transform active:scale-[0.98]"
          >
            Not Now, Keep Browsing
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
        >
          <X size={20} />
        </button>

        {/* Premium Detail */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></div>
      </div>
    </div>
  );
}
