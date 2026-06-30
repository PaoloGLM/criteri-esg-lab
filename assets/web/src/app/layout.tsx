import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/components/language-provider";

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
  title: "Criteri ESG — Intel·ligència per a decisions ètiques",
  description:
    "Criteri ESG converteix informes institucionals, frameworks i certificacions en accions concretes per a directors de sostenibilitat i consultories.",
  keywords: ["ESG", "Sostenibilitat", "CSRD", "EcoVadis", "B Corp", "Criteri"],
  authors: [{ name: "Criteri ESG" }],
  openGraph: {
    title: "Criteri ESG — Intel·ligència per a decisions ètiques",
    description: "Cada informe, cada certificació, cada framework — sintetitzats en 5 minuts.",
    url: "https://criteriesg.com",
    siteName: "Criteri ESG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ca" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} antialiased bg-background text-foreground`}
      >
        <LanguageProvider>{children}</LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
