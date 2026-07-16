"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { MidSections } from "@/components/sections/mid-sections";
import { ReportsPreview } from "@/components/sections/reports-preview";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const router = useRouter();
  const { user, plan } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);

  /**
   * Obre el diàleg d'autenticació. Si l'usuari ja està loguejat:
   *  - Si és free → obre PreusDialog (per fer-se Premium)
   *  - Si és premium → no fa res (no hauria d'arribar aquí perquè els
   *    botons condicionals ja no es mostren)
   */
  const openAuth = (tab: "register" | "login" = "register") => {
    if (user) {
      if (plan === "free") {
        setPreusOpen(true);
      }
      return;
    }
    setAuthTab(tab);
    setAuthOpen(true);
  };

  /**
   * Obre PreusDialog (per a usuaris loguejats free que volen fer-se Premium).
   * Si l'usuari no està loguejat, obre el diàleg d'autenticació primer.
   */
  const openPreusOrAuth = () => {
    if (user) {
      setPreusOpen(true);
    } else {
      openAuth("register");
    }
  };

  const handleOpenLatestReport = () => {
    router.push("/informes/revisio-esrs-maig-2026");
  };

  const handleOpenReport = (slug: string) => {
    router.push(`/informes/${slug}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenAuth={(tab) => openAuth(tab || "register")}
      />
      <main className="flex-1">
        <Hero
          onOpenReport={handleOpenLatestReport}
          onOpenRegister={() => openAuth("register")}
          onOpenPreus={openPreusOrAuth}
        />
        <MidSections
          onOpenRegister={() => openAuth("register")}
          onOpenReport={handleOpenLatestReport}
        />
        <ReportsPreview onOpenReport={handleOpenReport} />
        <FaqSection />
        <FinalCta
          onOpenRegister={() => openAuth("register")}
          onOpenPreus={openPreusOrAuth}
        />
      </main>
      <Footer />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog
        open={preusOpen}
        onOpenChange={setPreusOpen}
        onOpenRegister={() => openAuth("register")}
      />
    </div>
  );
}
