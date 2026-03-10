'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, DollarSign, ArrowRight, Loader2, Phone, Mail, User, KeyRound, ChevronDown } from 'lucide-react';

// Common country codes
const COUNTRY_CODES = [
    { code: '+1', flag: '🇺🇸', name: 'US' },
    { code: '+44', flag: '🇬🇧', name: 'UK' },
    { code: '+233', flag: '🇬🇭', name: 'GH' },
    { code: '+234', flag: '🇳🇬', name: 'NG' },
    { code: '+254', flag: '🇰🇪', name: 'KE' },
    { code: '+27', flag: '🇿🇦', name: 'ZA' },
    { code: '+91', flag: '🇮🇳', name: 'IN' },
    { code: '+86', flag: '🇨🇳', name: 'CN' },
    { code: '+60', flag: '🇲🇾', name: 'MY' },
    { code: '+63', flag: '🇵🇭', name: 'PH' },
    { code: '+66', flag: '🇹🇭', name: 'TH' },
    { code: '+62', flag: '🇮🇩', name: 'ID' },
    { code: '+84', flag: '🇻🇳', name: 'VN' },
    { code: '+971', flag: '🇦🇪', name: 'AE' },
    { code: '+966', flag: '🇸🇦', name: 'SA' },
];

type LoginMethod = 'email' | 'id' | 'magic';

export default function LoginPage() {
    const [method, setMethod] = useState<LoginMethod>('email');
    const [identifier, setIdentifier] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
    const [showCountryCodes, setShowCountryCodes] = useState(false);
    const [password, setPassword] = useState('');
    const [magicLoading, setMagicLoading] = useState(false);
    const [magicSent, setMagicSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // Forgot password
    const [mode, setMode] = useState<'login' | 'forgot'>('login');
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(true);
    const router = useRouter();
    
    // Auto-logout when accessing the login page to ensure fresh session
    useEffect(() => {
        const cleanupSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await supabase.auth.signOut();
                router.refresh(); 
            }
        };
        cleanupSession();
    }, [router]);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let emailToUse = '';
            const normalizedIdentifier = identifier.trim();

            if (method === 'email') {
                // Email/Username mode
                if (normalizedIdentifier.includes('@')) {
                    emailToUse = normalizedIdentifier;
                } else {
                    // It's a username - look up email securely via API
                    const lookupRes = await fetch('/api/auth/lookup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ identifier: normalizedIdentifier, type: 'username' })
                    });
                    
                    if (!lookupRes.ok) {
                        throw new Error('No account found with this username.');
                    }
                    
                    const lookupData = await lookupRes.json();
                    emailToUse = lookupData.email;
                }
            } else if (method === 'id') {
                // Phone Number ONLY mode
                let query = supabase.from('profiles').select('email');

                // If it doesn't have a +, normalize it with the selected country code
                const fullPhone = normalizedIdentifier.startsWith('+')
                    ? normalizedIdentifier
                    : `${countryCode.code}${normalizedIdentifier.replace(/\D/g, '')}`;

                // Look up email securely via API
                const lookupRes = await fetch('/api/auth/lookup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ identifier: fullPhone, type: 'phone' })
                });

                if (!lookupRes.ok) {
                    throw new Error('No account found with this Phone Number.');
                }
                
                const lookupData = await lookupRes.json();
                emailToUse = lookupData.email;
            }

            // Attempt Sign In
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: emailToUse,
                password,
            });

            if (signInError) {
                // 1. Handle "Email Not Confirmed" specifically
                if (signInError.message.toLowerCase().includes('email not confirmed')) {
                    throw new Error('Please check your email and confirm your account before logging in.');
                }

                throw signInError;
            }

            // Successful Auth
            if (signInData?.user) {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', signInData.user.id)
                    .single();

                // Role Redirection
                const isAdmin = profileData?.role === 'admin';



                router.push(isAdmin ? '/dashboard-alpha' : '/home');
                router.refresh(); // Ensure context updates
            } else {
                router.push('/home');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
            // Clean up common supabase error messages
            const cleanMessage = message.replace('Invalid login credentials', 'Incorrect email or password');
            setError(cleanMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        const input = identifier.trim();
        if (!input) {
            setError('Please enter an email or username.');
            return;
        }

        setError('');
        setMagicLoading(true);

        try {
            let emailToUse = input;

            // If it's not an email, assume it's a username and look it up securely via API
            if (!input.includes('@')) {
                const lookupRes = await fetch('/api/auth/lookup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ identifier: input, type: 'username' })
                });

                if (!lookupRes.ok) {
                    throw new Error('No account found with this username.');
                }
                
                const lookupData = await lookupRes.json();
                emailToUse = lookupData.email;
            }

            const { error } = await supabase.auth.signInWithOtp({
                email: emailToUse,
                options: {
                    emailRedirectTo: `${window.location.origin}/home`,
                }
            });
            if (error) throw error;
            setMagicSent(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send magic link.');
        } finally {
            setMagicLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetEmail) { setError('Please enter your email address.'); return; }
        setError('');
        setResetLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                redirectTo: `${window.location.origin}/login`,
            });
            if (error) throw error;
            setResetSent(true);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to send reset email.';
            setError(message);
        } finally {
            setResetLoading(false);
        }
    };

    const methodOptions: { id: LoginMethod; label: string; icon: React.ReactNode }[] = [
        { id: 'email', label: 'Password', icon: <KeyRound size={16} /> },
        { id: 'magic', label: 'Magic', icon: <Mail size={16} /> },
        { id: 'id', label: 'Phone', icon: <User size={16} /> },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-30%] right-[-20%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md animate-scale-in">
                <div className="glass-card-strong p-8">
                    {/* Logo & Title inside card */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-lg shadow-primary/30">
                            <DollarSign className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-light to-accent-light bg-clip-text text-transparent">
                            Simple Money
                        </h1>
                        <p className="text-text-secondary mt-2 text-xs uppercase tracking-widest font-bold opacity-70">
                            {mode === 'login' ? 'Welcome back' : 'Reset password'}
                        </p>
                    </div>
                    {mode === 'login' ? (
                        <>
                            {/* Login Method Tabs */}
                            <div className="flex gap-2 mb-8 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                                {methodOptions.map(({ id, label, icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => { setMethod(id); setError(''); setIdentifier(''); setPhoneNumber(''); }}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-2 ${method === id ? 'bg-primary text-white shadow-lg shadow-primary/20 transform scale-[1.02]' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                                    >
                                        <div className={`${method === id ? 'text-white' : 'text-primary/50'} transition-colors`}>{icon}</div>
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleLogin} className="space-y-5">
                                {/* Identifier Field */}
                                {method === 'id' ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
                                            <div className="flex flex-nowrap gap-2">
                                                {/* Country Code Picker - only if not manual + */}
                                                {!identifier.startsWith('+') && (
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowCountryCodes(!showCountryCodes)}
                                                            className="input-field flex items-center justify-between gap-1 px-2 whitespace-nowrap min-w-[90px] h-full"
                                                        >
                                                            <span>{countryCode.flag}</span>
                                                            <span className="text-sm font-bold text-text-primary">{countryCode.code}</span>
                                                            <ChevronDown size={14} className="text-text-secondary" />
                                                        </button>
                                                        {showCountryCodes && (
                                                            <div className="absolute top-full left-0 mt-1 w-48 bg-surface border border-white/10 rounded-xl shadow-2xl z-50 overflow-y-auto max-h-56">
                                                                {COUNTRY_CODES.map((c) => (
                                                                    <button
                                                                        key={c.code}
                                                                        type="button"
                                                                        onClick={() => { setCountryCode(c); setShowCountryCodes(false); }}
                                                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-text-primary transition-colors text-left"
                                                                    >
                                                                        <span>{c.flag}</span>
                                                                        <span className="font-bold">{c.code}</span>
                                                                        <span className="text-text-secondary text-xs">{c.name}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="relative flex-1 group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <User size={18} className="text-text-secondary group-focus-within:text-primary-light transition-colors" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={identifier}
                                                        onChange={(e) => setIdentifier(e.target.value)}
                                                        placeholder={identifier.startsWith('+') ? "Phone +number" : "000 000 000"}
                                                        className="input-field pl-12 font-medium"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-text-secondary mt-2 opacity-50 uppercase tracking-widest font-bold">
                                                {identifier.startsWith('+') ? 'Manual phone override active' : 'Selector adds prefix to numbers'}
                                            </p>
                                        </div>
                                    </div>
                                ) : method === 'magic' ? (
                                    <div className="space-y-5">
                                        {magicSent ? (
                                            <div className="text-center py-4 animate-scale-in">
                                                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
                                                    <Mail size={20} className="text-success" />
                                                </div>
                                                <h4 className="font-bold text-text-primary">Link Sent!</h4>
                                                <p className="text-xs text-text-secondary mt-1">Check your email to sign in instantly.</p>
                                                <button
                                                    onClick={() => setMagicSent(false)}
                                                    className="mt-4 text-xs text-primary-light hover:underline"
                                                >
                                                    Send again
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-text-secondary mb-2">Email or Username</label>
                                                    <div className="relative group">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <Mail size={18} className="text-text-secondary group-focus-within:text-primary-light transition-colors" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={identifier}
                                                            onChange={(e) => setIdentifier(e.target.value)}
                                                            placeholder="Email or username"
                                                            className="input-field pl-12"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Email or Username</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail size={18} className="text-text-secondary group-focus-within:text-primary-light transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                value={identifier}
                                                onChange={(e) => setIdentifier(e.target.value)}
                                                placeholder="Enter email or username"
                                                className="input-field pl-12"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Password Section - Only for fixed 'email' (Password) or 'id' methods */}
                                {method !== 'magic' && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-medium text-text-secondary">Password</label>
                                            <button
                                                type="button"
                                                onClick={() => { setMode('forgot'); setError(''); }}
                                                className="text-xs text-primary-light hover:text-accent-light transition-colors"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter your password"
                                                className="input-field pr-12"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm animate-slide-up">
                                        {error}
                                    </div>
                                )}

                                {!magicSent && (
                                    <div className="flex items-start gap-3 py-2 group">
                                        <input
                                            type="checkbox"
                                            checked={acceptTerms}
                                            onChange={(e) => setAcceptTerms(e.target.checked)}
                                            className="mt-1 w-5 h-5 rounded-lg border-white/10 bg-white/5 accent-primary transition-all group-hover:border-primary/50"
                                            id="login-terms"
                                        />
                                        <label htmlFor="login-terms" className="text-xs text-text-secondary cursor-pointer leading-relaxed">
                                            I am at least 18 years old and I agree to the {' '}
                                            <Link href="/agreement" className="text-primary-light hover:text-accent-light transition-colors font-bold">Terms of Service</Link>
                                            {' '}and{' '}
                                            <Link href="/privacy" className="text-primary-light hover:text-accent-light transition-colors font-bold">Privacy Policy</Link>
                                        </label>
                                    </div>
                                )}

                                {method === 'magic' && !magicSent && (
                                    <button
                                        type="button"
                                        onClick={handleMagicLink}
                                        disabled={magicLoading || !acceptTerms}
                                        className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"
                                    >
                                        {magicLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                Send Magic Link
                                                <ArrowRight size={16} />
                                            </>
                                        )}
                                    </button>
                                )}

                                {method !== 'magic' && (
                                    <button
                                        type="submit"
                                        disabled={loading || !acceptTerms}
                                        className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Sign In
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                )}
                            </form>

                            <div className="mt-8 text-center space-y-5">
                                <p className="text-text-secondary text-sm font-medium">
                                    Don&apos;t have an account?{' '}
                                    <Link href="/signup" className="text-primary-light font-black hover:text-accent-light transition-all uppercase tracking-widest text-[11px] underline underline-offset-4 ml-1">
                                         Sign Up
                                    </Link>
                                </p>
                                
                                <div className="flex items-center gap-3">
                                    <div className="h-px bg-white/5 flex-1"></div>
                                    <span className="text-[10px] text-text-secondary/30 font-bold uppercase tracking-widest">or</span>
                                    <div className="h-px bg-white/5 flex-1"></div>
                                </div>

                                <button 
                                    type="button"
                                    onClick={() => (window as any).Tawk_API?.maximize()}
                                    className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-white hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                                >
                                    Contact Customer Service
                                </button>
                            </div>
                        </>
                    ) : resetSent ? (
                        /* Reset Email Sent */
                        <div className="text-center py-6 animate-scale-in">
                            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                                <Mail size={28} className="text-success" />
                            </div>
                            <h2 className="text-xl font-bold text-text-primary mb-2">Check your inbox!</h2>
                            <p className="text-text-secondary text-sm mb-6">
                                We sent a password reset link to <span className="text-primary-light font-semibold">{resetEmail}</span>.
                            </p>
                            <button
                                onClick={() => { setMode('login'); setResetSent(false); setResetEmail(''); }}
                                className="text-primary-light text-sm underline hover:text-accent-light transition-colors"
                            >
                                Back to Sign In
                            </button>
                        </div>
                    ) : (
                        /* Forgot Password Form */
                        <form onSubmit={handleForgotPassword} className="space-y-5">
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/20 mb-3">
                                    <KeyRound size={22} className="text-primary-light" />
                                </div>
                                <p className="text-text-secondary text-sm">Enter your account email and we'll send you a link to reset your password.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="input-field"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={resetLoading}
                                className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50"
                            >
                                {resetLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Reset Link <ArrowRight size={20} /></>}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setMode('login'); setError(''); }}
                                className="w-full text-center text-text-secondary text-sm hover:text-white transition-colors"
                            >
                                ← Back to Sign In
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-text-secondary/50 text-xs mt-8">
                    © 2026 Simple Money. All Rights Reserved.
                </p>
            </div>
        </div>
    );
}
