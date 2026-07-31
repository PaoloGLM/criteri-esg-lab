import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/brevo-subscribe
 *
 * Afegeix un contacte a la llista "Criteri ESG Newsletter" de Brevo.
 * Es crida després del registre d'usuari (Supabase Auth signUp).
 *
 * Input JSON:
 *   - email: string
 *   - name: string (opcional)
 *   - lang: "ca" | "es" (per segmentar)
 *
 * També es pot cridar directament des del formulari de newsletter
 * de la homepage (sense necessitat de registre a Supabase).
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
const BREVO_LIST_NAME = "Criteri ESG Newsletter";

export async function POST(req: NextRequest) {
  try {
    const { email, name, lang } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email requerit" }, { status: 400 });
    }

    if (!BREVO_API_KEY) {
      console.error("[brevo-subscribe] BREVO_API_KEY no configurada");
      return NextResponse.json({ error: "Servidor no configurat" }, { status: 500 });
    }

    // 1. Buscar o crear la llista
    const listRes = await fetch("https://api.brevo.com/v3/contacts/lists?limit=50", {
      headers: { "api-key": BREVO_API_KEY, "accept": "application/json" },
    });

    let listId: number | null = null;
    if (listRes.ok) {
      const lists = await listRes.json();
      const found = lists.lists?.find((l: any) => l.name === BREVO_LIST_NAME);
      if (found) listId = found.id;
    }

    if (!listId) {
      // Crear la llista
      const createRes = await fetch("https://api.brevo.com/v3/contacts/lists", {
        method: "POST",
        headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ name: BREVO_LIST_NAME, folderId: 1 }),
      });
      if (createRes.ok) {
        listId = (await createRes.json()).id;
      }
    }

    if (!listId) {
      throw new Error("No s'ha pogut trobar/crear la llista de Brevo");
    }

    // 2. Afegir el contacte a la llista
    const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        listIds: [listId],
        updateEnabled: true,
        attributes: {
          NOM: name || "",
          IDIOMA: lang || "es",
        },
      }),
    });

    if (contactRes.status === 201) {
      console.log(`[brevo-subscribe] Contacte afegit: ${email}`);
      return NextResponse.json({ success: true, message: "Subscrit a la newsletter" });
    } else if (contactRes.status === 204) {
      // Ja existia, actualitzat
      console.log(`[brevo-subscribe] Contacte actualitzat: ${email}`);
      return NextResponse.json({ success: true, message: "Contacte actualitzat" });
    } else {
      const errText = await contactRes.text();
      console.error(`[brevo-subscribe] Error Brevo: ${contactRes.status} ${errText.substring(0, 200)}`);
      return NextResponse.json(
        { error: "Error afegint a la llista de correu" },
        { status: 500 }
      );
    }
  } catch (e: any) {
    console.error("[brevo-subscribe] Error:", e);
    return NextResponse.json(
      { error: e?.message || "Error intern" },
      { status: 500 }
    );
  }
}
