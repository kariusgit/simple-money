'use client';

import { Home, Zap, FileText, Headset } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const tabs = [
    { icon: Home, label: 'Home', href: '/home' },
    { icon: Zap, label: 'Start', href: '/start', isCenter: true },
    { icon: FileText, label: 'Record', href: '/record' },
    { icon: Headset, label: 'Support', href: '#', isSupport: true },
];

export default function BottomNav() {
    const pathname = usePathname();
    const { t } = useLanguage();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface dark:bg-surface/80 dark:backdrop-blur-xl border-t border-black/5 dark:border-white/5 md:hidden pb-safe transition-all duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-none">
            <div className="grid grid-cols-4 w-full h-16 md:h-20 items-end pb-2">
                {tabs.map((item) => {
                    const { icon: Icon, label, href, isCenter } = item;
                    const isActive = pathname === href;
                    const translatedLabel = t(label.toLowerCase());

                    return (
                        <div key={href} className="flex flex-col items-center justify-center relative h-full">
                            {isCenter ? (
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                    <Link
                                        href={href}
                                        className="flex flex-col items-center group"
                                    >
                                        <div
                                            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isActive
                                                    ? 'bg-gradient-to-br from-primary to-accent shadow-primary/40 scale-110'
                                                    : 'bg-gradient-to-br from-primary/80 to-accent/80 shadow-primary/20 hover:scale-105'
                                                }`}
                                        >
                                            <Icon size={24} className="text-white" />
                                        </div>
                                        <span
                                            className={`text-[9px] mt-1 font-black transition-colors uppercase tracking-widest ${isActive ? 'text-primary' : 'text-text-secondary'}`}
                                        >
                                            {translatedLabel}
                                        </span>
                                    </Link>
                                </div>
                            ) : item.isSupport ? (
                                    <button
                                        onClick={() => (window as any).Tawk_API?.maximize()}
                                        className="flex flex-col items-center group transition-all duration-300 w-full"
                                    >
                                        <Icon
                                            size={20}
                                            className="text-text-secondary group-hover:scale-110"
                                        />
                                        <span
                                            className="text-[9px] mt-1 font-black transition-colors uppercase tracking-widest text-text-secondary"
                                        >
                                            {translatedLabel}
                                        </span>
                                    </button>
                                ) : (
                                    <Link
                                        href={href}
                                        className="flex flex-col items-center group transition-all duration-300 w-full"
                                    >
                                        <Icon
                                            size={20}
                                            className={`transition-all group-hover:scale-110 ${isActive ? 'text-primary' : 'text-text-secondary'}`}
                                        />
                                        <span
                                            className={`text-[9px] mt-1 font-black transition-colors uppercase tracking-widest ${isActive ? 'text-primary' : 'text-text-secondary'}`}
                                        >
                                            {translatedLabel}
                                        </span>
                                        {isActive && (
                                            <div className="w-1 h-1 rounded-full bg-primary mt-1 shadow-[0_0_8px_var(--color-primary)]" />
                                        )}
                                    </Link>
                                )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}
