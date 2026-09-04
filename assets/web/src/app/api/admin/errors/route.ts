import { NextRequest } from "next/server";
import { requireAdmin, errorJson, logError, ERR } from "@/lib/admin-auth";

/**
 * GET   /api/admin/errors            → alarmes no resoltes (+ comptadors)
 * PATCH /api/admin/errors            → marca una alarma com a resolta
 *
 * Aquestes són les "alarmes" del sistema: cada error de la web (auth
 * fallida, DB caiguda, configuració mancant...) queda registrat amb un
 * identificador (ex: ADM-DB-001) perquè el CEO pugui veure-ho sense ser tècnic.
 */

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return errorJson(auth.errorId!, "Accés denegat", auth.status!);

  try {
    const client = auth.client!;

    const { data: errors, error: e1 } = await client
      .from("error_log")
      .select("*")
      .eq("resolved", false)
      .order("created_at", { ascending: false })
      .limit(100);

    if (e1) {
      // La taula error_log pot no existir encara (SQL de fase 1 pendent)
      const missingTable = e1.code === "42P01" || e1.message?.includes("does not exist");
      if (missingTable) {
        return Response.json({
          errors: [],
          counts: {},
          setup_pending: true,
          hint: "Executa assets/supabase-admin-fase1.sql al Supabase Dashboard",
        });
      }
      await logError(ERR.DB_ERROR, "error", {
        route: "/api/admin/errors",
        op: "GET",
        detail: e1.message,
      });
      return errorJson(ERR.DB_ERROR, "Error llegint alarmes", 500);
    }

    // Comptadors per severitat (últims 7 dies) per a la franja d'alarma
    const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
    const { data: recent, error: e2 } = await client
      .from("error_log")
      .select("severity")
      .gte("created_at", weekAgo);

    const counts: Record<string, number> = { info: 0, warning: 0, error: 0, critical: 0 };
    for (const r of recent ?? []) {
      counts[r.severity] = (counts[r.severity] ?? 0) + 1;
    }

    return Response.json({ errors: errors ?? [], counts, setup_pending: false });
  } catch (e) {
    await logError(ERR.DB_ERROR, "critical", {
      route: "/api/admin/errors",
      op: "GET",
      detail: String(e),
    });
    return errorJson(ERR.DB_ERROR, "Error intern", 500);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return errorJson(auth.errorId!, "Accés denegat", auth.status!);

  try {
    const body = await req.json();
    if (!body.id || typeof body.id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.id)) {
      return errorJson(ERR.VALIDATION, "id d'alarma invàlid", 400);
    }

    const { error } = await auth.client!
      .from("error_log")
      .update({ resolved: true })
      .eq("id", body.id);

    if (error) {
      await logError(ERR.DB_ERROR, "error", {
        route: "/api/admin/errors",
        op: "PATCH",
        detail: error.message,
      });
      return errorJson(ERR.DB_ERROR, "Error marcant l'alarma", 500);
    }

    return Response.json({ ok: true });
  } catch (e) {
    return errorJson(ERR.DB_ERROR, "Error intern", 500);
  }
}
