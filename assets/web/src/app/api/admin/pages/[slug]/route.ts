import { NextRequest } from "next/server";
import { requireAdmin, errorJson, logError, ERR } from "@/lib/admin-auth";

/**
 * GET  /api/admin/pages/[slug] → contingut actual de la pàgina (tots els estats)
 * PUT  /api/admin/pages/[slug] → guarda content_ca / content_es
 *
 * Body PUT: { content_ca?: { sections: {...} }, content_es?: { sections: {...} } }
 * Seguretat: requireAdmin valida JWT + rol admin server-side.
 */

export const dynamic = "force-dynamic";

const VALID_SLUGS = ["qui-som", "que-fem"];

function validateSections(json: unknown): string | null {
  if (json === null || json === undefined) return null; // camp opcional
  if (typeof json !== "object" || Array.isArray(json)) return "sections ha de ser un objecte";
  const sections = (json as { sections?: unknown }).sections;
  if (!sections || typeof sections !== "object" || Array.isArray(sections))
    return "Cal { sections: { [id]: html } }";
  for (const [k, v] of Object.entries(sections as Record<string, unknown>)) {
    if (typeof v !== "string") return `La secció '${k}' ha de contenir HTML (string)`;
    if (v.length > 200_000) return `La secció '${k}' és massa gran (màx 200KB)`;
  }
  return null;
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
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

  const { slug } = await ctx.params;
  if (!VALID_SLUGS.includes(slug)) {
    return errorJson(ERR.VALIDATION, `Pàgina desconeguda: ${slug}`, 400);
  }

  try {
    const { data, error } = await auth
      .client!.from("pages")
      .select("slug, status, content_ca, content_es, updated_at")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      await logError(ERR.DB_ERROR, "error", {
        route: "/api/admin/pages/[slug]",
        op: "GET",
        detail: error.message,
      });
      return errorJson(ERR.DB_ERROR, "Error llegint la pàgina", 500);
    }

    // Si encara no existeix la fila (taula nova), responem buit sense fallar
    return Response.json({ page: data ?? { slug, status: null, content_ca: null, content_es: null } });
  } catch (e) {
    await logError(ERR.DB_ERROR, "critical", {
      route: "/api/admin/pages/[slug]",
      op: "GET",
      detail: String(e),
    });
    return errorJson(ERR.DB_ERROR, "Error intern", 500);
  }
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
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

  const { slug } = await ctx.params;
  if (!VALID_SLUGS.includes(slug)) {
    return errorJson(ERR.VALIDATION, `Pàgina desconeguda: ${slug}`, 400);
  }

  try {
    const body = (await req.json()) as {
      content_ca?: unknown;
      content_es?: unknown;
      status?: unknown;
    };

    const errCa = validateSections(body.content_ca);
    if (errCa) return errorJson(ERR.VALIDATION, `content_ca: ${errCa}`, 400);
    const errEs = validateSections(body.content_es);
    if (errEs) return errorJson(ERR.VALIDATION, `content_es: ${errEs}`, 400);

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.content_ca !== undefined) patch.content_ca = body.content_ca;
    if (body.content_es !== undefined) patch.content_es = body.content_es;
    if (body.status !== undefined) {
      if (!["draft", "published", "archived"].includes(String(body.status)))
        return errorJson(ERR.VALIDATION, "status invàlid", 400);
      patch.status = body.status;
    }

    const { error } = await auth.client!.from("pages").upsert(
      { slug, ...patch },
      { onConflict: "slug" }
    );

    if (error) {
      await logError(ERR.DB_ERROR, "error", {
        route: "/api/admin/pages/[slug]",
        op: "PUT",
        detail: error.message,
      });
      // 42P01 = taula inexistent (SQL fase 3 encara per executar)
      const msg =
        error.code === "42P01"
          ? "La taula 'pages' encara no existeix — executa primer el SQL de la fase 3"
          : "Error guardant la pàgina";
      return errorJson(ERR.DB_ERROR, msg, 500);
    }

    await logError("ADM-PAGES-SAVE", "info", {
      route: "/api/admin/pages/[slug]",
      op: "PUT",
      slug,
      by: auth.userId,
    });
    return Response.json({ ok: true });
  } catch (e) {
    await logError(ERR.DB_ERROR, "critical", {
      route: "/api/admin/pages/[slug]",
      op: "PUT",
      detail: String(e),
    });
    return errorJson(ERR.DB_ERROR, "Error intern", 500);
  }
}
