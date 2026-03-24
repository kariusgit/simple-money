'use client';

import { ChevronLeft, FileText, ShieldCheck, Scale, Lock, Zap, Award, Globe, HeartHandshake, AlertCircle, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AgreementPage() {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in space-y-10">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all border border-white/10 group">
                        <ChevronLeft size={24} className="text-text-secondary group-hover:text-white transition-colors" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight">Legal Framework</h1>
                        <p className="text-text-secondary text-xs mt-1 font-bold uppercase tracking-widest font-mono opacity-60">User Agreement & Protocol v4.0</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
                    <ShieldCheck size={16} className="text-success" />
                    <span className="text-[10px] font-black text-success uppercase tracking-widest">Enforced by RSA-4096</span>
                </div>
            </div>

            {/* Hero Section */}
            <div className="glass-prism p-10 rounded-[40px] relative overflow-hidden flex flex-col md:flex-row items-center gap-10 border-primary/20">
                <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/40 shrink-0">
                    <FileText size={48} className="text-white" />
                </div>
                <div className="space-y-4 text-center md:text-left">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Terms of Neural Participation</h2>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-widest leading-relaxed opacity-80 max-w-xl">
                        Welcome to the <span className="text-primary-light">Cirqle Global Node Network</span>. By accessing our decentralized optimization services, you agree to adhere to the following operational protocols.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-success" />
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Age 18+ Verified</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global Compliance</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Agreement Sections */}
            <div className="grid grid-cols-1 gap-8">
                
                {/* 1. Operational Requirements */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Zap size={20} className="text-primary-light" />
                        </div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">1. Data Optimization Protocols</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-card p-6 border-white/5 space-y-3">
                            <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-50">1.1 Thresholds</h4>
                            <p className="text-sm font-bold text-white leading-relaxed">Account balance must maintain a minimum of <strong>100 USDT</strong> to initiate neural optimization sequences.</p>
                        </div>
                        <div className="glass-card p-6 border-white/5 space-y-3">
                            <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-50">1.2 Settlements</h4>
                            <p className="text-sm font-bold text-white leading-relaxed">Balance withdrawals are permitted at any time following the finalization of an active task batch.</p>
                        </div>
                        <div className="glass-card p-6 border-white/5 space-y-3">
                            <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-50">1.3 Reset Logic</h4>
                            <p className="text-sm font-bold text-white leading-relaxed">Sequential tasks require a fresh <strong>100 USDT</strong> liquidity anchor for protocol synchronization.</p>
                        </div>
                    </div>
                </section>

                {/* 2. VIP Hierarchy */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                            <Award size={20} className="text-accent-light" />
                        </div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">2. Node Tier Governance</h3>
                    </div>
                    
                    <div className="glass-card-strong p-8 border-white/5 relative overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black text-primary-light uppercase tracking-[0.3em]">Promotion Criteria</h4>
                                <ul className="space-y-3">
                                    {[
                                        { l: 'Level 2', d: '500+ USDT' },
                                        { l: 'Level 3', d: '2,000+ USDT' },
                                        { l: 'Level 4', d: '5,000+ USDT' },
                                    ].map((tier, i) => (
                                        <li key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                            <span className="text-xs font-black text-white">{tier.l} Upgrade</span>
                                            <span className="text-[10px] font-bold text-text-secondary font-mono">{tier.d}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black text-accent-light uppercase tracking-[0.3em]">Compliance Rules</h4>
                                <div className="space-y-4 text-xs font-bold text-text-secondary uppercase tracking-widest leading-relaxed opacity-60">
                                    <p>Node tiers control task priority and rebate percentage. Abandoning active sequences will result in immediate withdrawal restriction until the set is finalized.</p>
                                    <p><strong>Credit Score:</strong> 100% integrity score required for all T-0 settlements.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Security & Bundles (Alert Style) */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-card p-10 border-danger/20 bg-danger/[0.02] space-y-6">
                        <div className="flex items-center gap-3">
                            <Lock size={20} className="text-danger" />
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Account Risk Control</h3>
                        </div>
                        <div className="space-y-4 text-xs font-bold text-text-secondary leading-relaxed uppercase tracking-wider">
                            <p>Entering incorrect security protocols 3 times triggers an <strong>M-Level Freeze</strong>. System unfreezing requires official compliance verification fees.</p>
                            <p>Manual intervention in automated data processing is strictly prohibited to prevent liquidity leakage.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20 flex items-center gap-3 text-danger">
                            <AlertCircle size={18} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Zero manual override policy</span>
                        </div>
                    </div>

                    <div className="glass-card p-10 border-success/20 bg-success/[0.02] space-y-6">
                        <div className="flex items-center gap-3">
                            <Zap size={20} className="text-success" />
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Optimization Bundles</h3>
                        </div>
                        <div className="space-y-4 text-xs font-bold text-text-secondary leading-relaxed uppercase tracking-wider">
                            <p>Bundles contain 1-3 synchronized assets. These sequences generate <strong>High-ROI</strong> negative balances (10%-200%) which must be settled within 24 hours.</p>
                            <p>Bundles are non-cancellable and essential for reputation growth in the optimization network.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-success/10 border border-success/20 flex items-center gap-3 text-success">
                            <TrendingUp size={18} className="animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Priority Rebate: 2.7%+</span>
                        </div>
                    </div>
                </section>

                {/* 4. Infrastructure & Tax (Prism Style) */}
                <section className="glass-prism p-12 rounded-[40px] border-white/10 space-y-8">
                    <div className="flex items-center gap-4">
                        <Globe size={24} className="text-primary-light" />
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Financial Governance & Taxation</h3>
                    </div>
                    
                    <div className="space-y-6 text-xs font-bold text-text-secondary leading-relaxed uppercase tracking-[0.1em] opacity-80">
                        <p>Pursuant to global digital financial regulations, accounts exceeding <strong>$10,000 USD</strong> in cumulative volume are subject to tax verification. Submitting tax settlements through the company portal ensures unified processing and immediate reimbursement to the user node.</p>
                        
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/5 border-l-primary border-l-4">
                            <p><strong>Cryptocurrency Disclosure:</strong> Tax protocols for digital assets (USDT) differ from fiat currency. Failure to comply with platform taxation requests will result in the categorization of funds as <span className="text-danger">Restricted Assets</span>, rendering them ineligible for circulation in the global market.</p>
                        </div>
                        
                        <div className="flex items-center gap-6 pt-4">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Audit Standard</span>
                                <span className="text-xs font-black text-white uppercase">ISO-27001</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Network Layer</span>
                                <span className="text-xs font-black text-white uppercase">Layer-2 Mesh</span>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            {/* Acknowledge Footer */}
            <div className="pt-10 text-center space-y-6">
                <div className="flex items-center justify-center gap-4">
                    <div className="h-[1px] w-12 bg-white/10" />
                    <HeartHandshake className="text-primary-light" />
                    <div className="h-[1px] w-12 bg-white/10" />
                </div>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] opacity-40 max-w-sm mx-auto">
                    By operating a node on this network, you agree to these legal protocols.
                </p>
                <div className="text-[9px] font-mono text-text-secondary/20 uppercase">
                    Fingerprint: 88A-99B-CC2-XX1-PROTOCOL-ACTIVE
                </div>
            </div>

        </div>
    );
}
