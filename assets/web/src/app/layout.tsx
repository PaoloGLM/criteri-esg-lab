import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/components/language-provider";
import { AuthProvider } from "@/lib/auth-context";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Criteri ESG · Informes ESG sintetitzats per a professionals",
    template: "%s · Criteri ESG",
  },
  description:
    "Criteri ESG sintetitza informes institucionals ESG en 8 blocs accionables: Semàfor Metodològic, dades clau, implicacions, accions recomanades i cross-reference amb EcoVadis, B Corp, MSCI i GRI.",
  keywords: [
    "ESG",
    "CSRD",
    "ESRS",
    "EcoVadis",
    "B Corp",
    "MSCI ESG",
    "GRI",
    "TCFD",
    "SFDR",
    "CSDDD",
    "sostenibilitat",
    "informes ESG",
    "Criteri ESG",
  ],
  authors: [{ name: "Criteri ESG" }],
  creator: "Criteri ESG",
  publisher: "Criteri ESG",
  metadataBase: new URL("https://criteriesg.com"),
  alternates: {
    canonical: "/",
    languages: {
      "ca-ES": "/",
      "es-ES": "/",
    },
  },
  openGraph: {
    title: "Criteri ESG · Informes ESG sintetitzats per a professionals",
    description:
      "Cada informe institucional ESG, sintetitzat en 5 minuts. Semàfor Metodològic, accions recomanades i cross-reference amb EcoVadis, B Corp, MSCI i GRI.",
    url: "https://criteriesg.com",
    siteName: "Criteri ESG",
    locale: "ca_ES",
    alternateLocale: ["es_ES"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Criteri ESG · Informes ESG sintetitzats per a professionals",
    description:
      "Cada informe institucional ESG, sintetitzat en 5 minuts. Semàfor Metodològic, accions i cross-reference amb certificacions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Criteri ESG",
  url: "https://criteriesg.com",
  logo: "https://criteriesg.com/logo.svg",
  description:
    "Servei d'intel·ligència ESG que sintetitza informes institucionals en 8 blocs accionables per a directors de sostenibilitat i consultories.",
  email: "info@criteriesg.com",
  foundingDate: "2026",
  knowsAbout: [
    "ESG",
    "CSRD",
    "ESRS",
    "EcoVadis",
    "B Corp",
    "MSCI ESG",
    "GRI",
    "TCFD",
    "TNFD",
    "SFDR",
    "CSDDD",
    "Sostenibilitat empresarial",
    "Due diligence",
  ],
  sameAs: ["https://github.com/PaoloGLM/criteri-esg-lab"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Criteri ESG",
  url: "https://criteriesg.com",
  inLanguage: ["ca", "es"],
  publisher: {
    "@type": "Organization",
    name: "Criteri ESG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ca" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
