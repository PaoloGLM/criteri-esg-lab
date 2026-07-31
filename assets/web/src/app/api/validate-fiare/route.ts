import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/validate-fiare
 *
 * Rep un justificant de transferència (PDF o imatge), l'envia a Gemini per OCR,
 * valida que 4 de 5 camps siguin correctes, i si tot OK activa Premium.
 *
 * Els 5 camps a validar:
 * 1. Import (348€ o 440€)
 * 2. Transferència immediata ("inmediata" o "immediate")
 * 3. IBAN destí (ES77 2100 3000 7422 0123 4567)
 * 4. Existència del nom d'un banc (qualsevol banc)
 * 5. Concepte amb email de l'usuari
 *
 * Si 4 de 5 són correctes → activar Premium
 * Si no → retornar error amb missatge
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const EXPECTED_IBAN = "ES7721003000742201234567";
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileBase64, fileName, fileType, userEmail, userId } = body;

    if (!fileBase64 || !userEmail || !userId) {
      return NextResponse.json(
        { error: "Falten dades: fileBase64, userEmail, userId" },
        { status: 400 }
      );
    }

    const geminiResult = await validateWithGemini(fileBase64, fileType, userEmail);
    const checks = geminiResult.checks;
    const correctCount = Object.values(checks).filter(Boolean).length;

    console.log(`[validate-fiare] Usuari ${userEmail}: ${correctCount}/5 camps correctes`);

    if (correctCount >= 4) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: { plan: "premium", payment_method: "fiare", payment_date: new Date().toISOString() } }
      );

      if (updateError) {
        console.error("[validate-fiare] Error Supabase:", updateError);
        return NextResponse.json(
          { error: "Error activant Premium. Contacta amb info@criteriesg.com." },
          { status: 500 }
        );
      }

      try {
        await supabase.from("payments_fiare").insert({
          user_id: userId,
          user_email: userEmail,
          file_name: fileName,
          amount: "348",
          status: "validated_auto",
          checks: checks,
          created_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn("[validate-fiare] No s'ha pogut registrar a payments_fiare:", e);
      }

      return NextResponse.json({
        success: true,
        message: "Justificante validado. Acceso Premium activado.",
        checks,
        correctCount,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "No se ha podido validar el justificante. Verifica que el documento contenga: importe correcto, IBAN de destino, nombre del banco, concepto con tu email y que sea transferencia inmediata. Si crees que es un error, escribenos a info@criteriesg.com.",
        checks,
        correctCount,
      });
    }
  } catch (e: any) {
    console.error("[validate-fiare] Error:", e);
    return NextResponse.json(
      { error: e?.message || "Error intern del servidor" },
      { status: 500 }
    );
  }
}

async function validateWithGemini(fileBase64: string, fileType: string, userEmail: string) {
  const { GoogleAuth } = require("google-auth-library");
  const auth = new GoogleAuth({
    keyFile: "/home/z/my-project/.gcp-service-account.json",
    scopes: "https://www.googleapis.com/auth/cloud-platform",
  });
  const client = await auth.getClient();
  const token = (await client.getAccessToken()).token;

  const url = `https://europe-west1-aiplatform.googleapis.com/v1/projects/criteri-esg/locations/europe-west1/publishers/google/models/gemini-2.5-flash:generateContent`;

  const inlineData = {
    mimeType: fileType || "application/pdf",
    data: fileBase64,
  };

  const prompt = `Analitza aquest justificant de transferència bancària i extreu la següent informació. Torna un JSON vàlid amb aquesta estructura exacta:

{
  "amount": "import extret del document (només el número)",
  "is_immediate": true/false,
  "iban_destination": "IBAN de destí extret (sense espais)",
  "bank_name": "nom del banc emissor extret",
  "concept": "concepte de la transferència extret",
  "checks": {
    "amount_correct": true/false,
    "is_immediate": true/false,
    "iban_correct": true/false,
    "bank_name_present": true/false,
    "concept_has_email": true/false
  }
}

Criteris de validació:
- amount_correct: true si l'import és 348 o 440 (o variants amb decimals)
- is_immediate: true si el document menciona "inmediata", "immediate", "instantánea" o similar
- iban_correct: true si l'IBAN de destí conté "ES7721003000742201234567" (amb o sense espais)
- bank_name_present: true si es detecta el nom de qualsevol banc (Fiare, BBVA, Santander, CaixaBank, etc.)
- concept_has_email: true si el concepte conté un email (format xxx@xxx.xxx)

Email esperat al concepte: ${userEmail}

Torna NOMÉS el JSON, sense markdown ni text addicional.`;

  const payload = {
    contents: [{
      role: "user",
      parts: [
        { text: prompt },
        { inlineData: inlineData },
      ],
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 1000,
      response_mime_type: "application/json",
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini HTTP ${response.status}: ${errText.substring(0, 300)}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      throw new Error("Gemini no ha retornat JSON vàlid");
    }
  }

  if (!parsed.checks) {
    const amountStr = String(parsed.amount || "").replace(/\s/g, "").replace(",", ".");
    const ibanStr = String(parsed.iban_destination || "").replace(/\s/g, "");
    const conceptStr = String(parsed.concept || "").toLowerCase();

    parsed.checks = {
      amount_correct: /348|440/.test(amountStr),
      is_immediate: parsed.is_immediate === true || /inmediat|immediate|instant/i.test(conceptStr),
      iban_correct: ibanStr.includes(EXPECTED_IBAN),
      bank_name_present: !!parsed.bank_name && parsed.bank_name.length > 2,
      concept_has_email: EMAIL_REGEX.test(conceptStr) && conceptStr.includes(userEmail.toLowerCase()),
    };
  }

  return parsed;
}
