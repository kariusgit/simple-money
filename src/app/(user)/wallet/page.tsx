'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { 
    ArrowDownLeft, 
    ArrowUpRight, 
    Wallet as WalletIcon, 
    ShieldCheck, 
    History,
    ChevronRight,
    TrendingUp,
    CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function WalletPage() {
    const { profile } = useAuth();
    const { t } = useLanguage();
    const { format } = useCurrency();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header section with Balance Overview */}
            <div className="relative group perspective-1000 animate-slide-up">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-[32px] blur-xl opacity-50"></div>
                <div className="relative glass-card-strong p-8 md:p-12 min-h-[220px] flex flex-col justify-center overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary-light">
                                    <WalletIcon size={24} />
                                </div>
                                <h1 className="text-xl md:text-3xl font-black text-text-primary dark:text-white uppercase tracking-tight">{t('wallet_overview')}</h1>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] opacity-80">
                                    {t('total_assets')}
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter drop-shadow-lg">
                                        {format(profile?.wallet_balance || 0)}
                                    </h2>
                                    <span className="text-sm font-black text-primary-light uppercase tracking-widest animate-pulse">USDT</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="grid grid-cols-2 gap-3 w-full md:w-auto text-center">
                                <div className="glass-card p-4 flex flex-col items-center gap-1 min-w-[120px]">
                                    <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest line-clamp-1">{t('today_profit')}</p>
                                    <p className="text-xl font-black text-accent">{format(profile?.profit || 0)}</p>
                                </div>
                                <div className="glass-card p-4 flex flex-col items-center gap-1 min-w-[120px]">
                                    <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest line-clamp-1">{t('referral_bonus')}</p>
                                    <p className="text-xl font-black text-success">{format(profile?.referral_earned || 0)}</p>
                                </div>
                            </div>
                            <div className="glass-card px-6 py-4 flex flex-col items-center gap-1 min-w-[100px] w-full md:w-auto text-center">
                                <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest line-clamp-1">{t('completed')}</p>
                                <p className="text-xl font-black text-primary-light">{profile?.completed_count || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Hub: TWO MAIN CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Deposit Card */}
                <Link href="/deposit" className="group animate-diagonal-tl">
                    <div className="glass-card-glow p-8 md:p-10 relative overflow-hidden transition-all duration-500 hover:scale-[1.02] border border-white/5 h-full flex flex-col justify-between cursor-pointer">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                            <ArrowDownLeft size={100} className="text-primary-light" />
                        </div>
                        
                        <div className="space-y-6 relative z-10 flex flex-col items-center text-center w-full">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-text-primary dark:text-white uppercase tracking-tight">Add Funds</h3>
                                <p className="text-text-secondary text-sm font-medium leading-relaxed max-w-[280px]">
                                    {t('deposit_description')}
                                </p>
                            </div>
                            <div className="w-16 h-16 rounded-[24px] bg-primary/20 border border-primary/20 flex items-center justify-center text-primary-light group-hover:scale-110 transition-transform shadow-2xl shadow-primary/20">
                                <ArrowDownLeft size={32} />
                            </div>
                        </div>

                        <div className="mt-12 flex items-center justify-between relative z-10">
                            <span className="text-[10px] font-black text-primary-light uppercase tracking-[0.3em] group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                ENTER PORTAL <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                        <div className="w-4 h-4 rounded-full bg-primary/20" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Withdrawal Card */}
                <Link href="/withdraw" className="group animate-diagonal-tr">
                    <div className="glass-card-glow p-8 md:p-10 relative overflow-hidden transition-all duration-500 hover:scale-[1.02] border border-white/5 h-full flex flex-col justify-between cursor-pointer">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500 group-hover:-rotate-6">
                            <ArrowUpRight size={100} className="text-accent" />
                        </div>

                        <div className="space-y-6 relative z-10 flex flex-col items-center text-center w-full">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-text-primary dark:text-white uppercase tracking-tight">Withdraw</h3>
                                <p className="text-text-secondary text-sm font-medium leading-relaxed max-w-[280px]">
                                    {t('withdraw_description')}
                                </p>
                            </div>
                            <div className="w-16 h-16 rounded-[24px] bg-accent/20 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-2xl shadow-accent/20">
                                <ArrowUpRight size={32} />
                            </div>
                        </div>

                        <div className="mt-12 flex items-center justify-between relative z-10">
                            <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em] group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                START PAYOUT <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-accent opacity-50" />
                                <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest text-accent font-black">SECURE</span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Quick Stats / History Secondary Menu */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: History, label: 'Transaction History', desc: 'Review your funding logs', href: '/record' },
                    { icon: CreditCard, label: 'Payment Methods', desc: 'Manage your payout targets', href: '/profile/wallet' },
                    { icon: ShieldCheck, label: 'Security Center', desc: 'Advanced asset protection', href: '/profile/security' }
                ].map((item, i) => (
                    <Link key={i} href={item.href} className="group">
                        <div className="glass-card p-6 flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group-hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-surface/50 flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                                <item.icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-text-primary dark:text-white text-xs uppercase tracking-wider">{item.label}</h4>
                                <p className="text-[10px] text-text-secondary tracking-tighter uppercase font-black opacity-40">{item.desc}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
