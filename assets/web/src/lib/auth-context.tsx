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
  /**Pla de l'usuari: 'free' | 'premium'. Llegit de user.user_metadata.plan*/
  plan: "free" | "premium";
  /**Tanca la sessió actual*/
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si Supabase no està configurat, mirem si hi ha un mode demo via
    // query param `?demo=free|premium`. Això permet testejar visualment
    // els CTAs condicionals sense Supabase configurat. NOMÉS en mode
    // no configurat: si Supabase està configurat, això s'ignora.
    if (!isSupabaseConfigured()) {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const demo = params.get("demo");
        if (demo === "free" || demo === "premium") {
          const fakeUser = {
            id: `demo-${demo}-user`,
            aud: "authenticated",
            role: "authenticated",
            email: demo === "premium" ? "premium@demo.com" : "free@demo.com",
            app_metadata: { provider: "email" },
            user_metadata: {
              full_name: demo === "premium" ? "Sònia Premium" : "Maria Puig",
              email: demo === "premium" ? "premium@demo.com" : "free@demo.com",
              plan: demo,
              company: "Criteri ESG S.L.",
              gdpr_consent: true,
              // Per defecte, tot usuari nou té newsletter activada en castellà.
              // Decisió editorial de Paolo (CONTEXT decisió 12).
              newsletter_subscribed: true,
              newsletter_language: "es" as const,
              interests: [],
            },
            created_at: new Date().toISOString(),
          } as unknown as User;
          const fakeSession = {
            access_token: "demo-token",
            refresh_token: "demo-refresh",
            expires_in: 3600,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            token_type: "bearer",
            user: fakeUser,
          } as unknown as Session;
          setSession(fakeSession);
        }
      }
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

      // Retorn a /admin després d'un OAuth iniciat al backoffice.
      // Supabase només honra redirectTo si l'URL és a les "Redirect URLs"
      // permeses del dashboard; si no, envia l'usuari al Site URL (home).
      // Això no depèn de la config del dashboard: l'intenció es va guardar
      // a sessionStorage abans de sortir cap a Google (vegeu admin/page.tsx).
      if (newSession && typeof window !== "undefined") {
        try {
          if (window.sessionStorage.getItem("criteri-admin-login") === "1") {
            window.sessionStorage.removeItem("criteri-admin-login");
            // Deixa que React acabi el render abans de navegar
            setTimeout(() => {
              if (!window.location.pathname.startsWith("/admin")) {
                window.location.replace("/admin");
              }
            }, 0);
          }
        } catch {
          /* sessionStorage no disponible — ignora */
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Onboarding per defecte per a usuaris que entren via OAuth (Google)
   * sense haver passat pel formulari de registre manual.
   *
   * Quan Supabase crea un usuari nou via Google, no li posa
   * `newsletter_subscribed`, `newsletter_language`, `plan` ni `interests`.
   * Si detectem aquest cas, fem un `auth.updateUser` silenciós amb valors
   * per defecte:
   *   - newsletter_subscribed: true (cohrent amb el formulari manual)
   *   - newsletter_language: 'es' (la newsletter per defecte és en castellà, decisió editorial de Paolo)
   *   - plan: 'free'
   *
   * Així evitem la inconsistència que un usuari Google aparegui com
   * "no subscrit" a la newsletter quan en realitat vol rebre-la.
   */
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    if (!session?.user) return;

    const meta = session.user.user_metadata ?? {};
    const isMissingDefaults =
      meta.newsletter_subscribed === undefined ||
      meta.newsletter_language === undefined ||
      meta.plan === undefined;

    if (!isMissingDefaults) return;

    // Per evitar execucions duplicades en mode StrictMode (dev), marquem
    // amb un flag temporal al localStorage.
    const onboardingKey = `criteri-onboarding-${session.user.id}`;
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem(onboardingKey)) return;
      window.localStorage.setItem(onboardingKey, "1");
    }

    (async () => {
      const { error } = await supabase.auth.updateUser({
        data: {
          newsletter_subscribed: true,
          newsletter_language: "es",
          plan: "free",
          // No sobreescriure full_name/email/interests — Google ja els posa
        },
      });
      if (error) {
        console.error(
          "[auth-context] Error setting default user metadata:",
          error.message
        );
        // Si falla, netegem el flag perquè es pugui reintentar
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(onboardingKey);
        }
      } else {
        // Apuntar a Brevo per a la newsletter
        try {
          await fetch("/api/brevo-subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email || "",
              name: meta.full_name || meta.name || "",
              lang: "es",
            }),
          });
        } catch (e) {
          console.warn("[auth-context] No s'ha pogut apuntar a Brevo:", e);
        }
      }
    })();
  }, [session?.user]);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setSession(null);
      // En mode demo, netejem el query param
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("demo");
        window.history.replaceState({}, "", url.toString());
        window.location.reload();
      }
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
    plan:
      (session?.user?.user_metadata?.plan as "free" | "premium" | undefined) ??
      "free",
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
