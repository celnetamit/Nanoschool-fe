'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  FileText, 
  Award, 
  Palette, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Mail,
  Globe,
  CreditCard,
  Hash,
  Calendar,
  UserCheck,
  ShieldCheck,
  Image as ImageIcon,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { SystemConfig } from '@/lib/settings';

export default function SystemSettingsView() {
  const [activeTab, setActiveTab] = useState<'invoice' | 'certificate' | 'branding' | 'fiscal'>('invoice');
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/config');
      const data = await response.json();
      if (data.success) {
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      setMessage({ type: 'error', text: 'Failed to load configuration' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Configuration deployed successfully!' });
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update configuration' });
      }
    } catch (error) {
      console.error('Error saving config:', error);
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (section: keyof SystemConfig, field: string, value: string) => {
    if (!config) return;
    
    let processedValue: any = value;
    // Handle numeric conversion for specific fields
    if (section === 'fiscal' && field === 'revenueTarget') {
        processedValue = parseFloat(value) || 0;
    }

    setConfig({
      ...config,
      [section]: {
        ...(config[section] as any),
        [field]: processedValue
      }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing System Core...</p>
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
          <div className="space-y-2">
              <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-xl shadow-slate-950/20">
                      <Settings size={22} className={saving ? 'animate-spin' : ''} />
                  </div>
                  <span className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em]">System Admin</span>
              </div>
              <h1 className="text-5xl font-black text-slate-950 tracking-[-0.05em] leading-tight">
                 Command <span className="text-slate-400">Center</span>
              </h1>
              <p className="text-slate-500 font-bold text-sm tracking-tight flex items-center gap-2">
                 Configure global protocols for Invoices, Certificates, and Branding
                 {saving && (
                     <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px]">
                        <Loader2 size={10} className="animate-spin" />
                        Syncing...
                     </span>
                 )}
              </p>
          </div>
          
          <div className="flex items-center gap-4">
              {message && (
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border animate-in slide-in-from-right-4 ${
                      message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                      {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                      {message.text}
                  </div>
              )}
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-4 bg-slate-950 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-2xl flex items-center gap-3 disabled:opacity-50"
              >
                 <Save size={18} /> {saving ? 'Deploying...' : 'Deploy Changes'}
              </button>
          </div>
      </div>

      {/* Tabs Control */}
      <div className="flex gap-2 p-1.5 bg-slate-100/50 backdrop-blur-sm border border-slate-200 rounded-[2rem] w-fit mx-auto md:mx-0">
          <button 
            onClick={() => setActiveTab('invoice')}
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'invoice' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
              <FileText size={14} className="inline mr-2" /> Invoice Config
          </button>
          <button 
            onClick={() => setActiveTab('certificate')}
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'certificate' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
              <Award size={14} className="inline mr-2" /> Certificates
          </button>
          <button 
            onClick={() => setActiveTab('branding')}
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'branding' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
              <Palette size={14} className="inline mr-2" /> Global Brand
          </button>
          <button 
            onClick={() => setActiveTab('fiscal')}
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'fiscal' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
              <TrendingUp size={14} className="inline mr-2" /> Fiscal & Goals
          </button>
      </div>

      {/* Main Configuration Form */}
      <div className="grid grid-cols-1 gap-10">
          {activeTab === 'invoice' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {/* Company Info */}
                      <div className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-xl space-y-8">
                          <h3 className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-3">
                              <Building2 className="text-blue-600" /> Company Identity
                          </h3>
                          <div className="space-y-6">
                              <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Legal Company Name</label>
                                  <input 
                                    type="text" 
                                    value={config.invoice.companyName || ''}
                                    onChange={(e) => updateConfig('invoice', 'companyName', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                                  />
                              </div>
                              <div className="grid grid-cols-1 gap-4">
                                  <div>
                                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Registered Address (Line 1)</label>
                                      <input 
                                        type="text" 
                                        value={config.invoice.addressLine1 || ''}
                                        onChange={(e) => updateConfig('invoice', 'addressLine1', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Registered Address (Line 2)</label>
                                      <input 
                                        type="text" 
                                        value={config.invoice.addressLine2 || ''}
                                        onChange={(e) => updateConfig('invoice', 'addressLine2', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Registered Address (Line 3)</label>
                                      <input 
                                        type="text" 
                                        value={config.invoice.addressLine3 || ''}
                                        onChange={(e) => updateConfig('invoice', 'addressLine3', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                                      />
                                  </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-2">
                                          <Hash size={12} /> GSTIN
                                      </label>
                                      <input 
                                        type="text" 
                                        value={config.invoice.gstin || ''}
                                        onChange={(e) => updateConfig('invoice', 'gstin', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-black"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-2">
                                          <Hash size={12} /> CIN NUMBER
                                      </label>
                                      <input 
                                        type="text" 
                                        value={config.invoice.cinNo || ''}
                                        onChange={(e) => updateConfig('invoice', 'cinNo', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-black"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-2">
                                          <Mail size={12} /> Billing Email
                                      </label>
                                      <input 
                                        type="email" 
                                        value={config.invoice.supportEmail || ''}
                                        onChange={(e) => updateConfig('invoice', 'supportEmail', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold"
                                      />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'certificate' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="max-w-4xl mx-auto bg-white p-12 rounded-[3.5rem] border border-slate-200/60 shadow-2xl relative overflow-hidden">
                      <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                      
                      <div className="flex items-center gap-6 mb-12">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-slate-950 flex items-center justify-center text-white shadow-xl">
                              <Award size={32} />
                          </div>
                          <div>
                              <h3 className="text-3xl font-black text-slate-950 tracking-tight">Certification Assets</h3>
                              <p className="text-slate-400 font-bold text-sm tracking-tight">Configure the naming convention and signing authority for credentials.</p>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Credential Prefix</label>
                                      <input 
                                        type="text" 
                                        value={config.certificate.prefix || ''}
                                        onChange={(e) => updateConfig('certificate', 'prefix', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-black text-slate-950 uppercase"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Issue Year</label>
                                      <input 
                                        type="text" 
                                        value={config.certificate.year || ''}
                                        onChange={(e) => updateConfig('certificate', 'year', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-black text-sans"
                                      />
                                  </div>
                              </div>
                              
                              <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-2">
                                      <UserCheck size={12} /> Signatory Authority
                                  </label>
                                  <input 
                                    type="text" 
                                    value={config.certificate.authorityName || ''}
                                    onChange={(e) => updateConfig('certificate', 'authorityName', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-black text-slate-950"
                                  />
                              </div>
                              
                              <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Authority Designation</label>
                                  <input 
                                    type="text" 
                                    value={config.certificate.authorityTitle || ''}
                                    onChange={(e) => updateConfig('certificate', 'authorityTitle', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold"
                                  />
                              </div>
                          </div>

                          <div className="space-y-6">
                              <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 flex flex-col gap-4">
                                  <div className="flex items-center gap-4">
                                      <ShieldCheck className="text-blue-600" size={32} />
                                      <div>
                                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">ID Format Preview</p>
                                          <p className="text-xl font-black text-slate-950 tabular-nums">{config.certificate.prefix}-{config.certificate.year}-00001</p>
                                      </div>
                                  </div>
                              </div>

                              <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-2">
                                      <ImageIcon size={12} /> Certificate Template (PDF/IMG URL)
                                  </label>
                                  <input 
                                    type="text" 
                                    value={config.certificate.templateUrl || ''}
                                    onChange={(e) => updateConfig('certificate', 'templateUrl', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-mono text-xs"
                                  />
                              </div>

                               <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-2">
                                      <ImageIcon size={12} /> Signatory Signature (URL)
                                  </label>
                                  <input 
                                    type="text" 
                                    value={config.certificate.signatureUrl || ''}
                                    onChange={(e) => updateConfig('certificate', 'signatureUrl', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-mono text-xs"
                                  />
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'branding' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] border border-slate-200/60 shadow-2xl space-y-8">
                       <h3 className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-3">
                          <Palette className="text-emerald-600" /> Site Branding
                      </h3>
                      
                      <div className="space-y-6">
                           <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Application Logo (URL)</label>
                              <div className="flex gap-4">
                                  <input 
                                    type="text" 
                                    value={config.branding.logoUrl || ''}
                                    onChange={(e) => updateConfig('branding', 'logoUrl', e.target.value)}
                                    className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-mono text-xs"
                                  />
                                  <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center p-2 border border-slate-200 shadow-inner group overflow-hidden">
                                      <img src={config.branding.logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                                  </div>
                              </div>
                          </div>

                          <div className="grid grid-cols-2 gap-8 pt-4">
                               <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Primary Brand Color</label>
                                  <div className="flex items-center gap-3">
                                      <input 
                                        type="color" 
                                        value={config.branding.primaryColor || ''}
                                        onChange={(e) => updateConfig('branding', 'primaryColor', e.target.value)}
                                        className="w-12 h-12 rounded-xl border-0 cursor-pointer p-0 overflow-hidden"
                                      />
                                      <input 
                                        type="text" 
                                        value={config.branding.primaryColor || ''}
                                        onChange={(e) => updateConfig('branding', 'primaryColor', e.target.value)}
                                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold"
                                      />
                                  </div>
                               </div>
                               <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Secondary Brand Color</label>
                                  <div className="flex items-center gap-3">
                                      <input 
                                        type="color" 
                                        value={config.branding.secondaryColor || ''}
                                        onChange={(e) => updateConfig('branding', 'secondaryColor', e.target.value)}
                                        className="w-12 h-12 rounded-xl border-0 cursor-pointer p-0 overflow-hidden"
                                      />
                                      <input 
                                        type="text" 
                                        value={config.branding.secondaryColor || ''}
                                        onChange={(e) => updateConfig('branding', 'secondaryColor', e.target.value)}
                                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold"
                                      />
                                  </div>
                               </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'fiscal' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] border border-slate-200/60 shadow-2xl space-y-10 relative overflow-hidden">
                      <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                      
                      <div className="flex items-center gap-6 mb-4">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-slate-950 flex items-center justify-center text-white shadow-xl">
                              <TrendingUp size={32} />
                          </div>
                          <div>
                              <h3 className="text-3xl font-black text-slate-950 tracking-tight">Fiscal Targets</h3>
                              <p className="text-slate-400 font-bold text-sm tracking-tight">Configure the economic goals for your Intelligence Node.</p>
                          </div>
                      </div>

                      <div className="space-y-8 relative z-10">
                          <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200/60 space-y-6">
                               <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                                      <CreditCard size={12} /> Revenue Target (Base Currency)
                                  </label>
                                  <div className="relative">
                                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">₹</span>
                                      <input 
                                        type="number" 
                                        value={config.fiscal.revenueTarget || 0}
                                        onChange={(e) => updateConfig('fiscal', 'revenueTarget', e.target.value)}
                                        className="w-full pl-12 pr-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-black text-2xl text-slate-950"
                                        placeholder="5000000"
                                      />
                                  </div>
                               </div>

                               <div className="flex items-center gap-4 pt-4 border-t border-slate-200/60">
                                   <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                       <Hash size={20} />
                                   </div>
                                   <div>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Reporting Currency</p>
                                       <p className="text-sm font-black text-slate-950">{config.fiscal.currency || 'INR'}</p>
                                   </div>
                               </div>
                          </div>

                          <div className="p-6 rounded-2xl bg-slate-950 text-white flex items-center justify-between shadow-xl">
                               <div className="space-y-1">
                                   <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Target Preview</p>
                                   <p className="text-2xl font-black tracking-tight">₹{(config.fiscal.revenueTarget / 1000000).toFixed(1)}M Goal</p>
                               </div>
                               <TrendingUp className="text-blue-500 opacity-50" size={32} />
                          </div>
                      </div>
                  </div>
              </div>
          )}
      </div>

      {/* Safety Notice */}
      <div className="flex items-center gap-4 p-8 bg-amber-50 border border-amber-100 rounded-[2.5rem] max-w-4xl mx-auto italic italic-none">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <AlertCircle size={24} />
          </div>
          <div>
              <h4 className="text-sm font-black text-amber-950 uppercase tracking-widest">Protocol Warning</h4>
              <p className="text-[11px] font-bold text-amber-700/80 leading-relaxed mt-1">
                  Deploying configuration changes will instantly update all active invoices, certificates, and branding globally. 
                  This action is logged and cannot be undone via system rollback. Ensure all legal data (GSTIN/Address) is accurate.
              </p>
          </div>
      </div>
    </div>
  );
}
