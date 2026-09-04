import { NextRequest } from "next/server";
import { requireAdmin, errorJson, logError, ERR } from "@/lib/admin-auth";

/**
 * GET  /api/admin/users          → llista usuaris amb el seu pla
 * PATCH /api/admin/users?user=<uuid> → canvia el pla/status d'un usuari
 *
 * Seguretat: requireAdmin valida JWT + rol admin server-side.
 * Dades sensibles: mai retornem hashos, tokens ni metadades d'auth.
 */

export const dynamic = "force-dynamic";

const VALID_PLANS = ["free", "premium", "ultra"];
const VALID_SUB_STATUS = ["active", "cancelled", "expired", "pending", "suspended"];

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return errorJson(auth.errorId!, "Accés denegat", auth.status!);

  try {
    // Vista admin_users_view: profiles LEFT JOIN subscriptions
    // (creada al SQL de la fase 1; RLS permet només admins)
    const { data, error } = await auth.client!
      .from("profiles")
      .select(
        `id, email, full_name, company, created_at, is_admin,
         subscriptions (plan, status, updated_at)`
      )
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      await logError(ERR.DB_ERROR, "error", {
        route: "/api/admin/users",
        op: "GET",
        detail: error.message,
      });
      return errorJson(ERR.DB_ERROR, "Error llegint usuaris", 500);
    }

    // Aplanem la relació per simplicitat al frontend
    const users = (data ?? []).map((u: Record<string, unknown>) => {
      const subs = (u.subscriptions as Array<Record<string, unknown>>) || [];
      const current = subs.find((s) => s.status === "active") || subs[0];
      return {
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        company: u.company,
        created_at: u.created_at,
        is_admin: u.is_admin,
        plan: current?.plan ?? "free",
        subscription_status: current?.status ?? null,
        plan_updated_at: current?.updated_at ?? null,
      };
    });

    return Response.json({ users, count: users.length });
  } catch (e) {
    await logError(ERR.DB_ERROR, "critical", {
      route: "/api/admin/users",
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
    const userId = body.user_id;

    if (!userId || typeof userId !== "string" || !/^[0-9a-f-]{36}$/i.test(userId)) {
      return errorJson(ERR.VALIDATION, "user_id invàlid", 400);
    }

    // Només permetem canviar pla i estat de subscripció
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.plan !== undefined) {
      if (!VALID_PLANS.includes(String(body.plan)))
        return errorJson(ERR.VALIDATION, "Pla invàlid (free/premium/ultra)", 400);
      updates.plan = body.plan;
    }
    if (body.status !== undefined) {
      if (!VALID_SUB_STATUS.includes(String(body.status)))
        return errorJson(ERR.VALIDATION, "Estat invàlid", 400);
      updates.status = body.status;
    }
    if (Object.keys(updates).length === 1) {
      return errorJson(ERR.VALIDATION, "Cap canvi sol·licitat", 400);
    }

    // Actualitzem la subscripció activa de l'usuari
    const { data: existing, error: findError } = await auth.client!
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (findError) {
      await logError(ERR.DB_ERROR, "error", {
        route: "/api/admin/users",
        op: "PATCH-find",
        user_id: userId,
        detail: findError.message,
      });
      return errorJson(ERR.DB_ERROR, "Error cercant la subscripció", 500);
    }

    if (!existing) {
      // L'usuari no té subscripció activa: creem una de nova
      const { error: insertError } = await auth.client!
        .from("subscriptions")
        .insert({
          user_id: userId,
          plan: updates.plan || "free",
          status: updates.status || "active",
          started_at: new Date().toISOString(),
        });
      if (insertError) {
        await logError(ERR.DB_ERROR, "error", {
          route: "/api/admin/users",
          op: "PATCH-insert",
          user_id: userId,
          detail: insertError.message,
        });
        return errorJson(ERR.DB_ERROR, "Error creant la subscripció", 500);
      }
    } else {
      const { error: updateError } = await auth.client!
        .from("subscriptions")
        .update(updates)
        .eq("id", existing.id);
      if (updateError) {
        await logError(ERR.DB_ERROR, "error", {
          route: "/api/admin/users",
          op: "PATCH-update",
          user_id: userId,
          detail: updateError.message,
        });
        return errorJson(ERR.DB_ERROR, "Error actualitzant la subscripció", 500);
      }
    }

    await logError("ADM-USERS-PLAN-CHANGED", "info", {
      admin_id: auth.userId,
      user_id: userId,
      changes: { plan: updates.plan, status: updates.status },
    });

    return Response.json({ ok: true, user_id: userId, ...updates });
  } catch (e) {
    await logError(ERR.DB_ERROR, "critical", {
      route: "/api/admin/users",
      op: "PATCH",
      detail: String(e),
    });
    return errorJson(ERR.DB_ERROR, "Error intern", 500);
  }
}
