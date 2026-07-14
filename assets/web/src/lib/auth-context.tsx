"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthContextValue {
  /**Usuari actual o null si no hi ha sessió*/
  user: User | null;
  /**Sessió de Supabase actual o null*/
  session: Session | null;
  /**Cert mentre es carrega la sessió inicial*/
  loading: boolean;
  /**Tanca la sessió actual*/
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si Supabase no està configurat, no fer res
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Recupera la sessió inicial de Supabase
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) {
        console.error("[auth-context] Error getting session:", error.message);
      }
      setSession(data.session);
      setLoading(false);
    });

    // Escolta els canvis d'estat d'autenticació
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setSession(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[auth-context] Error signing out:", error.message);
    }
    setSession(null);
  }, []);

  const value: AuthContextValue = {
    user: session?.user ?? null,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
