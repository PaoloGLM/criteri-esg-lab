import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, errorJson, ERR } from "@/lib/admin-auth";
import { readTheme, mergeTheme, THEME_DEFAULTS } from "@/lib/theme-server";

/**
 * GET/PUT /api/admin/theme — tema del site (colors, tipografies)
 * Emmagatzemat: Storage bucket "media", fitxer theme.json.
 * GET: públic (el tema és informació pública; el layout també el llegeix).
 * PUT: només admin (requireAdmin valida el JWT server-side).
 * mergeTheme (theme-server) sanititza els valors abans de guardar.
 */
export const dynamic = "force-dynamic";

const THEME_PATH = "theme.json";

export async function GET() {
  return NextResponse.json(await readTheme());
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok || !auth.client) return errorJson(ERR.NO_SESSION, "Sessió no vàlida", 401);

  try {
    const body = await req.json();
    const current = await readTheme();
    const next = mergeTheme(current, body);
    const { error } = await auth.client.storage.from("media").upload(THEME_PATH, JSON.stringify(next, null, 2), {
      contentType: "application/json",
      upsert: true,
      cacheControl: "60",
    });
    if (error) return errorJson(ERR.DB_ERROR, "No s'ha pogut guardar el tema", 500);
    return NextResponse.json(next);
  } catch {
    return errorJson(ERR.VALIDATION, "Cos de petició no vàlid", 400);
  }
}
