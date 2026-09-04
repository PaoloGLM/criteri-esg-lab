import { NextRequest } from "next/server";
import { requireAdmin, errorJson, logError, ERR } from "@/lib/admin-auth";

/**
 * GET  /api/admin/reports        → llista tots els informes (inclosos drafts)
 * POST /api/admin/reports        → crea informe nou
 *
 * Seguretat: requireAdmin valida JWT + rol admin server-side.
 */

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return errorJson(
      auth.errorId!,
      auth.errorId === ERR.NO_SESSION
        ? "Sessió no vàlida"
        : auth.errorId === ERR.NOT_ADMIN
          ? "Accés restringit a administradors"
          : "Error de configuració del servidor",
      auth.status!
    );
  }

  try {
    const { data, error } = await auth
      .client!.from("informes")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      await logError(ERR.DB_ERROR, "error", {
        route: "/api/admin/reports",
        op: "GET",
        detail: error.message,
      });
      return errorJson(ERR.DB_ERROR, "Error llegint informes", 500);
    }

    return Response.json({ reports: data ?? [] });
  } catch (e) {
    await logError(ERR.DB_ERROR, "critical", {
      route: "/api/admin/reports",
      op: "GET",
      detail: String(e),
    });
    return errorJson(ERR.DB_ERROR, "Error intern", 500);
  }
}

// ── Validació de dades d'entrada ─────────────────────────────────────
const VALID_TYPES = ["regulatory", "framework", "rating", "industry", "official"];
const VALID_SCOPES = ["CAT", "ES", "EU", "GLOBAL"];
const VALID_STATUS = ["draft", "validated", "published", "archived"];

function validateReportPayload(body: Record<string, unknown>): string | null {
  if (!body.slug || typeof body.slug !== "string")
    return "Cal un identificador (slug) únic, ex: 'cnmv-informe-2026'";
  if (!/^[a-z0-9-]{3,80}$/.test(body.slug))
    return "El slug només pot tenir lletres minúscules, números i guions";
  if (!body.title || typeof body.title !== "string")
    return "Cal un títol";
  if (!body.institution || typeof body.institution !== "string")
    return "Cal una institució";
  if (!body.date || typeof body.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(body.date))
    return "Cal una data vàlida (YYYY-MM-DD)";
  if (body.type && !VALID_TYPES.includes(String(body.type))) return "Tipus invàlid";
  if (body.scope && !VALID_SCOPES.includes(String(body.scope))) return "Àmbit invàlid";
  if (body.status && !VALID_STATUS.includes(String(body.status))) return "Estat invàlid";
  return null;
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return errorJson(
      auth.errorId!,
      "Accés denegat",
      auth.status!
    );
  }

  try {
    const body = await req.json();

    const validationError = validateReportPayload(body);
    if (validationError) {
      return errorJson(ERR.VALIDATION, validationError, 400);
    }

    const { data, error } = await auth.client!
      .from("informes")
      .insert({
        slug: body.slug,
        title: body.title,
        institution: body.institution,
        date: body.date,
        pages: Number(body.pages) || 0,
        type: body.type || "official",
        scope: body.scope || "EU",
        tags: Array.isArray(body.tags) ? body.tags : [],
        certifications: Array.isArray(body.certifications) ? body.certifications : [],
        summary: body.summary || "",
        url: body.url || "",
        content_ca: body.content_ca || null,
        content_es: body.content_es || null,
        status: body.status || "draft",
      })
      .select()
      .single();

    if (error) {
      const isDuplicate = error.code === "23505";
      await logError(
        isDuplicate ? ERR.VALIDATION : ERR.DB_ERROR,
        isDuplicate ? "warning" : "error",
        { route: "/api/admin/reports", op: "POST", detail: error.message }
      );
      return errorJson(
        isDuplicate ? ERR.VALIDATION : ERR.DB_ERROR,
        isDuplicate
          ? `Ja existeix un informe amb el slug "${body.slug}"`
          : "Error creant l'informe",
        isDuplicate ? 409 : 500
      );
    }

    return Response.json({ report: data }, { status: 201 });
  } catch (e) {
    await logError(ERR.DB_ERROR, "critical", {
      route: "/api/admin/reports",
      op: "POST",
      detail: String(e),
    });
    return errorJson(ERR.DB_ERROR, "Error intern", 500);
  }
}
