import { NextRequest } from "next/server";
import { requireAdmin, errorJson, serviceClient, logError, ERR } from "@/lib/admin-auth";

/**
 * GET /api/admin/health → estat global del sistema per al panell
 *
 * Comprova: DB reachable, taula informes accessible, error_log present,
 * configuració completa (service key), comptadors bàsics.
 * Mai expose dades sensibles: només ok/fail + detalls tècnics mínims.
 */

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return errorJson(auth.errorId!, "Accés denegat", auth.status!);

  const checks: Record<string, { ok: boolean; detail?: string }> = {};

  // 1. DB: lectura d'informes (compta publicats i drafts)
  try {
    const { count: published, error: e1 } = await auth.client!
      .from("informes")
      .select("*", { count: "exact", head: true })
      .eq("status", "published");
    const { count: total, error: e2 } = await auth.client!
      .from("informes")
      .select("*", { count: "exact", head: true });

    if (e1 || e2) {
      checks.db_informes = { ok: false, detail: e1?.message || e2?.message };
    } else {
      checks.db_informes = {
        ok: true,
        detail: `${published ?? 0} publicats de ${total ?? 0} totals`,
      };
    }
  } catch (e) {
    checks.db_informes = { ok: false, detail: String(e) };
  }

  // 2. Taula error_log present? (si no, cal executar el SQL de fase 1)
  try {
    const { error } = await auth.client!
      .from("error_log")
      .select("id", { count: "exact", head: true });
    checks.db_error_log = error
      ? { ok: false, detail: "Taula error_log no existeix — executa supabase-admin-fase1.sql" }
      : { ok: true };
  } catch (e) {
    checks.db_error_log = { ok: false, detail: String(e) };
  }

  // 3. Usuaris registrats
  try {
    const { count, error } = await auth.client!
      .from("profiles")
      .select("*", { count: "exact", head: true });
    checks.db_profiles = error
      ? { ok: false, detail: error.message }
      : { ok: true, detail: `${count ?? 0} usuaris` };
  } catch (e) {
    checks.db_profiles = { ok: false, detail: String(e) };
  }

  // 4. Configuració de correu (Brevo) — només verify que existeixi la var
  checks.email_brevo = {
    ok: !!process.env.BREVO_API_KEY,
    detail: process.env.BREVO_API_KEY ? "configurat" : "BREVO_API_KEY no configurada al servidor",
  };

  // 5. Autenticació admin funciona (arribem aquí = sí)
  checks.admin_auth = { ok: true, detail: "JWT + rol verificats correctament" };

  const allOk = Object.values(checks).every((c) => c.ok);

  return Response.json({
    status: allOk ? "healthy" : "degraded",
    checked_at: new Date().toISOString(),
    checks,
  });
}
