'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, Award, ShieldCheck, CheckCircle2, Globe, Building, Download, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function CertificatePage() {
    const { profile } = useAuth();
    const { t } = useLanguage();

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="space-y-8 pb-24">
            {/* Header */}
            <div className="flex items-center gap-4 animate-slide-up">
                <Link href="/home" className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-primary/10 transition-all text-text-primary hover:text-primary">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-text-primary tracking-tight uppercase">Platform Certificate</h1>
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-60">Authentication & compliance</p>
                </div>
            </div>

            {/* Certificate Area */}
            <div className="relative group perspective-1000 animate-slide-up [animation-delay:0.1s]">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-success/20 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                
                <div className="relative glass-card-strong p-1 md:p-2 rounded-[38px] overflow-hidden">
                    <div className="bg-white dark:bg-black p-8 md:p-16 rounded-[34px] border-8 border-double border-primary/20 relative overflow-hidden">
                        {/* Watermark/Background elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                            <Award size={600} />
                        </div>
                        
                        {/* Certificate Content */}
                        <div className="relative z-10 flex flex-col items-center text-center space-y-10">
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-primary/20">
                                        <Award size={48} />
                                    </div>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-primary tracking-tight">Certificate of Achievement</h2>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="h-[1px] w-12 bg-primary/40" />
                                    <p className="text-xs font-black text-primary uppercase tracking-[0.4em]">Optimization Professional</p>
                                    <div className="h-[1px] w-12 bg-primary/40" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <p className="text-sm text-text-secondary italic font-serif">This document officially recognizes that</p>
                                <h3 className="text-2xl md:text-4xl font-black text-text-primary uppercase tracking-wider underline decoration-primary/30 underline-offset-8">
                                    {profile?.username || 'Valued Member'}
                                </h3>
                                <p className="max-w-xl text-xs md:text-sm text-text-secondary leading-relaxed font-medium mx-auto px-4">
                                    Has successfully met all safety protocols and operational standards required for neural network data optimization. 
                                    By adhering to the highest levels of professional integrity and technical accuracy, this member is certified 
                                    to operate within Level {profile?.level_id || 1} optimization parameters.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-8">
                                <div className="flex flex-col items-center space-y-2 border-t border-black/5 dark:border-white/10 pt-4">
                                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest leading-none">Issue Date</span>
                                    <span className="text-sm font-bold text-text-primary">{today}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center -mt-8">
                                    <div className="w-20 h-20 rounded-full border-4 border-double border-success/40 p-1">
                                        <div className="w-full h-full rounded-full bg-success/10 flex items-center justify-center text-success">
                                            <ShieldCheck size={32} />
                                        </div>
                                    </div>
                                    <span className="text-[8px] font-black text-success uppercase tracking-widest mt-2">Verified Status</span>
                                </div>
                                <div className="flex flex-col items-center space-y-2 border-t border-black/5 dark:border-white/10 pt-4">
                                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest leading-none">Auth ID</span>
                                    <span className="text-[10px] font-bold text-text-primary font-mono">{profile?.id?.slice(0, 16).toUpperCase() || 'PN-882-OPTIM'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-4 px-6 py-2 bg-black/5 dark:bg-white/5 rounded-full">
                                <Building size={14} className="text-text-secondary" />
                                <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">Global Neural Data Federation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 animate-slide-up [animation-delay:0.3s]">
                <button className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/30 hover:bg-primary-hover transition-all">
                    <Download size={18} />
                    Download PDF
                </button>
                <button className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-text-primary font-black uppercase tracking-widest text-xs hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                    <Share2 size={18} />
                    Share Proof
                </button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up [animation-delay:0.4s]">
                <div className="glass-card p-6 flex gap-4">
                    <CheckCircle2 className="text-success shrink-0" size={24} />
                    <div>
                        <h4 className="text-xs font-black text-text-primary uppercase tracking-wider mb-1">Authenticity Guaranteed</h4>
                        <p className="text-[10px] text-text-secondary font-medium leading-relaxed">This certificate is digitally signed and logged on the platform's distributed ledger for permanent verification.</p>
                    </div>
                </div>
                <div className="glass-card p-6 flex gap-4">
                    <Globe className="text-accent shrink-0" size={24} />
                    <div>
                        <h4 className="text-xs font-black text-text-primary uppercase tracking-wider mb-1">Global Recognition</h4>
                        <p className="text-[10px] text-text-secondary font-medium leading-relaxed">Valid for optimization operations across all supported regional servers and neural network clusters.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
