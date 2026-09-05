"use client";

import { supabase } from "@/lib/supabase";

/**
 * Client d'API per al panell /admin.
 * Afegeix automàticament el JWT de la sessió Supabase a cada petició
 * (header Authorization: Bearer). El servidor el valida SEMPRE.
 */

export interface AdminError {
  error: string;
  errorId?: string;
  status: number;
}

async function authedFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw {
      error: "No hi ha sessió activa. Inicia sessió primer.",
      errorId: "ADM-AUTH-001",
      status: 401,
    } as AdminError;
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw {
      error: json.error || `Error HTTP ${res.status}`,
      errorId: json.errorId,
      status: res.status,
    } as AdminError;
  }

  return json as T;
}

// ── Tipus compartits amb l'API ───────────────────────────────────────

export interface AdminInforme {
  slug: string;
  title: string;
  institution: string;
  date: string;
  pages: number;
  type: string;
  scope: string;
  tags: string[];
  certifications: string[];
  summary: string;
  url: string;
  status: "draft" | "validated" | "published" | "archived";
  content_ca: Record<string, unknown> | null;
  content_es: Record<string, unknown> | null;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  created_at: string;
  is_admin: boolean;
  plan: string;
  subscription_status: string | null;
}

export interface AdminAlarm {
  id: string;
  error_id: string;
  severity: "info" | "warning" | "error" | "critical";
  context: Record<string, unknown> | null;
  created_at: string;
}

export interface AdminPage {
  slug: string;
  status: string | null;
  content_ca: { sections?: Record<string, string> } | null;
  content_es: { sections?: Record<string, string> } | null;
  updated_at: string | null;
}

export interface PagesResponse {
  page: AdminPage;
}

// ── Endpoints ────────────────────────────────────────────────────────

export const adminApi = {
  reports: {
    list: () => authedFetch<{ reports: AdminInforme[] }>("/api/admin/reports"),
    create: (report: Partial<AdminInforme>) =>
      authedFetch<{ report: AdminInforme }>("/api/admin/reports", {
        method: "POST",
        body: JSON.stringify(report),
      }),
    update: (slug: string, updates: Partial<AdminInforme>) =>
      authedFetch<{ report: AdminInforme }>(`/api/admin/reports/${slug}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    remove: (slug: string) =>
      authedFetch<{ ok: boolean }>(`/api/admin/reports/${slug}`, {
        method: "DELETE",
      }),
  },

  users: {
    list: () =>
      authedFetch<{ users: AdminUser[]; count: number }>("/api/admin/users"),
    setPlan: (userId: string, plan: string) =>
      authedFetch<{ ok: boolean }>("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ user_id: userId, plan }),
      }),
  },

  errors: {
    list: () =>
      authedFetch<{
        errors: AdminAlarm[];
        counts: Record<string, number>;
        setup_pending?: boolean;
        hint?: string;
      }>("/api/admin/errors"),
    resolve: (id: string) =>
      authedFetch<{ ok: boolean }>("/api/admin/errors", {
        method: "PATCH",
        body: JSON.stringify({ id }),
      }),
  },

  health: () =>
    authedFetch<{
      status: "healthy" | "degraded";
      checked_at: string;
      checks: Record<string, { ok: boolean; detail?: string }>;
    }>("/api/admin/health"),

  pages: {
    get: (slug: string) =>
      authedFetch<PagesResponse>(`/api/admin/pages/${slug}`),
    put: (
      slug: string,
      body: {
        content_ca?: { sections: Record<string, string> };
        content_es?: { sections: Record<string, string> };
        status?: "draft" | "published" | "archived";
      }
    ) =>
      authedFetch<{ ok: boolean }>(`/api/admin/pages/${slug}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
  },
};
