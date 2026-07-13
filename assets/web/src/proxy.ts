import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Credencials d'accés — canvia-les quan vulguis
const USERNAME = process.env.SITE_USERNAME || "criteri";
const PASSWORD = process.env.SITE_PASSWORD || "esg2026";

export function proxy(request: NextRequest) {
  // Comprovar si ja està autenticat
  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    const [type, credentials] = authHeader.split(" ");
    if (type === "Basic") {
      const decoded = Buffer.from(credentials, "base64").toString("utf-8");
      const [user, pass] = decoded.split(":");
      if (user === USERNAME && pass === PASSWORD) {
        return NextResponse.next();
      }
    }
  }

  // No autenticat — demanar credencials
  return new NextResponse("Autenticacio necessaria", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Criteri ESG"',
    },
  });
}

export const config = {
  // Aplicar a totes les rutes excepte arxius estàtics
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg|robots.txt|llms.txt|fiare-form-mockup.html|registro-mockup.html|cuenta-mockup.html).*)"],
};
