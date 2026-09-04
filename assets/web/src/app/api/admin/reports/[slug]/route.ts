import { NextRequest } from "next/server";
import { requireAdmin, errorJson, logError, ERR } from "@/lib/admin-auth";

/**
 * PATCH  /api/admin/reports/[slug]  → edita un informe (parcial)
 * DELETE /api/admin/reports/[slug]  → esborra un informe
 *
 * Seguretat: requireAdmin valida JWT + rol admin server-side.
 * Notes:
 * - Eliminar un informe published el treu de la web immediatament.
 * - Els canvis de slug no estan permesos (trencarien enllaços públics).
 */

export const dynamic = "force-dynamic";

const VALID_TYPES = ["regulatory", "framework", "rating", "industry", "official"];
const VALID_SCOPES = ["CAT", "ES", "EU", "GLOBAL"];
const VALID_STATUS = ["draft", "validated", "published", "archived"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return errorJson(auth.errorId!, "Accés denegat", auth.status!);

  try {
    const { slug } = await params;
    const body = await req.json();

    // Validacions de seguretat i integritat
    const updates: Record<string, unknown> = {};

    if (body.slug !== undefined) {
      return errorJson(
        ERR.VALIDATION,
        "El slug no es pot canviar (trencaria els enllaços públics). Esborra i crea un d'informe si cal.",
        400
      );
    }
    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim())
        return errorJson(ERR.VALIDATION, "Títol invàlid", 400);
      updates.title = body.title.trim();
    }
    if (body.institution !== undefined) {
      if (typeof body.institution !== "string" || !body.institution.trim())
        return errorJson(ERR.VALIDATION, "Institució invàlida", 400);
      updates.institution = body.institution.trim();
    }
    if (body.date !== undefined) {
      if (typeof body.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(body.date))
        return errorJson(ERR.VALIDATION, "Data invàlida (YYYY-MM-DD)", 400);
      updates.date = body.date;
    }
    if (body.pages !== undefined) {
      const pages = Number(body.pages);
      if (!Number.isFinite(pages) || pages < 0 || pages > 10000)
        return errorJson(ERR.VALIDATION, "Nombre de pàgines invàlid", 400);
      updates.pages = Math.round(pages);
    }
    if (body.type !== undefined) {
      if (!VALID_TYPES.includes(String(body.type)))
        return errorJson(ERR.VALIDATION, "Tipus invàlid", 400);
      updates.type = body.type;
    }
    if (body.scope !== undefined) {
      if (!VALID_SCOPES.includes(String(body.scope)))
        return errorJson(ERR.VALIDATION, "Àmbit invàlid", 400);
      updates.scope = body.scope;
    }
    if (body.status !== undefined) {
      if (!VALID_STATUS.includes(String(body.status)))
        return errorJson(ERR.VALIDATION, "Estat invàlid", 400);
      updates.status = body.status;
    }
    if (body.tags !== undefined) {
      if (!Array.isArray(body.tags))
        return errorJson(ERR.VALIDATION, "Tags han de ser una llista", 400);
      updates.tags = body.tags.map(String).slice(0, 20);
    }
    if (body.certifications !== undefined) {
      if (!Array.isArray(body.certifications))
        return errorJson(ERR.VALIDATION, "Certificacions han de ser una llista", 400);
      updates.certifications = body.certifications.map(String).slice(0, 30);
    }
    if (body.summary !== undefined) {
      if (typeof body.summary !== "string" || body.summary.length > 2000)
        return errorJson(ERR.VALIDATION, "Resum invàlid (màx 2000 caràcters)", 400);
      updates.summary = body.summary;
    }
    if (body.url !== undefined) {
      if (typeof body.url !== "string" || body.url.length > 2000)
        return errorJson(ERR.VALIDATION, "URL invàlida", 400);
      updates.url = body.url;
    }
    if (body.content_ca !== undefined) {
      if (typeof body.content_ca !== "object" || body.content_ca === null)
        return errorJson(ERR.VALIDATION, "content_ca ha de ser un objecte JSON", 400);
      updates.content_ca = body.content_ca;
    }
    if (body.content_es !== undefined) {
      if (typeof body.content_es !== "object" || body.content_es === null)
        return errorJson(ERR.VALIDATION, "content_es ha de ser un objecte JSON", 400);
      updates.content_es = body.content_es;
    }

    if (Object.keys(updates).length === 0) {
      return errorJson(ERR.VALIDATION, "Cap camp vàlid per actualitzar", 400);
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await auth.client!
      .from("informes")
      .update(updates)
      .eq("slug", slug)
      .select()
      .single();

    if (error) {
      const notFound = error.code === "PGRST116";
      await logError(
        notFound ? ERR.VALIDATION : ERR.DB_ERROR,
        notFound ? "warning" : "error",
        { route: "/api/admin/reports/[slug]", op: "PATCH", slug, detail: error.message }
      );
      return errorJson(
        notFound ? ERR.VALIDATION : ERR.DB_ERROR,
        notFound ? `No existeix l'informe "${slug}"` : "Error actualitzant l'informe",
        notFound ? 404 : 500
      );
    }

    return Response.json({ report: data });
  } catch (e) {
    await logError(ERR.DB_ERROR, "critical", {
      route: "/api/admin/reports/[slug]",
      op: "PATCH",
      detail: String(e),
    });
    return errorJson(ERR.DB_ERROR, "Error intern", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return errorJson(auth.errorId!, "Accés denegat", auth.status!);

  try {
    const { slug } = await params;

    const { error } = await auth.client!
      .from("informes")
      .delete()
      .eq("slug", slug);

    if (error) {
      await logError(ERR.DB_ERROR, "error", {
        route: "/api/admin/reports/[slug]",
        op: "DELETE",
        slug,
        detail: error.message,
      });
      return errorJson(ERR.DB_ERROR, "Error esborrant l'informe", 500);
    }

    return Response.json({ ok: true, slug });
  } catch (e) {
    await logError(ERR.DB_ERROR, "critical", {
      route: "/api/admin/reports/[slug]",
      op: "DELETE",
      detail: String(e),
    });
    return errorJson(ERR.DB_ERROR, "Error intern", 500);
  }
}
