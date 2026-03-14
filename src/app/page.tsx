'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
    Zap,
    ShieldCheck,
    TrendingUp,
    Users,
    ArrowRight,
    Globe,
    Cpu,
    Lock,
    DollarSign,
    Sparkles,
    Github,
    Twitter,
    BadgeCheck,
    History,
    MessageCircle,
    Activity,
    Play,
    CheckCircle2,
    Star,
    ArrowUpRight,
    Menu,
    X
} from 'lucide-react';
import gsap from 'gsap';
import AnimatePage from '@/components/AnimatePage';

export default function LandingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            router.push('/home');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (loading || !containerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.set(['.reveal-up', '.reveal-scale'], { opacity: 0 });
            gsap.set('.reveal-up', { y: 60 });
            gsap.set('.reveal-scale', { scale: 0.8 });

            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            tl.to('.reveal-up', {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.1
            })
            .to('.reveal-scale', {
                scale: 1,
                opacity: 1,
                duration: 1,
                stagger: 0.1
            }, "-=0.8");

            // Generative Neural Mesh Logic
            const canvas = document.getElementById('neural-mesh') as HTMLCanvasElement;
            if (canvas) {
                const ctx2d = canvas.getContext('2d');
                if (ctx2d) {
                    let w = canvas.width = window.innerWidth;
                    let h = canvas.height = window.innerHeight;
                    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
                    const particleCount = 80;

                    for (let i = 0; i < particleCount; i++) {
                        particles.push({
                            x: Math.random() * w,
                            y: Math.random() * h,
                            vx: (Math.random() - 0.5) * 0.3,
                            vy: (Math.random() - 0.5) * 0.3,
                            size: Math.random() * 2 + 1
                        });
                    }

                    function animateMesh() {
                        if (!ctx2d) return;
                        ctx2d.clearRect(0, 0, w, h);
                        ctx2d.strokeStyle = 'rgba(34, 197, 94, 0.12)';
                        ctx2d.fillStyle = 'rgba(34, 197, 94, 0.4)';

                        particles.forEach((p, i) => {
                            p.x += p.vx;
                            p.y += p.vy;

                            if (p.x < 0 || p.x > w) p.vx *= -1;
                            if (p.y < 0 || p.y > h) p.vy *= -1;

                            ctx2d.beginPath();
                            ctx2d.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                            ctx2d.fill();

                            for (let j = i + 1; j < particles.length; j++) {
                                const p2 = particles[j];
                                const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                                if (dist < 120) {
                                    ctx2d.lineWidth = 1 - dist / 120;
                                    ctx2d.beginPath();
                                    ctx2d.moveTo(p.x, p.y);
                                    ctx2d.lineTo(p2.x, p2.y);
                                    ctx2d.stroke();
                                }
                            }
                        });
                        requestAnimationFrame(animateMesh);
                    }
                    animateMesh();

                    window.addEventListener('resize', () => {
                        w = canvas.width = window.innerWidth;
                        h = canvas.height = window.innerHeight;
                    });
                }
            }

            // Floating animations
            gsap.to('.blob-1', {
                x: 100,
                y: 50,
                duration: 8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            gsap.to('.blob-2', {
                x: -80,
                y: -40,
                duration: 10,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }, containerRef);

        return () => ctx.revert();
    }, [loading]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0a0a0b]">
                <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (user) return null;

    return (
        <AnimatePage>
            <div ref={containerRef} className="min-h-screen bg-[#0a0a0b] text-white selection:bg-emerald-500/30 selection:text-emerald-300 overflow-x-hidden">
                {/* Background Atmosphere with Video Effect */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    {/* Animated Gradient Orbs - Video-like effect */}
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[150px] animate-pulse-slow" />
                    <div className="blob-1 absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px]" />
                    <div className="blob-2 absolute bottom-0 left-0 w-[700px] h-[700px] bg-emerald-600/10 rounded-full blur-[180px]" />
                    
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }} />
                    
                    {/* Scanning Line Effect */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent animate-scan" 
                             style={{ animation: 'scan 4s linear infinite' }} />
                    </div>
                    
                    {/* Neural Mesh Canvas */}
                    <canvas id="neural-mesh" className="absolute inset-0 w-full h-full opacity-40 mix-blend-screen" />
                    
                    {/* Noise Texture */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
                    
                    {/* Gradient Fade */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0b]/60 to-[#0a0a0b]" />
                </div>

                {/* Navigation */}
                <nav className="fixed top-0 w-full z-[100] px-6 py-5 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <DollarSign className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-black uppercase tracking-tighter">Simple Money</span>
                        </div>

                        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
                            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
                            <a href="#vip" className="hover:text-emerald-400 transition-colors">VIP Levels</a>
                            <a href="#testimonials" className="hover:text-emerald-400 transition-colors">Success Stories</a>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/login" className="hidden md:block text-[10px] font-black uppercase tracking-widest px-6 py-3 hover:text-white transition-colors text-white/70">Login</Link>
                            <Link href="/signup" className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(34,197,94,0.3)]">
                                Start Earning
                            </Link>
                            <button 
                                className="md:hidden text-white p-2"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                    
                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden absolute top-full left-0 w-full bg-[#0a0a0b]/95 backdrop-blur-xl border-b border-white/5 py-6 px-6">
                            <div className="flex flex-col gap-4">
                                <a href="#features" className="text-sm font-bold text-white/70 hover:text-emerald-400 py-2">Features</a>
                                <a href="#how-it-works" className="text-sm font-bold text-white/70 hover:text-emerald-400 py-2">How It Works</a>
                                <a href="#vip" className="text-sm font-bold text-white/70 hover:text-emerald-400 py-2">VIP Levels</a>
                                <a href="#testimonials" className="text-sm font-bold text-white/70 hover:text-emerald-400 py-2">Success Stories</a>
                                <Link href="/login" className="text-sm font-bold text-white/70 hover:text-emerald-400 py-2">Login</Link>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero Section with Video Background & App Preview */}
                <section className="relative pt-32 md:pt-44 pb-20 md:pb-32 px-6 min-h-screen flex items-center">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            {/* Left: Content */}
                            <div className="text-center lg:text-left relative z-10">
                                <div className="reveal-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Live Platform - 10,000+ Active Earners</span>
                                </div>

                                <h1 className="reveal-up text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] mb-8">
                                    Earn Up To
                                    <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                                        $450/Day
                                    </span>
                                    With Simple Tasks
                                </h1>

                                <p className="reveal-up text-white/60 text-base md:text-lg font-medium max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                                    Complete simple digital tasks, unlock VIP tiers, and watch your daily commissions grow. 
                                    Join thousands of members already earning with our transparent rewards platform.
                                </p>

                                <div className="reveal-up flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                                    <Link 
                                        href="/signup" 
                                        className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 text-black px-10 py-5 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                                    >
                                        Start Earning Now <ArrowRight size={18} />
                                    </Link>
                                    <button 
                                        onClick={() => setVideoPlaying(true)}
                                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 rounded-2xl border border-white/10 hover:border-emerald-500/50 hover:bg-white/5 transition-all text-sm font-bold"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <Play size={16} className="text-emerald-400 ml-0.5" />
                                        </div>
                                        Watch How It Works
                                    </button>
                                </div>

                                {/* Trust Badges */}
                                <div className="reveal-up flex flex-wrap items-center justify-center lg:justify-start gap-6 text-white/40">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={18} className="text-emerald-500" />
                                        <span className="text-xs font-bold">Secure Crypto Payments</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Zap size={18} className="text-cyan-400" />
                                        <span className="text-xs font-bold">Instant Withdrawals</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BadgeCheck size={18} className="text-emerald-400" />
                                        <span className="text-xs font-bold">99.9% Payout Rate</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: App Preview / Dashboard Mockup */}
                            <div className="reveal-scale relative">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-[40px] blur-[60px]" />
                                
                                {/* Phone Frame */}
                                <div className="relative mx-auto max-w-[320px] lg:max-w-[380px]">
                                    <div className="relative bg-gradient-to-b from-white/10 to-white/5 rounded-[40px] p-2 border border-white/10 shadow-2xl">
                                        <div className="bg-[#0d0d0f] rounded-[36px] overflow-hidden">
                                            {/* Status Bar */}
                                            <div className="flex items-center justify-between px-6 py-3 bg-black/50">
                                                <span className="text-[10px] font-bold text-white/60">9:41</span>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-4 h-2 bg-emerald-500 rounded-sm" />
                                                </div>
                                            </div>
                                            
                                            {/* App Content */}
                                            <div className="p-5 space-y-5">
                                                {/* Header */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[10px] text-white/40 uppercase tracking-wider">Total Balance</p>
                                                        <p className="text-3xl font-black text-white">$12,847.50</p>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                                                        <DollarSign size={24} className="text-black" />
                                                    </div>
                                                </div>
                                                
                                                {/* Today's Progress */}
                                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-xs font-bold text-white/60">Today's Tasks</span>
                                                        <span className="text-xs font-black text-emerald-400">32/40 Complete</span>
                                                    </div>
                                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full animate-progress" style={{ width: '80%' }} />
                                                    </div>
                                                </div>
                                                
                                                {/* Earnings Card */}
                                                <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl p-4 border border-emerald-500/20">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <TrendingUp size={18} className="text-emerald-400" />
                                                        <span className="text-xs font-bold text-white/80">Today's Earnings</span>
                                                    </div>
                                                    <p className="text-2xl font-black text-emerald-400">+$127.50</p>
                                                    <p className="text-[10px] text-white/40 mt-1">Commission Rate: 1.00%</p>
                                                </div>
                                                
                                                {/* Recent Activity */}
                                                <div className="space-y-3">
                                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Recent Activity</p>
                                                    {[
                                                        { type: 'Task Complete', amount: '+$3.50', time: '2m ago' },
                                                        { type: 'Commission', amount: '+$12.00', time: '15m ago' },
                                                        { type: 'Task Complete', amount: '+$3.50', time: '32m ago' },
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-white">{item.type}</p>
                                                                    <p className="text-[10px] text-white/40">{item.time}</p>
                                                                </div>
                                                            </div>
                                                            <span className="text-sm font-black text-emerald-400">{item.amount}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating Elements */}
                                <div className="absolute -top-4 -left-4 bg-[#0d0d0f] rounded-2xl p-4 border border-white/10 shadow-2xl animate-float hidden lg:block">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                                            <Star size={18} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/40">VIP Level</p>
                                            <p className="text-lg font-black text-amber-400">LV4</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="absolute -bottom-4 -right-4 bg-[#0d0d0f] rounded-2xl p-4 border border-emerald-500/20 shadow-2xl animate-float hidden lg:block" style={{ animationDelay: '1s' }}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs font-bold text-emerald-400">+$24.50 earned</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="px-6 py-20 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {[
                                { label: 'Active Users', value: '124K+', icon: Users, color: 'text-emerald-400' },
                                { label: 'Total Payouts', value: '$840M+', icon: DollarSign, color: 'text-cyan-400' },
                                { label: 'Global Rank', value: '#1', icon: Globe, color: 'text-amber-400' },
                                { label: 'Uptime', value: '99.9%', icon: BadgeCheck, color: 'text-emerald-400' },
                            ].map((stat, i) => (
                                <div key={i} className="reveal-scale bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 rounded-3xl flex flex-col items-center text-center gap-4 border border-white/5 group hover:border-emerald-500/30 transition-all duration-500">
                                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl md:text-3xl font-black tracking-tighter">{stat.value}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="px-6 py-20 md:py-32 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16 md:mb-20 space-y-4">
                            <h2 className="reveal-up text-xs font-black uppercase tracking-[0.4em] text-emerald-400">Getting Started</h2>
                            <h3 className="reveal-up text-3xl md:text-5xl font-black tracking-tighter">Start Earning in 3 Steps</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {[
                                {
                                    step: '01',
                                    title: 'Create Account',
                                    desc: 'Sign up in under 60 seconds with just your email. No complex verification needed to start.',
                                    icon: Users
                                },
                                {
                                    step: '02',
                                    title: 'Make a Deposit',
                                    desc: 'Fund your account with USDT, ETH, or BTC. Minimum deposit starts at just $30.',
                                    icon: DollarSign
                                },
                                {
                                    step: '03',
                                    title: 'Complete Tasks',
                                    desc: 'Start completing simple digital tasks and earn commissions instantly on every completion.',
                                    icon: Zap
                                }
                            ].map((item, i) => (
                                <div key={i} className="reveal-up relative group">
                                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative bg-white/[0.02] backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-white/5 group-hover:border-emerald-500/30 transition-all duration-500">
                                        <div className="flex items-start justify-between mb-8">
                                            <span className="text-5xl md:text-6xl font-black text-white/5 group-hover:text-emerald-500/20 transition-colors">{item.step}</span>
                                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                                <item.icon size={28} />
                                            </div>
                                        </div>
                                        <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">{item.title}</h4>
                                        <p className="text-white/50 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="px-6 py-20 md:py-32 relative bg-white/[0.01]">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16 md:mb-20 space-y-4">
                            <h2 className="reveal-up text-xs font-black uppercase tracking-[0.4em] text-cyan-400">Platform Features</h2>
                            <h3 className="reveal-up text-3xl md:text-5xl font-black tracking-tighter">Why Choose Simple Money</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {[
                                {
                                    title: 'Task-Based Earnings',
                                    desc: 'Complete simple digital tasks in sets. Each task completion earns you a commission based on your VIP level.',
                                    icon: Zap,
                                    color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400'
                                },
                                {
                                    title: '6 VIP Levels',
                                    desc: 'Progress through LV1 to LV6 with commission rates ranging from 0.45% to 1.50% per task.',
                                    icon: BadgeCheck,
                                    color: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400'
                                },
                                {
                                    title: 'Referral Rewards',
                                    desc: 'Earn bonus commissions when you invite friends. The more you refer, the more you earn.',
                                    icon: Users,
                                    color: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400'
                                },
                                {
                                    title: 'Daily Salary Bonus',
                                    desc: 'Earn additional salary bonuses for consecutive daily task completions, up to $32,800/month.',
                                    icon: TrendingUp,
                                    color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400'
                                },
                                {
                                    title: 'Secure Transactions',
                                    desc: 'All deposits and withdrawals are processed through secure crypto channels with instant confirmation.',
                                    icon: ShieldCheck,
                                    color: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400'
                                },
                                {
                                    title: 'Instant Withdrawals',
                                    desc: 'Request withdrawals anytime. Funds are processed within minutes to your crypto wallet.',
                                    icon: ArrowUpRight,
                                    color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400'
                                }
                            ].map((feat, i) => (
                                <div key={i} className="reveal-up group">
                                    <div className={`h-full bg-gradient-to-b ${feat.color} backdrop-blur-sm p-8 rounded-3xl border hover:scale-[1.02] transition-all duration-500`}>
                                        <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${feat.color.includes('text-') ? feat.color.split(' ').find(c => c.startsWith('text-')) : ''}`}>
                                            <feat.icon size={28} />
                                        </div>
                                        <h4 className="text-xl font-black uppercase tracking-tight mb-4">{feat.title}</h4>
                                        <p className="text-white/50 leading-relaxed">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* VIP Levels Section */}
                <section id="vip" className="px-6 py-20 md:py-32 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16 md:mb-20 space-y-4">
                            <h2 className="reveal-up text-xs font-black uppercase tracking-[0.4em] text-amber-400">VIP Tier System</h2>
                            <h3 className="reveal-up text-3xl md:text-5xl font-black tracking-tighter">Unlock Higher Commissions</h3>
                            <p className="reveal-up text-white/50 max-w-2xl mx-auto">Higher VIP levels unlock increased commission rates and more daily tasks</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { id: 1, name: 'LV1', price: 100, rate: '0.45%', tasks: 40, color: 'from-cyan-500 to-blue-600' },
                                { id: 2, name: 'LV2', price: 500, rate: '0.50%', tasks: 50, color: 'from-violet-500 to-purple-600' },
                                { id: 3, name: 'LV3', price: 2000, rate: '0.80%', tasks: 60, color: 'from-amber-400 to-orange-500', popular: true },
                                { id: 4, name: 'LV4', price: 5000, rate: '1.00%', tasks: 70, color: 'from-rose-500 to-red-600' },
                                { id: 5, name: 'LV5', price: 10000, rate: '1.20%', tasks: 80, color: 'from-emerald-500 to-teal-600' },
                                { id: 6, name: 'LV6', price: 30000, rate: '1.50%', tasks: 100, color: 'from-blue-600 to-indigo-700' },
                            ].map((level) => (
                                <div key={level.id} className={`reveal-up relative group ${level.popular ? 'ring-2 ring-emerald-500/50' : ''}`}>
                                    {level.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-full">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className="h-full bg-white/[0.02] backdrop-blur-sm p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-500">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                                <BadgeCheck size={28} className="text-white" />
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">
                                                Tier {level.id}
                                            </div>
                                        </div>
                                        <h4 className="text-3xl font-black uppercase tracking-tighter mb-2">{level.name}</h4>
                                        <div className="flex items-baseline gap-2 mb-8">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Deposit</span>
                                            <span className="text-2xl font-black">${level.price.toLocaleString()}</span>
                                        </div>
                                        <div className="space-y-4 pt-6 border-t border-white/5">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Commission Rate</span>
                                                <span className="text-sm font-black text-emerald-400">{level.rate}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Daily Tasks</span>
                                                <span className="text-sm font-black">{level.tasks}</span>
                                            </div>
                                        </div>
                                        <Link href="/signup" className="mt-8 w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-[10px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2">
                                            Get Started <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="px-6 py-20 md:py-32 relative bg-white/[0.01]">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16 md:mb-20 space-y-4">
                            <h2 className="reveal-up text-xs font-black uppercase tracking-[0.4em] text-emerald-400">Success Stories</h2>
                            <h3 className="reveal-up text-3xl md:text-5xl font-black tracking-tighter">Real Members, Real Earnings</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    name: 'Michael R.',
                                    level: 'LV4 Member',
                                    earnings: '$4,200/month',
                                    quote: "I was skeptical at first, but after my first withdrawal went through instantly, I was convinced. Now I'm earning consistently every day.",
                                    avatar: 'M'
                                },
                                {
                                    name: 'Sarah K.',
                                    level: 'LV5 Member',
                                    earnings: '$8,500/month',
                                    quote: "The VIP system really rewards dedication. I started at LV1 and worked my way up. The commission rates at higher levels are incredible.",
                                    avatar: 'S'
                                },
                                {
                                    name: 'David L.',
                                    level: 'LV6 Member',
                                    earnings: '$15,000/month',
                                    quote: "Simple Money changed my financial situation completely. The daily salary bonus alone covers my bills. Highly recommend to anyone serious about earning.",
                                    avatar: 'D'
                                }
                            ].map((testimonial, i) => (
                                <div key={i} className="reveal-up bg-white/[0.02] backdrop-blur-sm p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all duration-500">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xl font-black text-black">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{testimonial.name}</p>
                                            <p className="text-xs text-emerald-400">{testimonial.level}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-white/60 leading-relaxed mb-6">"{testimonial.quote}"</p>
                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Monthly Earnings</p>
                                        <p className="text-2xl font-black text-emerald-400">{testimonial.earnings}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-6 py-20 md:py-32 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="reveal-up bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 rounded-[40px] p-10 md:p-16 border border-emerald-500/20 relative overflow-hidden">
                            {/* Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-3xl" />
                            
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6">
                                    Ready to Start Earning?
                                </h2>
                                <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
                                    Join over 124,000 members who are already earning daily commissions with Simple Money. 
                                    Your financial freedom starts with one click.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link 
                                        href="/signup" 
                                        className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 text-black px-12 py-5 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                                    >
                                        Create Free Account <ArrowRight size={18} />
                                    </Link>
                                    <Link 
                                        href="/login"
                                        className="w-full sm:w-auto px-12 py-5 rounded-2xl border border-white/10 hover:border-emerald-500/50 hover:bg-white/5 transition-all text-sm font-bold"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="px-6 pt-20 md:pt-32 pb-12 relative border-t border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16 md:mb-20">
                            <div className="col-span-2 md:col-span-1 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                                        <DollarSign className="text-black" size={20} />
                                    </div>
                                    <span className="text-xl font-black uppercase tracking-tighter">Simple Money</span>
                                </div>
                                <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                                    The trusted platform for task-based earnings. Join thousands of members earning daily commissions.
                                </p>
                            </div>

                            {[
                                {
                                    title: 'Platform',
                                    links: [
                                        { label: 'VIP Levels', href: '/levels' },
                                        { label: 'Daily Salary', href: '/salary' },
                                        { label: 'Invite Friends', href: '/invite' },
                                        { label: 'Start Tasks', href: '/start' }
                                    ]
                                },
                                {
                                    title: 'Account',
                                    links: [
                                        { label: 'Sign Up', href: '/signup' },
                                        { label: 'Login', href: '/login' },
                                        { label: 'Deposit', href: '/deposit' },
                                        { label: 'Withdraw', href: '/withdraw' }
                                    ]
                                },
                                {
                                    title: 'Support',
                                    links: [
                                        { label: 'Help Center', href: '/faq' },
                                        { label: 'Contact Us', href: '/service' },
                                        { label: 'Privacy Policy', href: '/privacy' },
                                        { label: 'Terms of Use', href: '/agreement' }
                                    ]
                                }
                            ].map((col, i) => (
                                <div key={i} className="space-y-4">
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{col.title}</h5>
                                    <ul className="space-y-3">
                                        {col.links.map((link, j) => (
                                            <li key={j}>
                                                <Link href={link.href} className="text-sm text-white/40 hover:text-emerald-400 transition-colors">
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Systems Operational</span>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
                                &copy; 2026 Simple Money. All rights reserved.
                            </p>
                            <div className="flex items-center gap-6 text-white/20">
                                <Twitter size={18} className="hover:text-emerald-400 transition-colors cursor-pointer" />
                                <Github size={18} className="hover:text-emerald-400 transition-colors cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </footer>

                {/* Video Modal */}
                {videoPlaying && (
                    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setVideoPlaying(false)}>
                        <div className="relative max-w-4xl w-full aspect-video bg-[#0d0d0f] rounded-3xl overflow-hidden border border-white/10">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                        <Play size={32} className="text-emerald-400 ml-1" />
                                    </div>
                                    <p className="text-white/60">Video content would play here</p>
                                </div>
                            </div>
                            <button 
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                onClick={() => setVideoPlaying(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AnimatePage>
    );
}
