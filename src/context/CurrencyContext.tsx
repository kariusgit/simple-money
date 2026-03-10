'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSiteSettings } from './SettingsContext';
import { supabase } from '@/lib/supabase';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';

interface Currency {
    code: CurrencyCode;
    symbol: string;
    rate: number; // Rate relative to USD
}

const currencies: Record<CurrencyCode, Currency> = {
    USD: { code: 'USD', symbol: '$', rate: 1 },
    EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
    GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
    JPY: { code: 'JPY', symbol: '¥', rate: 150.5 },
    CAD: { code: 'CAD', symbol: '$', rate: 1.35 },
};

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (code: CurrencyCode) => void;
    convert: (amount: number) => number;
    format: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const { profile } = useAuth();
    const { currency: backendCurrency, loading } = useSiteSettings();
    const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies.USD);

    useEffect(() => {
        if (loading) return;
        
        // If the admin has defined a global override, use it as default
        const defaultCurrency = backendCurrency?.default && currencies[backendCurrency.default as CurrencyCode] 
            ? { ...currencies[backendCurrency.default as CurrencyCode], symbol: backendCurrency.symbol || currencies[backendCurrency.default as CurrencyCode].symbol }
            : currencies.USD;

        const savedCurrency = localStorage.getItem('currency') as CurrencyCode;
        if (savedCurrency && currencies[savedCurrency]) {
            setCurrentCurrency(currencies[savedCurrency]);
        } else if (profile?.currency && currencies[profile.currency as CurrencyCode]) {
            setCurrentCurrency(currencies[profile.currency as CurrencyCode]);
        } else {
            setCurrentCurrency(defaultCurrency);
        }
    }, [profile?.currency, backendCurrency, loading]);

    const handleSetCurrency = async (code: CurrencyCode) => {
        if (currencies[code]) {
            setCurrentCurrency(currencies[code]);
            localStorage.setItem('currency', code);

            if (profile?.id) {
                try {
                    await supabase
                        .from('profiles')
                        .update({ currency: code })
                        .eq('id', profile.id);
                } catch (err) {
                    console.error('Failed to persist currency setting:', err);
                }
            }
        }
    };

    const convert = (amount: number) => {
        return amount * currentCurrency.rate;
    };

    const format = (amount: number) => {
        const converted = convert(amount);
        if (currentCurrency.code === 'JPY') {
            return `${currentCurrency.symbol}${Math.round(converted).toLocaleString()}`;
        }
        return `${currentCurrency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency: currentCurrency, setCurrency: handleSetCurrency, convert, format }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
    return context;
};
