'use client';

import { Package, Zap, ArrowRight, Sparkles, Star, Smartphone, ShieldCheck } from 'lucide-react';

export interface BundlePackage {
    id: string;
    name: string;
    description: string;
    shortageAmount: number;  // deposit required
    totalAmount: number;     // product price shown to user
    bonusAmount: number;     // profit earned on completion
    expiresIn: number;       // seconds
    taskItem?: {
        title: string;
        image_url: string;
        category: string;
    } | null;
}

interface BundledPackageModalProps {
    isOpen: boolean;
    bundle: BundlePackage | null;
    onAccept: (bundle: BundlePackage) => void;
}

export default function BundledPackageModal({ isOpen, bundle, onAccept }: BundledPackageModalProps) {
    if (!isOpen || !bundle) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-fade-in md:pl-72">
            {/* Backdrop with extreme blur and amber tint */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />

            {/* Modal Container */}
            <div
                className="relative w-full max-w-[420px] glass-card-glow overflow-hidden animate-scale-in border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.2)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Premium Background Effects */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/20 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-600/20 blur-[60px] rounded-full pointer-events-none" />

                {/* Bundle Header */}
                <div className="p-6 pb-0 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping shadow-[0_0_10px_var(--color-amber-500)]" />
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Special Acceleration</span>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center gap-2">
                        <Sparkles size={12} className="text-amber-500" />
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">VIP Bundle</span>
                    </div>
                </div>

                {/* Bundle Information */}
                <div className="p-8 pb-4 flex flex-col items-center relative z-10 text-center">
                    {bundle.taskItem?.image_url ? (
                        <div className="w-48 h-48 rounded-[40px] bg-white/5 border border-amber-500/20 p-4 shadow-2xl relative group mb-6">
                            <div className="absolute inset-x-0 -bottom-4 h-8 bg-amber-500/40 blur-2xl rounded-full" />
                            <img
                                src={bundle.taskItem.image_url}
                                alt={bundle.taskItem.title}
                                className="w-full h-full object-cover rounded-[24px] relative z-10 shadow-lg border border-white/10"
                            />
                            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-amber-400 to-orange-600 p-2.5 rounded-xl shadow-[0_0_20px_var(--color-amber-500)] z-20 animate-bounce">
                                <Star size={20} className="text-white fill-white" />
                            </div>
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                            <Package size={40} className="text-amber-500" />
                        </div>
                    )}

                    <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-tight px-4">
                        {bundle.taskItem?.title || bundle.name}
                    </h2>
                    <p className="text-text-secondary text-xs mt-3 leading-relaxed max-w-[280px] uppercase font-bold tracking-wider opacity-80">
                        {bundle.description}
                    </p>
                </div>

                {/* Financial Table */}
                <div className="px-8 mb-8 relative z-10">
                    <div className="glass-card p-5 border border-amber-500/10 bg-amber-500/[0.03] space-y-4">
                        <div className="flex justify-between items-end border-b border-white/5 pb-3">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Asset Combination</span>
                                <span className="text-xl font-black text-white">${bundle.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black text-success uppercase tracking-widest mb-1">Bonus Profit</span>
                                <span className="text-xl font-black text-success shadow-success/20">+${bundle.bonusAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap size={14} className="text-amber-500 fill-amber-500" />
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Deposit Required</span>
                            </div>
                            <span className="text-lg font-black text-white bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/30">
                                ${bundle.shortageAmount.toFixed(2)} USDT
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mandatory Checkbox/Info */}
                <div className="px-8 space-y-3 mb-8 relative z-10">
                    <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <ShieldCheck size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest leading-relaxed">
                            MANDATORY REQUIREMENT: These matched assets are reserved. You must accept this bundle to unlock your remaining daily tasks.
                        </p>
                    </div>
                </div>

                {/* Action Button */}
                <div className="px-8 pb-10 relative z-10">
                    <button
                        onClick={() => onAccept(bundle)}
                        className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                    >
                        Accept & Continue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-black text-amber-500/60 uppercase tracking-[0.2em]">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Secured Bundle Active
                    </div>
                </div>

            </div>
        </div>
    );
}

export function generateRandomBundle(taskNumber: number, currentWalletBalance: number, baseTaskPrice: number): BundlePackage {
    const bundles = [
        { name: 'Turbo Growth Pack', description: 'A special accelerator bundle has been triggered! Top up your account to unlock this high-value combination order.' },
        { name: 'VIP Boost Bundle', description: 'You\'ve been selected for a VIP acceleration bundle! This task matched a dual-item optimization slot.' },
        { name: 'Flash Earnings Pack', description: 'A flash bundle opportunity has appeared! This asset is grouped into a multi-item optimization request.' },
        { name: 'Power Multiplier Pack', description: 'This task triggered a premium optimization slot. Add funds to activate your multiplier and complete the order.' },
    ];

    const chosen = bundles[taskNumber % bundles.length];
    const minShortagePercentage = 0.10;
    const maxShortagePercentage = 2.00;
    const randomShortagePercentage = minShortagePercentage + Math.random() * (maxShortagePercentage - minShortagePercentage);
    const shortageAmount = Math.round((currentWalletBalance * randomShortagePercentage) * 100) / 100;
    const totalAmount = Math.round((currentWalletBalance + shortageAmount) * 100) / 100;
    const bonusMultiplier = 0.027 + Math.random() * 0.073;
    const bonusAmount = Math.round((totalAmount * bonusMultiplier) * 100) / 100;

    return {
        id: `bundle-${Date.now()}`,
        name: chosen.name,
        description: chosen.description,
        shortageAmount,
        totalAmount,
        bonusAmount,
        expiresIn: 3600,
        taskItem: null,
    };
}
