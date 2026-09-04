import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

/**
 * Mòdul d'autenticació i autorització del panell /admin.
 *
 * Arquitectura de seguretat (defensa en profunditat):
 * 1. El client admin envia el JWT de Supabase al header `Authorization: Bearer <token>`.
 * 2. El servidor VERIFICA el token contra Supabase (auth.getUser) — mai confia
 *    en claims llegits del client sense validar.
 * 3. Comprova profiles.is_admin = true (consulta feta amb service role).
 * 4. RLS a Supabase és l'última línia de defensa (les policies limiten el que
 *    qualsevol clau pot fer, inclosa aquesta).
 *
 * Errors: cada resposta porta un identificador (ex: ADM-AUTH-002) que es
 * registra a error_log i es mostra al panell d'alarmes.
 */

// ── Identificadors d'error ────────────────────────────────────────────
export const ERR = {
  NO_SESSION: "ADM-AUTH-001",
  NOT_ADMIN: "ADM-AUTH-002",
  SERVER_CONFIG: "ADM-SYS-001",
  DB_ERROR: "ADM-DB-001",
  VALIDATION: "ADM-VAL-001",
  RATE_LIMIT: "ADM-SYS-002",
} as const;

/** Client service-role (només dins API routes; si falta la clau, llença ADM-SYS-001). */
export function serviceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error(ERR.SERVER_CONFIG);
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Registra un error a error_log (mai llança; el logging no pot trencar la petició). */
export async function logError(
  errorId: string,
  severity: "info" | "warning" | "error" | "critical",
  context: Record<string, unknown>
): Promise<void> {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;
    await serviceClient()
      .from("error_log")
      .insert({ error_id: errorId, severity, context });
  } catch {
    /* silenciós per disseny */
  }
}

export interface AdminCheckResult {
  ok: boolean;
  /** Client service-role si ok, null si no. */
  client: SupabaseClient | null;
  /** Identificador d'error i codi HTTP si no ok. */
  errorId?: string;
  status?: number;
  /** user_id de l'admin (útil per auditar qui fa canvis). */
  userId?: string;
}

/**
 * Verifica que la petició ve d'una sessió Supabase vàlida amb rol admin.
 * Llegeix el JWT del header Authorization i el valida SERVER-SIDE.
 */
export async function requireAdmin(
  req: NextRequest
): Promise<AdminCheckResult> {
  // 1. Configuració present?
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    await logError(ERR.SERVER_CONFIG, "critical", {
      route: req.nextUrl?.pathname,
      detail: "Falta SUPABASE_SERVICE_ROLE_KEY a les env vars del servidor",
    });
    return { ok: false, client: null, errorId: ERR.SERVER_CONFIG, status: 500 };
  }

  // 2. Token present?
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return { ok: false, client: null, errorId: ERR.NO_SESSION, status: 401 };
  }

  const client = serviceClient();

  // 3. Token vàlid? (verificació criptogràfica contra Supabase)
  const { data: userData, error: userError } = await client.auth.getUser(token);
  if (userError || !userData?.user) {
    await logError(ERR.NO_SESSION, "warning", {
      route: req.nextUrl?.pathname,
      detail: userError?.message || "token invàlid",
    });
    return { ok: false, client: null, errorId: ERR.NO_SESSION, status: 401 };
  }

  // 4. És admin?
  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("is_admin")
    .eq("id", userData.user.id)
    .single();
  if (profileError || !profile?.is_admin) {
    await logError(ERR.NOT_ADMIN, "warning", {
      route: req.nextUrl?.pathname,
      user_id: userData.user.id,
      email: userData.user.email,
      detail: "Intent d'accés admin sense permisos",
    });
    return { ok: false, client: null, errorId: ERR.NOT_ADMIN, status: 403 };
  }

  return { ok: true, client, userId: userData.user.id };
}

/** Resposta JSON d'error estàndard (sempre inclou errorId per a l'alarma). */
export function errorJson(
  errorId: string,
  message: string,
  status: number
): Response {
  return Response.json({ error: message, errorId }, { status });
}
