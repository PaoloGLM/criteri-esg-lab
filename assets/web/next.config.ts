import type { NextConfig } from "next";

/**
 * Capçaleres de seguretat HTTP aplicades a totes les rutes.
 *
 * - HSTS: força HTTPS (Vercel ja ho fa, però així ho garantim)
 * - X-Content-Type-Options: prevé MIME sniffing
 * - X-Frame-Options: SAMEORIGIN (mai embeddable des de tercers). 'self' és
 *   necessari per a l'editor visual /admin/visual, que carrega la pàgina real
 *   en un iframe same-origin (simulador tipus WP). Contra clickjacking de
 *   tercers protegeix igual que DENY.
 * - Referrer-Policy: només envia l'origen a altres sites
 * - Permissions-Policy: desactiva API del navegador que no usem
 * - Content-Security-Policy: prevé XSS i injecció de scripts externs
 *
 * NOTA sobre la CSP:
 *   - 'unsafe-inline' a script-src i style-src és necessari perquè Next.js
 *     injecta estils i scripts inline. En el futur es pot migrar a nonces.
 *   - connect-src permet https://*.supabase.co per quan Supabase es configuri.
 *   - img-src permet 'self' data: https: perquè alguns informes tenen imatges
 *     externes (URLs de fonts institucionals).
 *   - frame-ancestors 'self': embeddable només same-origin (editor visual
 *     /admin/visual). Contra clickjacking de tercers protegeix igual que 'none'.
 */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    // Mai ignorar errors TypeScript en build. Si hi ha errors, el build ha de fallar.
    ignoreBuildErrors: false,
  },
  // Strict mode activat per detectar bugs en desenvolupament.
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
