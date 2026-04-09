'use client';

import { useEffect, useState } from 'react';
import { 
  Award, 
  Download, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  Calendar, 
  User, 
  ChevronRight,
  Loader2,
  FileText,
  X
} from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  type: string;
  issueDate: string;
  credentialId: string;
  status: string;
  recipientName: string;
}

export default function CertificationsView() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/user/certificates')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCertificates(data.certificates);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredCerts = certificates.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.credentialId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-12 animate-pulse">
        <div className="h-24 bg-white/50 backdrop-blur-md rounded-[2rem] border border-slate-200/40"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-white/50 backdrop-blur-md rounded-[3rem] border border-slate-200/40"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-14 animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2">
          <div className="space-y-1">
              <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
                      <Award size={22} className="stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Academic Credentials</span>
              </div>
              <h1 className="text-5xl font-black text-slate-950 tracking-[-0.05em] leading-tight">
                 Achievement <span className="text-slate-400">Vault</span>
              </h1>
              <p className="text-slate-500 font-bold text-sm tracking-tight flex items-center gap-2">
                 Verifiable professional markers of your deep-tech trajectory
                 <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px]">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                    Blockchain Encrypted
                 </span>
              </p>
          </div>
          <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search credentials..."
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-950 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
      </div>

      {/* Main Grid */}
      {filteredCerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCerts.map((cert) => (
            <div 
              key={cert.id} 
              className="group relative bg-white rounded-[3rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all duration-700 overflow-hidden flex flex-col"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/10 transition-colors duration-700"></div>
              
              <div className="p-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-10">
                      <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform duration-500">
                          <Award size={32} className="stroke-[1.5]" />
                      </div>
                      <div className="text-right">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
                              <ShieldCheck size={12} />
                              {cert.status}
                          </span>
                      </div>
                  </div>

                  <div className="flex-1 space-y-3 mb-12">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{cert.type}</span>
                      <h3 className="text-2xl font-black text-slate-950 tracking-tighter leading-tight group-hover:text-blue-700 transition-colors">
                          {cert.title}
                      </h3>
                      <p className="text-sm font-bold text-slate-500 italic flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          {cert.recipientName}
                      </p>
                  </div>

                  <div className="pt-8 border-t border-slate-50 space-y-6">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                          <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              {mounted ? new Date(cert.issueDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '...'}
                          </div>
                          <span className="font-mono text-[9px] bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{cert.credentialId}</span>
                      </div>
                      <button 
                         onClick={() => setSelectedCert(cert)}
                         className="w-full py-4 bg-slate-50 group-hover:bg-slate-950 group-hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest border border-slate-100 group-hover:border-slate-950 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-3"
                      >
                          View Credential <ExternalLink size={14} />
                      </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3.5rem] border-2 border-dashed border-slate-200 p-24 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                <FileText size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-950 tracking-tighter mb-4">No Credentials Harvested</h3>
            <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed opacity-80">
               Completion nodes are verified after full curriculum finalization. Your dashboard will populate once evaluation protocols are complete.
            </p>
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-10 overflow-y-auto">
          <div 
             className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-500" 
             onClick={() => setSelectedCert(null)}
          ></div>
          
          <div className="relative w-full max-w-5xl bg-white rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
             {/* Certificate Design */}
             <div className="p-12 md:p-20 relative bg-[#fafafa]">
                {/* Decorative border */}
                <div className="absolute inset-10 border-[12px] border-double border-blue-600/10 pointer-events-none"></div>
                <div className="absolute inset-14 border border-blue-600/20 pointer-events-none"></div>

                <div className="relative z-10 text-center space-y-12">
                   <div className="flex flex-col items-center gap-6">
                      <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-2xl">
                          <Award size={48} className="stroke-[1.5]" />
                      </div>
                      <div className="space-y-1">
                          <h2 className="text-2xl font-black text-blue-600 uppercase tracking-[0.4em]">NanoSchool</h2>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Advanced Deep-Tech Research Academy</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h1 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter uppercase">Certificate of Completion</h1>
                      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent mx-auto"></div>
                   </div>

                   <div className="space-y-6">
                      <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">This credential is presented to</p>
                      <h2 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter capitalize">{selectedCert.recipientName}</h2>
                      <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                         for the successful completion of the <span className="text-blue-600 font-black">{selectedCert.title}</span> program, demonstrating technical proficiencies in accordance with established industry protocols.
                      </p>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-3 gap-10 pt-10 items-end">
                      <div className="hidden md:block text-left space-y-4">
                          <div className="w-40 h-1 bg-slate-950"></div>
                          <div className="space-y-1">
                              <p className="font-black text-slate-950 text-xs uppercase tracking-widest">Academic Board</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">NanoSchool Intelligence Node</p>
                          </div>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 rounded-full border-4 border-double border-blue-600/30 flex items-center justify-center opacity-40 grayscale group hover:grayscale-0 transition-all">
                              <ShieldCheck size={40} className="text-blue-600" />
                          </div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digital Audit Hash Verified</p>
                      </div>

                      <div className="text-right space-y-4">
                          <div className="space-y-1">
                             <p className="font-black text-slate-950 text-xs">Issued: {mounted ? new Date(selectedCert.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '...'}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Credential: {selectedCert.credentialId}</p>
                          </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Action bar */}
             <div className="bg-slate-950 p-6 flex items-center justify-between px-12 relative z-20">
                <button 
                   onClick={() => setSelectedCert(null)}
                   className="text-white/60 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                   <X size={16} /> Close Preview
                </button>
                <div className="flex items-center gap-4">
                    <button className="px-8 py-3 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all active:scale-95 shadow-xl shadow-black/20 flex items-center gap-2">
                        <Download size={14} /> Download PDF
                    </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
