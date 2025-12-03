<<<<<<< HEAD
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);

            if (event === 'SIGNED_IN' && session?.user) {
                checkOnboarding(session.user.id);
            } else if (event === 'SIGNED_OUT') {
                router.push('/auth');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkOnboarding = async (userId: string) => {
        const { data, error } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error('Error checking user settings:', error);
        }

        if (!data?.gemini_api_key) {
            router.push('/onboarding');
        } else if (pathname === '/auth' || pathname === '/onboarding') {
            router.push('/');
        }
    };

    useEffect(() => {
        if (!loading && !user && pathname !== '/auth') {
            router.push('/auth');
        }
    }, [user, loading, pathname]);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
=======
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);

            if (event === 'SIGNED_IN' && session?.user) {
                checkOnboarding(session.user.id);
            } else if (event === 'SIGNED_OUT') {
                router.push('/auth');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkOnboarding = async (userId: string) => {
        const { data, error } = await supabase
            .from('user_settings')
            .select('gemini_api_key')
            .eq('user_id', userId)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error('Error checking user settings:', error);
        }

        if (!data?.gemini_api_key) {
            router.push('/onboarding');
        } else if (pathname === '/auth' || pathname === '/onboarding') {
            router.push('/');
        }
    };

    useEffect(() => {
        if (!loading && !user && pathname !== '/auth') {
            router.push('/auth');
        }
    }, [user, loading, pathname]);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
