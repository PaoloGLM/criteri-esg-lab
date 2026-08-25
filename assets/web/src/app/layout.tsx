import type { Metadata } from "next";
import { Newsreader, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./v1.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/components/language-provider";
import { AuthProvider } from "@/lib/auth-context";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
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

/* AEO: FAQPage global — respostes directes citables pels motors d'IA */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Què és Criteri ESG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Criteri ESG és un servei que converteix informes institucionals ESG de 80+ pàgines en resums accionables de 5 minuts, amb verificació a pàgina exacta i creuament amb 16 estàndards de sostenibilitat (CSRD/ESRS, GRI, EcoVadis, B Corp, MSCI, CSDDD, SFDR, Taxonomia UE, TCFD, TNFD i més).",
      },
    },
    {
      "@type": "Question",
      name: "Quant costa Criteri ESG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gratuït per a l'arxiu (informes de més de 6 mesos) i la newsletter bimensual. Premium 440€/any (36,67€/mes, impostos inclosos), amb early bird de 290€/any de per vida per als primers 50 subscriptors (24,17€/mes).",
      },
    },
    {
      "@type": "Question",
      name: "Quina metodologia fa servir Criteri ESG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Doble filtre amb dos models d'IA (un destil·la, un fa d'advocat del diable), entorn tancat sense invenció, cada afirmació amb la pàgina exacta citada, inferència marcada com a tal, i validació humana obligatòria abans de publicar. Màxim 1.100 paraules per informe.",
      },
    },
    {
      "@type": "Question",
      name: "Què és el semàfor metodològic de Criteri ESG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Una nota A-D que avalua la qualitat metodològica de cada informe original en 10 segons, amb 5 indicadors públics. Regla: A = 5 verds, B = 4 verds + 1 groc, C ≤ 1 vermell, D = 2+ vermells. El mateix criteri per a tots els informes, auditable.",
      },
    },
    {
      "@type": "Question",
      name: "Per a qui és Criteri ESG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Per a directors de sostenibilitat, consultors ESG, compliance officers i equips que necessiten decidir cada setmana amb el context regulatori actualitzat. També per a ONG i sector públic.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
      </head>
      <body
        className={`${newsreader.variable} ${dmSans.variable} ${jetbrains.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
