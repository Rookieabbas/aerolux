import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile row for the authenticated user
  const fetchProfile = useCallback(async (userId) => {
    if (!userId || !isSupabaseConfigured) {
      setProfile(null);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching profile:', error.message);
        return null;
      }

      setProfile(data);
      return data;
    } catch (err) {
      console.error('Exception fetching profile:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 1. Initial active session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // 2. Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign up with full name and phone metadata
  const signUp = async ({ email, password, fullName, phone }) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please check .env settings.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || '',
          role: 'user',
        },
      },
    });

    if (error) throw error;

    if (data?.user) {
      setUser(data.user);
      await fetchProfile(data.user.id);
    }

    return data;
  };

  // Sign in with email and password
  const signIn = async ({ email, password }) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please check .env settings.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data?.user) {
      setUser(data.user);
      await fetchProfile(data.user.id);
    }

    return data;
  };

  // 1-Click Instant Demo Login (auto-creates if first time or signs in immediately)
  const signInDemoUser = async () => {
    const demoEmail = 'vip.guest@aerolux.vip';
    const demoPassword = 'AeroLuxVIP2025!';
    const demoName = 'Lord Alexander Hamilton';
    const demoPhone = '+1 (555) 019-2834';

    try {
      return await signIn({ email: demoEmail, password: demoPassword });
    } catch (err) {
      // If user doesn't exist yet in Supabase auth, create it seamlessly
      return await signUp({
        email: demoEmail,
        password: demoPassword,
        fullName: demoName,
        phone: demoPhone,
      });
    }
  };

  // Sign out
  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setProfile(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      return await fetchProfile(user.id);
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInDemoUser,
    signOut,
    refreshProfile,
    isSupabaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
