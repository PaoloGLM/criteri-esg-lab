import { NextRequest } from "next/server";
import { serviceClient, logError, errorJson, ERR } from "@/lib/admin-auth";
import { normalizeReportBlock } from "@/lib/report-normalize";

/**
 * POST /api/admin/reports/import
 *
 * Porta d'entrada del pipeline d'informes (scripts Python).
 *
 * A diferència de la resta de rutes /api/admin (que exigeixen sessió admin
 * JWT), aquesta s'autentica amb un SECRET DE SERVEI compartit (header
 * `X-Pipeline-Secret`), pensat per ser usat per processos automatitzats que
 * no tenen sessió humana.
 *
 * Restricció de seguretat FONAMENTAL: aquest endpoint NOMÉS pot crear o
 * actualitzar informes en estat "draft". El pas a "published" requereix
 * SEMPRE la sessió admin real de Paolo (ruta PATCH normal). Així, encara
 * que el secret es filtrés, ningú no podria publicar contingut sense que
 * Paolo ho validés manualment.
 */

export const dynamic = "force-dynamic";

const VALID_TYPES = ["regulatory", "framework", "rating", "industry", "official"];
const VALID_SCOPES = ["CAT", "ES", "EU", "GLOBAL"];

export async function POST(req: NextRequest) {
  // 0. Secret de servei present i correcte?
  const secret = process.env.PIPELINE_API_SECRET;
  if (!secret) {
    await logError(ERR.SERVER_CONFIG, "critical", {
      route: "/api/admin/reports/import",
      detail: "Falta PIPELINE_API_SECRET a les env vars del servidor",
    });
    return errorJson(ERR.SERVER_CONFIG, "Import no configurat al servidor", 503);
  }

  const provided = req.headers.get("x-pipeline-secret") || "";
  // Comparació en temps constant per no filtrar per timing
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  const match = a.length === b.length && a.length > 0 && (() => {
    let ok = 0;
    for (let i = 0; i < a.length; i++) ok |= a[i] ^ b[i];
    return ok === 0;
  })();
  if (!match) {
    await logError(ERR.NO_SESSION, "warning", {
      route: "/api/admin/reports/import",
      detail: "Secret de pipeline invàlid",
    });
    return errorJson(ERR.NO_SESSION, "Secret de pipeline invàlid", 401);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorJson(ERR.VALIDATION, "Cos JSON invàlid", 400);
  }

  // 1. Validació de metadades (mateixa que la ruta POST normal)
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const institution = typeof body.institution === "string" ? body.institution.trim() : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";

  if (!/^[a-z0-9-]{3,80}$/.test(slug))
    return errorJson(ERR.VALIDATION, "Slug invàlid", 400);
  if (!title) return errorJson(ERR.VALIDATION, "Cal un títol", 400);
  if (!institution) return errorJson(ERR.VALIDATION, "Cal una institució", 400);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    return errorJson(ERR.VALIDATION, "Data invàlida (YYYY-MM-DD)", 400);

  const type = (body.type as string) || "official";
  const scope = (body.scope as string) || "EU";
  if (!VALID_TYPES.includes(type)) return errorJson(ERR.VALIDATION, "Tipus invàlid", 400);
  if (!VALID_SCOPES.includes(scope)) return errorJson(ERR.VALIDATION, "Àmbit invàlid", 400);

  // 2. Normalització del contingut (els JSON del pipeline tenen variants CA/ES)
  const contentCa = normalizeReportBlock(body.content_ca);
  const contentEs = normalizeReportBlock(body.content_es);
  if (!contentCa || !contentEs)
    return errorJson(
      ERR.VALIDATION,
      "content_ca i content_es han de ser objectes JSON vàlids",
      400
    );

  const row = {
    slug,
    title,
    institution,
    date,
    pages: Number(body.pages) || 0,
    type,
    scope,
    tags: Array.isArray(body.tags) ? body.tags.map(String).slice(0, 20) : [],
    certifications: Array.isArray(body.certifications)
      ? body.certifications.map(String).slice(0, 30)
      : [],
    summary: typeof body.summary === "string" ? body.summary.slice(0, 2000) : "",
    url: typeof body.url === "string" ? body.url.slice(0, 2000) : "",
    content_ca: contentCa,
    content_es: contentEs,
    status: "draft", // SEMPRE draft — mai publicat des d'aquí
    updated_at: new Date().toISOString(),
  };

  const client = serviceClient();

  try {
    // Upsert: si el slug ja existeix, l'actualitzem (mantenim l'estat actual
    // tret que sigui "published": un informe publicat no es pot sobrescriure
    // pel pipeline — caldria revertir-lo manualment a l'admin primer).
    const { data: existing } = await client
      .from("informes")
      .select("status")
      .eq("slug", slug)
      .maybeSingle();

    if (existing && existing.status === "published") {
      return errorJson(
        ERR.VALIDATION,
        `L'informe "${slug}" ja està publicat; el pipeline no pot sobrescriure'l. Reverteix-lo a draft des de l'admin primer.`,
        409
      );
    }

    if (existing) {
      const { error } = await client
        .from("informes")
        .update(row)
        .eq("slug", slug);
      if (error) {
        await logError(ERR.DB_ERROR, "error", {
          route: "/api/admin/reports/import",
          op: "UPDATE",
          slug,
          detail: error.message,
        });
        return errorJson(ERR.DB_ERROR, "Error actualitzant l'informe", 500);
      }
    } else {
      const { error } = await client.from("informes").insert(row);
      if (error) {
        await logError(ERR.DB_ERROR, "error", {
          route: "/api/admin/reports/import",
          op: "INSERT",
          slug,
          detail: error.message,
        });
        return errorJson(ERR.DB_ERROR, "Error creant l'informe", 500);
      }
    }

    return Response.json({ ok: true, slug, status: "draft" }, { status: 201 });
  } catch (e) {
    await logError(ERR.DB_ERROR, "critical", {
      route: "/api/admin/reports/import",
      op: "UPSERT",
      slug,
      detail: String(e),
    });
    return errorJson(ERR.DB_ERROR, "Error intern", 500);
  }
}
